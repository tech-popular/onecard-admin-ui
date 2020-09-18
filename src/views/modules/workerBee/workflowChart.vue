<template>
  <div>
    <el-button type="primary" icon="el-icon-zoom-in" @click="enlarge()" style="margin-bottom: 20px;"/>
    <el-button type="primary" icon="el-icon-zoom-out" @click="narrow()" style="margin-bottom: 20px;"/>
    <el-tooltip class="item" effect="dark" :content='intParameterValue' placement="top-start">
      <el-button type="primary" style="margin-bottom: 20px;">流程入参</el-button>
    </el-tooltip>
    <el-tooltip class="item" effect="dark" :content='outParameterValue' placement="top-start">
      <el-button type="primary" style="margin-bottom: 20px">流程出参</el-button>
    </el-tooltip>
    <div class="tag-group" style="margin-bottom: 20px; color:'#fff'">
      <span class="tag-group__title">节点颜色值：</span>
      <el-button type="primary" size="mini" style="background: #103a87; border:none">HTTP</el-button>
      <el-button type="primary" size="mini" style="background: #6d89b1; border:none">JDBC</el-button>
      <el-button type="primary" size="mini" style="background: #ed6e19; border:none">KAFKA</el-button>
      <el-button type="primary" size="mini" style="background: #e39f24; border:none">GROOVY</el-button>
      <el-button type="primary" size="mini" style="background: #e559f2; border:none">DECISION</el-button>
      <el-button type="primary" size="mini" style="background: #8859f2; border:none">CASSANDRA</el-button>
      <el-button type="primary" size="mini" style="background: #863816; border:none">AVIATOR</el-button>
      <el-button type="primary" size="mini" style="background: #f43574; border:none">FORK_JOIN</el-button>
      <el-button type="primary" size="mini" style="background: #430b98; border:none">JOIN</el-button>
      <el-button type="primary" size="mini" style="background: #065361; border:none">SUB_WORKFLOW</el-button>
      <el-button type="primary" size="mini" style="background: #0868d3; border:none">FREEMARKER</el-button>
      <el-button type="primary" size="mini" style="background: #724a3b; border:none">FORRCH</el-button>
      <el-button type="primary" size="mini" style="background: #0b9ccb; border:none">REDIS</el-button>
      <el-button type="primary" size="mini" style="background: #a9cb0b; border:none">HBASE</el-button>
    </div>
    <div id="myDiagramDiv" style="width:100%; height:650px; background-color: #ccc;"></div>
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="init"/>
    <workFlowChartChairle v-if="workFlowChartChairlevisible" ref="addSubProcess"/>
  </div>
</template>

