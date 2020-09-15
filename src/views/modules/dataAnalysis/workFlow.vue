<template>
  <div class="work-flow" v-loading="loading">
    <div id="sample">
      <div class="left-tool">
        <div class="flow-save">
          <div><el-button class="flow-btn-goback" type="warning" icon="md-arrow-round-back" @click="goback">返回</el-button></div>
          <div><el-button class="flow-btn-save" type="primary" icon="ios-cube-outline" @click="save" v-if="tag !== 'view'">保存</el-button></div>
        </div>
        <div id="myPaletteDiv"></div>
      </div>
      <div id="myDiagramDiv"></div>
    </div>
    <in-params-node @close="closeAllNode" v-if="inparamsNodeVisible" ref="inparamsNodeEl"></in-params-node>
    <data-query-node @close="closeAllNode" @getSelectCuster="getSelectCuster" v-if="dataQueryNodeVisible" ref="dataQueryNodeEl"></data-query-node>
    <group-choice-node @close="closeAllNode" @setCusterName="setCusterName"  v-if="groupChoiceNodeVisible" ref="groupChoiceNodeEl"></group-choice-node>
    <out-params-node @close="closeAllNode" v-if="outparamsNodeVisible" ref="outparamsNodeEl"></out-params-node>
    <save-data @close="closeSave" v-if="saveDataVisible" ref="saveDataEl"></save-data>
  </div>
