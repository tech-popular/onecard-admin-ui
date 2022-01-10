<template>
  <div class="mod-menu">
    <el-form :inline="true" :model="dataForm">
      <el-form-item label="菜单名称: ">
        <el-input v-model="dataForm.name" @keyup.enter.native="getDataList()"></el-input>
      </el-form-item>
			<el-form-item label="菜单链接: ">
       <el-input v-model="dataForm.url" @keyup.enter.native="getDataList()"></el-input>
      </el-form-item>
			<el-form-item label="菜单等级: ">
        <el-input v-model="dataForm.grade" @keyup.enter.native="getDataList()"></el-input>
        <!-- <el-select v-model="dataForm.grade"></el-select> -->
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
        prop="id"
        header-align="center"
        align="center"
        width="80"
        label="ID">
      </el-table-column>
      <el-table-column
        prop="name"
        header-align="center"
				align="center"
        width="150"
        label="菜单名称">
      </el-table-column>
      <el-table-column
        prop="menuType"
        header-align="center"
				align="center"
        width="150"
        :formatter="formatMenuType"
        label="菜单属性">
      </el-table-column>
      <el-table-column
        prop="grade"
        header-align="center"
        align="center"
        width="120"
        label="菜单等级">
      </el-table-column>
      <el-table-column
			  prop="url"
        header-align="center"
        align="center"
        label="菜单链接">
         <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" placement="top">
            <div v-html="toBreak(scope.row.url)" slot="content" style="max-width:400px;line-height: 1.5;word-break: break-all;"></div>
            <div class="text-to-long-cut">{{scope.row.url}}</div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        prop="flag"
        header-align="center"
        align="center"
        label="是否有效">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.flag === 1" size="small" type="danger">否</el-tag>
          <el-tag v-else-if="scope.row.flag === 0" size="small" type="primary">是</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="creator"
        header-align="center"
        align="center"
        label="创建人">
      </el-table-column>
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        label="创建时间">
      </el-table-column>
      <el-table-column
        prop="updateTime"
        header-align="center"
        align="center"
        label="修改时间">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button  type="text" size="small" @click="addOrUpdateHandle(scope.row)">修改</el-button>
          <!-- <el-button  type="text" size="small" @click="deleteHandle(scope.row.id)"></el-button> -->
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
      layout="total, sizes, prev, pager, next, jumper" />
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
  import { getMenuList, updateFlagInfo } from '@/api/BI-Manager/menu'
  import AddOrUpdate from './menu-add-or-update'
  export default {
    data () {
      return {
        dataForm: {
          name: '',
          url: '',
          grade: ''
        },
        page: 1, // 当前页
        pageSize: 10, // 默认每页10条
        totalCount: 0,
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
        this.dataListLoading = true
        let params = {
          'name': this.dataForm.name,
          'url': this.dataForm.url,
          'grade': this.dataForm.grade,
          'page': this.page,
          'pageSize': this.pageSize,
          'type': 0
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
      resetHandle () { // 重置
        this.dataForm.name = ''
        this.dataForm.url = ''
        this.dataForm.grade = ''
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
      formatMenuType(row, column, cellValue, index) {
        const menuLists = ['superset列表', 'table简单报表', 'tableau图表']
        return menuLists[cellValue];
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
