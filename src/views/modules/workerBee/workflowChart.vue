<template>
  <div>
    <el-button type="primary" icon="el-icon-zoom-in" @click="enlarge()" style="margin-bottom: 20px;"/>
    <el-button type="primary" icon="el-icon-zoom-out" @click="narrow()" style="margin-bottom: 20px;"/>
    <div id="myDiagramDiv" style="width:100%; height:650px; background-color: #ccc;"></div>
    <el-dialog title="节点数据" :modal-append-to-body='false' :append-to-body="true"  @close="workFlowChartDialgClose" :visible.sync="visible">
    <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;">
      <el-table-column prop="flowId" header-align="center" align="center" label="节点ID"/>
      <el-table-column prop="taskReferenceName" header-align="center" align="center" label="节点名称"/>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageNum"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper"/>
    </el-dialog>
  </div>
</template>

<script>
import go from 'gojs'
import { workFlowTaskList } from '@/api/workerBee/workFlow'

export default{
  props: ['dataAllList'],
  data () {
    return {
      visible: false,
      dataList: [],
      pageNum: 1, // 当前页
      pageSize: 10, // 默认每页10条
      totalPage: 0
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
          $(go.Shape, 'Circle', {fill: '#79C900'}),
          $(go.TextBlock, { stroke: '#fff' }, new go.Binding('text'))
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
        mySelf.visible = true
        console.log(e.subject.part.data, '获取id')
        const dataBody = {
          'pageNum': mySelf.pageNum,
          'pageSize': mySelf.pageSize,
          'flowId': mySelf.flowId
        }
        workFlowTaskList(dataBody).then(({data}) => {
          mySelf.dataListLoading = true
          if (data && data.message === 'success') {
            mySelf.dataList = data.data.list
            mySelf.totalPage = data.data.totalCount
            mySelf.dataListLoading = false
          }
        })

        // mySelf.$alert(e.subject.part.data.dital, {
        //   showConfirmButton: false
        // })
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
    },
    // 每页数
    sizeChangeHandle (val) {
      this.pageSize = val
      this.pageNum = 1
      this.init()
    },
      // 下一页
    currentChangeHandle (val) {
      this.pageNum = val
      this.flowId = localStorage.getItem('id')
      this.init()
    },
    workFlowChartDialgClose () {
      this.visible = false
    }
  }

}
 </script>
<style lang="scss" scoped>

</style>
