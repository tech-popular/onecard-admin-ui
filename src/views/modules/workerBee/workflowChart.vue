<template>
  <div>
    <el-button type="primary" icon="el-icon-zoom-in" @click="enlarge()" style="margin-bottom: 20px;"/>
    <el-button type="primary" icon="el-icon-zoom-out" @click="narrow()" style="margin-bottom: 20px;"/>
    <div id="myDiagramDiv" style="width:100%; height:650px; background-color: #ccc;"></div>
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"/>
    <!-- <workFlowChartChairle v-if="workFlowChartChairlevisible" ref="addChartChairle" @refreshDataList="getDataList"/> -->

  </div>
</template>

<script>
import go from 'gojs'
import AddOrUpdate from './workFlowChart-add-or-update'
// import workFlowChartChairle from './workFlowChartChairle'

export default{
  props:
  {
    dataAllList: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    dataAllList (newValue, oldValue) {
      this.init()
    }
  },
  // props: ['dataAllList'],
  data () {
    return {
      addOrUpdateVisible: false,
      workFlowChartChairlevisible: false
    }
  },
  components: {
    AddOrUpdate
    // workFlowChartChairle
  },
  mounted () {
    this.init()
  },

  methods: {
    init () {
      var mySelf = this
      if (mySelf.myDiagram) {
        this.myDiagram.div = null
      }
      const $ = go.GraphObject.make

      mySelf.myDiagram =
        $(go.Diagram, 'myDiagramDiv',
          {
            allowCopy: false,
            'draggingTool.dragsTree': true,
            'commandHandler.deletesTree': true,
            layout:
              $(go.TreeLayout,
                { angle: 90, arrangement: go.TreeLayout.ArrangementFixedRoots }),
            'undoManager.isEnabled': true,
            isReadOnly: true // 只读
          })
      mySelf.myDiagram.nodeTemplateMap.add('Start',
          $(go.Node, 'Auto',
            $(go.Shape, 'Circle', { fill: '#17B3A3' }),
            $(go.TextBlock, { stroke: '#fff' }, new go.Binding('text'))
          )
        )
      mySelf.myDiagram.nodeTemplateMap.add('Judge',
        $(go.Node, 'Auto',
          { position: new go.Point(100, 0) },
          $(go.Shape, 'Diamond', {fill: '#538779'}),
          $(go.TextBlock, { stroke: '#fff', margin: 8 }, new go.Binding('text'))
        )
      )
      mySelf.myDiagram.nodeTemplateMap.add('Condition',
        $(go.Node, 'Auto',
          { position: new go.Point(100, 0) },
          $(go.Shape, 'RoundedRectangle', { fill: '#58ce7a' }),
          $(go.TextBlock, { margin: 8, stroke: '#fff', alignment: go.Spot.Center }, new go.Binding('text'))
        )
      )
      mySelf.myDiagram.nodeTemplateMap.add('End',
        $(go.Node, 'Auto',
          { position: new go.Point(100, 0) },
          $(go.Shape, 'Circle', {fill: '#79C900'}),
          $(go.TextBlock, { margin: 10, stroke: '#fff' }, new go.Binding('text'))
        )
      )
      // 替换LinkTemplateMap中的默认链接模板
      mySelf.myDiagram.linkTemplate =
        $(go.Link, go.Link.Orthogonal,
          {
            routing: go.Link.AvoidsNodes,
            curve: go.Link.JumpOver,
            corner: 5,
            toShortLength: 4,
            relinkableFrom: true,
            relinkableTo: true,
            reshapable: true,
            resegmentable: true,
            // 鼠标悬停巧妙地突出显示链接:
            mouseEnter: function (e, link) { link.findObject('HIGHLIGHT').stroke = 'rgba(30,144,255,0.2)' },
            mouseLeave: function (e, link) { link.findObject('HIGHLIGHT').stroke = 'transparent' },
            selectionAdorned: false
          },
          new go.Binding('points').makeTwoWay(),
          $(go.Shape,  // 链接路径形状
            { isPanelMain: true, stroke: 'gray', strokeWidth: 2 },
            new go.Binding('stroke', 'isSelected', function (sel) { return sel ? 'dodgerblue' : 'gray' }).ofObject()),
          $(go.Shape,
            { toArrow: 'standard', strokeWidth: 0, fill: 'gray' }
          ),
          $(go.TextBlock, go.Link.OrientUpright,
            {
              background: 'white',
              visible: false,
              segmentIndex: -2,
              segmentOrientation: go.Link.None
            },
            new go.Binding('text', 'answer'),
            new go.Binding('visible', 'answer', function (a) { return (!!a) })
          )
        )
      // var nodeDataArray = [
      //   {key: '0', text: '工作流预览', category: 'Start'},
      //   {key: '1', text: '数据1', category: 'Condition', dital: '这是详情'},
      //   {key: '2', text: '数据数据数据数据2', category: 'Condition', dital: '这是详情2'},
      //   {key: '3', text: '数据3', category: 'Condition', dital: '这是详情3'},
      //   {key: '4', text: '数据4', category: 'Condition', dital: '这是详情4'},
      //   {key: '5', text: '条件500000000000000', category: 'Judge'},
      //   {key: '6', text: '数据5', category: 'Condition', dital: '这是详情5'},
      //   {key: '7', text: '数据6', category: 'Condition', dital: '这是详情6'}
      // ]
      // var linkDataArray = [
      //   {from: '0', to: '1', answer: null},
      //   {from: '1', to: '2', answer: '是'},
      //   {from: '1', to: '3', answer: null},
      //   {from: '2', to: '4', answer: null},
      //   {from: '3', to: '4', answer: null},
      //   {from: '5', to: '6', answer: null},
      //   {from: '5', to: '7', answer: null},
      //   {from: '4', to: '5', answer: null}
      // ]
      // 查看
      mySelf.myDiagram.addDiagramListener('ObjectSingleClicked', function (e) {
        if (e.subject.part.data.category === 'Start' || e.subject.part.data.category === 'End') {
          mySelf.addOrUpdateVisible = false
        } else {
          mySelf.addOrUpdateVisible = true
        }
        mySelf.$nextTick(() => {
          mySelf.$refs.addOrUpdate.init(e.subject.part.data.key, '查看')
        })
      })
      // 右击查看子流程
      // mySelf.myDiagram.onObjectDoubleClicked('ObjectSingleClicked', function (e) {
      //   if (e.subject.part.data.category === 'Start' || e.subject.part.data.category === 'End') {
      //     mySelf.workFlowChartChairlevisible = false
      //   } else {
      //     mySelf.workFlowChartChairlevisible = true
      //   }
      //   mySelf.$nextTick(() => {
      //     mySelf.$refs.addChartChairle.init(e.subject.part.data.key, '查看')
      //   })
      // })
      mySelf.myDiagram.model = $(go.GraphLinksModel,
        {
          copiesArrays: true,
          copiesArrayObjects: true,
          // nodeDataArray: nodeDataArray,
          // linkDataArray: linkDataArray
          nodeDataArray: this.dataAllList.nodeDataArrays,
          linkDataArray: this.dataAllList.linkDataArrays
        })
    },

    // 放大事件
    enlarge () {
      var mySelf = this
      mySelf.myDiagram.scale += 0.1
    },
    // 缩小事件
    narrow () {
      var mySelf = this
      mySelf.myDiagram.scale -= 0.1
    }
  }

}
 </script>
<style lang="scss" scoped>

</style>
