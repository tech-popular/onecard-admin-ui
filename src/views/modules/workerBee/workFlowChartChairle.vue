<template>
  <el-dialog title="子流程" :modal-append-to-body='false' :append-to-body="true" @close="showClisk" :visible.sync="visible">
    <div id="mySubProcess" style="width:100%; height:650px; background-color: #ccc;"/>
  </el-dialog>
</template>

<script>
import go from 'gojs'
import { workFlowShow } from '@/api/workerBee/workFlow'
export default {
  data () {
    return {
      visible: false,
      id: '',
      SubProcessList: []
    }
  },
  methods: {
    init (id) {
      this.visible = true
      this.id = id || ''
      this.$nextTick(() => {
        const dataBody = id
        workFlowShow(dataBody).then(({data}) => {
          if (data && data.status === 0) {
            this.SubProcessList = data.data
          }
        })
        var mySelf = this
        if (mySelf.myDiagram) {
          this.myDiagram.div = null
        }
        const $ = go.GraphObject.make

        mySelf.myDiagram =
        $(go.Diagram, 'mySubProcess',
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
        mySelf.myDiagram.model = $(go.GraphLinksModel,
          {
            copiesArrays: true,
            copiesArrayObjects: true,
            nodeDataArray: this.SubProcessList.nodeDataArrays,
            linkDataArray: this.SubProcessList.linkDataArrays
          })
      })
    },
    showClisk () {
      this.visible = false
    }
  }
}
</script>
