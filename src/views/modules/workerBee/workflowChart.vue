<template>
  <div>
    <el-button type="primary" icon="el-icon-zoom-in" @click="enlarge()" style="margin-bottom: 20px;"/>
    <el-button type="primary" icon="el-icon-zoom-out" @click="narrow()" style="margin-bottom: 20px;"/>
    <div id="myDiagramDiv" style="width:100%; height:650px; background-color: #ccc;"></div>
  </div>
</template>

<script>
import go from 'gojs'
export default{
  props: ['dataAllList'],
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
      mySelf.myDiagram.nodeTemplateMap.add('Start',
        $(go.Node, 'Auto',
          $(go.Shape, 'Circle',
            { fill: '#17B3A3' }
          ),
          $(go.TextBlock,
            {
              stroke: '#fff'
            },
            new go.Binding('text')
          )
        )
      )
      mySelf.myDiagram.nodeTemplateMap.add('Judge',
        $(go.Node, 'Auto',
          $(go.Shape, 'Diamond',
            {height: 70, fill: '#00A9C9'}
          ),
          $(go.TextBlock,
            {
              stroke: '#fff'
            },
            new go.Binding('text')
          )
        )
      )
      mySelf.myDiagram.nodeTemplateMap.add('Condition',
        $(go.Node, 'Auto',
          $(go.Shape, 'RoundedRectangle',
            {
              fill: 'blue'
            }
          ),
          $(go.TextBlock,
            {
              stroke: '#fff'
            },
            new go.Binding('text')
          )
        )
      )
      mySelf.myDiagram.nodeTemplateMap.add('End',
        $(go.Node, 'Auto',
          $(go.Shape, 'Circle',
            { height: 55, fill: '#79C900', stroke: null }
          ),
          $(go.TextBlock,
            {
              stroke: '#fff'
            },
            new go.Binding('text')
          )
        )
      )
      // var nodeDataArray = [
      //   {key: '0', text: '工作流预览', category: 'Start'},
      //   {key: '1', text: '数据1', category: 'Condition'},
      //   {key: '2', text: '数据数据数据数据2', category: 'Condition'},
      //   {key: '3', text: '数据3', category: 'Condition'},
      //   {key: '4', text: '数据4', category: 'Condition'},
      //   {key: '5', text: '条件500000000000000', category: 'Judge'},
      //   {key: '6', text: '数据6', category: 'Condition'},
      //   {key: '7', text: '数据7', category: 'Condition'}
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
