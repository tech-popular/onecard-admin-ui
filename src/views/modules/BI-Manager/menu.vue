<template>
  <div class="mod-menu">
    <el-form :inline="true" :model="dataForm">
      <el-form-item label="菜单名称: ">
        <el-input v-model="dataForm.name" clearable @keyup.enter.native="getDataList()"></el-input>
      </el-form-item>
      <el-form-item label="目录名称：">
        <el-cascader clearable ref="cascaderMenu" @keyup.enter.native="getDataList()" v-model="dataForm.catalogueId" :options="menuList" :props="menuListTreeProps"></el-cascader>
      </el-form-item>
      <el-form-item label="菜单链接: ">
        <el-input v-model="dataForm.url" clearable @keyup.enter.native="getDataList()"></el-input>
      </el-form-item>
      <el-form-item label="菜单等级: ">
        <el-input v-model="dataForm.grade" clearable @keyup.enter.native="getDataList()"></el-input>
      </el-form-item>
      <el-form-item label="创建人: ">
        <el-input v-model="dataForm.creator" clearable @keyup.enter.native="getDataList()"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getDataList()">查询</el-button>
        <el-button type="default" @click="resetHandle()">重置</el-button>
        <el-button type="success" @click="addOrUpdateHandle()">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList" v-loading="dataListLoading" border style="width: 100%;">
      <el-table-column prop="id" header-align="center" align="center" width="80" label="ID"></el-table-column>
      <el-table-column prop="name" header-align="center" align="center" width="150" label="菜单名称">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" placement="top">
            <div v-html="toBreak(scope.row.name)" slot="content" style="max-width:400px;line-height: 1.5;word-break: break-all;"></div>
            <div class="text-to-long-cut">{{scope.row.name}}</div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="menuRelevance" header-align="center" align="center" width="150" label="菜单层级">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" placement="top">
            <div v-html="toBreak(scope.row.menuRelevance )" slot="content" style="max-width:400px;line-height: 1.5;word-break: break-all;"></div>
            <div class="text-to-long-cut">{{scope.row.menuRelevance }}</div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="menuType" header-align="center" align="center" width="150" :formatter="formatMenuType" label="菜单属性"></el-table-column>
      <el-table-column prop="grade" header-align="center" align="center" width="120" label="菜单等级">
        <template slot-scope="scope">{{scope.row.grade}}级菜单</template>
      </el-table-column>
      <el-table-column prop="url" header-align="center" align="center" label="菜单链接">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" placement="top">
            <div v-html="toBreak(scope.row.url)" slot="content" style="max-width:400px;line-height: 1.5;word-break: break-all;"></div>
            <div class="text-to-long-cut">{{scope.row.url}}</div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="orderNum" header-align="center" align="center" label="当前层级排序"></el-table-column>
      <el-table-column prop="flag" header-align="center" align="center" label="是否有效">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.flag === 1" size="small" type="danger">否</el-tag>
          <el-tag v-else-if="scope.row.flag === 0" size="small" type="primary">是</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="creator" header-align="center" align="center" label="创建人"></el-table-column>
      <el-table-column prop="createTime" header-align="center" align="center" label="创建时间"></el-table-column>
      <el-table-column prop="updateTime" header-align="center" align="center" label="修改时间"></el-table-column>
      <el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row)">修改</el-button>
          <el-button type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
          <el-button type="text" size="small" v-if="scope.row.menuType === 100" @click="sortMenuHandle(scope.row)">排序</el-button>
          <el-button v-if="scope.row.flag === 1 " style="color:#67C23A;" type="text" size="small" @click="changeFlagHandle(scope.row.id,scope.row.flag)">启用</el-button>
          <el-button v-if="scope.row.flag === 0 " style="color:#F56C6C;" type="text" size="small" @click="changeFlagHandle(scope.row.id,scope.row.flag)">禁用</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="page"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalCount"
      layout="total, sizes, prev, pager, next, jumper"
    />
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    <menu-sort v-if="menuSortVisible" ref="menuSort" @refreshDataList="getDataList"></menu-sort>
  </div>
</template>

