<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" >
      <el-form-item>
        <!--<el-input v-model="dataForm.key" placeholder="参数名" clearable @keyup.enter.native="getDataList()"></el-input>-->
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
        <el-button v-if="isAuth('canary:canarybasetask:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button type="primary" @click="syncEs()">同步ES</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      style="width: 100%;">
      <el-table-column
        prop="id"
        header-align="center"
        align="center"
        label="主键">
      </el-table-column>
      <el-table-column
        prop="name"
        header-align="center"
        align="center"
        label="name">
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
        prop="createdTime"
        header-align="center"
        align="center"
        label="创建时间">
      </el-table-column>
      <el-table-column
        prop="updatedTime"
        header-align="center"
        align="center"
        label="更新时间">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row)">
            {{scope.row.authOtherList.includes(userid) || scope.row.authOwner === userid ? '修改' : '查看'}}
          </el-button>
          <el-button type="text" size="small" v-if="scope.row.authOtherList.includes(userid) || scope.row.authOwner === userid" @click="deleteHandle(scope.row.id)">删除</el-button>
          <el-button type="text" size="small" v-if="scope.row.authOtherList.includes(userid) || scope.row.authOwner === userid" @click="addOrUpdateServiceHandle(scope.row.id)">应用配置</el-button>
          <el-button type="text" size="small" v-if="scope.row.authOwner === userid"   @click="taskPermission(scope.row)">授权</el-button>
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
    <task-service v-if="taskServiceVisible" ref="taskService"  @refreshDataList="getDataList"></task-service>
    <!-- 授权 -->
    <assign-permission v-if="assignPermissionVisible" :submitDataApi= "submitDataApi" ref="assignPermission" @refreshDataList="getDataList"></assign-permission>
  </div>
</template>
<style>
  .input-with-select  {
    width: 380px;
  }
</style>
<script>
  import { updateCanaryAuth } from '@/api/commom/assignPermission'
  import AddOrUpdate from './canarybasetask-add-or-update'
  import TaskService from './canarybaseservice'
  import AssignPermission from '../../components/permission/assign-permission'
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
        taskServiceVisible: false,
        submitDataApi: updateCanaryAuth,
        assignPermissionVisible: false,
        userid: sessionStorage.getItem('id')
      }
    },
    components: {
      AddOrUpdate,
      TaskService,
      AssignPermission
    },
    activated () {
      this.getDataList()
    },
    methods: {
      loadAll () {
        if (this.dataForm.key) {
          this.$http({
            url: this.$http.adornUrl('/canary/canarybasetask/search/' + this.dataForm.key),
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
          url: this.$http.adornUrl('/canary/canarybasetask/list'),
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
      // 新增 / 修改
      addOrUpdateHandle (row) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          let canUpdate = row ? row.authOtherList.includes(this.userid) || row.authOwner === this.userid : true
          let id = row ? row.id : undefined
          this.$refs.addOrUpdate.init(id, canUpdate)
        })
      },
      // 同步到es
      syncEs () {
        return this.$http({
          url: this.$http.adornUrl(`/canary/canarybasetask/all/syncEs`),
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
      // 应用配置
      addOrUpdateServiceHandle (id) {
        this.taskServiceVisible = true
        this.$nextTick(() => {
          this.$refs.taskService.init(id)
        })
      },
      // 删除
      deleteHandle (id) {
        this.$confirm(`确定对[${id} '删除']操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/canary/canarybasetask/delete/' + id),
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
        })
      },
      taskPermission (row) {
        // 打开权限分配弹框
        // 根据登陆用户和数据创建人判断是否是同一用户决定权限按钮是否显示
         this.assignPermissionVisible = true
         this.$nextTick(() => {
           this.$refs.assignPermission.init(row)
        })
      }
    }
  }
</script>
