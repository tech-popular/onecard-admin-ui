<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" >
      <el-form-item>
        <el-input v-model="dataForm.key" placeholder="名称" clearable @keyup.enter.native="getDataList()"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button v-if="isAuth('canary:canarypipeline:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button v-if="isAuth('canary:canarypipeline:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
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
        label="pipeline主键">
      </el-table-column>
      <el-table-column
        prop="channel"
        header-align="center"
        align="center"
        label="方式">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.channel === 1" size="small" >钉钉</el-tag>
          <el-tag v-else-if="scope.row.channel === 2" size="small" >邮箱</el-tag>
          <el-tag v-else-if="scope.row.channel === 3" size="small" >电话</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        header-align="center"
        align="center"
        label="名称">
      </el-table-column>
      <el-table-column
        prop="value"
        header-align="center"
        align="center"
        label="pipe值">
        <template slot-scope="scope">
          <el-tooltip effect="dark" placement="top">
            <div v-html="toBreak(scope.row.value)" slot="content"></div>
            <div class="text-to-long-cut">{{scope.row.value}}</div>
          </el-tooltip>
        </template>
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
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row)"> {{isAdmin || scope.row.authOtherList.includes(userid) || scope.row.authOwner === userid ? '修改' : '查看'}}</el-button>
          <el-button type="text" size="small" v-if="isAdmin || scope.row.authOtherList.includes(userid) || scope.row.authOwner === userid" @click="deleteHandle(scope.row.id)">删除</el-button>
          <el-button type="text" size="small" v-if="isAdmin || scope.row.authOwner === userid"   @click="taskPermission(scope.row)">授权</el-button>
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
     <!-- 授权 -->
    <assign-permission v-if="assignPermissionVisible" :submitDataApi= "submitDataApi" ref="assignPermission" @refreshDataList="getDataList"></assign-permission>
  </div>
</template>

<script>
  import { updateCanaryPipelineAuth } from '@/api/commom/assignPermission'
  import AddOrUpdate from './canarypipeline-add-or-update'
  import AssignPermission from '../../components/permission/assign-permission'
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
        submitDataApi: updateCanaryPipelineAuth,
        assignPermissionVisible: false,
        userid: sessionStorage.getItem('id'),
        isAdmin: sessionStorage.getItem('username') === 'admin'
      }
    },
    components: {
      AddOrUpdate,
      AssignPermission
    },
    activated () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/canary/canarypipeline/list'),
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
      addOrUpdateHandle (row) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          let canUpdate = true
          if (!this.isAdmin) {
            canUpdate = row ? row.authOtherList.includes(this.userid) || row.authOwner === this.userid : true
          }
          this.$refs.addOrUpdate.init(row, canUpdate)
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
            url: this.$http.adornUrl('/canary/canarypipeline/delete'),
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
