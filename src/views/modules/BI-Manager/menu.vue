<template>
  <div class="mod-menu">
    <el-form :inline="true" :model="dataForm">
      <el-form-item label="菜单名称: ">
        <el-input v-model="dataForm.menuName"></el-input>
      </el-form-item>
			<el-form-item label="菜单链接: ">
       <el-input v-model="dataForm.menuLink"></el-input>
      </el-form-item>
			<el-form-item label="菜单等级: ">
        <el-select v-model="dataForm.menuLevel"></el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getDataList()">查询</el-button>
        <el-button type="default" @click="resetHandle()">重置</el-button>
        <el-button type="success" @click="addOrUpdateHandle()">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      v-loading="dataListLoading"
      border
      style="width: 100%;">
      <el-table-column
        prop="menuId"
        header-align="center"
        align="center"
        width="80"
        label="ID">
      </el-table-column>
      <el-table-column
        prop="menuName"
        header-align="center"
				align="center"
        width="150"
        label="菜单名称">
      </el-table-column>
      <el-table-column
        prop="menuLevel"
        header-align="center"
        align="center"
        width="120"
        label="菜单等级">
      </el-table-column>
      <el-table-column
			  prop="menuLink"
        header-align="center"
        align="center"
        label="菜单链接">
      </el-table-column>
      <el-table-column
        prop="type"
        header-align="center"
        align="center"
        label="是否有效">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type === -2" size="small" type="danger">是</el-tag>
          <el-tag v-else-if="scope.row.type === -1" size="small" type="primary">否</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="orderNum"
        header-align="center"
        align="center"
        label="所属模块">
      </el-table-column>
      <el-table-column
        prop="userName"
        header-align="center"
        align="center"
        label="菜单顺序">
      </el-table-column>
      <el-table-column
        prop="createDate"
        header-align="center"
        align="center"
        label="网络类型">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button v-if="isAuth('sys:menu:update') && scope.row.type !== -2" type="text" size="small" @click="addOrUpdateHandle(scope.row.menuId)">修改</el-button>
          <el-button v-if="isAuth('sys:menu:delete') && scope.row.type !== -2" type="text" size="small" @click="deleteHandle(scope.row.menuId)">删除</el-button>
          <!-- <el-button v-if="scope.row.status === 0 && isAuth('sys:menu:updateStatus')" style="color:#67C23A;" type="text" size="small" @click="enableOrDisableHandle(scope.row.menuId,scope.row.status)">启用</el-button>
          <el-button v-if="scope.row.status === 1 && isAuth('sys:menu:updateStatus')" style="color:#F56C6C;" type="text" size="small" @click="enableOrDisableHandle(scope.row.menuId,scope.row.status)">禁用</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
  import AddOrUpdate from './menu-add-or-update'
  export default {
    data () {
      return {
        dataForm: {
          menuName: '',
          menuLink: '',
          menuLevel: ''
        },
        cascaderOptions: [],
        cascaderProps: {
          value: 'id',
          label: 'name'
        },
        dataList: [],
        dataListLoading: false,
        addOrUpdateVisible: false
      }
    },
    components: {
      AddOrUpdate
    },
    mounted () {
      this.getDataList()
      this.getSelectDown()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        // this.dataListLoading = true
      },
      getSelectDown () {
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
        this.$confirm(`确定对[id=${id}]进行[删除]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
        }).catch(() => {})
      },
      resetHandle () { // 重置
        this.dataForm.menuName = ''
        this.dataForm.menuLink = ''
        this.dataForm.menuLevel = ''
        this.getDataList()
      }
    }
  }
</script>
<style lang="scss">
  .el-scrollbar {
    overflow: hidden;
  }
  .el-cascader-menu {
    height: 192px;
  }
  .el-scrollbar__wrap {
    height: 204px;
  }
</style>
