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
      var nodeDataArray = this.dataAllList.nodeDataArray
      var linkDataArray = this.dataAllList.linkDataArray
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
