<template>
  <div>
    <el-form :inline="true" :model="dataForm" ref="dataForm">
      <el-form-item label="工作流名称">
        <el-input v-model="dataForm.workerBee" placeholder="工作流名称" onkeyup="value=value.replace(/\s/g,'') " 
        onbeforepaste="clipboardData.setData('text',clipboardData.getData('text').replace(/\s/g,''))" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchHandle()">查询</el-button>
        <el-button @click="resetHandle()">重置</el-button>
        <el-button type="primary" @click="addOrUpdateHandle()">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;">
      <el-table-column prop="id" header-align="center" align="center" label="工作流编号"/>
      <el-table-column prop="name" header-align="center" align="center" label="工作流名称"/>
      <el-table-column prop="owner" header-align="center" align="center" label="拥有者"/>
      <el-table-column prop="user" header-align="center" align="center" label="使用者"/>
      <el-table-column prop="createdBy" header-align="center" align="center" label="创建人"/>
      <el-table-column prop="flowCode" header-align="center" align="center" label="工作流编码"/>
      <el-table-column prop="inputParameters" header-align="center" align="center" label="工作流入参"/>
      <el-table-column prop="description" header-align="center" align="center" label="描述"/>
      <el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
        <template slot-scope="scope">
          <!-- <el-button v-if="isAuth('cash:instmanage:update')" type="text" @click="clickSketchMap(scope.row)">查看工作流</el-button> -->
          <el-button type="text" @click="clickSketchMap(scope.row.id,scope.row)">预览</el-button>
          <el-button type="text" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button type="text" @click="clickFlowEdit(scope.row.id)">任务关系</el-button>
          <el-button type="text" style="color:#f56c6c" @click="deleteddialog(scope.row.id)">删除</el-button>
          <!-- <el-button type="text" @click="clickFlowShow(scope.row.id)">2.0工作流</el-button> -->
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
    <!-- 弹窗查看示意图 -->
    <el-dialog
      title="工作流预览"
      @close="handleClosede"
      fullscreen
      style="max-height: 100vh"
      :visible.sync="visible">
      <showFlow v-if="sketchMap" ref="showFlow" :dataAllList="dataAllList" :list="list" @refreshDataList="getDataList"/>
    </el-dialog>
    <!-- 删除弹窗 -->
    <el-dialog
      title="删除"
      :visible.sync="deleteVisible"
      width="30%">
      <span>确定删除吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleted()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 弹窗查看示意图 -->
    <el-dialog
      title="2.0工作流预览"
      @close="handleClosede"
      fullscreen
      style="max-height: 100vh"
      :visible.sync="flowTaskFlowVisible">
      <flowTaskFlow v-if="flowTaskFlow"/>
    </el-dialog>
    <!-- 数据关系 -->
    <taskFlow v-if="visibleEdit" ref="taskFlow"/>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"/>
  </div>
</template>

<script>
  import showFlow from './workflowChart'
  import taskFlow from './taskFlow'
  import flowTaskFlow from './marketingDecision'
  import AddOrUpdate from './workFlow-add-or-update'
  import { workFlowList, deleteWorkFlow, workFlowShow } from '@/api/workerBee/workFlow'

  export default {
    data () {
      return {
        visible: false,
        deleteVisible: false,
        visibleEdit: false,
        flowTaskFlowVisible: false,
        flowTaskFlow: false,
        dataForm: {
          workerBee: ''
        },
        dataList: [],
        dataAllList: {},
        workerBee: '',
        list: '',
        pageNum: 1, // 当前页
        pageSize: 10, // 默认每页10条
        totalPage: 0,
        dataListLoading: false,
        sketchMap: false,
        addOrUpdateVisible: false,
        deletedId: ''
      }
    },
    components: {
      showFlow,
      taskFlow,
      AddOrUpdate,
      flowTaskFlow
    },
    mounted () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.dataListLoading = true
            const dataBody = {
              'pageNum': this.pageNum,
              'pageSize': this.pageSize,
              'name': this.dataForm.workerBee
            }
            workFlowList(dataBody, false).then(({data}) => {
              if (data && data.message === 'success') {
                this.dataList = data.data.list
                this.totalPage = data.data.totalCount
              } else {
                this.dataList = []
                this.totalPage = 0
              }
              this.dataListLoading = false
            })
          }
        })
      },
  
      /** 查看示意图接口 */
      getDataFlowList () {
        const dataBody = this.workerBee
        workFlowShow(dataBody).then(({data}) => {
          if (data && data.status === 0) {
            this.sketchMap = true
            // this.visible = true
            this.dataAllList = data.data
          } else {
            return false
          }
        })
      },
      // 新增 / 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      // 数据关系
      clickFlowEdit (id) {
        this.visibleEdit = true
        this.$store.commit('workFlow/setFlowId', id)
        this.$nextTick(() => {
          this.$refs.taskFlow.init(id)
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
        deleteWorkFlow(dataBody, false).then(({data}) => {
          if (data && data.message === 'success') {
            this.deleteVisible = false
            this.getDataList()
          }
        })
      },
      /** 查看示意图 */
      clickSketchMap (value, list) {
        this.visible = true
        this.list = list
        this.workerBee = value
        this.getDataFlowList()
      },
      /** 查询 */
      searchHandle () {
        this.pageNum = 1
        this.getDataList()
      },
      /** 重置 */
      resetHandle () {
        this.pageNum = 1
        this.dataForm = []
        this.getDataList()
      },
      // 取消或关闭流程图弹窗
      handleClosede () {
        this.dataAllList = {}
        this.visible = false
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageNum = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageNum = val
        this.getDataList()
      },
      // 2.0工作流
      clickFlowShow () {
        this.flowTaskFlowVisible = true
        this.flowTaskFlow = true
      }
    }
  }
</script>
<style scoped>
  .toZhi {
    line-height: 36px;
    margin-right: 8px;
  }
</style>