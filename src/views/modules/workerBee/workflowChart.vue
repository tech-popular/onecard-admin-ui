<template>
  <div>
    <div id="myDiagramDiv"></div>
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
                { angle: 0, arrangement: go.TreeLayout.ArrangementFixedRoots }),
            'undoManager.isEnabled': true
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
      var greengrad = $(go.Brush, 'Linear', { 0: '#B1E2A5', 1: '#7AE060' })
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
                  $(go.TextBlock, '流量/比例',
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
      mySelf.myDiagram.nodeTemplateMap.add('Terminal',
        $(go.Node, 'Spot',
          $(go.Shape, 'Circle',
            { width: 55, height: 55, fill: greengrad, stroke: null }
          ),
          $(go.TextBlock,
            { font: '10pt Verdana, sans-serif' },
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
        {
          key: 1,
          question: 'Greeting',
          actions: [
            { text: 'Sales', figure: 'ElectricalHazard', fill: 'blue' },
            { text: 'Parts and Services', figure: 'FireHazard', fill: 'red' },
            { text: 'Representative', figure: 'IrritationHazard', fill: 'yellow' }
          ]
        },
        {
          key: 2,
          question: 'Sales',
          actions: [
            { text: 'Compact', figure: 'ElectricalHazard', fill: 'blue' },
            { text: 'Mid-Size', figure: 'FireHazard', fill: 'red' },
            { text: 'Large', figure: 'IrritationHazard', fill: 'yellow' }
          ]
        },
        {
          key: 3,
          question: 'Parts and Services',
          actions: [
            { text: 'Maintenance', figure: 'ElectricalHazard', fill: 'blue' },
            { text: 'Repairs', figure: 'FireHazard', fill: 'red' },
            { text: 'State Inspection', figure: 'IrritationHazard', fill: 'yellow' }
          ]
        },
        { key: 4, question: 'Representative' },
        { key: 5, question: 'Compact' },
        { key: 6, question: 'Mid-Size' },
        {
          key: 7,
          question: 'Large',
          actions: [
            { text: 'SUV', figure: 'ElectricalHazard', fill: 'blue' },
            { text: 'Van', figure: 'FireHazard', fill: 'red' }
          ]
        },
        { key: 8, question: 'Maintenance' },
        { key: 9, question: 'Repairs' },
        { key: 10, question: 'State Inspection' },
        { key: 11, question: 'SUV' },
        { key: 12, question: 'Van' },
        { key: 13, category: 'Terminal', text: 'Susan' },
        { key: 14, category: 'Terminal', text: 'Eric' },
        { key: 15, category: 'Terminal', text: 'Steven' },
        { key: 16, category: 'Terminal', text: 'Tom' },
        { key: 17, category: 'Terminal', text: 'Emily' },
        { key: 18, category: 'Terminal', text: 'Tony' },
        { key: 19, category: 'Terminal', text: 'Ken' },
        { key: 20, category: 'Terminal', text: 'Rachel' }
      ]
      var linkDataArray = [
        { from: 1, to: 2, answer: 1 },
        { from: 1, to: 3, answer: 2 },
        { from: 1, to: 4, answer: 3 },
        { from: 2, to: 5, answer: 1 },
        { from: 2, to: 6, answer: 2 },
        { from: 2, to: 7, answer: 3 },
        { from: 3, to: 8, answer: 1 },
        { from: 3, to: 9, answer: 2 },
        { from: 3, to: 10, answer: 3 },
        { from: 7, to: 11, answer: 1 },
        { from: 7, to: 12, answer: 2 },
        { from: 5, to: 13 },
        { from: 6, to: 14 },
        { from: 11, to: 15 },
        { from: 12, to: 16 },
        { from: 8, to: 17 },
        { from: 9, to: 18 },
        { from: 10, to: 19 },
        { from: 4, to: 20 }
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
