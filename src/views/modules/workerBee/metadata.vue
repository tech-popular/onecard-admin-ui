<template>
  <div>
    <el-form :inline="true">
      <el-form-item>
        <el-button type="primary" @click="addOrUpdateHandle()">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="newList" border
      v-loading="dataListLoading"
      style="width: 100%;">
      <el-table-column
        prop="id"
        header-align="center"
        align="center"
        label="任务具体id"/>
      <el-table-column
        prop="name"
        header-align="center"
        align="center"
        label="任务定义名称"
        width="150px"/>
      <el-table-column
        prop="type"
        header-align="center"
        align="center"
        label="任务类型"/>
      <el-table-column
        prop="description"
        header-align="center"
        align="center"
        label="任务描述"/>
      <el-table-column
        prop="owner"
        header-align="center"
        align="center"
        label="任务归属"/>
      <el-table-column
        prop="user"
        header-align="center"
        align="center"
        label="任务使用者"
        width="150px"/>
      <!-- <el-table-column
        prop="retryCount"
        header-align="center"
        align="center"
        label="重试次数"/>
      <el-table-column
        prop="timeoutSeconds"
        header-align="center"
        align="center"
        label="任务执行超时时间"/>
      <el-table-column
        prop="retryDelaySeconds"
        header-align="center"
        align="center"
        label="重试延迟时间"/>
      <el-table-column
        prop="responseTimeoutSeconds"
        header-align="center"
        align="center"
        label="响应超时时间"/> -->
      <!-- <el-table-column
        prop="concurrentExecLimit"
        header-align="center"
        align="center"
        label="并发执行限制"/>
      <el-table-column
        prop="inputTemplate"
        header-align="center"
        align="center"
        label="输入模板"/>
      <el-table-column
        prop="rateLimitPerFrequency"
        header-align="center"
        align="center"
        label="频率限制"/>
      <el-table-column
        prop="isolation_groupId"
        header-align="center"
        align="center"
        label="隔离组ID"/>
      <el-table-column
        prop="executionNameSpace"
        header-align="center"
        align="center"
        label="执行命名空间"/> -->
      <el-table-column
        prop="ownerApp"
        header-align="center"
        align="center"
        label="所属系统"/>
      <el-table-column
        prop="remark"
        header-align="center"
        align="center"
        label="备注"/>
      <el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
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
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"/>
  </div>
</template>

<script>
  import AddOrUpdate from './metadata-add-or-update'
  import { beeTaskList, deleteBeeTask } from '@/api/workerBee/metadata'
  export default {
    data () {
      return {
        dataList: [],
        pageNum: 1, // 当前页
        pageSize: 10, // 默认每页10条
        totalPage: 0,
        dataListLoading: false,
        addOrUpdateVisible: false,
        newList: []
      }
    },
    components: {
      AddOrUpdate
    },
    activated () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        const dataBody = {
          'pageNum': this.pageNum,
          'pageSize': this.pageSize
        }
        beeTaskList(dataBody).then(({data}) => {
          if (data && data.status === 0) {
            this.dataList = data.list
            this.totalPage = data.totalCount
            var arrList = []
            for (let i = 0, length = this.dataList.length; i < length; i++) {
              arrList.push(this.dataList[i].beeTaskDef)
              this.newList = arrList
            }
          } else {
            this.dataList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
        })
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
      isNull (value) {
        return value == '' || value == null || value == undefined
      },
      // 新增 / 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      // 删除
      deleteHandle (id) {
        this.$confirm(`确定删除操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const dataBody = {
            utcParam: [id]
          }
          deleteBeeTask(dataBody).then(({data}) => {
            if (data && data.status === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getDataList()
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        })
      }
    }
  }
</script>
