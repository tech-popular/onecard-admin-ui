<template>
  <div class="work-flow">
    <div id="sample">
      <div class="left-tool">
        <div class="flow-save">
          <el-button class="flow-btn-save" type="primary" icon="ios-cube-outline" @click="save" v-if="tag !== 'view'">保存</el-button>
          <el-button class="flow-btn-goback" type="warning" icon="md-arrow-round-back" @click="goback">返回</el-button>
        </div>
        <div id="myPaletteDiv"></div>
      </div>
      <div id="myDiagramDiv"></div>
    </div>
    <div>
      <el-dialog
        :visible.sync="saveModalVisible"
        title="保存流程"
        :close-on-click-modal="false"
      >
        <el-form ref="saveForm" :model="saveForm" :rules="saveFormValidate" :label-width="100">
          <el-form-item prop="name" label="流程名称">
            <el-input v-model="saveForm.name" placeholder="请输入流程名称" />
          </el-form-item>
          <el-form-item prop="code" label="流程编号">
            <el-input v-model="saveForm.code" placeholder="请输入流程编号，只可输入字母、数字、下划线" />
          </el-form-item>
        </el-form>
        <!-- <submit-botton @submit="handleSubmit" @cancel="handleCancel" slot="footer"></submit-botton> -->
      </el-dialog>
    </div>
      <switch-node @close="closeSwitchNode" :data='switchNodeData' v-if="switchNodeVisible" ref="switchNodeEl"></switch-node>
      <div v-if="custerParamsNodeVisible">
        <custer-allparams-node @close="closeCusterParamsNode" :data='custerParamsNodeData'></custer-allparams-node>
      </div>
      <div v-if="custerNodeVisible">
        <custer-node @close="closeCusterNode" :data='custerNodeData'></custer-node>
      </div>
  </div>
