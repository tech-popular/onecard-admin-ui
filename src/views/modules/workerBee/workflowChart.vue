<template>
  <div>
    <el-button type="primary" icon="el-icon-zoom-in" @click="enlarge()" style="margin-bottom: 20px;"/>
    <el-button type="primary" icon="el-icon-zoom-out" @click="narrow()" style="margin-bottom: 20px;"/>
    <div id="myDiagramDiv" style="width:100%; height:650px; background-color: #ccc;"></div>
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"/>
  </div>
</template>

<script>
import go from 'gojs'
import AddOrUpdate from './workFlowChart-add-or-update'

export default{
  props: ['dataAllList'],
  data () {
    return {
      addOrUpdateVisible: false

    }
  },
  components: {
    AddOrUpdate
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
            'undoManager.isEnabled': true
            // isReadOnly: true // 只读
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
        $(go.Link,  // 整个连接面板
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
          $(go.Shape,  // 高光形状，通常是透明的
            { isPanelMain: true, strokeWidth: 8, stroke: 'transparent', name: 'HIGHLIGHT' }),
          $(go.Shape,  // 链接路径形状
            { isPanelMain: true, stroke: 'gray', strokeWidth: 2 },
            new go.Binding('stroke', 'isSelected', function (sel) { return sel ? 'dodgerblue' : 'gray' }).ofObject()),
          $(go.Shape,  // 箭头
            { toArrow: 'standard', strokeWidth: 0, fill: 'gray' }),
          $(go.Panel, 'Auto',  // 链接标签，通常不可见
            { visible: false, name: 'LABEL', segmentIndex: 2, segmentFraction: 0.5 },
            new go.Binding('visible', 'visible').makeTwoWay(),
            $(go.Shape, 'RoundedRectangle',  // 标签形状
              { fill: '#F8F8F8', strokeWidth: 0 }), // 条件格式“是”“否”背景色
            $(go.TextBlock, '是',  // 标签
              {
                textAlign: 'center',
                font: '10pt helvetica, arial, sans-serif',
                stroke: '#333333',
                editable: true
              },
              new go.Binding('text').makeTwoWay())
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
      mySelf.myDiagram.addDiagramListener('ObjectSingleClicked', function (e) {
        mySelf.addOrUpdateVisible = true
        mySelf.$nextTick(() => {
          mySelf.$refs.addOrUpdate.init(e.subject.part.data.key, '查看')
        })
      })
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
