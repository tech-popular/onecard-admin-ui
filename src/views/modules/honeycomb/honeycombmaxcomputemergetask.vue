<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" >
      <el-form-item>
        <el-input v-model="dataForm.key" placeholder="表名称" clearable @keyup.enter.native="getDataList()"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button v-if="isAuth('honeycomb:honeycombmaxcomputemergetask:save')" type="primary" @click="addHandle()">新增</el-button>
        <el-button v-if="isAuth('honeycomb:honeycombmaxcomputemergetask:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
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
        prop="tableName"
        header-align="center"
        align="center"
        label="表名称">
      </el-table-column>
      <el-table-column
        prop="pk"
        header-align="center"
        align="center"
        label="表的主键">
      </el-table-column>
      <el-table-column
        prop="mergeSql"
        header-align="center"
        align="center"
        show-overflow-tooltip
        label="合并sql">
      </el-table-column>
      <el-table-column
        prop="maxcomputeSpace"
        header-align="center"
        align="center"
        label="空间名">
      </el-table-column>
      <el-table-column
        prop="type"
        header-align="center"
        align="center"
        label="0是5分钟合并，1是t+1合并">
      </el-table-column>
      <el-table-column
        prop="version"
        header-align="center"
        align="center"
        label="版本号">
      </el-table-column>
      <el-table-column
        prop="remark"
        header-align="center"
        align="center"
        label="备注">
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
      <!--<el-table-column-->
        <!--prop="remark"-->
        <!--header-align="center"-->
        <!--align="center"-->
        <!--label="备注">-->
      <!--</el-table-column>-->
      <!--<el-table-column-->
        <!--prop="createTime"-->
        <!--header-align="center"-->
        <!--align="center"-->
        <!--label="">-->
      <!--</el-table-column>-->
      <!--<el-table-column-->
        <!--prop="updateTime"-->
        <!--header-align="center"-->
        <!--align="center"-->
        <!--label="">-->
      <!--</el-table-column>-->
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="updateHandle(scope.row.tableName)">修改</el-button>
          <el-button type="text" size="small" @click="deleteHandle(scope.row.tableName)">删除</el-button>
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
    <update-maxcompute v-if="updateVisible" ref="updateCompute" @refreshDataList="getDataList"></update-maxcompute>
    <add-maxcompute v-if="addVisible" ref="addCompute" @refreshDataList="getDataList"></add-maxcompute>
  </div>
</template>

<script>
  import UpdateMaxcompute from './honeycombmaxcomputemergetask-update'
  import AddMaxcompute from './honeycombmaxcomputemergetask-add'
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
        updateVisible: false,
        addVisible: false
      }
    },
    components: {
      UpdateMaxcompute,
      AddMaxcompute
    },
    activated () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/honeycomb/honeycombmaxcomputemergetask/list'),
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
      //  / 修改
      addHandle (id) {
        this.addVisible = true
        this.$nextTick(() => {
          this.$refs.addCompute.init(id)
        })
      },
      //  / 修改
      updateHandle (id) {
        this.updateVisible = true
        this.$nextTick(() => {
          this.$refs.updateCompute.init(id)
        })
      },
      // 删除
      deleteHandle (id) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.tableName
        })
        this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/honeycomb/honeycombmaxcomputemergetask/delete'),
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
