<template>
  <div class="mod-menu">
    <el-form :inline="true" :model="dataForm">
      <el-form-item label="级联选择: ">
        <el-cascader
          style="width: 300px;overflow:hidden"
          v-model="dataForm.select"
          :options="cascaderOptions"
          :props="cascaderProps"
          @change="cascaderChange"
          clearable
          filterable
        >
        </el-cascader>
      </el-form-item>
      <!-- <el-form-item label="名称: ">
        <el-input v-model="dataForm.name" placeholder="名称" clearable></el-input>
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" @click="getDataList()">查询</el-button>
        <el-button type="default" @click="resetHandle()">重置</el-button>
        <el-button v-if="isAuth('sys:menu:save')" type="success" @click="addOrUpdateHandle()">新增</el-button>
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
      <table-tree-column
        prop="name"
        header-align="center"
        treeKey="menuId"
        width="150"
        label="名称">
      </table-tree-column>
      <el-table-column
        prop="parentName"
        header-align="center"
        align="center"
        width="120"
        label="上级菜单">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        label="图标">
        <template slot-scope="scope">
          <icon-svg :name="scope.row.icon || ''"></icon-svg>
        </template>
      </el-table-column>
      <el-table-column
        prop="type"
        header-align="center"
        align="center"
        label="类型">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type === -2" size="small" type="danger">版块</el-tag>
          <el-tag v-else-if="scope.row.type === -1" size="small" type="primary">导航</el-tag>
          <el-tag v-else-if="scope.row.type === 0" size="small" type="warning">目录</el-tag>
          <el-tag v-else-if="scope.row.type === 1" size="small" type="success">菜单</el-tag>
          <el-tag v-else-if="scope.row.type === 2" size="small" type="info">按钮</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="orderNum"
        header-align="center"
        align="center"
        label="当前层级排序">
      </el-table-column>
      <el-table-column
        prop="url"
        header-align="center"
        align="center"
        width="150"
        label="菜单路径">
        <template slot-scope="scope">
          <el-tooltip effect="dark" placement="top">
            <div v-html="toBreak(scope.row.url)" slot="content"></div>
            <div class="text-to-long-cut">{{scope.row.url}}</div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        prop="userName"
        header-align="center"
        align="center"
        label="创建人">
      </el-table-column>
      <el-table-column
        prop="createDate"
        header-align="center"
        align="center"
        label="创建时间">
      </el-table-column>
      <el-table-column
        prop="status"
        header-align="center"
        align="center"
        width="150"
        label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 1" size="small" >显示</el-tag>
          <el-tag v-else size="small" type="danger">隐藏</el-tag>
        </template>
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
  import TableTreeColumn from '@/components/table-tree-column'
  import AddOrUpdate from './menu-add-or-update'
  import { treeDataTranslate } from '@/utils'
  import { getPageList, getSelectDown } from '@/api/sys/menu'
  export default {
    data () {
      return {
        dataForm: {
          name: '',
          select: []
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
      TableTreeColumn,
      AddOrUpdate
    },
    mounted () {
      this.getDataList()
      this.getSelectDown()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        getPageList({
          id: this.dataForm.id
          // name: this.dataForm.name
        }).then(({data}) => {
          this.dataList = treeDataTranslate(data.data, 'menuId')
          // this.$nextTick(() => {
            // document.getElementsByClassName('el-icon-caret-right')[0].click()
            // document.getElementsByClassName('el-icon-caret-right')[1].click()
          // })
          this.dataListLoading = false
        })
      },
      getSelectDown () {
        getSelectDown().then(({data}) => {
          if (data && data.code === 0) {
            this.cascaderOptions = JSON.parse(data.menuList)
          } else {
            this.cascaderOptions = []
          }
        })
      },
      cascaderChange (val) {
        this.dataForm.id = val[val.length - 1]
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
          this.$http({
            url: this.$http.adornUrl(`/sys/menu/delete/${id}`),
            method: 'post',
            data: this.$http.adornData()
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
        }).catch(() => {})
      },
      // 启用、禁用
      enableOrDisableHandle (id, status) {
        this.$confirm(`确定对 [id=${id}] 进行 [` + (status === 1 ? '禁用' : '启用') + `] 操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl(`/sys/menu/updateStatus/${id}/${(status === 1 ? 0 : 1)}`),
            method: 'post',
            data: this.$http.adornData()
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
        }).catch(() => {})
      },
      resetHandle () { // 重置
        this.dataForm.select = ''
        this.dataForm.id = ''
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