</template>
<script>
import go, { Margin } from 'gojs'
import { palette } from '@/utils/flowPalette' // 侧边栏模板数据
import { saveFlowInfo, flowView, editFlowInfo } from '@/api/dataAnalysis/dataDecisionManage'
import switchNode from './workflowNode/switchNode'
import custerAllparamsNode from './workflowNode/custerAllparamsNode'
import custerNode from './workflowNode/custerNode'
var that = null
var mySelf = null
export default {
  data () {
    return {
      diagramHeight: '600px',
      flowJson: {
        class: 'go.GraphLinksModel',
        linkFromPortIdProperty: 'fromPort',
        linkToPortIdProperty: 'toPort',
        nodeDataArray: [],
        linkDataArray: []
      },
      tag: this.$route.query.tag,
      orderNo: this.$route.query.orderNo,
      flowId: this.$route.query.flowId,
      appId: this.$route.query.appId,
      switchNodeVisible: false,
      switchNodeData: {},
      custerParamsNodeVisible: false,
      custerParamsNodeData: {},
      custerNodeVisible: false,
      custerNodeData: {},

      nodeTitle: '',
      successText: '执行成功',
      saveModalVisible: false,
      saveForm: {
        name: '',
        code: ''
      },
      saveFormValidate: {
        name: [
          { required: true, message: '流程名称不能为空', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '流程编号不能为空，只可输入字母、数字、下划线', pattern: /^(?!_)(?!.*?_$)[a-zA-Z0-9_]+$/, trigger: 'blur' }
        ]
      }
    }
  },
  components: { switchNode, custerAllparamsNode, custerNode },
  created () {
    that = this
    if (that.tag) { // 修改和查看时，加载初始数据
      that.getFlow(this.$route.query.flowId)
    }
  },
  mounted () {
    this.diagramInit()
  },
  methods: {
    getFlow (flowId) {
      flowView(flowId).then(res => {
        if (res.code !== 200) {
          return this.$message.error(res.message)
        }
        if (!res.data.structureJson) {
          return this.$message.error('JSON信息不存在')
        }
        that.flowJson = JSON.parse(res.data.structureJson)
        this.orderNo = res.data.orderNo
        this.saveForm.name = res.data.name
        this.saveForm.code = res.data.code
        this.branchLinkKeys = that.flowJson.branchLinkKeys
        this.mergeParentsKeys = that.flowJson.mergeParentsKeys
        mySelf.myDiagram.model = go.Model.fromJson(res.data.structureJson)
      })
    },
    closeSwitchNode (item) {
      this.switchNodeVisible = false
      if (item && item.tag == 'save') {
        let key = item.data.key
        let _data = mySelf.myDiagram.findNodeForKey(key).data
        _data.data = item.data.config
        that.$message.success(that.successText)
      }
    },
    closeCusterParamsNode (item) {
      that.custerParamsNodeVisible = false
      if (item && item.tag == 'save') {
        let key = item.data.key
        let _data = mySelf.myDiagram.findNodeForKey(key).data
        _data.data = item.data.config
        that.$message.success(that.successText)
      }
    },
    closeCusterNode (item) {
      that.custerNodeVisible = false
      if (item && item.tag == 'save') {
        let key = item.data.key
        let _data = mySelf.myDiagram.findNodeForKey(key).data
        _data.data = item.data.config
        that.$message.success(that.successText)
      }
    },
    // 加载并刷新画布
    loadJson () {
      var _json = mySelf.myDiagram.model.toJson()
      mySelf.myDiagram.model = go.Model.fromJson(_json)
    },
    // 返回
    goback () {
      if (this.tag === 'view') {
        this.$router.replace({ path: '/configManage/searchFlow', query: {appId: that.appId, orderNo: that.$route.query.orderNo} })
      } else {
        that.$Modal.confirm({
          title: '提示',
          content: '流程未保存，确认返回？',
          okText: '确定返回',
          cancelTtext: '取消',
          onOk: () => {
            this.$router.replace({ path: '/configManage/searchFlow', query: {appId: that.appId, orderNo: that.$route.query.orderNo} })
          }
        })
      }
    },
    // 保存
    save () {
      let linkDataArray = mySelf.myDiagram.model.linkDataArray
      let nodeDataArray = mySelf.myDiagram.model.nodeDataArray
      // 判断节点连线名称是否重复，重复不可提交
      let obj = {}
      let linkFlag = false
      linkDataArray.map(item => {
        if (!obj[item.from] && item.linkText) {
          obj[item.from] = item.linkText
          return
        }
        if (obj[item.from] && obj[item.from] === item.linkText) {
          linkFlag = true
        }
      })
      if (linkFlag) return this.$message.error('同一节点的连接内容不能重复！')
      // 判断节点数据是否存在，若无数据则提示配置
      let pNullArr = []
      nodeDataArray.map(item => {
        if (item.category !== 'END' && item.category !== 'PARALLEL_BRANCH' && !item.data) {
          pNullArr.push(item.nodeName)
        }
        //  保存时再判断一下分支节点及合并节点的逻辑
        var node = mySelf.myDiagram.findNodeForKey(item.key)
        if (item.category === 'PARALLEL_BRANCH') {
          that.setBranchLinkKeys(node)
        }
        if (item.category === 'BRANCH_COMBINE') {
          let arr = []
          let allParentNodes = that.getAllParentNode(node, arr)
          that.mergeParentsKeys = []
          allParentNodes.map(function (pNode) { // 找到当前节点的祖宗十八代，不包含当前节点
            that.mergeParentsKeys.push(pNode.key)
          })
        }
      })
      if (pNullArr.length) return this.$message.error(`请配置节点【“${pNullArr.join('”、“')}”】的内容`)
    },
    handleCancel () {
      this.saveModalVisible = false
    },
    handleSubmit () {
      this.$refs.saveForm.validate((valid) => {
        if (valid) {
          this.saveFlowInfo(mySelf.myDiagram.model.toJson())
        }
      })
    },
    saveFlowInfo (data) {
      let params = JSON.parse(data)
      params.orderNo = this.orderNo
      params.name = this.saveForm.name
      params.code = this.saveForm.code
      params.branchLinkKeys = that.branchLinkKeys  //  分支和合并数据保存一下，用于渲染时用
      params.mergeParentsKeys = that.mergeParentsKeys //  分支和合并数据保存一下，用于渲染时用
      let url = this.flowId ? editFlowInfo : saveFlowInfo
      if (this.flowId) {
        params.flowId = this.flowId
      }
      url(JSON.stringify(params)).then(res => {
        if (res.code !== 200) {
          return this.$message.error(res.message)
        }
        this.$message.success(res.message)
        setTimeout(() => {
          that.$router.replace({ path: '/configManage/searchFlow', query: { orderNo: this.orderNo, appId: this.appId } })
        }, 300)
      })
    },
    // 加载
    load () {
      mySelf.myDiagram.model = go.Model.fromJson(this.flowJson)
    },
    diagramInit () {
      mySelf = this
      var $ = go.GraphObject.make // 为了简洁定义模板
      mySelf.myDiagram = $(
        go.Diagram,
        'myDiagramDiv', //  must name or refer to the DIV HTML element
        {
          grid: $(go.Panel, 'Grid', // 设置网格
            $(go.Shape, 'LineH', { stroke: 'lightgray', strokeWidth: 0.5 }),
            $(go.Shape, 'LineH', { stroke: 'gray', strokeWidth: 0.5, interval: 10 }),
            $(go.Shape, 'LineV', { stroke: 'lightgray', strokeWidth: 0.5 }),
            $(go.Shape, 'LineV', { stroke: 'gray', strokeWidth: 0.5, interval: 10 })
          ),
          isReadOnly: mySelf.tag === 'view', // 查看时禁止编辑
          initialContentAlignment: go.Spot.Center,
          allowDrop: true, //  must be true to accept drops from the Palette
          LinkDrawn: that.showLinkLabel, //  this DiagramEvent listener is defined below
          LinkRelinked: that.showLinkLabel,
          scrollsPageOnFocus: false,
          'undoManager.isEnabled': true //  enable undo & redo
        }
      )
      var sharedToolTip =
        $('ToolTip',
          { 'Border.figure': 'RoundedRectangle' },
          $(go.TextBlock, { margin: 2 }, new go.Binding('text', '', function (d) { return d.nodeName }))
        )
      function nodeStyle () {
        return [
          new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(
            go.Point.stringify
          ),
          {
            locationSpot: go.Spot.Center,
            toolTip: sharedToolTip
          }
        ]
      }
      function makePort (name, align, spot, output, input) {
        var horizontal =
        align.equals(go.Spot.Top) || align.equals(go.Spot.Bottom)
        return $(go.Shape, {
          fill: 'transparent', //  changed to a color in the mouseEnter event handler
          strokeWidth: 0, //  no stroke
          width: horizontal ? NaN : 8, //  if not stretching horizontally, just 8 wide
          height: !horizontal ? NaN : 8, //  if not stretching vertically, just 8 tall
          alignment: align, //  align the port on the main Shape
          stretch: horizontal
            ? go.GraphObject.Horizontal
            : go.GraphObject.Vertical,
          portId: name, //  declare this object to be a "port"
          fromSpot: spot, //  declare where links may connect at this port
          fromLinkable: output, //  declare whether the user may draw links from here
          toSpot: spot, //  declare where links may connect at this port
          toLinkable: input, //  declare whether the user may draw links to here
          cursor: 'pointer', //  show a different cursor to indicate potential link point
          mouseEnter: function (e, port) {
            //  the PORT argument will be this Shape
            if (!e.diagram.isReadOnly) port.fill = 'rgba(0,0,0,0.3)'
          },
          mouseLeave: function (e, port) {
            port.fill = 'transparent'
          }
        })
      }
      // 选中的样式
      var nodeSelectionAdornmentTemplate = $(
        go.Adornment,
        'Auto',
        $(go.Shape, {
          fill: null,
          stroke: '#08595c',
          strokeWidth: 1.5,
          strokeDashArray: [4, 2]
        }),
        $(go.Placeholder)
      )
      function textBlock (isEdit, type) { //  可编辑节点名称的textBlock ，type表示是否把名称显示出来
        return $(
          go.TextBlock,
          {
            font: '12px sans-serif',
            stroke: type ? 'transparent' : '#fff', // 分支和合并节点可以不显示名称
            margin: isEdit ? new Margin(10, 0) : 0,
            maxSize: new go.Size(120, NaN),
            //  wrap: go.TextBlock.WrapFit,
            editable: isEdit, // 文字可编辑
            textEdited: function (textBlock, previousText, currentText) { // 改变了节点名称时触发事件,后面节点的入参名称更新
              let nodeData = textBlock.part.data.data
              let node = textBlock.part.data
              if (previousText !== currentText) {
                mySelf.myDiagram.model.setDataProperty(node, 'nodeName', currentText)
              }
              if (!nodeData) return
              let outParams = nodeData.outParams
              if (outParams && outParams.length) {
                let reg = new RegExp(previousText.split(`(${node.key})`)[0])
                outParams.map(item => {
                  item.name = item.name.replace(reg, node.nodeName)
                })
              }
            }
          },
          new go.Binding('text', '', function (node) {
            let locX = node.loc.split(' ')[0] // 从位置判断是否是左侧菜单中的内容
            return locX === '0' || !isEdit ? node.nodeName : node.nodeName + '(' + node.key + ')'
          }).makeTwoWay()
        )
      }
      // start
      mySelf.myDiagram.nodeTemplateMap.add(
        'START',
        $(
          go.Node,
          'Table',
          nodeStyle(),
          { selectionAdornmentTemplate: nodeSelectionAdornmentTemplate },
          $(
            go.Panel,
            'Auto',
            $(
              go.Shape,
              'Circle',
              {
                minSize: new go.Size(50, 50),
                fill: '#50a928',
                cursor: 'move',
                strokeWidth: 0
              }
            ),
            textBlock(false)
          ),
          {
            doubleClick: function (e, node) { // 点击开始时触发事件
              if (e.event.path[1].id == 'myPaletteDiv') {
                return
              }
              that.switchNodeVisible = true
              that.$nextTick(() => {
                that.switchNodeData = node.part.data
                console.log(that.$refs)
                that.$refs.switchNodeEl.init()
              })
            }
          },
          makePort('B', go.Spot.Bottom, go.Spot.Bottom, true, false)
        )
      )
      //category:Conditional时。走默认
      mySelf.myDiagram.nodeTemplateMap.add(
        'CONDITIONAL', // the default category
        $(
          go.Node,
          'Table',
          nodeStyle(),
          {
            selectionAdornmentTemplate: nodeSelectionAdornmentTemplate
          },
          $(
            go.Panel,
            'Auto',
            $(
              go.Shape,
              'Diamond',
              {
                fill: 'rgb(136, 89, 242)',
                strokeWidth: 0,
                cursor: 'move',
                minSize: new go.Size(120, NaN)
              }
            ),
            textBlock(true)
          ),
          {
            doubleClick: function(e, node) {
              that.operateNodeJudgeParams(node, 'edit')
              if (e.event.path[1].id == 'myPaletteDiv') {
                return
              }
              that.doubleClickNodeEvent(node)
            }
          },
          // four named ports, one on each side:
          makePort('T', go.Spot.Top, go.Spot.TopSide, false, true),
          makePort('L', go.Spot.Left, go.Spot.LeftSide, true, true),
          makePort('R', go.Spot.Right, go.Spot.RightSide, true, true),
          makePort('B', go.Spot.Bottom, go.Spot.BottomSide, true, false)
        )
      )
      // 正常查询
      mySelf.myDiagram.nodeTemplateMap.add(
        '',
        $(
          go.Node,
          'Table',
          nodeStyle(),
          {
            selectionAdornmentTemplate: nodeSelectionAdornmentTemplate
          },
          $(
            go.Panel,
            'Auto',
            $(
              go.Shape,
              'RoundedRectangle',
              {
                fill: 'rgb(8, 104, 211)',
                strokeWidth: 0,
                cursor: 'move',
                minSize: new go.Size(120, NaN)
              }
            ),
            textBlock(true)
          ),
          {
            //  双击展示
            doubleClick: function (e, node) {
              //  console.log(e)
              if (e.event.path[1].id == 'myPaletteDiv') {
                return
              }
              that.doubleClickNodeEvent(node)
            }
          },
          makePort('T', go.Spot.Top, go.Spot.Top, false, true),
          makePort('B', go.Spot.Bottom, go.Spot.Bottom, true, false)
        )
      )
      // start
      mySelf.myDiagram.nodeTemplateMap.add(
        'END',
        $(
          go.Node,
          'Table',
          nodeStyle(),
          { selectionAdornmentTemplate: nodeSelectionAdornmentTemplate },
          $(
            go.Panel,
            'Auto',
            $(
              go.Shape,
              'Circle',
              {
                minSize: new go.Size(50, 50),
                fill: '#DC3C00',
                cursor: 'move',
                strokeWidth: 0
              }
            ),
            textBlock(false)
          ),
          {
            doubleClick: function (e, node) { // 点击开始时触发事件
              if (e.event.path[1].id == 'myPaletteDiv') {
                return
              }
              that.switchNodeVisible = true
              that.$nextTick(() => {
                that.switchNodeData = node.part.data
                console.log(that.$refs)
                that.$refs.switchNodeEl.init()
              })
            }
          },
          makePort('T', go.Spot.Top, go.Spot.Top, false, true)
        )
      )
      mySelf.myDiagram.addModelChangedListener(function (evt) { // 监听新拖拽到画布的节点
        if (!evt.isTransactionFinished) return
        var txn = evt.object  //  a Transaction
        if (txn === null) return
        txn.changes.each(function (e) {
          if (e.modelChange === 'linkToKey') {
            let fromNode = mySelf.myDiagram.findNodeForKey(e.object.from)
            let newToNode = mySelf.myDiagram.findNodeForKey(e.newValue)
            let oldToNode = mySelf.myDiagram.findNodeForKey(e.oldValue)
            if (e.object.from === '1') return
            that.lineLinkOperateEvents(fromNode, 'edit') // 修改时，需要用到修改前的key，及修改后的key
          } else if (e.modelChange === 'nodeDataArray') {
            if (e.change === go.ChangedEvent.Insert) { // 插入新节点
              let nodeData = mySelf.myDiagram.findNodeForKey(e.newValue.key).data
              let keyNum = e.newValue.key * 1
              let keyLength = e.newValue.key.length
              let base = 10 // 基数
              if (keyLength === 2) { // 两位数时，取个位
                base = e.newValue.key.substr(0, 1) * 10
              } else if (keyLength === 3) { // 三位数时，取十位加个位
                base = 100
                if (nodeData.category === 'ORACLE_QUERY') { // ORACLE_QUERY特殊三位数时，取个位
                  base = e.newValue.key.substr(0, 2) * 10
                }
              } else if (keyLength === 4) { // 四位数时，取十位加个位
                base = e.newValue.key.substr(0, 2) * 100
              }
              let key = keyNum <= 11 ? '' : keyNum % base // 当key为小于等于10时，默认是第一次拖动则不加序号，其他的加序号，序号取key的个位数
              nodeData.nodeName = e.newValue.nodeName + key// 重置节点的名称，依次往下排列
              mySelf.myDiagram.model.updateTargetBindings(nodeData)  //  更新节点数据，参数是你当前编辑的节点数据
            } // else if (e.change === go.ChangedEvent.Remove) { // 删除节点 e.oldValue.key
          }
        })
      })
      mySelf.myDiagram.commandHandler.canDeleteSelection = function () { // 根据对象数据进行判断节点、线是否可以删除的时候
        // 用例获取选中的节点或线
        return mySelf.myDiagram.selection.all(function (node) {
          if (node.data.key) { // 删除的是节点时
            //   console.log(node.data)
            this.$confirm('此操作将删除该节点, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              mySelf.myDiagram.commandHandler.deleteSelection()
            }).catch(() => {
              console.log('cancel')
            })
          } else {
            let fromNode = mySelf.myDiagram.findNodeForKey(node.data.from)
            let toNode = mySelf.myDiagram.findNodeForKey(node.data.to)
            that.lineLinkOperateEvents(fromNode, 'delete') // 删除时，只需要当前连线的to key就可以拿到上面父级所有节点的出参，及下面所有节点的入参
          }
        })
      }
      mySelf.myDiagram.addDiagramListener('LinkDrawn', function (e) { // 监听连线结束的事件
        let key = e.subject.data.from   // e.subject.data这是这个线条的数据
        var nodeLink = mySelf.myDiagram.findNodeForKey(key)  // 获取节点对象
        let category = nodeLink.data.category
        if (category === 'CONDITIONAL') { // 将状态判断的连线内容保存，保存时判断用
          let linkOutData = []
          let linkDataText = []
          nodeLink.findLinksOutOf().each(function (link) {
            link.data.linkText = link.data.linkText
            ? link.data.linkText
            : 'TRUE'
            if (linkOutData.length == 1) {
              link.data.linkText = linkDataText[0] === 'TRUE' ? 'FALSE' : 'TRUE' // 将第二条线赋值为Flase
              mySelf.myDiagram.model.updateTargetBindings(link.data)  // 更新线上的文字，没有的话默认内容无法更改出来
            }
            if (linkOutData.length == 2) { // 限制最多可连接两条线
              that.$message.error({
                content: '最多可连接两个子节点',
                duration: 1
              })
              mySelf.myDiagram.model.removeLinkData(link.data)
              return
            }
            linkOutData.push(link.data)
            linkDataText.push(link.data.linkText)
          })
        } else { // 非状态判断时，只允许有一个子节点
          let linkOutData = []
          nodeLink.findLinksOutOf().each(function (link) {
            if (linkOutData.length == 1) { // 限制最多可连接两条线
              that.$message.error({
                content: '最多可连接一个子节点',
                duration: 1
              })
              mySelf.myDiagram.model.removeLinkData(link.data)
              return
            }
            linkOutData.push(link.data)
          })
        }
      })
      mySelf.myDiagram.linkTemplate = $(
        go.Link, //  the whole link panel
        {
          routing: go.Link.AvoidsNodes,
          curve: go.Link.JumpOver,
          corner: 5,
          toShortLength: 4,
          relinkableFrom: true,
          relinkableTo: true,
          reshapable: true,
          resegmentable: true,
          selectable: true,
          mouseEnter: function (e, link) {
            link.findObject('HIGHLIGHT').stroke = 'rgba(30,144,255,0.2)'
          },
          mouseLeave: function (e, link) {
            link.findObject('HIGHLIGHT').stroke = 'transparent'
          },
          selectionAdorned: false
        },
        new go.Binding('points').makeTwoWay(),
        $(
          go.Shape,
          {
            isPanelMain: true,
            strokeWidth: 8,
            stroke: 'transparent',
            name: 'HIGHLIGHT'
          }
        ),
        $(
          go.Shape, //  线的形状
          { isPanelMain: true, stroke: 'gray', strokeWidth: 2 },
          new go.Binding('stroke', 'isSelected', function (sel) {
            return sel ? 'dodgerblue' : 'gray'
          }).ofObject()
        ),
        $(
          go.Shape, //  the arrowhead
          { toArrow: 'standard', strokeWidth: 0, fill: 'gray' }
        ),
        $(
          go.Panel,
          'Auto', //  the link label, normally not visible
          {
            visible: false,
            name: 'LABEL',
            segmentIndex: 2,
            segmentFraction: 0.5
          },
          new go.Binding('visible', 'visible').makeTwoWay(),
          $(
            go.Shape,
            'RoundedRectangle', //  文字标签的形状
            { fill: '#F8F8F8', strokeWidth: 0 }
          ),
          $(
            go.TextBlock,
            'TRUE', //  设置线上文字
            {
              textAlign: 'center',
              font: '10pt helvetica, arial, sans-serif',
              stroke: 'red',
              minSize: new go.Size(50, NaN),
              editable: false
            },
            new go.Binding('text', 'linkText').makeTwoWay()
          )
        )
      )
      mySelf.myDiagram.toolManager.linkingTool.temporaryLink.routing = go.Link.Orthogonal
      mySelf.myDiagram.toolManager.relinkingTool.temporaryLink.routing = go.Link.Orthogonal

      this.load() //  load an initial diagram from some JSON text

      mySelf.myPalette = $(
        go.Palette,
        'myPaletteDiv', //  must name or refer to the DIV HTML element
        {
          scrollsPageOnFocus: false,
          nodeTemplateMap: mySelf.myDiagram.nodeTemplateMap, //  share the templates used by myDiagram
          model: new go.GraphLinksModel(palette)
      //  end init
        }
      )
      mySelf.myPalette.layout.sorting = go.GridLayout.Forward
    },
    showLinkLabel (e) { // 显示连线上的文字
      var label = e.subject.findObject('LABEL')
      if (label !== null) {
        label.visible = e.subject.fromNode.data.category === 'CONDITIONAL' // 除了状态处理显示外。其他的都不显示
      }
    },
    doubleClickNodeEvent (node) { // 双击节点时的事件
      // 获取节点出来的线
      let nodeLink = mySelf.myDiagram.findNodeForKey(node.key)  // 获取节点对象
      let category = node.part.data.category
      // 参数依赖时，必需先选择上游节点
      let linkIntoData = []
      nodeLink.findLinksInto().each(function (link) {
        linkIntoData.push(link.data)
      })
      if (linkIntoData.length == 0) {
        that.$message.error('请连接上游节点')
        return
      }
      let linkOutData = []
      nodeLink.findLinksOutOf().each(function (link) {
        linkOutData.push(link.data)
      })
      if (linkOutData.length == 0) {
        that.$message.error({
          content: '请连接子节点',
          duration: 1
        })
        return
      }
      let innerParams = [] //  将父级的出参和start出参集合起来，用作该节点的入参
      let innerParamsObj = {
        parents: [],
        start: []
      }
      //  判断选择的节点类型
      that.nodeTitle = node.part.data.nodeName
      let basicParams = {
        tag: that.tag === 'view',
        nodeData: node.part.data,
        innerParams: node.data.category !== 'BRANCH_COMBINE' ? innerParams : innerParamsObj
      }
      console.log(1234, basicParams)
      if (category == 'SQL_QUERY') { //  sql查询START, END, SQL_QUERY, HBASE_QUERY, API_CALL, DATA_HANDLE, CONDITIONAL
        that.sqlNodeData = basicParams
        that.sqlNodeVisible = true
      } else if (category == 'HBASE_QUERY') { //  hbase查询
        that.hbaseNodeData = basicParams
        that.hbaseNodeVisible = true
      } else if (category == 'REDIS_QUERY') { //  redis查询
        that.redisNodeData = basicParams
        that.redisNodeVisible = true
      } else if (category == 'API_CALL') { //  第三方接口
        that.thirdNodeData = basicParams
        that.thirdInterfaceVisible = true
      } else if (category == 'DATA_HANDLE') { //  数据处理
        that.dataHandingNodeData = basicParams
        that.dataHandingNodeVisible = true
      } else if (category == 'CONDITIONAL') {
        that.conditionHandingNodeData = basicParams
        that.conditionHandingNodeVisible = true
      } else if (category == 'ORACLE_QUERY') {
        that.oracleNodeData = basicParams
        that.oracleNodeVisible = true
        console.log(that.oracleNodeVisible)
      }
    },
    lineLinkOperateEvents(fromNode, type) { //连线的修改、删除事件
    console.log(fromNode)
      if (fromNode.data.category === 'START')  return // 第一条线不可删除及修改
      mySelf.myDiagram.commandHandler.deleteSelection()
    },
    setBranchLinkKeys (node) { //  修改连线及删除连线时，重新获取分支节点的子节点key
      that.branchLinkKeys = []
      node.findLinksOutOf().each(function (link) {
        let category = link.toNode.data.category
        if (category !== 'BRANCH_COMBINE') {
          that.branchLinkKeys.push(link.data.to)
        }
      })
    },
    getAllParentNode (node, arr) { //  获取当前节点的所有父级及祖宗元素，findTreeParentChain()这个属性如果有多个父级只会取所有父级及祖宗元素，findTreeParentChain()这个属性如果有多个父级只会取第一个，不适用本需求
      let nodeInto = node.findNodesInto()
      nodeInto.each(function (inode) {
        if (inode) {
          arr.push(inode.data)
          that.getAllParentNode(inode, arr)
        }
      })
      return Array.from(new Set(arr))
    },
    getParentNode (node, arr) { // 获取当前节点的所有父级
      let nodeInto = node.findNodesInto()
      nodeInto.each(function (inode) {
        if (inode) {
          //  if (inode.data.data && inode.data.data.outParams) {
          if (inode.category !== 'CONDITIONAL' && inode.category !== 'PARALLEL_BRANCH' && inode.category !== 'BRANCH_COMBINE') { //  父级有出参的情况下
            arr.push(inode.data)
          } else {  //  父级没有出参的情况下，取上上个父级的出参内容
            that.getParentNode(inode, arr)
          }
        }
      })
      return Array.from(new Set(arr))
    },
    arrIncludes (arr1, arr2) { //  判断arr1是否包含arr2
      return arr2.every(val => arr1.includes(val))
    }
  }
}
</script>
<style lang="scss">
  .work-flow {
    position: absolute;
    // width: 94%;
    // height: 94%;
    left: 18px;
    top: 0;
    right: 18px;
    bottom: 18px;
  }
  .btn {
      text-align: right;
      margin-bottom: 10px;
  }

  #sample {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: space-between;
  }
  .left-tool {
      width: 150px;
      margin-right: 2px;
      background-color: whitesmoke;
      border: solid 1px black;
      display:flex;
      flex-direction:column;
  }
  .flow-save {
      border-bottom: 1px solid #ccc;
      padding:10px 0
  }
  .flow-save button {
      display: block;
      margin: 0 auto;
  }
  .flow-save .flow-btn-save {
      margin-bottom: 10px;
  }
  #myPaletteDiv {
      flex: 1
  }
  #myDiagramDiv {
      flex-grow: 1;
      border: solid 1px black;
      height: 100%;
  }
  .width100 {
      width: 100px;
  }
  .width200 {
      width: 200px;
  }
  .width300 {
      width: 300px;
  }
  .width400 {
      width: 400px;
  }
  .margin-left8 {
      margin-left: 8px;
  }
  .margin-left10 {
      margin-left: 10px;
  }
  .modal-content {
      max-height:600px;
      overflow:auto;
      padding-top: 10px;
      min-height: 100px;
  }
  .modal-content-item {
      border: 1px solid #ccc;
      padding: 10px;
      border-radius:5px;
  }
  .modal-title {
      padding-bottom:10px;
      margin-top:-20px;
      font-size:15px;
      span {
          display:inline-block;
          padding:0 10px;
          background:#fff
      }
  }
  .conditions-select {
      width: 200px;
      .ivu-select-dropdown {
          max-width: 400px;
      }
  }
  .modal-form{
      max-height: 600px;
      overflow: auto;
      padding-top: 10px
  }
  .modal-params {
      margin-top: 30px;
  }
  .status-add {
      width: 200px;
  }
  .modal-formItem {
      border-bottom:1px solid #e8eaec
  }
  .inner-tags{
      margin-bottom:10px;
  }
  .condition-symbol {
      width: 60px;
  }
  .item-no-left .ivu-form-item-content {
      margin-left: 0 !important
  }
  .ivu-checkbox-group-item {
      display: block;
      padding-bottom: 10px;
  }
  .status-symbol {
      width: 60px
  }
</style>
