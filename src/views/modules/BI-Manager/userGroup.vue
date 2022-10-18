<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" size="small">
      <el-form-item label="用户组名称: ">
        <el-input v-model="dataForm.name" class="input-with-select" @keyup.enter.native="getDataList()"></el-input>
      </el-form-item>
      <el-form-item label="用户成员: ">
        <el-select v-model="dataForm.userId" clearable placeholder="请输入关键字" style="width:100%" remote :remote-method="getUserSelectList" :loading="loading" filterable>
          <el-option v-for="item in userIdList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button v-if="isAuth('honeycomb:honeycombtask:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList" border fit v-loading="dataListLoading">
      <el-table-column prop="id" header-align="center" align="center" label="ID" width="80"></el-table-column>
      <el-table-column prop="name" header-align="center" align="center" label="用户组名称">
        <template slot-scope="scope">
          <el-tooltip effect="dark" placement="top">
            <div v-html="toBreak(scope.row.name)" slot="content"></div>
            <div class="text-to-long-cut">{{scope.row.name}}</div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="department" header-align="center" align="center" show-overflow-tooltip label="归属部门"></el-table-column>
      <el-table-column prop="creater" header-align="center" align="center" show-overflow-tooltip label="申请人"></el-table-column>
      <el-table-column prop="remark" header-align="center" align="center" show-overflow-tooltip label="说明"></el-table-column>
      <el-table-column prop="memberNum" header-align="center" align="center" label="成员人数" width="80"></el-table-column>
      <el-table-column prop="flag" header-align="center" align="center" label="是否有效" width="80">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.flag === 1" size="small">否</el-tag>
          <el-tag v-else size="small" type="danger">是</el-tag>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="操作" width="260">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row)">修改</el-button>
          <el-button type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
          <el-button type="text" size="small" @click="taskDependent(scope.row.id, 0)">PC端权限</el-button>
          <el-button type="text" size="small" @click="taskDependent(scope.row.id, 1)">移动端权限</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalCount"
      layout="total, sizes, prev, pager, next, jumper"
    ></el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    <assign-permissions v-if="assignPermissionsVisible" ref="assignPermissions" @refreshDataList="getDataList"></assign-permissions>
  </div>
</template>
<style>
.input-with-select {
  width: 180px;
}
</style>
<script>
import { getUserGroupList, deleteUsersById, getUsersList } from '@/api/BI-Manager/userGroup'
import AddOrUpdate from './userGroup-add-or-update'
import assignPermissions from './assign-permissions'
export default {
  data () {
    return {
      dataForm: {
        userId: '',
        name: ''
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalCount: 0,
      dataListLoading: false,
      dataListSelections: [],
      userIdList: [],
      loading: false,
      // tenantIdList: [],
      addOrUpdateVisible: false,
      assignPermissionsVisible: false,
      taskDependentVisible: false
    }
  },
  components: {
    AddOrUpdate,
    assignPermissions
  },
  activated () {
    this.getDataList()
  },
  mounted () { },
  methods: {
    handleSelect (item) {
      this.dataForm.key = item.name
      this.getDataList()
    },
    // 获取数据列表
    getDataList () {
      this.dataListLoading = true
      let params = {
        'name': this.dataForm.name,
        'userId': this.dataForm.userId,
        'page': this.pageIndex,
        'pageSize': this.pageSize
      }
      getUserGroupList(params).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = data.data.list
          // this.getTenantDown()
          this.totalCount = data.data.totalCount
          this.dataListLoading = false
        } else {
          this.dataList = []
          this.totalCount = 0
          this.dataListLoading = false
        }
      })
    },
    getUserSelectList (query) {
      if (query !== '') {
        this.loading = true
        let params = {
          name: query
        }
        getUsersList(params).then(({ data }) => {
          if (data && data.code === 0) {
            this.userIdList = data.dataList
          } else {
            this.userIdList = []
          }
          this.loading = false
        }).finally(() => {
          this.loading = false
        })
      } else {
        this.userIdList = []
      }
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
        this.$refs.addOrUpdate.init(row)
      })
    },
    taskDependent (id, type) {
      this.assignPermissionsVisible = true
      this.$nextTick(() => {
        this.$refs.assignPermissions.init(id, type)
      })
    },
    // 删除
    deleteHandle (id) {
      this.$confirm(`确定对[id=${id}]进行[删除]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteUsersById(id).then(({ data }) => {
          if (data.code !== 0) {
            return this.$message({
              type: 'error',
              message: data.msg
            })
          }
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.getDataList()
        })
      }).catch(() => { })
    }
  }
}
</script>
