<template>
  <div>
    <!-- 删除弹窗 -->
    <el-dialog
      title="删除"
      :visible.sync="deleteVisible"
      :append-to-body='false'
      :modal-append-to-body='true'
      width="30%">
      <span>确定删除吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleted()">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="数据关系" :close-on-click-modal="false" :visible.sync="visible" width="60%">
    <el-button type="primary" style="margin-bottom: 15px;" @click="addOrUpdateHandle()">新增</el-button>
    <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;">
      <el-table-column prop="id" header-align="center" align="center" label="id"/>
      <el-table-column prop="flowId" header-align="center" align="center" label="工作流ID"/>
      <el-table-column prop="taskReferenceName" header-align="center" align="center" label="参考任务名"/>
      <el-table-column prop="parentTask" header-align="center" align="center" label="父级ID"/>
      <el-table-column prop="preTask" header-align="center" align="center" label="上一个任务ID"/>
      <el-table-column prop="taskId" header-align="center" align="center" label="任务ID"/>
      <el-table-column prop="inputParams" header-align="center" align="center" label="任务入参">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" placement="top">
            <div v-html="toBreak(scope.row.inputParams)" slot="content"></div>
            <div class="text-to-long-cut">{{scope.row.inputParams}}</div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="outputParams" header-align="center" align="center" label="任务出参别名映射">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" placement="top">
            <div v-html="toBreak(scope.row.outputParams)" slot="content"></div>
            <div class="text-to-long-cut">{{scope.row.outputParams}}</div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" width="150" label="操作">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button type="primary" size="mini" icon="el-icon-edit" circle @click="addOrUpdateHandle(scope.row.id)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="查看" placement="top">
            <el-button type="success" size="mini" icon="el-icon-view" circle @click="clickSketchMap(scope.row.id)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
           <el-button type="danger" size="mini" icon="el-icon-delete" circle @click="deleteddialog(scope.row.id)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
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
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="init" />
     <!-- 弹窗, 查看 -->
    <look v-if="lookVisible" ref="look" @refreshDataList="init" />
    
  </div>
</template>

<script>
  import { workFlowTaskList, workFlowTaskDelete } from '@/api/workerBee/workFlow'
  import AddOrUpdate from './taskFlow-add-or-update'
  import Look from './taskFlow-look'

export default {
    data () {
      return {
        visible: false,
        dataList: [],
        pageNum: 1, // 当前页
        pageSize: 10, // 默认每页10条
        totalPage: 0,
        addOrUpdateVisible: false,
        dataListLoading: false,
        list: '',
        deletedId: '',
        deleteVisible: false,
        lookVisible: false
      }
    },
    components: {
      AddOrUpdate,
      Look
    },
    mounted () {
      this.init()
    },
    methods: {
      init (id) {
        this.visible = true
        this.flowId = this.$store.state.workFlow.id
        const dataBody = {
          'pageNum': this.pageNum,
          'pageSize': this.pageSize,
          'flowId': this.flowId
        }
        this.$nextTick(() => {
          workFlowTaskList(dataBody).then(({data}) => {
            this.dataListLoading = true
            if (data && data.message === 'success') {
              this.dataList = data.data.list
              this.totalPage = data.data.totalCount
              this.dataListLoading = false
            }
          })
        })
      },
      // 新增 / 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id, this.dataList, this.flowId)
        })
      },
      // 删除弹窗获取值
      deleteddialog (value) {
        this.deletedId = value
        this.deleteVisible = true
      },
      // 删除
      deleted () {
        const dataBody = this.deletedId
        workFlowTaskDelete(dataBody, false).then(({data}) => {
          if (data && data.message === 'success') {
            this.deleteVisible = false
            this.init()
          } else {
            this.$message.error(data.message)
          }
        })
      },
      // 查看
      /** 查看示意图 */
      clickSketchMap (value) {
        this.lookVisible = true
        this.$nextTick(() => {
          this.$refs.look.init(value, this.flowId)
        })
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
      }
    }
  }
</script>
<style scoped>
  .el-button+.el-button{
    margin: 0 !important;
  }
</style>