</template>
<script>
import go, { Margin } from 'gojs'
import { palette } from './dataAnalysisUtils/flowPalette' // 侧边栏模板数据
import { custerList, saveFlowInfo, flowView, editFlowInfo } from '@/api/dataAnalysis/dataDecisionManage'
import groupChoiceNode from './workflowNode/groupChoiceNode'
import inParamsNode from './workflowNode/inparamsNode'
import dataQueryNode from './workflowNode/dataQueryNode'
import outParamsNode from './workflowNode/outparamsNode'
import saveData from './workflowNode/saveData'
var that = null
var mySelf = null
export default {
  data () {
    return {
      loading: false,
      diagramHeight: '600px',
      flowJson: {
        class: 'go.GraphLinksModel',
        linkFromPortIdProperty: 'fromPort',
        linkToPortIdProperty: 'toPort',
        nodeDataArray: [
          {'key': '1', 'category': 'IN_PARAM', 'loc': '0 0', 'nodeName': '决策\n入参'},
          {'key': '2', 'loc': '0 100', 'category': 'DATA_QUERY', 'nodeName': '数据查询'}
        ],
        linkDataArray: [{
          from: '1',
          to: '2'
        }]
      },
      tag: this.$route.query.tag,
      id: this.$route.query.id,
      channelCode: '',
      groupId: [],
      inparamsNodeVisible: false,
      groupChoiceNodeVisible: false,
      dataQueryNodeVisible: false,
      outparamsNodeVisible: false,
      saveDataVisible: false,
      currentName: '',
      selectCuster: [],
      nodeTitle: '',
      successText: '执行成功',
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
  components: { groupChoiceNode, inParamsNode, dataQueryNode, outParamsNode, saveData },
  created () {
    that = this
  },
  mounted () {
    if (that.id) {
      that.getFlow(this.$route.query.id)
    } else {
      this.diagramInit()
    }
  },
  methods: {
    getFlow (id) {
      this.loading = true
      flowView(id).then(({data}) => {
        if (data.status !== '1') {
          this.loading = false
          return this.$message.error(data.msg)
        }
        if (!data.data.configJson) {
          this.loading = false
          return this.$message.error('JSON信息不存在')
        }
        that.flowJson = data.data.configJson
        this.$nextTick(() => {
          this.diagramInit()
          mySelf.myDiagram.model = go.Model.fromJson(JSON.stringify(data.data.configJson))
          this.loading = false
        })
        this.saveForm.name = data.data.name
        this.saveForm.code = data.data.code
        this.channelCode = data.data.channelCode
        // this.groupId = data.groupId
        this.groupId = data.data.configJson.nodeDataArray.filter(item => item.key === '2')[0].data.configItems.groupId
        this.getCusterList(data.data.channelCode)
      })
    },
    getCusterList (code) { // 回显时用的
      custerList(code).then(({data}) => {
        if (data.status * 1 !== 1) {
          this.custerList = []
          return
        }
        this.custerList = data.data
        let arr = []
        this.groupId.forEach(item => {
          let obj = this.custerList.filter(citem => citem.value === item)[0]
          arr.push(obj)
        })
        this.selectCuster = arr
      })
    },
    closeAllNode (item) {
      if (item && item.tag == 'save') {
        let key = item.data.key
        let _data = mySelf.myDiagram.findNodeForKey(key).data
        _data.data = item.data.config
        // 修改数据查询时，若有的分群已选内容不在数据查询中，则重置分群节点的数据
        if (_data.category === 'DATA_QUERY') {
          let node = mySelf.myDiagram.findNodeForKey(key)
          node.findTreeParts().each(function (cNode) {
            if (cNode.data.category === 'GROUP_CHOICE') {
              let itemGroupId = cNode.data.data.configItems.groupId
              if (itemGroupId && !that.groupId.includes(itemGroupId)) {
                cNode.data.data.configItems.groupId = ''
                cNode.data.nodeName = '分群节点'
                mySelf.myDiagram.model.updateTargetBindings(cNode.data)
              }
            }
          })
        }
      }
    },
    getSelectCuster (custerArr, data) { // 获取数据转换中的参数，用于保存用
      this.selectCuster = custerArr
      this.groupId = data.groupId
      this.channelCode = data.channelCode
    },
    setCusterName (name, key) { // 分群节点时，节点名称以选择的分群名称来标记
      this.currentName = name
      let node = mySelf.myDiagram.findNodeForKey(key).part.data
      mySelf.myDiagram.model.setDataProperty(node, 'nodeName', name)
    },
    // 返回
    goback () {
      if (this.tag === 'view') {
        this.$router.replace({ path: 'dataAnalysis-dataDecisionManage' })
      } else {
        that.$confirm('流程未保存，确认返回？', '提示', {
          confirmButtonText: '确定返回',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$router.replace({ path: 'dataAnalysis-dataDecisionManage' })
        }).catch(() => {
          console.log('cancel')
        })
      }
    },
    // 保存
    save () {
      let nodeDataArray = mySelf.myDiagram.model.nodeDataArray
      // 判断节点数据是否存在，若无数据则提示配置
      let pNullArr = []
      let pChildOneArr = []
      nodeDataArray.map(item => {
        if (!item.data && item.category !== 'NO_USE') {
          pNullArr.push(item.nodeName)
        }
        if (item.category === 'GROUP_CHOICE') {
          // 兼容修改数据查询时，把部分分群节点内容置空的情况
          if (item.data && !item.data.configItems.groupId) {
            pNullArr.push(item.nodeName)
          }
          let node = mySelf.myDiagram.findNodeForKey(item.key)
          let linkNum = 0
          node.findLinksOutOf().each(function (link) {
            linkNum++
          })
          if (linkNum < 2) {
            pChildOneArr.push(item.nodeName)
          }
        }
      })
      if (pNullArr.length) return this.$message.error(`请配置节点【“${Array.from(new Set(pNullArr)).join('”、“')}”】的内容`)
      if (pChildOneArr.length) return this.$message.error(`每个分群节点需有两个子节点，请配置节点【“${pChildOneArr.join('”、“')}”】的子节点！`)
      if (that.id) { // 修改保存
        this.saveFlowInfo(JSON.parse(mySelf.myDiagram.model.toJson()), {
          name: this.saveForm.name,
          code: this.saveForm.code
        })
      } else { // 新建保存
        this.saveDataVisible = true
        this.$nextTick(() => {
          this.$refs.saveDataEl.init()
        })
      }
    },
    closeSave (data) {
      this.saveFlowInfo(JSON.parse(mySelf.myDiagram.model.toJson()), data)
    },
    saveFlowInfo (flowJson, saveData) {
      let params = {
        configJson: flowJson,
        name: saveData.name,
        code: saveData.code,
        groupId: this.groupId,
        channelCode: this.channelCode
      }
      let url = this.id ? editFlowInfo : saveFlowInfo
      if (this.id) {
        params.id = this.id
      }
      url(params).then(({data}) => {
        if (data.status !== '1') {
          return this.$message.error(data.message)
        }
        this.$message.success(data.message)
        setTimeout(() => {
          that.$router.replace({ path: 'dataAnalysis-dataDecisionManage' })
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
          initialContentAlignment: go.Spot.Top,
          allowDrop: mySelf.tag !== 'view', //  must be true to accept drops from the Palette
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
      function textBlock (isEdit) { //  可编辑节点名称的textBlock ，type表示是否把名称显示出来
        return $(
          go.TextBlock,
          {
            font: '12px Arial, sans-serif',
            stroke: '#fff',
            margin: new Margin(10, 0),
            maxSize: new go.Size(120, NaN),
            wrap: go.TextBlock.WrapFit,
            editable: isEdit,
            textEdited: function (textBlock, previousText, currentText) { // 改变了节点名称时触发事件,后面节点的入参名称更新
              let node = textBlock.part.data
              if (previousText !== currentText) {
                mySelf.myDiagram.model.setDataProperty(node, 'nodeName', currentText)
              }
            }
          },
          new go.Binding('text', '', function (node) {
            return node.nodeName
          }).makeTwoWay()
        )
      }
      // 占位NO_USE
      mySelf.myDiagram.nodeTemplateMap.add(
        'NO_USE',
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
              'Rectangle',
              {
                minSize: new go.Size(0, 50),
                fill: 'transparent',
                strokeWidth: 0
              }
            ),
            textBlock(false)
          )
        )
      )
      // IN_PARAM
      mySelf.myDiagram.nodeTemplateMap.add(
        'IN_PARAM',
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
              that.doubleClickNodeEvent(e, node, 'inparamsNodeVisible', 'inparamsNodeEl')
            }
          },
          makePort('B', go.Spot.Bottom, go.Spot.Bottom, true, false)
        )
      )
      // category:GROUP_CHOICE
      mySelf.myDiagram.nodeTemplateMap.add(
        'GROUP_CHOICE', // the default category
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
            doubleClick: function (e, node) {
              if (!that.selectCuster.length) {
                that.$message.error('请先在“数据查询”节点选择分群！')
                return
              }
              that.doubleClickNodeEvent(e, node, 'groupChoiceNodeVisible', 'groupChoiceNodeEl')
            }
          },
          // four named ports, one on each side:
          makePort('T', go.Spot.Top, go.Spot.TopSide, false, true),
          makePort('L', go.Spot.Left, go.Spot.LeftSide, true, true),
          makePort('R', go.Spot.Right, go.Spot.RightSide, true, true),
          makePort('B', go.Spot.Bottom, go.Spot.BottomSide, true, false)
        )
      )
      // GROUP_CHOICE
      mySelf.myDiagram.nodeTemplateMap.add(
        'DATA_QUERY',
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
            textBlock(false)
          ),
          {
            //  双击展示
            doubleClick: function (e, node) {
              that.$message({
                type: 'error',
                message: '修改该节点的出参会影响后面的分群节点的数据！',
                customClass: 'msg-error'
              })
              that.doubleClickNodeEvent(e, node, 'dataQueryNodeVisible', 'dataQueryNodeEl')
            }
          },
          makePort('T', go.Spot.Top, go.Spot.Top, false, true),
          makePort('B', go.Spot.Bottom, go.Spot.Bottom, true, false)
        )
      )
      // 返参OUT_PARAM
      mySelf.myDiagram.nodeTemplateMap.add(
        'OUT_PARAM',
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
            textBlock(true)
          ),
          {
            doubleClick: function (e, node) { // 点击开始时触发事件
              that.doubleClickNodeEvent(e, node, 'outparamsNodeVisible', 'outparamsNodeEl')
            }
          },
          makePort('T', go.Spot.Top, go.Spot.Top, false, true)
        )
      )
      mySelf.myDiagram.commandHandler.canDeleteSelection = function () { // 根据对象数据进行判断节点、线是否可以删除的时候
        // 用例获取选中的节点或线
        return mySelf.myDiagram.selection.all(function (node) {
          if (node.data.key) { // 删除的是节点时
            if (node.data.category === 'IN_PARAM' || node.data.category === 'DATA_QUERY') return false
            that.$confirm('此操作将删除该节点, 是否继续?', '提示', {
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
            that.lineLinkOperateEvents(fromNode, 'delete') // 删除时，只需要当前连线的to key就可以拿到上面父级所有节点的出参，及下面所有节点的入参
          }
        })
      }
      mySelf.myDiagram.addDiagramListener('LinkDrawn', function (e) { // 监听连线结束的事件
        let fromKey = e.subject.data.from   // e.subject.data这是这个线条的数据
        let toKey = e.subject.data.to
        var fromNodeLink = mySelf.myDiagram.findNodeForKey(fromKey)  // 获取节点对象
        let toNodeLink = mySelf.myDiagram.findNodeForKey(toKey)
        let fromCategory = fromNodeLink.data.category
        let toCategory = toNodeLink.data.category
        if (fromCategory === 'DATA_QUERY' && toCategory === 'OUT_PARAM') { // 数据转换不可直接连线到返参节点
          fromNodeLink.findLinksOutOf().each(function (link) {
            that.$message.error('不可直接返参，请连接分群节点！')
            return mySelf.myDiagram.model.removeLinkData(link.data)
          })
        }
        if (fromCategory === 'GROUP_CHOICE') { // 将状态判断的连线内容保存，保存时判断用
          let linkOutData = []
          let linkDataText = []
          fromNodeLink.findLinksOutOf().each(function (link) {
            link.data.linkText = link.data.linkText
            ? link.data.linkText
            : 'TRUE'
            if (linkOutData.length == 1) {
              link.data.linkText = linkDataText[0] === 'TRUE' ? 'FALSE' : 'TRUE' // 将第二条线赋值为Flase
              // if (link.data.linkText === 'FALSE' && toCategory === 'DATA_QUERY') { // false线上不可连线分群节点
              //   that.$message.error('连线有误，请重新连线')
              //   return mySelf.myDiagram.model.removeLinkData(link.data)
              // }
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
          fromNodeLink.findLinksOutOf().each(function (link) {
            if (linkOutData.length == 1) { // 限制最多可连接一条线
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
        label.visible = e.subject.fromNode.data.category === 'GROUP_CHOICE' // 除了状态处理显示外。其他的都不显示
      }
    },
    doubleClickNodeEvent (e, node, visibleParams, nodeEl) { // 双击节点时的事件
      console.log(node.data)
      if (e.event.path[1].id == 'myPaletteDiv') return
      // 获取节点出来的线
      let nodeLink = mySelf.myDiagram.findNodeForKey(node.key)  // 获取节点对象
      let category = node.part.data.category
      // 参数依赖时，必需先选择上游节点
      let linkIntoData = []
      nodeLink.findLinksInto().each(function (link) {
        linkIntoData.push(link.data)
      })
      if (category !== 'IN_PARAM' && linkIntoData.length == 0) {
        that.$message.error('请连接上游节点')
        return
      }
      that[visibleParams] = true
      that.$nextTick(() => {
        that.$refs[nodeEl].init(node.data)
      })
    },
    lineLinkOperateEvents (fromNode, type) { // 连线的修改、删除事件
      if (fromNode.data.category === 'IN_PARAM') return // 第一条线不可删除及修改
      mySelf.myDiagram.commandHandler.deleteSelection()
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
    left: 18px;
    top: 18px;
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
      padding:10px 0;
  }
  .flow-save button {
      display: block;
      margin: 0 auto 10px;
  }
  // .flow-save .flow-btn-save {
  //     margin-bottom: 10px;
  // }
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
  .msg-error {
    z-index: 9999 !important
  }
</style>
