<template>
  <div>
    <el-dialog title="数据关系" :close-on-click-modal="false" :visible.sync="visible">
    <el-button type="primary" style="margin-bottom: 15px;" @click="addOrUpdateHandle()">新增</el-button>
    <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;">
        <el-table-column prop="flowId" header-align="center" align="center" label="工作流ID"/>
        <el-table-column prop="taskReferenceName" header-align="center" align="center" label="参考任务名称"/>
        <el-table-column prop="preTask" header-align="center" align="center" label="父级ID"/>
        <el-table-column prop="taskId" header-align="center" align="center" label="任务ID"/>
        <el-table-column prop="remark" header-align="center" align="center" label="备注"/>
      </el-table>
      <el-pagination
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="pageNum"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        :total="totalPage"
        layout="total, sizes, prev, pager, next, jumper"/>
      <span slot="footer">
        <!-- <el-button @click="visible = false">取消</el-button> -->
        <!-- <el-button type="primary" @click="dataFormSubmit()">确定</el-button> -->
      </span>
    </el-dialog>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="init" />
  </div>
</template>

<script>
  import { workFlowTaskList } from '@/api/workerBee/workFlow'
  import AddOrUpdate from './taskFlow-add-or-update'

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
        list: ''
      }
    },
    components: {
      AddOrUpdate
    },
    mounted () {
      this.init()
    },
    methods: {
      init (id) {
        this.visible = true
        this.flowId = id
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
      addOrUpdateHandle () {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(this.dataList, this.flowId)
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
        this.init()
      }
    }
  }
</script>
