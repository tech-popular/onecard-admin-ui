<template>
  <el-dialog
    title="应用配置"
    :close-on-click-modal="false"
    z-index="99"
    :visible.sync="outerVisible">
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="searchData()">
      <el-form-item>
        <el-input v-model="dataForm.key" placeholder="项目名称或服务名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="searchData()">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-select v-model="dataForm.newprojectid" ref="newProjectid" placeholder="请选择">
          <el-option v-for="item in newprojectidoptions"   :key="item.id" :label="item.project" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button v-if="isAuth('canary:canaryproject:save')" type="primary" @click="addProjectToTaskHandle()">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
      <el-table-column
        prop="id"
        header-align="center"
        align="center"
        label="项目主键Id">
      </el-table-column>
      <el-table-column
        prop="project"
        header-align="center"
        align="center"
        label="项目">
      </el-table-column>
      <el-table-column
        prop="serviceName"
        header-align="center"
        align="center"
        label="服务名称">
      </el-table-column>
      <el-table-column
        prop="group"
        header-align="center"
        align="center"
        label="组名">
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
          <el-button type="text" size="small" @click="setThresholdHandle(scope.row.taskServiceId)">配置阈值</el-button>
          <el-button type="text" size="small" @click="deleteHandle(scope.row.taskServiceId)">删除</el-button>
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
    <add-or-update v-if="addOrUpdateServiceVisible" ref="addOrUpdate" @refreshDataList="init"></add-or-update>
  </div>
  </el-dialog>
</template>

<script>
  import AddOrUpdate from './canarybasetaskthreshold-add-or-update'
  export default {
    data () {
      return {
        dataForm: {
          key: '',
          taskId: 0,
          newprojectid: ''
        },
        dataList: [],
        outerVisible: false,
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        newprojectidoptions: [],
        addOrUpdateServiceVisible: false
      }
    },
    components: {
      AddOrUpdate
    },
    methods: {
      searchData () {
        this.init(this.dataForm.taskId)
      },
      // 获取数据列表
      init (id) {
        // 返回下拉框
        this.$http({
          url: this.$http.adornUrl(`/canary/canaryproject/select`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({
                   data
                 }) => {
          if (data && data.code === 0) {
            this.newprojectidoptions = data.allProjects
          }
        })
        this.dataForm.taskId = id || 0
        this.outerVisible = true
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/canary/canarybasetask/relservicetask'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'key': this.dataForm.key,
            'taskId': this.dataForm.taskId
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
        this.searchData()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.searchData()
      },
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      // 新增 / 修改
      setThresholdHandle (id) {
        this.addOrUpdateServiceVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      // 添加该应用到项目中
      addProjectToTaskHandle () {
        this.$confirm(`确定做添加操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/canary/canarybasetask/addtoservicerel'),
            method: 'post',
            data: this.$http.adornData({
              'serviceId': this.dataForm.newprojectid,
              'taskId': this.dataForm.taskId
            }, false)
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 300,
                onClose: () => {
                  this.searchData()
                }
              })
            } else {
              this.$message.error(data.msg)
            }
            this.dataForm.newprojectid = ''
          })
        })
      },
      // 删除
      deleteHandle (taskServiceId) {
        this.$confirm(`确定对[id=${taskServiceId}]进行删除操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/canary/canarybasetask/deleteservicerel/' + taskServiceId),
            method: 'post',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.searchData()
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
