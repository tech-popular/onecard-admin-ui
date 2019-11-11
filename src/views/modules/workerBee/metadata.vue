<template>
  <div>
    <el-form :inline="true">
      <el-form-item>
        <el-button type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList" border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50"/>
      <el-table-column
        prop="id"
        header-align="center"
        align="center"
        label="任务定义名称"/>
      <el-table-column
        prop="project"
        header-align="center"
        align="center"
        label="任务类型"/>
      <el-table-column
        prop="serviceName"
        header-align="center"
        align="center"
        label="任务描述"/>
      <el-table-column
        prop="group"
        header-align="center"
        align="center"
        label="任务具体id"/>
      <el-table-column
        prop="owner"
        header-align="center"
        align="center"
        label="任务归属"/>
      <el-table-column
        prop="user"
        header-align="center"
        align="center"
        label="任务使用者"/>
      <el-table-column
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
        label="响应超时时间"/>
      <el-table-column
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
        label="执行命名空间"/>
      <el-table-column
        prop="remark"
        header-align="center"
        align="center"
        label="备注"/>
      <el-table-column
        prop="ownerApp"
        header-align="center"
        align="center"
        label="所属系统"/>
      <el-table-column
        prop="createdBy"
        header-align="center"
        align="center"
        label="创建者姓名"/>
      <el-table-column
        prop="updatedBy"
        header-align="center"
        align="center"
        label="更新者姓名"/>
      <el-table-column
        prop="enable"
        header-align="center"
        align="center"
        label="是否启用">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.enable === 1" size="small" >正常</el-tag>
          <el-tag v-else size="small" type="danger">禁用</el-tag>
        </template>
      </el-table-column>
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
      :current-page="pageIndex"
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
  import { metadataList } from '@/api/workerBee/metadata'
  export default {
    data () {
      return {
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
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
          'page': this.pageIndex,
          'limit': this.pageSize
        }
        metadataList(dataBody).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.page.list
            this.totalPage = data.page.totalCount
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
        this.pageIndex = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getDataList()
      },
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
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
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.id
        })
        this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/canary/canaryproject/delete'),
            method: 'post',
            data: this.$http.adornData(ids, false)
          }).then(({data}) => {
            if (data && data.code === 0) {
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
