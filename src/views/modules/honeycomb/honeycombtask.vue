<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.key" placeholder="参数名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button v-if="isAuth('honeycomb:honeycombtask:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button v-if="isAuth('honeycomb:honeycombtask:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
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
        label="">
      </el-table-column>
      <el-table-column
        prop="name"
        header-align="center"
        align="center"
        label="任务名称">
      </el-table-column>
      <el-table-column
        prop="inDatasource"
        header-align="center"
        align="center"
        label="输入数据源">
      </el-table-column>
      <el-table-column
        prop="computeType"
        header-align="center"
        align="center"
        label="计算类型:1 简单 2 复杂">
      </el-table-column>
      <el-table-column
        prop="cacheSql"
        header-align="center"
        align="center"
        show-overflow-tooltip
        label="历史数据生成SQL">
      </el-table-column>
      <el-table-column
        prop="sql"
        header-align="center"
        align="center"
        show-overflow-tooltip
        label="SQL">
      </el-table-column>
      <el-table-column
        prop="period"
        header-align="center"
        align="center"
        label="周期(分钟)">
      </el-table-column>
      <el-table-column
        prop="transformerConfig"
        header-align="center"
        align="center"
        show-overflow-tooltip
        label="转换配置">
      </el-table-column>
      <el-table-column
        prop="outDatasource"
        header-align="center"
        align="center"
        label="输出数据源">
      </el-table-column>
      <el-table-column
        prop="dependTask"
        header-align="center"
        align="center"
        label="依赖于某个任务(暂不支持)">
      </el-table-column>
      <el-table-column
        prop="cron"
        header-align="center"
        align="center"
        label="cron表达式">
      </el-table-column>
      <el-table-column
        prop="version"
        header-align="center"
        align="center"
        label="版本号">
      </el-table-column>
      <el-table-column
        prop="tenantId"
        header-align="center"
        align="center"
        label="租户id">
      </el-table-column>
      <el-table-column
        prop="tags"
        header-align="center"
        align="center"
        label="标签">
      </el-table-column>
      <el-table-column
        prop="enable"
        header-align="center"
        align="center"
        label="是否启用">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button type="text" size="small" @click="addOrUpdateHandleThreshold(scope.row.id)">配置阈值</el-button>
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
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
  import AddOrUpdate from './honeycombtask-add-or-update'
  import AddOrUpdateThreshold from '../canary/canarythresholdusergroup-add-or-update'
  export default {
    data () {
      return {
        dataForm: {
          key: ''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        addOrUpdateThresholdVisible: false
      }
    },
    components: {
      AddOrUpdate,
      AddOrUpdateThreshold
    },
    activated () {
      this.getDataList()
    },
    methods: {
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
      addOrUpdateHandleThreshold (id) {
        this.addOrUpdateThresholdVisible = true
        this.$nextTick(() => {
          this.$refs.AddOrUpdateThreshold.init(id)
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
