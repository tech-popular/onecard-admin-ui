<template>
  <div>
    <el-dialog title="实时策略" @close="closeDialogClick" :modal-append-to-body='false' :append-to-body="true" :close-on-click-modal="false" :visible.sync="visible" width="900px">
      <div class="select-content">
        <el-select
          v-model="strategyId"
          filterable
          placeholder="请选择"
          class="item-sel"
        >
          <el-option
            v-for="(item, index) in strategyList"
            :key="index"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
        <div style="display:inline-block;float:right">
          <el-button @click="reloadDiagram" size="mini" icon="el-icon-refresh">刷新</el-button>
          <el-button @click="bigDiagram" size="mini" icon="el-icon-plus">放大</el-button>
          <el-button @click="smallDiagram" size="mini" icon="el-icon-minus">缩小</el-button>
        </div>
      </div>
      <el-card shadow="nerver">
        <div id="myDiagramDiv" style="height: 750px;"></div>
      </el-card>
      <div slot="footer">
        <el-button type="primary" @click="cancel">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import go from 'gojs'
var mySelf = null
export default {
  data () {
    return {
      visible: false,
      strategyId: '',
      strategyList: [
        {
          id: 1,
          name: '策略2 30%'
        }
      ],
      flowJson: {
        class: 'go.GraphLinksModel',
        linkFromPortIdProperty: 'fromPort',
        linkToPortIdProperty: 'toPort',
        nodeDataArray: [
          {'key': -1, 'category': 'Start', 'loc': '175 0', 'text': 'Start'},
          {'key': 0, 'loc': '-5 75', 'text': 'Preheat oven to 375 F'},
          {'key': 1, 'loc': '175 100', 'text': 'In a bowl, blend: 1 cup margarine, 1.5 teaspoon vanilla, 1 teaspoon salt'},
          {'key': 2, 'loc': '175 200', 'text': 'Gradually beat in 1 cup sugar and 2 cups sifted flour'},
          {'key': 3, 'loc': '175 290', 'text': 'Mix in 6 oz (1 cup) Nestle'},
          {'key': 4, 'loc': '175 380', 'text': 'Press evenly into ungreased 15x10x1 pan'},
          {'key': 5, 'loc': '355 85', 'text': 'Finely chop 1/2 cup of your choice of nuts'},
          {'key': 6, 'loc': '175 450', 'text': 'Sprinkle nuts on top'},
          {'key': 7, 'loc': '175 515', 'text': 'Bake for 25 minutes and let cool'},
          {'key': 8, 'loc': '175 585', 'text': 'Cut into rectangular grid'},
          {'key': -2, 'category': 'End', 'loc': '175 660', 'text': 'Enjoy!'}
        ],
        linkDataArray: [
          {'from': 1, 'to': 2, 'fromPort': 'B', 'toPort': 'T'},
          {'from': 2, 'to': 3, 'fromPort': 'B', 'toPort': 'T'},
          {'from': 3, 'to': 4, 'fromPort': 'B', 'toPort': 'T'},
          {'from': 4, 'to': 6, 'fromPort': 'B', 'toPort': 'T'},
          {'from': 6, 'to': 7, 'fromPort': 'B', 'toPort': 'T'},
          {'from': 7, 'to': 8, 'fromPort': 'B', 'toPort': 'T'},
          {'from': 8, 'to': -2, 'fromPort': 'B', 'toPort': 'T'},
          {'from': -1, 'to': 0, 'fromPort': 'B', 'toPort': 'T'},
          {'from': -1, 'to': 1, 'fromPort': 'B', 'toPort': 'T'},
          {'from': -1, 'to': 5, 'fromPort': 'B', 'toPort': 'T'},
          {'from': 5, 'to': 4, 'fromPort': 'B', 'toPort': 'T'},
          {'from': 0, 'to': 4, 'fromPort': 'B', 'toPort': 'T'}
        ]
      }
    }
  },
  methods: {
    init () {
      this.visible = true
      this.$nextTick(() => {
        this.diagramInit()
      })
    },
    diagramInit () { // 导出
      mySelf = this
      var $ = go.GraphObject.make  // for conciseness in defining templates

      mySelf.myDiagram =
        $(go.Diagram, 'myDiagramDiv',  // must name or refer to the DIV HTML element
          {
            'LinkDrawn': showLinkLabel,  // this DiagramEvent listener is defined below
            'LinkRelinked': showLinkLabel,
            'isReadOnly': true,
            'scale': 1.0,    // 初始视图大小比例
            'minScale': 0.5, // 最小视图的缩小比例
            'maxScale': 1.5, // 最大视图的放大比例
            'undoManager.isEnabled': true  // enable undo & redo
          })
      function nodeStyle () {
        return [
          new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
          {
            locationSpot: go.Spot.Center
          }
        ]
      }

      function makePort (name, align, spot, output, input) {
        var horizontal = align.equals(go.Spot.Top) || align.equals(go.Spot.Bottom)
        return $(go.Shape,
          {
            fill: 'transparent',  // changed to a color in the mouseEnter event handler
            strokeWidth: 0,  // no stroke
            width: horizontal ? NaN : 8,  // if not stretching horizontally, just 8 wide
            height: !horizontal ? NaN : 8,  // if not stretching vertically, just 8 tall
            alignment: align,  // align the port on the main Shape
            stretch: (horizontal ? go.GraphObject.Horizontal : go.GraphObject.Vertical),
            portId: name,  // declare this object to be a 'port'
            fromSpot: spot,  // declare where links may connect at this port
            fromLinkable: output,  // declare whether the user may draw links from here
            toSpot: spot,  // declare where links may connect at this port
            toLinkable: input,  // declare whether the user may draw links to here
            cursor: 'pointer',  // show a different cursor to indicate potential link point
            mouseEnter: function (e, port) {  // the PORT argument will be this Shape
              if (!e.diagram.isReadOnly) port.fill = 'rgba(255,0,255,0.5)'
            },
            mouseLeave: function (e, port) {
              port.fill = 'transparent'
            }
          })
      }

      function textStyle () {
        return {
          font: 'normal 12px Lato, Helvetica, Arial, sans-serif',
          stroke: '#F8F8F8'
        }
      }

      mySelf.myDiagram.nodeTemplateMap.add('',  // the default category
        $(go.Node, 'Table', nodeStyle(),
          $(go.Panel, 'Auto',
            $(go.Shape, 'RoundedRectangle',
              { fill: '#2093f7', stroke: '#2093f7' },
              new go.Binding('figure', 'figure')),
            $(go.TextBlock, textStyle(),
              {
                margin: 8,
                maxSize: new go.Size(160, NaN),
                wrap: go.TextBlock.WrapFit,
                editable: true
              },
              new go.Binding('text').makeTwoWay())
          ),
          makePort('T', go.Spot.Top, go.Spot.TopSide, false, true),
          makePort('L', go.Spot.Left, go.Spot.LeftSide, true, true),
          makePort('R', go.Spot.Right, go.Spot.RightSide, true, true),
          makePort('B', go.Spot.Bottom, go.Spot.BottomSide, true, false)
        )
      )

      mySelf.myDiagram.linkTemplate =
        $(go.Link,  // the whole link panel
          {
            routing: go.Link.AvoidsNodes,
            curve: go.Link.JumpOver,
            corner: 5,
            toShortLength: 4,
            relinkableFrom: true,
            relinkableTo: true,
            reshapable: true,
            resegmentable: true,
            // mouse-overs subtly highlight links:
            mouseEnter: function (e, link) { link.findObject('HIGHLIGHT').stroke = 'rgba(30,144,255,0.2)' },
            mouseLeave: function (e, link) { link.findObject('HIGHLIGHT').stroke = 'transparent' },
            selectionAdorned: false
          },
          new go.Binding('points').makeTwoWay(),
          $(go.Shape, { isPanelMain: true, strokeWidth: 8, stroke: 'transparent', name: 'HIGHLIGHT' }),
          $(go.Shape, { isPanelMain: true, stroke: 'gray', strokeWidth: 2 }, new go.Binding('stroke', 'isSelected', function (sel) { return sel ? 'dodgerblue' : 'gray' }).ofObject()),
          $(go.Shape, { toArrow: 'standard', strokeWidth: 0, fill: 'gray' }),
          $(
            go.Panel,
            'Auto',
            { visible: false, name: 'LABEL', segmentIndex: 2, segmentFraction: 0.5 },
            new go.Binding('visible', 'visible').makeTwoWay(),
            $(go.Shape, 'RoundedRectangle', { fill: '#F8F8F8', strokeWidth: 0 }), // 文字标签的形状
            $(
              go.TextBlock,
              'Yes', // 设置线上文字
              {
                textAlign: 'center',
                font: '12px helvetica, arial, sans-serif',
                stroke: '#333333',
                editable: true
              },
              new go.Binding('text').makeTwoWay()
            )
          )
        )
      function showLinkLabel (e) {
        var label = e.subject.findObject('LABEL')
        if (label !== null) label.visible = (e.subject.fromNode.data.category === 'Conditional')
      }

      mySelf.myDiagram.toolManager.linkingTool.temporaryLink.routing = go.Link.Orthogonal
      mySelf.myDiagram.toolManager.relinkingTool.temporaryLink.routing = go.Link.Orthogonal

      mySelf.load()
    },
    load () {
      mySelf.myDiagram.model = go.Model.fromJson(mySelf.flowJson)
    },
    reloadDiagram () {
      this.load()
    },
    bigDiagram () {
      mySelf.myDiagram.scale += 0.1
    },
    smallDiagram () {
      mySelf.myDiagram.scale -= 0.1
    },
    closeDialogClick () { // 右上角关闭弹窗时
      if (!this.visible) {
        this.$emit('closeDialog')
      }
    },
    cancel () {
      this.visible = false
      this.$emit('closeDialog')
    }
  }
}
</script>
<style scoped>
  .select-content {
    margin-bottom: 10px;
  }
  .item-sel {
    width: 400px;
  }
</style>
