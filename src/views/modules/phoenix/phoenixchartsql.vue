<template>
  <el-dialog
    title="大屏图表sql"
    :visible.sync="visible">
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList(dataForm.chartId)">
    <el-form-item>
      <el-input v-model="dataForm.key" placeholder="参数名" clearable></el-input>
    </el-form-item>
    <el-form-item>
      <el-button @click="getDataList(dataForm.chartId)">查询</el-button>
      <el-button v-if="isAuth('phoenix:phoenixchartsql:save')" type="primary" @click="addOrUpdateHandle(dataForm.chartId, 0)">新增</el-button>
      <el-button v-if="isAuth('phoenix:phoenixchartsql:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
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
        label="编号">
      </el-table-column>
      <el-table-column
        prop="chartId"
        header-align="center"
        align="center"
        label="chart号">
      </el-table-column>
      <el-table-column
        prop="sql"
        header-align="center"
        align="center"
        label="sql语句">
      </el-table-column>
      <el-table-column
        prop="type"
        header-align="center"
        align="center"
        label="组件类型">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addOrUpdateHandle(dataForm.chartId, scope.row.id)">修改</el-button>
          <el-button type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
          <el-button type="text" size="small" @click="chartSqlColumnHandle(scope.row.id)">大屏图表sql列</el-button>
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
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList1="getDataList(dataForm.chartId)"></add-or-update>
    <!-- 大屏图表sql列 -->
    <chart-sql-column v-if="chartSqlColumnVisible" ref="chartSqlColumn"></chart-sql-column>
  </div>
  </el-dialog>
</template>

<script>
  import AddOrUpdate from './phoenixchartsql-add-or-update'
  import ChartSqlColumn from './phoenixchartsqlcolumn'
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          key: '',
          chartId: ''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        chartSqlColumnVisible: false
      }
    },
    components: {
      AddOrUpdate,
      ChartSqlColumn
    },
    activated () {
      this.getDataList(this.dataForm.chartId)
    },
    methods: {
      refreshData () {
        this.getDataList(this.dataForm.chartId)
      },
      // 获取数据列表
      getDataList (chartId) {
        this.dataForm.chartId = chartId
        this.visible = true
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/phoenix/phoenixchartsql/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'key': this.dataForm.key,
            'chartId': this.dataForm.chartId
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
        this.getDataList(this.dataForm.chartId)
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getDataList(this.dataForm.chartId)
      },
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      // 新增 / 修改
      addOrUpdateHandle (chartId, id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(chartId, id)
        })
      },
      chartSqlColumnHandle (id) {
        this.chartSqlColumnVisible = true
        this.$nextTick(() => {
          this.$refs.chartSqlColumn.getDataList(id)
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
            url: this.$http.adornUrl('/phoenix/phoenixchartsql/delete'),
            method: 'post',
            data: this.$http.adornData(ids, false)
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.visible = false
                  this.getDataList(this.dataList.chartId)
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
