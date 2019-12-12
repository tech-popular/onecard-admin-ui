<template>
  <div>
    <el-form :inline="true">
      <el-form-item>
        <el-button type="primary" @click="addOrUpdateHandle()">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList" border
      v-loading="dataListLoading"
      style="width: 100%;">
      <el-table-column
        prop="flowId"
        header-align="center"
        align="center"
        label="流程编号"/>
      <el-table-column
        prop="consumerName"
        header-align="center"
        align="center"
        label="消费者名字"
        width="150px"/>
      <el-table-column
        prop="topic"
        header-align="center"
        align="center"
        label="topic名称"/>
      <el-table-column
        prop="bootstrapServers"
        header-align="center"
        align="center"
        label="kafka地址"/>
      <el-table-column
        prop="groupId"
        header-align="center"
        align="center"
        label="分组名称"/>
      <el-table-column
        prop="version"
        header-align="center"
        align="center"
        label="版本号"
        width="150px"/>
      <!-- <el-table-column
        prop="remark"
        header-align="center"
        align="center"
        label="备注"/> -->
      <el-table-column fixed="right" header-align="center" align="center" width="180" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
          <el-button type="text" size="small" @click="action(scope.row.id)">启用</el-button>
          <el-button type="text" size="small" @click="storp(scope.row.id)">停止</el-button>
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
  import AddOrUpdate from './kafka-add-or-update'
  import { beeTaskList, deleteBeeTask, start, stop } from '@/api/workerBee/kafka'
  export default {
    data () {
      return {
        dataList: [],
        pageNum: 1, // 当前页
        pageSize: 10, // 默认每页10条
        totalPage: 0,
        dataListLoading: false,
        addOrUpdateVisible: false
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
          const dataBody = id
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
      },
      // 启动
      action (id) {
        this.$confirm(`确定启动?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const dataBody = id
          start(dataBody).then(({data}) => {
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
      },
      // 停止
      storp (id) {
        this.$confirm(`确定停止?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const dataBody = id
          stop(dataBody).then(({data}) => {
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
