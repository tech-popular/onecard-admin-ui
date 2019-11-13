<template>
  <div>
    <div id="sample">

    <div id="paletteDraggable" class="draggable" style="height: 300px;">
      <div id="paletteDraggableHandle" class="handle">选择流</div>
      <div id="paletteContainer">
        <div id="myPaletteDiv"></div>
      </div>
    </div>

    <div id="infoDraggable" class="draggable" style="display: inline-block; vertical-align: top; padding: 5px; top: 20px; left: 380px;">
      <div id="infoDraggableHandle" class="handle">修改流</div>
      <div>
      <div id="myInfo"></div>
      </div>
    </div>

    <div style="display: inline-block; vertical-align: top; width:400px">
      <div id="myDiagramDiv" style="background-color: whitesmoke; border: solid 1px black; height: 400px"></div>
    </div>

</div>
  </div>
</template>

<script>
import go from 'gojs'
// import '../../../extensions/DataInspector.css'
// require('../../../extensions/Figures')
// require('./data')
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
      const GO = go.GraphObject.make
      mySelf.myDiagram =
        GO(go.Diagram, 'myDiagramDiv',
          { 'undoManager.isEnabled': true })
      // define several shared Brushes
      var fill1 = 'rgb(105,210,231)'
      var brush1 = 'rgb(65,180,181)'
      var fill2 = 'rgb(167,219,216)'
      var brush2 = 'rgb(127,179,176)'
      var fill3 = 'rgb(224,228,204)'
      var brush3 = 'rgb(184,188,164)'
      var fill4 = 'rgb(243,134,48)'
      var brush4 = 'rgb(203,84,08)'
      mySelf.myDiagram.nodeTemplateMap.add('', // default category
        GO(go.Node, 'Auto',
          { locationSpot: go.Spot.Center },
          new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
          GO(go.Shape, 'Ellipse',
            { strokeWidth: 2, fill: fill1, name: 'SHAPE' },
            new go.Binding('figure', 'figure'),
            new go.Binding('fill', 'fill'),
            new go.Binding('stroke', 'stroke')
          ),
          GO(go.TextBlock,
            {
              margin: 5,
              maxSize: new go.Size(200, NaN),
              wrap: go.TextBlock.WrapFit,
              textAlign: 'center',
              editable: true,
              font: 'bold 9pt Helvetica, Arial, sans-serif',
              name: 'TEXT'
            },
            new go.Binding('text', 'text').makeTwoWay())))
      // On selection changed, make sure infoDraggable will resize as necessary
      mySelf.myDiagram.addDiagramListener('ChangedSelection', function (diagramEvent) {
        var idrag = document.getElementById('infoDraggable')
        idrag.style.width = ''
        idrag.style.height = ''
      })
      // initialize the Palette that is in a floating, draggable HTML container
      mySelf.myPalette = new go.Palette('myPaletteDiv')  // must name or refer to the DIV HTML element
      mySelf.myPalette.nodeTemplateMap = mySelf.myDiagram.nodeTemplateMap
      mySelf.myPalette.model = new go.GraphLinksModel([
        { text: '开始', fill: fill1, stroke: brush1, figure: 'Hexagon' },
        { text: '执行', fill: fill2, stroke: brush2, figure: 'Rectangle' },
        { text: '判断条件', fill: fill3, stroke: brush3, figure: 'Diamond' },
        { text: '完成', fill: fill4, stroke: brush4, figure: 'Octagon' }
      ])
      mySelf.myPalette.addDiagramListener('InitialLayoutCompleted', function (diagramEvent) {
        var pdrag = document.getElementById('paletteDraggable')
        var palette = diagramEvent.diagram
        pdrag.style.width = palette.documentBounds.width + 28 + 'px' // account for padding/borders
        pdrag.style.height = palette.documentBounds.height + 38 + 'px'
      })
      this.dataInspector()
    },
    dataInspector () {
      var mySelf = this
      document.getElementById('#paletteDraggable').draggable({ handle: '#paletteDraggableHandle' }).resizable({
        stop: function () { mySelf.myPalette.layoutDiagram(true) }
      })
      document.getElementById('#infoDraggable').draggable({ handle: '#infoDraggableHandle' })
      // eslint-disable-next-line no-unused-vars
      var inspector = new window.Inspector('myInfo', mySelf.myDiagram,
        {
          properties: {
            'key': { readOnly: true, show: window.Inspector.showIfPresent },
            'fill': { show: window.Inspector.showIfPresent, type: 'color' },
            'stroke': { show: window.Inspector.showIfPresent, type: 'color' }
          }
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
   .draggable {
          display: inline-block;
          vertical-align: top;
          border: 4px solid #BBB;
          border-radius: 4px;
          background-color: #F5F5F5;
          position: absolute;
          top: 20px;
          left: 20px;
          z-index: 500;
        }
        .handle {
          background-color: lightblue;
          cursor: move;
          text-align: center;
          font: bold 12px sans-serif;
        }
        #infoDraggable {
          font: 12px helvetica, sans-serif;
          min-width: 213px;
        }
        #myInfo {
          width: 100%;
          overflow: hidden;
        }
        #myPaletteDiv {
          background-color: #F5F5F5;
          width: 100%;
          height: 100%;
        }
        /*
    One simple way of making a div fill its space,
    with allowances for the title (top) and the resize handle (bottom)
    */
        #paletteContainer {
          position: absolute;
          bottom: 14px;
          left: 0px;
          right: 0px;
          top: 14px;
        }
</style>
