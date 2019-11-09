<template>
  <div>
    <el-button type="primary" icon="el-icon-zoom-in" @click="enlarge()" style="margin-bottom: 20px;"/>
    <el-button type="primary" icon="el-icon-zoom-out" @click="narrow()" style="margin-bottom: 20px;"/>
    <div id="myDiagramDiv" style="width:100%; height:500px; background-color: #ccc;"></div>
  </div>
</template>

<script>
import go from 'gojs'
export default{

  data () {
    return {

    }
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

      mySelf.myDiagram.addDiagramListener('Modified', function (e) {
        var button = document.getElementById('SaveButton')
        if (button) button.disabled = !mySelf.myDiagram.isModified
        var idx = document.title.indexOf('*')
        if (mySelf.myDiagram.isModified) {
          if (idx < 0) document.title += '*'
        } else {
          if (idx >= 0) document.title = document.title.substr(0, idx)
        }
      })
      var bluegrad = $(go.Brush, 'Linear', { 0: '#C4ECFF', 1: '#70D4FF' })
      // var greengrad = $(go.Brush, 'Linear', { 0: '#B1E2A5', 1: '#7AE060' })
      var actionTemplate =
        $(go.Panel, 'Horizontal',
          $(go.Shape,
            { width: 12, height: 12 },
            new go.Binding('figure'),
            new go.Binding('fill')
          ),
          $(go.TextBlock,
            { font: '10pt Verdana, sans-serif' },
            new go.Binding('text')
          )
       )
      mySelf.myDiagram.nodeTemplate =
        $(go.Node, 'Vertical',
          { selectionObjectName: 'BODY' },
          $(go.Panel, 'Auto',
            { name: 'BODY' },
            $(go.Shape, 'Rectangle',
              { fill: bluegrad, stroke: null }
            ),
            $(go.Panel, 'Vertical',
              { margin: 3 },

              $(go.TextBlock,
                {
                  stretch: go.GraphObject.Horizontal,
                  font: 'bold 12pt Verdana, sans-serif'
                },
                new go.Binding('text', 'question')
              ),

              $(go.Panel, 'Vertical',
                { stretch: go.GraphObject.Horizontal, visible: false },
                new go.Binding('visible', 'actions', function (acts) {
                  return (Array.isArray(acts) && acts.length > 0)
                }),

                $(go.Panel, 'Table',
                  { stretch: go.GraphObject.Horizontal },
                  $(go.TextBlock, '条件',
                    {
                      alignment: go.Spot.Left,
                      font: '10pt Verdana, sans-serif'
                    }
                  ),
                  $('PanelExpanderButton', 'COLLAPSIBLE',
                    { column: 1, alignment: go.Spot.Right }
                  )
                ),

                $(go.Panel, 'Vertical',
                  {
                    name: 'COLLAPSIBLE',
                    padding: 2,
                    stretch: go.GraphObject.Horizontal,
                    background: 'white',
                    defaultAlignment: go.Spot.Left,
                    itemTemplate: actionTemplate
                  },
                  new go.Binding('itemArray', 'actions')
                )
              )
            )
          ),
          $(go.Panel,
            { height: 17 },
            $('TreeExpanderButton')
          )
       )
      mySelf.myDiagram.nodeTemplateMap.add('Start',
        $(go.Node, 'Spot',
          $(go.Shape, 'Circle',
            { width: 80, height: 80, fill: '#17B3A3', stroke: null }
          ),
          $(go.TextBlock,
            {
              font: '10pt Verdana, sans-serif',
              stroke: '#fff'
            },
            new go.Binding('text')
          )
        )
      )
      mySelf.myDiagram.nodeTemplateMap.add('Judge',
        $(go.Node, 'Spot',
          $(go.Shape, 'Diamond',
            {fill: '#00A9C9', strokeWidth: 0}
          ),
          $(go.TextBlock,
            {
              font: '10pt Verdana, sans-serif',
              stroke: '#fff'
            },
            new go.Binding('text')
          )
        )
      )
      mySelf.myDiagram.nodeTemplateMap.add('Condition',
        $(go.Node, 'Spot',
          $(go.Shape, 'Rectangle',
            {height: 25, fill: 'blue', strokeWidth: 0}
          ),
          $(go.TextBlock,
            {
              font: '10pt Verdana, sans-serif',
              stroke: '#fff'
            },
            new go.Binding('text')
          )
        )
      )
      mySelf.myDiagram.nodeTemplateMap.add('End',
        $(go.Node, 'Spot',
          $(go.Shape, 'Circle',
            { width: 55, height: 55, fill: '#79C900', stroke: null }
          ),
          $(go.TextBlock,
            {
              font: '10pt Verdana, sans-serif',
              stroke: '#fff'
            },
            new go.Binding('text')
          )
        )
      )
      mySelf.myDiagram.linkTemplate =
        $(go.Link, go.Link.Orthogonal,
          { deletable: false, corner: 10 },
          $(go.Shape,
            { strokeWidth: 2 }
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
      var nodeDataArray = [
        { key: 1, text: '工作流预览', category: 'Start' },
        { key: 2, text: '我是工作流1', category: 'Judge' },
        { key: 3, text: '我是工作流2', category: 'Judge' },
        { key: 5, text: '这个数据1', category: 'Condition' },
        { key: 6, text: '这个数据2', category: 'Condition' },
        { key: 8, text: '这个数据3', category: 'Condition' },
        { key: 9, text: '这个数据4', category: 'Condition' },
        { key: 10, text: '完成1', category: 'End' },
        { key: 11, text: '完成2', category: 'End' },
        { key: 12, text: '完成3', category: 'End' },
        { key: 13, text: '完成4', category: 'End' }
      ]
      var linkDataArray = [
        { from: 1, to: 2, answer: '是' },
        { from: 1, to: 3, answer: '是' },
        { from: 1, to: 4, answer: '是' },
        { from: 2, to: 5, answer: '是' },
        { from: 2, to: 6, answer: '否' },
        { from: 3, to: 8, answer: '是' },
        { from: 3, to: 9, answer: '否' },
        { from: 5, to: 10 },
        { from: 6, to: 11 },
        { from: 8, to: 12 },
        { from: 9, to: 13 }
      ]
      mySelf.myDiagram.model = $(go.GraphLinksModel,
        {
          copiesArrays: true,
          copiesArrayObjects: true,
          nodeDataArray: nodeDataArray,
          linkDataArray: linkDataArray
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
