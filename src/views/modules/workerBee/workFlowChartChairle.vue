<template>
  <el-dialog title="子流程" :modal-append-to-body='false' :append-to-body="true" @close="showClisk" :visible.sync="visible">
    <div class="tag-group" style="margin-bottom: 20px; color:'#fff'">
      <span class="tag-group__title">节点颜色值：</span>
        <el-button type="primary" size="mini" style="background: #103a87; border:none; margin-top: 5px">HTTP</el-button>
        <el-button type="primary" size="mini" style="background: #6d89b1; border:none; margin-top: 5px">JDBC</el-button>
        <el-button type="primary" size="mini" style="background: #ed6e19; border:none; margin-top: 5px">KAFKA</el-button>
        <el-button type="primary" size="mini" style="background: #e39f24; border:none; margin-top: 5px">GROOVY</el-button>
        <el-button type="primary" size="mini" style="background: #e559f2; border:none; margin-top: 5px">DECISION</el-button>
        <el-button type="primary" size="mini" style="background: #8859f2; border:none; margin-top: 5px">CASSANDRA</el-button>
        <el-button type="primary" size="mini" style="background: #863816; border:none; margin-top: 5px">AVIATOR</el-button>
        <el-button type="primary" size="mini" style="background: #f43574; border:none; margin-top: 5px">FORK_JOIN</el-button>
        <el-button type="primary" size="mini" style="background: #430b98; border:none; margin-top: 5px">JOIN</el-button>
        <el-button type="primary" size="mini" style="background: #065361; border:none; margin-top: 5px">SUB_WORKFLOW</el-button>
        <el-button type="primary" size="mini" style="background: #0868d3; border:none">FREEMARKER</el-button>
        <el-button type="primary" size="mini" style="background: #724a3b; border:none">FORRCH</el-button>
        <el-button type="primary" size="mini" style="background: #0b9ccb; border:none">REDIS</el-button>
        <el-button type="primary" size="mini" style="background: #a9cb0b; border:none">HBASE</el-button>
    </div>
    <div id="mySubProcess" style="width:100%; height:650px; background-color: #ccc;"/>
  </el-dialog>
</template>