<script>
import { getMenuList, updateFlagInfo, findAllRecursionList } from '@/api/BI-Manager/menu'
import AddOrUpdate from './menu-add-or-update'
import menuSort from './menu-sort'
export default {
  data () {
    return {
      dataForm: {
        name: '',
        url: '',
        grade: '',
        creator: '',
        catalogueId: []
      },
      page: 1, // 当前页
      pageSize: 10, // 默认每页10条
      totalCount: 0,
      dataList: [],
      dataListLoading: false,
      addOrUpdateVisible: false,
      menuSortVisible: false,
      menuList: [],
      menuListTreeProps: {
        checkStrictly: true,
        label: 'name',
        value: 'id',
        children: 'children'
      },
    }
  },
  components: {
    AddOrUpdate,
    menuSort
  },
  mounted () {
    this.getDataList()
    this.getSelectDown()
    this.getRecursionList()
  },
  methods: {
    // 获取数据列表
    getDataList () {
      this.dataListLoading = true
      let params = {
        'name': this.dataForm.name,
        'url': this.dataForm.url,
        'grade': this.dataForm.grade,
        'page': this.page,
        'pageSize': this.pageSize,
        'type': 0,
        'creator': this.dataForm.creator,
        'id': this.dataForm.catalogueId.length ? this.dataForm.catalogueId[this.dataForm.catalogueId.length - 1] : ''
      }
      getMenuList(params).then(({ data }) => {
        if (data && data.code === 0) {
          this.totalCount = data.data.totalCount
          this.dataList = data.data.list
          this.dataListLoading = false
        } else {
          this.dataList = []
          this.totalCount = 0
          this.dataListLoading = false
        }
      })
    },
    getSelectDown () {
    },
    // 获取上级菜单
    getRecursionList () {
      let params = {
        type: 0
      }
      findAllRecursionList(params).then(({ data }) => {
        if (data && data.code === 0) {
          this.menuList = this.filterMenuList(data.data)
        }
      })
    },
    filterMenuList (tree) {
      let arr = []
      if (!!tree && tree.length !== 0) {
        tree.forEach((item, index) => {
          if (!item.url) {
            let obj = {}
            obj.id = item.id
            obj.name = item.name
            obj.grade = item.grade
            if (item.children.length) {
              let children = []
              children = this.filterMenuList(item.children)
              if (children.length) {
                obj.children = children
              }
              arr.push(obj)
            } else {
              arr.push(obj)
            }
          }
        })
      }
      return arr
    },
    // 新增 / 修改
    addOrUpdateHandle (id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    // 启用/禁用
    changeFlagHandle (id, flag) {
      let params = {
        id: id,
        flag: flag === 0 ? 1 : 0
      }
      updateFlagInfo(params).then(({ data }) => {
        if (data.code !== 0) {
          return this.$message({
            type: 'error',
            message: data.msg,
            duration: 3000
          })
        }
        this.$message({
          type: 'success',
          message: '操作成功'
        })
        this.getDataList()
      })
    },
    // 删除功能
    deleteHandle (id) {
      var ids = [id]
      this.$confirm(
        `确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        this.$http({
          url: this.$http.adornUrl('/bi/biSysMenu/deleteBatchIds'),
          method: 'post',
          data: this.$http.adornData(ids, false)
        }).then(({ data }) => {
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
    resetHandle () { // 重置
      this.dataForm.name = ''
      this.dataForm.url = ''
      this.dataForm.grade = ''
      this.dataForm.creator = ''
      this.dataForm.catalogueId = []
      this.getDataList()
    },
    /** 查询 */
    searchHandle () {
      this.page = 1
      this.getDataList()
    },
    // 每页数
    sizeChangeHandle (page) {
      this.pageSize = page
      this.page = 1
      this.getDataList()
    },
    // 当前页
    currentChangeHandle (page) {
      this.page = page
      this.getDataList()
    },
    // 格式化菜单属性显示
    formatMenuType (row, column, cellValue, index) {
      cellValue = row.menuType === 100 ? 3 : cellValue
      const menuLists = ['superset表报', 'BI报表', 'tableau图表', '目录']
      return menuLists[cellValue]
    },
    // 给目录下级进行手动排序
    sortMenuHandle (row) {
      this.menuSortVisible = true
      this.$nextTick(() => {
        this.$refs.menuSort.init(row)
      })
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
