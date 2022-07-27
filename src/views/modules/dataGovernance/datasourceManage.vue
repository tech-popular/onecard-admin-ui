<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm">
      <el-form-item label="数据源名称: ">
        <el-input v-model="dataForm.datasourceName" clearable class="input-with-select" @keyup.enter.native="getDataList()"></el-input>
      </el-form-item>
      <el-form-item label="数据源类型: ">
        <el-select v-model="dataForm.type" clearable>
          <el-option label="mysql" value="mysql"></el-option>
          <el-option label="maxComputer" value="maxComputer"></el-option>
          <el-option label="postgre" value="postgre"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="启用状态: ">
        <el-select v-model="dataForm.enable" clearable>
          <el-option label="全部" value></el-option>
          <el-option label="启用" value="1"></el-option>
          <el-option label="禁用" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="searchData()">查询</el-button>
        <el-button type="primary" @click="addOrUpdateHandle">新增</el-button>
        <el-button type="primary" v-if="isAdmin" @click="multiTaskPermission()">批量授权</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList" border v-loading="dataListLoading" @selection-change="selectionChangeHandle" style="width: 100%;">
      <el-table-column v-if="isAdmin" type="selection" header-align="center" align="center" width="50"></el-table-column>
      <el-table-column prop="id" header-align="center" align="center" label="数据源id"></el-table-column>
      <el-table-column prop="datasourceName" header-align="center" align="center" label="数据源名称">
        <template slot-scope="scope">
          <el-tooltip effect="dark" placement="top">
            <div v-html="toBreak(scope.row.datasourceName)" slot="content"></div>
            <div class="text-to-long-cut">{{scope.row.datasourceName}}</div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="datasourceType" header-align="center" align="center" label="数据源类型"></el-table-column>
      <el-table-column prop="databaseList" header-align="center" align="center" label="数据库列表"></el-table-column>
      <el-table-column prop="user" header-align="center" align="center" label="账户"></el-table-column>
      <el-table-column prop="url" header-align="center" align="center" show-overflow-tooltip label="数据源地址"></el-table-column>
      <el-table-column prop="createUser" header-align="center" align="center" label="创建人"></el-table-column>

      <el-table-column prop="createTime" header-align="center" align="center" label="创建时间"></el-table-column>
      <el-table-column prop="updateTime" header-align="center" align="center" label="更新时间"></el-table-column>
      <el-table-column prop="remark" header-align="center" align="center" label="备注"></el-table-column>
      <el-table-column prop="enable" header-align="center" align="center" label="启用状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.enable === 1" size="small">启用</el-tag>
          <el-tag v-else size="small" type="danger">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" width="150" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button type="text" size="small" v-if="isAdmin || scope.row.authOwner === userid || scope.row.authOwner === username" @click="taskPermission(scope.row)">授权</el-button>
          <!-- <el-button type="text" v-if="scope.row.typeDesc === 'ftp提数' && scope.row.enable === 1 && scope.row.approveStatus === 'agree'" @click="disableHandle(scope.row)">申请失效</el-button>
          <el-button type="text" v-if="scope.row.typeDesc === 'ftp提数' && scope.row.enable === 0  && scope.row.approveStatus === 'agree'" @click="renewalHandle(scope.row)">申请续期</el-button>-->
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
      layout="total, sizes, prev, pager, next, jumper"
    ></el-pagination>
    <!-- 授权 -->
    <permissionConfiguration v-if="permissionConfigurationVisible" :submitDataApi="submitDataApi" :submitDataApis="submitDataApis" ref="permissionConfiguration" @refreshDataList="getDataList"></permissionConfiguration>
    <addOrUpdate v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></addOrUpdate>-->
  </div>
</template>
<style>
.input-with-select {
  width: 180px;
}
</style>
<script>
import { datasourceList, updateDataSourceAuth, batchUpdateDataSourceAuth } from '@/api/dataGovernance/datasourceManage'
import addOrUpdate from './datasourceManage-add-or-update'
import permissionConfiguration from './permissionConfiguration'
export default {
  data () {
    return {
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      addOrUpdateVisible: false,
      dataForm: {
        enable: '',
        type: '',
        datasourceName: ''
      },
      dataListSelections: [],
      submitDataApi: updateDataSourceAuth,
      submitDataApis: batchUpdateDataSourceAuth,
      permissionConfigurationVisible: false,
      userid: sessionStorage.getItem('id'),
      username: sessionStorage.getItem('username'),
      isAdmin: sessionStorage.getItem('username') === 'admin'
    }
  },
  components: { addOrUpdate, permissionConfiguration },
  activated () {
    this.getDataList()
  },
  mounted () {
  },
  methods: {
    // 获取数据列表
    getDataList () {
      this.dataListLoading = true
      let params = {
        datasourceName: this.dataForm.datasourceName,
        enable: this.dataForm.enable ? Number(this.dataForm.enable) : '',
        type: this.dataForm.type,
        currPage: this.pageIndex,
        pageSize: this.pageSize
      }
      datasourceList(params).then(({ data }) => {
        console.log('res: ', data)
        if (data.code === 0 && data.data) {
          this.dataList = data.data.list
          this.totalPage = data.data.totalCount
          this.dataListLoading = false
        } else {
          this.dataList = []
          this.dataListLoading = false
        }
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
    searchData () {
      this.pageIndex = 1
      this.getDataList()
    },
    // 新增 / 修改
    addOrUpdateHandle (id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    // 多选
    selectionChangeHandle (val) {
      this.dataListSelections = val
    },
    taskPermission (row) {
      // 打开权限分配弹框
      // 根据登陆用户和数据创建人判断是否是同一用户决定权限按钮是否显示
      this.permissionConfigurationVisible = true
      this.$nextTick(() => {
        this.$refs.permissionConfiguration.init(row, false)
      })
    },
    // 批量授权
    multiTaskPermission () {
      this.permissionConfigurationVisible = true
      let ids = this.dataListSelections.map(item => {
        return item.id
      })
      this.$nextTick(() => {
        this.$refs.permissionConfiguration.init(ids, true)
      })
    }
  }
}
</script>