<script>
// import go from 'gojs'
import { workFlowShow } from '@/api/workerBee/workFlow'
var go = window.go
export default {
  data () {
    return {
      visible: false,
      subWorkFlow: '',
      SubProcessList: {}
    }
  },
  methods: {
    init (subWorkFlow) {
      this.visible = true
      this.subWorkFlow = subWorkFlow || ''
      this.$nextTick(() => {
        const dataBody = subWorkFlow
        workFlowShow(dataBody).then(({data}) => {
          if (data && data.status === 0) {
            this.SubProcessList = data.data
            console.log(this.SubProcessList, '+++++++++++++')
          }
        }).then(() => {
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
          mySelf.myDiagram.nodeTemplateMap.add('HTTP',
        $(go.Node, 'Auto',
          { position: new go.Point(100, 0) },
          $(go.Shape, 'RoundedRectangle', { fill: '#103a87' }),
          $(go.TextBlock, { margin: 8, stroke: '#fff', alignment: go.Spot.Center }, new go.Binding('text'))
        )
      )
          mySelf.myDiagram.nodeTemplateMap.add('JDBC',
        $(go.Node, 'Auto',
          { position: new go.Point(100, 0) },
          $(go.Shape, 'RoundedRectangle', { fill: '#6d89b1' }),
          $(go.TextBlock, { margin: 8, stroke: '#fff', alignment: go.Spot.Center }, new go.Binding('text'))
        )
      )
          mySelf.myDiagram.nodeTemplateMap.add('KAFKA',
        $(go.Node, 'Auto',
          { position: new go.Point(100, 0) },
          $(go.Shape, 'RoundedRectangle', { fill: '#ed6e19' }),
          $(go.TextBlock, { margin: 8, stroke: '#fff', alignment: go.Spot.Center }, new go.Binding('text'))
        )
      )
          mySelf.myDiagram.nodeTemplateMap.add('GROOVY',
        $(go.Node, 'Auto',
          { position: new go.Point(100, 0) },
          $(go.Shape, 'RoundedRectangle', { fill: '#e39f24' }),
          $(go.TextBlock, { margin: 8, stroke: '#fff', alignment: go.Spot.Center }, new go.Binding('text'))
        )
      )
          mySelf.myDiagram.nodeTemplateMap.add('DECISION',
        $(go.Node, 'Auto',
          { position: new go.Point(100, 0) },
          $(go.Shape, 'RoundedRectangle', { fill: '#e559f2' }),
          $(go.TextBlock, { margin: 8, stroke: '#fff', alignment: go.Spot.Center }, new go.Binding('text'))
        )
      )
          mySelf.myDiagram.nodeTemplateMap.add('CASSANDRA',
        $(go.Node, 'Auto',
          { position: new go.Point(100, 0) },
          $(go.Shape, 'RoundedRectangle', { fill: '#8859f2' }),
          $(go.TextBlock, { margin: 8, stroke: '#fff', alignment: go.Spot.Center }, new go.Binding('text'))
        )
      )
          mySelf.myDiagram.nodeTemplateMap.add('AVIATOR',
        $(go.Node, 'Auto',
          { position: new go.Point(100, 0) },
          $(go.Shape, 'RoundedRectangle', { fill: '#863816' }),
          $(go.TextBlock, { margin: 8, stroke: '#fff', alignment: go.Spot.Center }, new go.Binding('text'))
        )
      )
          mySelf.myDiagram.nodeTemplateMap.add('FORK_JOIN',
        $(go.Node, 'Auto',
          { position: new go.Point(100, 0) },
          $(go.Shape, 'RoundedRectangle', { fill: '#f43574' }),
          $(go.TextBlock, { margin: 8, stroke: '#fff', alignment: go.Spot.Center }, new go.Binding('text'))
        )
      )
          mySelf.myDiagram.nodeTemplateMap.add('JOIN',
        $(go.Node, 'Auto',
          { position: new go.Point(100, 0) },
          $(go.Shape, 'RoundedRectangle', { fill: '#430b98' }),
          $(go.TextBlock, { margin: 8, stroke: '#fff', alignment: go.Spot.Center }, new go.Binding('text'))
        )
      )
          mySelf.myDiagram.nodeTemplateMap.add('SUB_WORKFLOW',
        $(go.Node, 'Auto',
          { position: new go.Point(100, 0) },
          $(go.Shape, 'RoundedRectangle', { fill: '#065361' }),
          $(go.TextBlock, { margin: 8, stroke: '#fff', alignment: go.Spot.Center }, new go.Binding('text'))
        )
      )
          mySelf.myDiagram.nodeTemplateMap.add('FREEMARKER',
        $(go.Node, 'Auto',
          { position: new go.Point(100, 0) },
          $(go.Shape, 'RoundedRectangle', { fill: '#0868d3' }),
          $(go.TextBlock, { margin: 8, stroke: '#fff', alignment: go.Spot.Center }, new go.Binding('text'))
        )
      )
          mySelf.myDiagram.nodeTemplateMap.add('FORRCH',
        $(go.Node, 'Auto',
          { position: new go.Point(100, 0) },
          $(go.Shape, 'RoundedRectangle', { fill: '#724a3b' }),
          $(go.TextBlock, { margin: 8, stroke: '#fff', alignment: go.Spot.Center }, new go.Binding('text'))
        )
      )
          mySelf.myDiagram.nodeTemplateMap.add('REDIS',
        $(go.Node, 'Auto',
          { position: new go.Point(100, 0) },
          $(go.Shape, 'RoundedRectangle', { fill: '#0b9ccb' }),
          $(go.TextBlock, { margin: 8, stroke: '#fff', alignment: go.Spot.Center }, new go.Binding('text'))
        )
      )
          mySelf.myDiagram.nodeTemplateMap.add('HBASE',
        $(go.Node, 'Auto',
          { position: new go.Point(100, 0) },
          $(go.Shape, 'RoundedRectangle', { fill: '#a9cb0b' }),
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
      })
    },
    showClisk () {
      this.visible = false
    }
  }
}
</script>
