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
    <data-query-node @close="closeAllNode" v-if="dataQueryNodeVisible" ref="dataQueryNodeEl"></data-query-node>
    <group-choice-node @close="closeAllNode" v-if="groupChoiceNodeVisible" ref="groupChoiceNodeEl"></group-choice-node>
    <out-params-node @close="closeAllNode" v-if="outparamsNodeVisible" ref="outparamsNodeEl"></out-params-node>
    <multi-branch-node @close="closeAllNode" v-if="multiBranchNodeVisible" ref="multiBranchNodeEl"></multi-branch-node>
    <multi-branch-condition @close="closeMultiBranchCondition" v-if="multiBranchConditionVisible" ref="multiBranchConditionEl"></multi-branch-condition>
    <multi-branch-rate @close="closeMultiBranchRate" v-if="multiBranchRateVisible" ref="multiBranchRateEl"></multi-branch-rate>
    <save-data @close="closeSave" v-if="saveDataVisible" ref="saveDataEl"></save-data>
  </div>
</template>
<script>
// import { deepClone } from '@/utils'
import { palette } from './dataAnalysisUtils/flowPalette' // 侧边栏模板数据 MULTI_BRANCH
import { custerList, saveFlowInfo, flowView, editFlowInfo } from '@/api/dataAnalysis/dataDecisionManage'
import groupChoiceNode from './workflowNode/groupChoiceNode'
import inParamsNode from './workflowNode/inparamsNode'
import dataQueryNode from './workflowNode/dataQueryNode'
import outParamsNode from './workflowNode/outparamsNode'
import multiBranchNode from './workflowNode/multiBranchNode'
import multiBranchCondition from './workflowNode/multiBranchCondition'
import multiBranchRate from './workflowNode/multiBranchRate'
import saveData from './workflowNode/saveData'
var that = null
var mySelf = null
var go = window.go
var Margin = go.Margin
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
      type: '', // 分群类型
      flowTypeArr: [], // 分流类型
      inparamsNodeVisible: false,
      groupChoiceNodeVisible: false,
      dataQueryNodeVisible: false,
      outparamsNodeVisible: false,
      multiBranchNodeVisible: false,
      multiBranchConditionVisible: false,
      multiBranchRateVisible: false,
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
  components: { groupChoiceNode, inParamsNode, dataQueryNode, outParamsNode, multiBranchNode, multiBranchCondition, multiBranchRate, saveData },
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
        this.type = data.data.type
        that.flowTypeArr = data.data.configJson.flowTypeArr
        that.flowJson = data.data.configJson
        this.$nextTick(() => {
          this.diagramInit()
          mySelf.myDiagram.model = go.Model.fromJson(JSON.stringify(that.flowJson))
          this.load()
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
        let node = mySelf.myDiagram.findNodeForKey(key)
        let node1 = mySelf.myDiagram.findNodeForKey(key).part.data
        let _data = node.data
        _data.data = item.data.config
        // 修改数据查询时，若有的分群已选内容不在数据查询中，则重置分群节点的数据
        if (_data.category === 'DATA_QUERY') {
          // 获取json外的公共参数
          this.type = item.type
          this.selectCuster = item.data.config.custerArr
          this.groupId = item.data.config.configItems.groupId
          this.channelCode = item.data.config.configItems.channelCode
          node.findTreeParts().each(function (cNode) {
            if (cNode.data.category === 'GROUP_CHOICE' && cNode.data.data) {
              let itemGroupId = cNode.data.data.configItems.groupId
              if (itemGroupId && !that.groupId.includes(itemGroupId)) {
                cNode.data.data.configItems.groupId = ''
                cNode.data.nodeName = '分群节点'
                mySelf.myDiagram.model.updateTargetBindings(cNode.data)
              }
            }
          })
        }
        if (_data.category === 'GROUP_CHOICE') { // 根据选中的分群，更新分群节点的名称
          // let node1 = mySelf.myDiagram.findNodeForKey(key).part.data
          mySelf.myDiagram.model.setDataProperty(node1, 'nodeName', item.data.config.curName)
        }
        if (_data.category === 'MULTI_BRANCH') { // 获取分流的类型
          let filterArr = that.flowTypeArr.filter(item => item.key === key)
          let curFlowType = filterArr.length ? filterArr[0].flowType : ''
          console.log(item, curFlowType)
          if (curFlowType) { // 分流类型存在时，改变了分流类型，则需要重置连线上的条件显示
            node.findLinksOutOf().each(function (link) {
              if (curFlowType !== item.data.config.configItems.flowType) {
                if (item.data.config.configItems.flowType === 'condition') {
                  link.data.linkText = '请输入分流条件'
                  link.data.type = 'condition'
                } else {
                  link.data.linkText = '0%'
                  link.data.type = 'rate'
                }
                mySelf.myDiagram.model.updateTargetBindings(link.data)
              }
            })
            let index = that.flowTypeArr.findIndex(item => item.key === key)
            that.flowTypeArr.splice(index, 1, {
              flowType: item.data.config.configItems.flowType,
              key: key
            })
          } else {
            that.flowTypeArr.push({
              flowType: item.data.config.configItems.flowType,
              key: key
            })
          }
          console.log(that.flowTypeArr)
          mySelf.myDiagram.model.setDataProperty(node1, 'nodeName', item.data.config.flowName)
        }
      }
    },
    // 分流条件弹窗关闭事件
    closeMultiBranchCondition (item) {
      if (item && item.tag == 'save') {
        console.log(item, this.flowJson.linkDataArray)
        this.flowJson.linkDataArray.forEach(citem => {
          if (citem.from === item.data.from && citem.to === item.data.to) {
            citem.data = item.data.config
            citem.type = 'condition'
            citem.linkText = item.data.config.configItems.name // 对连线的文字赋值
            console.log(123, citem, mySelf.myDiagram.model)
            mySelf.myDiagram.model.updateTargetBindings(citem) // 更新连线上的文字
            // mySelf.myDiagram.model.setDataProperty(citem, 'linkText', item.data.config.configItems.name)
          }
        })
        console.log(mySelf.myDiagram.model, this.flowJson)
      }
    },
    closeMultiBranchRate (item) {
      if (item && item.tag == 'save') {
        console.log(item)
        this.flowJson.linkDataArray.forEach(citem => {
          if (citem.from === item.data.from && citem.to === item.data.to) {
            citem.data = item.data.config
            citem.type = 'rate'
            citem.linkText = item.data.config.configItems.rate + '%' // 对连线的文字赋值
            mySelf.myDiagram.model.updateTargetBindings(citem) // 更新连线上的文字
          }
        })
      }
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
      let linkDataArray = mySelf.myDiagram.model.linkDataArray
      // 判断节点数据是否存在，若无数据则提示配置
      let pNullArr = []
      let pChildOneArr = []
      let pNullLinkArr = []
      let pFlowLinkArr = []
      let pFlowlinkConditionIsFinished = [] // 分流条件是否填写完成
      let pFlowLinkRateIs100 = []
      nodeDataArray.map(item => {
        if (!item.data) {
          pNullArr.push(item.nodeName)
        }
        let node = mySelf.myDiagram.findNodeForKey(item.key)
        if (item.category !== 'OUT_PARAM') {
          if (item.category === 'GROUP_CHOICE') { // 分群节点必须有两个节点，否则报错
            // 兼容修改数据查询时，把部分分群节点内容置空的情况
            if (item.data && !item.data.configItems.groupId) {
              pNullArr.push(item.nodeName)
            }
            let linkNum = 0
            node.findLinksOutOf().each(function (link) {
              linkNum++
            })
            if (linkNum < 2) {
              pChildOneArr.push(item.nodeName)
            }
          } else if (item.category === 'MULTI_BRANCH') { // 分流节点时，判断连线上的条件是否完成，且比率相加为100
            let linkNum = 0
            let linkIs100 = 0
            node.findLinksOutOf().each(function (link) {
              linkNum++
              if (link.data.type === 'condition' && !link.data.data) { // 按条件分流时，判断条件是否填写完成
                pFlowlinkConditionIsFinished.push(item.nodeName)
              }
              if (link.data.type === 'rate') { // 判断比率是否总和为100
                let rate = link.data.data ? link.data.data.configItems.rate : 0
                linkIs100 += rate
              }
            })
            if (linkNum < 2) { // 分流至少2个子节点
              pFlowLinkArr.push(item.nodeName)
            }
            let type = item.data.configItems.flowType
            if (type !== 'condition' && linkIs100 !== 100) {
              pFlowLinkRateIs100.push(item.nodeName)
            }
          } else { // 其他节点若无连线信息则报错
            let linkNum1 = 0
            node.findLinksOutOf().each(function (link) {
              linkNum1++
            })
            if (linkNum1 === 0) {
              pNullLinkArr.push(item.nodeName)
            }
          }
        }
      })
      if (pNullLinkArr.length) return this.$message.error(`请为节点【“${Array.from(new Set(pNullLinkArr)).join('”、“')}”】配置连线信息！`)
      if (pNullArr.length) return this.$message.error(`请配置节点【“${Array.from(new Set(pNullArr)).join('”、“')}”】的内容！`)
      if (pChildOneArr.length) return this.$message.error(`每个分群节点需有两个子节点，请配置节点【“${pChildOneArr.join('”、“')}”】的子节点！`)
      if (pFlowLinkArr.length) return this.$message.error(`分流至少有两个节点，请为节点【“${Array.from(new Set(pFlowLinkArr)).join('”、“')}”】配置子节点信息！`)
      if (pFlowlinkConditionIsFinished.length) return this.$message.error(`请完善节点【“${Array.from(new Set(pFlowlinkConditionIsFinished)).join('”、“')}”】的条件！`)
      if (pFlowLinkRateIs100.length) return this.$message.error(`节点【“${Array.from(new Set(pFlowLinkRateIs100)).join('”、“')}”】的条件比率相加应为100%，请重新填写！！`)
      // 判断连线的内容
      console.log(linkDataArray, mySelf.myDiagram.model.toJson())
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
        configJson: { ...flowJson, flowTypeArr: this.flowTypeArr },
        name: saveData.name,
        code: saveData.code,
        groupId: this.groupId,
        type: this.type.toUpperCase(),
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
      function textBlock (isEdit, type) { //  可编辑节点名称的textBlock ，type表示是否把名称显示出来
        return $(
          go.TextBlock,
          {
            font: '12px Arial, sans-serif',
            // stroke: type ? 'transparent' : '#fff',
            stroke: '#fff',
            margin: type ? new Margin(20, 0, 3, 0) : new Margin(10, 0),
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
      // MULTI_BRANCH
      mySelf.myDiagram.nodeTemplateMap.add(
        'MULTI_BRANCH',
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
                fill: '#38bbce',
                strokeWidth: 0,
                cursor: 'move',
                minSize: new go.Size(40, 40)
              }
            ),
            textBlock(false, 'flow'),
            $(
              go.Picture,
              {
                desiredSize: new go.Size(40, 16),
                alignment: go.Spot.Top
              },
              new go.Binding('source', 'path', this.images)
            )
          ),
          {
            //  双击展示
            doubleClick: function (e, node) {
              that.doubleClickNodeEvent(e, node, 'multiBranchNodeVisible', 'multiBranchNodeEl')
            }
          },
          makePort('T', go.Spot.Top, go.Spot.TopSide, false, true),
          makePort('B', go.Spot.Bottom, go.Spot.BottomSide, true, false)
        )
      )
      mySelf.myDiagram.addModelChangedListener(function (evt) { // 监听新拖拽到画布的节点
        if (!evt.isTransactionFinished) return
        var txn = evt.object  // a Transaction
        if (txn === null) return
        txn.changes.each(function(e) {
          if (e.modelChange === 'linkFromKey') {
            let newFromNode = mySelf.myDiagram.findNodeForKey(e.newValue)
            let groupLinkDataText = []
            let flowLinkDataText = []
            that.flowJson.linkDataArray.forEach(citem => {
              if (newFromNode.category === 'MULTI_BRANCH' && citem.from === e.newValue) {
                let linkText = ''
                let filterArr = that.flowTypeArr.filter(item => item.key === citem.from)
                let curFlowType = filterArr.length ? filterArr[0].flowType : ''
                if (flowLinkDataText.length < 5 && citem.to === e.object.to) {
                  if (curFlowType === 'condition') {
                    linkText = '请输入分流条件'
                    citem.type = 'condition'
                  } else {
                    linkText = '0%'
                    citem.type = 'rate'
                  }
                  citem.linkText = linkText // 对连线的文字赋值
                  mySelf.myDiagram.model.updateTargetBindings(citem) // 更新连线上的文字
                } else {
                  if (citem.to === e.object.to) {
                    that.$message.error('最多可连接5个子节点')
                    return mySelf.myDiagram.model.removeLinkData(citem)
                  }
                }
                flowLinkDataText.push(citem.linkText)
              }
              if (newFromNode.category === 'GROUP_CHOICE' && citem.from === e.newValue) {
                if (groupLinkDataText.length === 0) {
                  citem.linkText = 'TRUE'
                  mySelf.myDiagram.model.updateTargetBindings(citem)  // 更新线上的文字，没有的话默认内容无法更改出来
                } else if (groupLinkDataText.length === 1) {
                  if (citem.to === e.object.to) { // 只更新本条线内容
                    citem.linkText = groupLinkDataText[0] === 'TRUE' ? 'FALSE' : 'TRUE' // 将第二条线赋值为Flase
                    mySelf.myDiagram.model.updateTargetBindings(citem)  // 更新线上的文字，没有的话默认内容无法更改出来
                  }
                } else if (groupLinkDataText.length == 2) { // 限制最多可连接两条线
                  if (citem.to === e.object.to) {
                    that.$message.error('最多可连接两个子节点')
                    return mySelf.myDiagram.model.removeLinkData(citem)
                  }
                }
                groupLinkDataText.push(citem.linkText)
              }
            })
          }
          if (e.modelChange === 'linkToKey') {
            // console.log(122, e.object)
            // let fromNode = mySelf.myDiagram.findNodeForKey(e.object.from)
            // let newToNode = mySelf.myDiagram.findNodeForKey(e.newValue)
            // // 修改连线时，若将false连到分流上，则提示
            // if (newToNode.category === 'MULTI_BRANCH' && e.object.linkText === 'FALSE') {
            //   mySelf.myDiagram.model.removeLinkData(e.object)
            //   return that.$message.error('分流节点只能走TRUE分支！')
            // }
          }
        })
      })
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

        fromNodeLink.findLinksOutOf().each(function (link) {
          // console.log(fromCategory, toCategory)
          // 入参节点只能连接查询节点
          if (fromCategory === 'IN_PARAM' && toCategory !== 'DATA_QUERY') return
          // 数据转换不可直接连线到返参节点
          if (fromCategory === 'DATA_QUERY' && toCategory === 'OUT_PARAM') {
            that.$message.error('不可直接返参，请连接分群节点！')
            return mySelf.myDiagram.model.removeLinkData(link.data)
          }
          // 分流节点的上级只能是分群节点！或节流节点
          if (toCategory === 'MULTI_BRANCH' && (fromCategory !== 'GROUP_CHOICE' && fromCategory !== 'MULTI_BRANCH')) {
            that.$message.error('连线有误，请重新连接！')
            return mySelf.myDiagram.model.removeLinkData(link.data)
          }
        })

        // 所有节点只能有一个上级节点
        let linkInNum = 0
        toNodeLink.findLinksInto().each(function (link) {
          if (linkInNum === 1) {
            that.$message.error('节点只能有一个上级节点！')
            return mySelf.myDiagram.model.removeLinkData(link.data)
          } else {
            linkInNum++
          }
        })
        if (fromCategory === 'GROUP_CHOICE') { // 将状态判断的连线内容保存，保存时判断用
          let linkOutData = []
          let linkDataText = []
          fromNodeLink.findLinksOutOf().each(function (link) {
            link.data.linkText = link.data.linkText
            ? link.data.linkText
            : 'TRUE'
            if (linkOutData.length == 1) {
              link.data.linkText = linkDataText[0] === 'TRUE' ? 'FALSE' : 'TRUE' // 将第二条线赋值为Flase
              // if (link.data.linkText === 'FALSE' && toCategory === 'MULTI_BRANCH') { // false线上不可连线分流节点
              //   that.$message.error('分流节点只能走TRUE分支！')
              //   return mySelf.myDiagram.model.removeLinkData(link.data)
              // }
              mySelf.myDiagram.model.updateTargetBindings(link.data)  // 更新线上的文字，没有的话默认内容无法更改出来
            }
            if (linkOutData.length == 2) { // 限制最多可连接两条线
              that.$message.error('最多可连接两个子节点')
              mySelf.myDiagram.model.removeLinkData(link.data)
              return
            }
            linkOutData.push(link.data)
            linkDataText.push(link.data.linkText)
          })
        } else if (fromCategory === 'MULTI_BRANCH') {
          console.log(9999, e)
          // 从分流拉连线时，默认显示为默认值
          let filterArr = that.flowTypeArr.filter(item => item.key === fromKey)
          let curFlowType = filterArr.length ? filterArr[0].flowType : ''
          if (!curFlowType) {
            that.$message.error('请先选择分流条件再连线!')
            return mySelf.myDiagram.model.removeLinkData(e.subject.data)
          }
          if (curFlowType === 'condition') {
            e.subject.data.linkText = '请输入分流条件'
            e.subject.data.type = 'condition'
          } else {
            e.subject.data.linkText = '0%'
            e.subject.data.type = 'rate'
          }
          mySelf.myDiagram.model.updateTargetBindings(e.subject.data)
          // 判断拉的条数
          let linkOutData = []
          fromNodeLink.findLinksOutOf().each(function (link) {
            if (linkOutData.length == 5) { // 限制最多可连接5条线
              that.$message.error('最多可连接5个子节点')
              mySelf.myDiagram.model.removeLinkData(link.data)
              return
            }
            linkOutData.push(link.data)
          })
        } else { // 非状态判断时，只允许有一个子节点
          let linkOutData = []
          fromNodeLink.findLinksOutOf().each(function (link) {
            if (linkOutData.length == 1) { // 限制最多可连接一条线
              that.$message.error('最多可连接一个子节点')
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
          doubleClick: function (e, link) {
            let fromNode = mySelf.myDiagram.findNodeForKey(link.data.from)
            if (fromNode.category === 'MULTI_BRANCH') {
              let filterArr = that.flowTypeArr.filter(item => item.key === link.data.from)
              let curFlowType = filterArr.length ? filterArr[0].flowType : ''
              if (curFlowType === 'condition') {
                that.multiBranchConditionVisible = true
                that.$nextTick(() => {
                  that.$refs['multiBranchConditionEl'].init(link)
                })
              } else {
                that.multiBranchRateVisible = true
                that.$nextTick(() => {
                  that.$refs['multiBranchRateEl'].init(link, curFlowType)
                })
              }
            }
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
    // 设置节点图片路径
    images(src) {
      if (src != '' && src != null) {
        return require('@/assets/img/' + src)
      } else {
        return ''
      }
    },
    showLinkLabel (e) { // 显示连线上的文字
      var label = e.subject.findObject('LABEL')
      if (label !== null) {
        label.visible = e.subject.fromNode.data.category === 'GROUP_CHOICE' || e.subject.fromNode.data.category === 'MULTI_BRANCH'// 除了状态处理显示外。其他的都不显示
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
      if (category === 'DATA_QUERY' && this.type) {
        node.data.data.type = this.type
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
