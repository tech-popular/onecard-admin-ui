<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm">
      <el-form-item>
        <!--<el-input v-model="dataForm.key" placeholder="参数名" clearable  @keyup.enter.native="getDataList()"></el-input>-->
        <el-autocomplete
          v-model="dataForm.key"
          :fetch-suggestions="querySearchAsync"
          placeholder="请输入内容"
          @select="handleSelect"
          class="input-with-select"
          @keyup.enter.native="getDataList()"
        ></el-autocomplete>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button v-if="isAuth('honeycomb:honeycombtask:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button v-if="isAuth('honeycomb:honeycombtask:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
        <el-button type="primary" @click="syncEs()">同步ES</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>
      <el-table-column
        prop="id"
        header-align="center"
        align="center"
        label="任务Id">
      </el-table-column>
      <el-table-column
        prop="name"
        header-align="center"
        align="center"
        label="任务名称">
      </el-table-column>
      <!--<el-table-column-->
        <!--prop="inDatasource"-->
        <!--header-align="center"-->
        <!--align="center"-->
        <!--label="输入数据源">-->
      <!--</el-table-column>-->
      <el-table-column
        prop="inDatasourceName"
        header-align="center"
        align="center"
        label="输入数据源">
      </el-table-column>
      <el-table-column
        prop="cron"
        header-align="center"
        align="center"
        show-overflow-tooltip
        label="cron表达式">
      </el-table-column>
      <el-table-column
        prop="sql"
        header-align="center"
        align="center"
        show-overflow-tooltip
        label="SQL">
      </el-table-column>
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
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
          <el-button type="text" size="small" @click="taskProgress(scope.row.id)">进度</el-button>
          <el-button type="text" size="small" @click="startTask(scope.row.id)">启动任务</el-button>
          <el-button type="text" size="small" @click="taskDependent(scope.row.id)">任务编排</el-button>
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
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    <task-progress v-if="taskProgressVisible" ref="taskProgress"></task-progress>
    <task-dependent v-if="taskDependentVisible" ref="taskDependent"></task-dependent>
  </div>
</template>
<style>
  .input-with-select  {
    width: 380px;
  }
</style>
<script>
  import AddOrUpdate from './honeycombtask-add-or-update'
  import TaskProgress from './honeycombtaskprogress'
  import TaskDependent from './honeycombtask-dependent'
  export default {
    data () {
      return {
        dataForm: {
          key: ''
        },
        restaurants: [],
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        addOrUpdateThresholdVisible: false,
        taskProgressVisible: false,
        taskDependentVisible: false
      }
    },
    components: {
      AddOrUpdate,
      TaskProgress,
      TaskDependent
    },
    activated () {
      this.getDataList()
    },
    mounted () {
      this.loadAll()
    },
    methods: {
      loadAll () {
        if (this.dataForm.key) {
          this.$http({
            url: this.$http.adornUrl('/honeycomb/honeycombtask/search/' + this.dataForm.key),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.restaurants = data.searchData
            }
          })
        }
      },
      querySearchAsync (queryString, cb) {
        this.loadAll()
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
          cb(this.restaurants)
        }, 3000 * Math.random())
      },
      handleSelect (item) {
        console.log(' iiii' + item.name)
        this.dataForm.key = item.name
        this.getDataList()
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/honeycomb/honeycombtask/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'key': this.dataForm.key
          })
        }).then(({data}) => {
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
      // 新增 / 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      taskProgress (id) {
        this.taskProgressVisible = true
        this.$nextTick(() => {
          this.$refs.taskProgress.init(id)
        })
      },
      taskDependent (id) {
        this.taskDependentVisible = true
        this.$nextTick(() => {
          this.$refs.taskDependent.init(id)
        })
      },
      // 同步到es
      syncEs () {
        return this.$http({
          url: this.$http.adornUrl(`/honeycomb/honeycombtask/all/syncEs`),
          method: 'get',
          params: this.$http.adornParams()
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
      },
      startTask (id) {
        return this.$http({
          url: this.$http.adornUrl(`/honeycomb/honeycombtask/starttask/` + id),
          method: 'get',
          params: this.$http.adornParams()
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
            url: this.$http.adornUrl('/honeycomb/honeycombtask/delete'),
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