<script>
// import go from 'gojs'
import AddOrUpdate from './workFlowChart-add-or-update'
import workFlowChartChairle from './workFlowChartChairle'
var go = window.go
export default{
  props:
  {
    dataAllList: {
      type: Object,
      default: () => {}
    },
    list: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    dataAllList (newValue, oldValue) {
      this.init()
    }
  },
  data () {
    return {
      addOrUpdateVisible: false,
      workFlowChartChairlevisible: false,
      intParameterValue: '流程入参',
      outParameterValue: '流程出参'
    }
  },
  components: {
    AddOrUpdate,
    workFlowChartChairle
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.intParameterValue = this.list.inputParameters
      this.outParameterValue = this.list.outputParameters
      var mySelf = this
      if (mySelf.myDiagram) {
        this.myDiagram.div = null
      }
      const $ = go.GraphObject.make
      // a function that produces the content of the diagram tooltip
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
          $(go.Shape, 'Diamond', {fill: '#e559f2'}),
          $(go.TextBlock, { stroke: '#fff', margin: 8 }, new go.Binding('text')),
          {
            toolTip: // define a tooltip for each node
            $(go.Adornment, 'Spot',      // that has several labels around it
              { background: 'transparent' },  // avoid hiding tooltip when mouse moves
              $(go.Placeholder, { padding: 5 }),
              $(go.TextBlock,
                { alignment: go.Spot.Top, alignmentFocus: go.Spot.Bottom, stroke: '#2093f7' },
                new go.Binding('text', 'key', function (s) { return '鼠标左击查看详情' })),
              $(go.TextBlock, 'Bottom',
                { alignment: go.Spot.Bottom, alignmentFocus: go.Spot.Top, stroke: '#2093f7' },
                new go.Binding('text', 'color', function (s) { return '鼠标右击查看子流程' }))
            )  // end Adornment
          }
        )
      )
      mySelf.myDiagram.nodeTemplateMap.add('Condition',
        $(go.Node, 'Auto',
          { position: new go.Point(100, 0) },
          $(go.Shape, 'RoundedRectangle', { fill: '#58ce7a' }),
          $(go.TextBlock, { margin: 8, stroke: '#fff', alignment: go.Spot.Center }, new go.Binding('text')),
          {
            toolTip: // define a tooltip for each node
            $(go.Adornment, 'Spot',      // that has several labels around it
              { background: 'transparent' },  // avoid hiding tooltip when mouse moves
              $(go.Placeholder, { padding: 5 }),
              $(go.TextBlock,
                { alignment: go.Spot.Top, alignmentFocus: go.Spot.Bottom, stroke: '#2093f7' },
                new go.Binding('text', 'key', function (s) { return '鼠标左击查看详情' })),
              $(go.TextBlock, 'Bottom',
                { alignment: go.Spot.Bottom, alignmentFocus: go.Spot.Top, stroke: '#2093f7' },
                new go.Binding('text', 'color', function (s) { return '鼠标右击查看子流程' }))
            )  // end Adornment
          }
        )
      )
      mySelf.myDiagram.nodeTemplateMap.add('HTTP',
        $(go.Node, 'Auto',
          { position: new go.Point(100, 0) },
          $(go.Shape, 'RoundedRectangle', { fill: '#103a87' }),
          $(go.TextBlock, { margin: 8, stroke: '#fff', alignment: go.Spot.Center }, new go.Binding('text')),
          {
            toolTip: // define a tooltip for each node
            $(go.Adornment, 'Spot',      // that has several labels around it
              { background: 'transparent' },  // avoid hiding tooltip when mouse moves
              $(go.Placeholder, { padding: 5 }),
              $(go.TextBlock,
                { alignment: go.Spot.Top, alignmentFocus: go.Spot.Bottom, stroke: '#2093f7' },
                new go.Binding('text', 'key', function (s) { return '鼠标左击查看详情' })),
              $(go.TextBlock, 'Bottom',
                { alignment: go.Spot.Bottom, alignmentFocus: go.Spot.Top, stroke: '#2093f7' },
                new go.Binding('text', 'color', function (s) { return '鼠标右击查看子流程' }))
            )  // end Adornment
          }
        )
      )
      mySelf.myDiagram.nodeTemplateMap.add('JDBC',
        $(go.Node, 'Auto',
          { position: new go.Point(100, 0) },
          $(go.Shape, 'RoundedRectangle', { fill: '#6d89b1' }),
          $(go.TextBlock, { margin: 8, stroke: '#fff', alignment: go.Spot.Center }, new go.Binding('text')),
          {
            toolTip: // define a tooltip for each node
            $(go.Adornment, 'Spot',      // that has several labels around it
              { background: 'transparent' },  // avoid hiding tooltip when mouse moves
              $(go.Placeholder, { padding: 5 }),
              $(go.TextBlock,
                { alignment: go.Spot.Top, alignmentFocus: go.Spot.Bottom, stroke: '#2093f7' },
                new go.Binding('text', 'key', function (s) { return '鼠标左击查看详情' })),
              $(go.TextBlock, 'Bottom',
                { alignment: go.Spot.Bottom, alignmentFocus: go.Spot.Top, stroke: '#2093f7' },
                new go.Binding('text', 'color', function (s) { return '鼠标右击查看子流程' }))
            )  // end Adornment
          }
        )
      )
      mySelf.myDiagram.nodeTemplateMap.add('KAFKA',
        $(go.Node, 'Auto',
          { position: new go.Point(100, 0) },
          $(go.Shape, 'RoundedRectangle', { fill: '#ed6e19' }),
          $(go.TextBlock, { margin: 8, stroke: '#fff', alignment: go.Spot.Center }, new go.Binding('text')),
          {
            toolTip: // define a tooltip for each node
            $(go.Adornment, 'Spot',      // that has several labels around it
              { background: 'transparent' },  // avoid hiding tooltip when mouse moves
              $(go.Placeholder, { padding: 5 }),
              $(go.TextBlock,
                { alignment: go.Spot.Top, alignmentFocus: go.Spot.Bottom, stroke: '#2093f7' },
                new go.Binding('text', 'key', function (s) { return '鼠标左击查看详情' })),
              $(go.TextBlock, 'Bottom',
                { alignment: go.Spot.Bottom, alignmentFocus: go.Spot.Top, stroke: '#2093f7' },
                new go.Binding('text', 'color', function (s) { return '鼠标右击查看子流程' }))
            )  // end Adornment
          }
        )
      )
      mySelf.myDiagram.nodeTemplateMap.add('GROOVY',
        $(go.Node, 'Auto',
          { position: new go.Point(100, 0) },
          $(go.Shape, 'RoundedRectangle', { fill: '#e39f24' }),
          $(go.TextBlock, { margin: 8, stroke: '#fff', alignment: go.Spot.Center }, new go.Binding('text')),
          {
            toolTip: // define a tooltip for each node
            $(go.Adornment, 'Spot',      // that has several labels around it
              { background: 'transparent' },  // avoid hiding tooltip when mouse moves
              $(go.Placeholder, { padding: 5 }),
              $(go.TextBlock,
                { alignment: go.Spot.Top, alignmentFocus: go.Spot.Bottom, stroke: '#2093f7' },
                new go.Binding('text', 'key', function (s) { return '鼠标左击查看详情' })),
              $(go.TextBlock, 'Bottom',
                { alignment: go.Spot.Bottom, alignmentFocus: go.Spot.Top, stroke: '#2093f7' },
                new go.Binding('text', 'color', function (s) { return '鼠标右击查看子流程' }))
            )  // end Adornment
          }
        )
      )
      mySelf.myDiagram.nodeTemplateMap.add('DECISION',
        $(go.Node, 'Auto',
          { position: new go.Point(100, 0) },
          $(go.Shape, 'RoundedRectangle', { fill: '#e559f2' }),
          $(go.TextBlock, { margin: 8, stroke: '#fff', alignment: go.Spot.Center }, new go.Binding('text')),
          {
            toolTip: // define a tooltip for each node
            $(go.Adornment, 'Spot',      // that has several labels around it
              { background: 'transparent' },  // avoid hiding tooltip when mouse moves
              $(go.Placeholder, { padding: 5 }),
              $(go.TextBlock,
                { alignment: go.Spot.Top, alignmentFocus: go.Spot.Bottom, stroke: '#2093f7' },
                new go.Binding('text', 'key', function (s) { return '鼠标左击查看详情' })),
              $(go.TextBlock, 'Bottom',
                { alignment: go.Spot.Bottom, alignmentFocus: go.Spot.Top, stroke: '#2093f7' },
                new go.Binding('text', 'color', function (s) { return '鼠标右击查看子流程' }))
            )  // end Adornment
          }
        )
      )
      mySelf.myDiagram.nodeTemplateMap.add('CASSANDRA',
        $(go.Node, 'Auto',
          { position: new go.Point(100, 0) },
          $(go.Shape, 'RoundedRectangle', { fill: '#8859f2' }),
          $(go.TextBlock, { margin: 8, stroke: '#fff', alignment: go.Spot.Center }, new go.Binding('text')),
          {
            toolTip: // define a tooltip for each node
            $(go.Adornment, 'Spot',      // that has several labels around it
              { background: 'transparent' },  // avoid hiding tooltip when mouse moves
              $(go.Placeholder, { padding: 5 }),
              $(go.TextBlock,
                { alignment: go.Spot.Top, alignmentFocus: go.Spot.Bottom, stroke: '#2093f7' },
                new go.Binding('text', 'key', function (s) { return '鼠标左击查看详情' })),
              $(go.TextBlock, 'Bottom',
                { alignment: go.Spot.Bottom, alignmentFocus: go.Spot.Top, stroke: '#2093f7' },
                new go.Binding('text', 'color', function (s) { return '鼠标右击查看子流程' }))
            )  // end Adornment
          }
        )
      )
      mySelf.myDiagram.nodeTemplateMap.add('AVIATOR',
        $(go.Node, 'Auto',
          { position: new go.Point(100, 0) },
          $(go.Shape, 'RoundedRectangle', { fill: '#863816' }),
          $(go.TextBlock, { margin: 8, stroke: '#fff', alignment: go.Spot.Center }, new go.Binding('text')),
          {
            toolTip: // define a tooltip for each node
            $(go.Adornment, 'Spot',      // that has several labels around it
              { background: 'transparent' },  // avoid hiding tooltip when mouse moves
              $(go.Placeholder, { padding: 5 }),
              $(go.TextBlock,
                { alignment: go.Spot.Top, alignmentFocus: go.Spot.Bottom, stroke: '#2093f7' },
                new go.Binding('text', 'key', function (s) { return '鼠标左击查看详情' })),
              $(go.TextBlock, 'Bottom',
                { alignment: go.Spot.Bottom, alignmentFocus: go.Spot.Top, stroke: '#2093f7' },
                new go.Binding('text', 'color', function (s) { return '鼠标右击查看子流程' }))
            )  // end Adornment
          }
        )
      )
      mySelf.myDiagram.nodeTemplateMap.add('FORK_JOIN',
        $(go.Node, 'Auto',
          { position: new go.Point(100, 0) },
          $(go.Shape, 'RoundedRectangle', { fill: '#f43574' }),
          $(go.TextBlock, { margin: 8, stroke: '#fff', alignment: go.Spot.Center }, new go.Binding('text')),
          {
            toolTip: // define a tooltip for each node
            $(go.Adornment, 'Spot',      // that has several labels around it
              { background: 'transparent' },  // avoid hiding tooltip when mouse moves
              $(go.Placeholder, { padding: 5 }),
              $(go.TextBlock,
                { alignment: go.Spot.Top, alignmentFocus: go.Spot.Bottom, stroke: '#2093f7' },
                new go.Binding('text', 'key', function (s) { return '鼠标左击查看详情' })),
              $(go.TextBlock, 'Bottom',
                { alignment: go.Spot.Bottom, alignmentFocus: go.Spot.Top, stroke: '#2093f7' },
                new go.Binding('text', 'color', function (s) { return '鼠标右击查看子流程' }))
            )  // end Adornment
          }
        )
      )
      mySelf.myDiagram.nodeTemplateMap.add('JOIN',
        $(go.Node, 'Auto',
          { position: new go.Point(100, 0) },
          $(go.Shape, 'RoundedRectangle', { fill: '#430b98' }),
          $(go.TextBlock, { margin: 8, stroke: '#fff', alignment: go.Spot.Center }, new go.Binding('text')),
          {
            toolTip: // define a tooltip for each node
            $(go.Adornment, 'Spot',      // that has several labels around it
              { background: 'transparent' },  // avoid hiding tooltip when mouse moves
              $(go.Placeholder, { padding: 5 }),
              $(go.TextBlock,
                { alignment: go.Spot.Top, alignmentFocus: go.Spot.Bottom, stroke: '#2093f7' },
                new go.Binding('text', 'key', function (s) { return '鼠标左击查看详情' })),
              $(go.TextBlock, 'Bottom',
                { alignment: go.Spot.Bottom, alignmentFocus: go.Spot.Top, stroke: '#2093f7' },
                new go.Binding('text', 'color', function (s) { return '鼠标右击查看子流程' }))
            )  // end Adornment
          }
        )
      )
      mySelf.myDiagram.nodeTemplateMap.add('SUB_WORKFLOW',
        $(go.Node, 'Auto',
          { position: new go.Point(100, 0) },
          $(go.Shape, 'RoundedRectangle', { fill: '#065361' }),
          $(go.TextBlock, { margin: 8, stroke: '#fff', alignment: go.Spot.Center }, new go.Binding('text')),
          {
            toolTip: // define a tooltip for each node
            $(go.Adornment, 'Spot',      // that has several labels around it
              { background: 'transparent' },  // avoid hiding tooltip when mouse moves
              $(go.Placeholder, { padding: 5 }),
              $(go.TextBlock,
                { alignment: go.Spot.Top, alignmentFocus: go.Spot.Bottom, stroke: '#2093f7' },
                new go.Binding('text', 'key', function (s) { return '鼠标左击查看详情' })),
              $(go.TextBlock, 'Bottom',
                { alignment: go.Spot.Bottom, alignmentFocus: go.Spot.Top, stroke: '#2093f7' },
                new go.Binding('text', 'color', function (s) { return '鼠标右击查看子流程' }))
            )  // end Adornment
          }
        )
      )
      mySelf.myDiagram.nodeTemplateMap.add('FREEMARKER',
        $(go.Node, 'Auto',
          { position: new go.Point(100, 0) },
          $(go.Shape, 'RoundedRectangle', { fill: '#0868d3' }),
          $(go.TextBlock, { margin: 8, stroke: '#fff', alignment: go.Spot.Center }, new go.Binding('text')),
          {
            toolTip: // define a tooltip for each node
            $(go.Adornment, 'Spot',      // that has several labels around it
              { background: 'transparent' },  // avoid hiding tooltip when mouse moves
              $(go.Placeholder, { padding: 5 }),
              $(go.TextBlock,
                { alignment: go.Spot.Top, alignmentFocus: go.Spot.Bottom, stroke: '#2093f7' },
                new go.Binding('text', 'key', function (s) { return '鼠标左击查看详情' })),
              $(go.TextBlock, 'Bottom',
                { alignment: go.Spot.Bottom, alignmentFocus: go.Spot.Top, stroke: '#2093f7' },
                new go.Binding('text', 'color', function (s) { return '鼠标右击查看子流程' }))
            )  // end Adornment
          }
        )
      )
      mySelf.myDiagram.nodeTemplateMap.add('FORRCH',
        $(go.Node, 'Auto',
          { position: new go.Point(100, 0) },
          $(go.Shape, 'RoundedRectangle', { fill: '#724a3b' }),
          $(go.TextBlock, { margin: 8, stroke: '#fff', alignment: go.Spot.Center }, new go.Binding('text')),
          {
            toolTip: // define a tooltip for each node
            $(go.Adornment, 'Spot',      // that has several labels around it
              { background: 'transparent' },  // avoid hiding tooltip when mouse moves
              $(go.Placeholder, { padding: 5 }),
              $(go.TextBlock,
                { alignment: go.Spot.Top, alignmentFocus: go.Spot.Bottom, stroke: '#2093f7' },
                new go.Binding('text', 'key', function (s) { return '鼠标左击查看详情' })),
              $(go.TextBlock, 'Bottom',
                { alignment: go.Spot.Bottom, alignmentFocus: go.Spot.Top, stroke: '#2093f7' },
                new go.Binding('text', 'color', function (s) { return '鼠标右击查看子流程' }))
            )  // end Adornment
          }
        )
      )
      mySelf.myDiagram.nodeTemplateMap.add('REDIS',
        $(go.Node, 'Auto',
          { position: new go.Point(100, 0) },
          $(go.Shape, 'RoundedRectangle', { fill: '#0b9ccb' }),
          $(go.TextBlock, { margin: 8, stroke: '#fff', alignment: go.Spot.Center }, new go.Binding('text')),
          {
            toolTip: // define a tooltip for each node
            $(go.Adornment, 'Spot',      // that has several labels around it
              { background: 'transparent' },  // avoid hiding tooltip when mouse moves
              $(go.Placeholder, { padding: 5 }),
              $(go.TextBlock,
                { alignment: go.Spot.Top, alignmentFocus: go.Spot.Bottom, stroke: '#2093f7' },
                new go.Binding('text', 'key', function (s) { return '鼠标左击查看详情' })),
              $(go.TextBlock, 'Bottom',
                { alignment: go.Spot.Bottom, alignmentFocus: go.Spot.Top, stroke: '#2093f7' },
                new go.Binding('text', 'color', function (s) { return '鼠标右击查看子流程' }))
            )  // end Adornment
          }
        )
      )
      mySelf.myDiagram.nodeTemplateMap.add('HBASE',
        $(go.Node, 'Auto',
          { position: new go.Point(100, 0) },
          $(go.Shape, 'RoundedRectangle', { fill: '#a9cb0b' }),
          $(go.TextBlock, { margin: 8, stroke: '#fff', alignment: go.Spot.Center }, new go.Binding('text')),
          {
            toolTip: // define a tooltip for each node
            $(go.Adornment, 'Spot',      // that has several labels around it
              { background: 'transparent' },  // avoid hiding tooltip when mouse moves
              $(go.Placeholder, { padding: 5 }),
              $(go.TextBlock,
                { alignment: go.Spot.Top, alignmentFocus: go.Spot.Bottom, stroke: '#2093f7' },
                new go.Binding('text', 'key', function (s) { return '鼠标左击查看详情' })),
              $(go.TextBlock, 'Bottom',
                { alignment: go.Spot.Bottom, alignmentFocus: go.Spot.Top, stroke: '#2093f7' },
                new go.Binding('text', 'color', function (s) { return '鼠标右击查看子流程' }))
            )  // end Adornment
          }
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
            // mouseEnter: function (e, link) { link.findObject('HIGHLIGHT').stroke = 'rgba(30,144,255,0.2)' },
            // mouseLeave: function (e, link) { link.findObject('HIGHLIGHT').stroke = 'transparent' },
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
      //   {key: '0', text: '工作流预览', category: 'Start', color: ''},
      //   {key: '1', text: 'http', category: 'THTTP', dital: '这是详情'},
      //   {key: '2', text: 'jdbk', category: 'JDBC', dital: '这是详情2'},
      //   {key: '3', text: 'json', category: 'Condition', dital: '这是详情3'},
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
      mySelf.myDiagram.addDiagramListener('ObjectContextClicked', function (e) {
        var part = e.subject.part
        if (part.data.subWorkFlow) {
          if (part.data.category === 'Start' || part.data.category === 'End') {
            mySelf.workFlowChartChairlevisible = false
          } else {
            mySelf.workFlowChartChairlevisible = true
          }
          mySelf.$nextTick(() => {
            mySelf.$refs.addSubProcess.init(part.data.subWorkFlow, '子流程')
          })
        } else {
          mySelf.$message({
            message: '该节点没有子流程',
            type: 'warning'
          })
        }
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
      console.log(this.dataAllList.nodeDataArrays)
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
