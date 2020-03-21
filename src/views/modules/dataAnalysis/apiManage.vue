<template>
  <div>
    <el-form :inline="true" :model="dataForm" ref="dataForm">
      <el-form-item label="API名称">
        <el-input v-model="dataForm.name" placeholder="API名称" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchHandle()">查询</el-button>
        <el-button @click="resetHandle()">重置</el-button>
        <el-button type="success" @click="addOrUpdateHandle()">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;">
      <el-table-column prop="id" header-align="center" align="center" label="ID"></el-table-column>
      <el-table-column prop="name" header-align="center" align="center" label="API名称"></el-table-column>
      <el-table-column prop="code" header-align="center" align="center" label="接口编码"></el-table-column>
      <el-table-column prop="desc" header-align="center" align="center" label="API说明">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" placement="top">
            <div v-html="toBreak(scope.row.desc)" slot="content" style="max-width:400px;line-height: 1.5;word-break: break-all;"></div>
            <div class="text-to-long-cut">{{scope.row.desc}}</div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="creator" header-align="center" align="center" label="创建人"></el-table-column>
      <!-- <el-table-column prop="updator" header-align="center" align="center" label="修改人"></el-table-column> -->
      <el-table-column prop="createTime" header-align="center" align="center" label="创建时间"></el-table-column>
      <el-table-column prop="updateTime" header-align="center" align="center" label="修改时间"></el-table-column>
      <el-table-column header-align="center" align="center" width="150" label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="addOrUpdateHandle(scope.row, 'update')">编辑</el-button>
          <el-button type="text" @click="addOrUpdateHandle(scope.row, 'view')">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageNum"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalCount"
      layout="total, sizes, prev, pager, next, jumper" />
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"/>
  </div>
</template>

<script>
  import { apiManageList } from '@/api/dataAnalysis/apiManage'
  import AddOrUpdate from './baseComponents/apiManage-add-or-update'
  export default {
    data () {
      return {
        dataForm: {
          name: ''
        },
        dataList: [],
        pageNum: 1, // 当前页
        pageSize: 10, // 默认每页10条
        totalCount: 0,
        dataListLoading: false,
        addOrUpdateVisible: false
      }
    },
    components: {
      AddOrUpdate
    },
    mounted () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        let params = {
          ...this.dataForm,
          'pageNum': this.pageNum,
          'pageSize': this.pageSize
        }
        apiManageList(params).then(({data}) => {
          this.dataListLoading = false
          if (data.status !== '1' || !data.data || !data.data.list.length) {
            this.dataList = []
            this.totalCount = 0
            return
          }
          this.dataList = data.data.list
          this.totalCount = data.data.total
        })
      },
      // 新增 / 修改
      addOrUpdateHandle (row, tag) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(row, tag)
        })
      },
      /** 查询 */
      searchHandle () {
        this.pageNum = 1
        this.getDataList()
      },
      /** 重置 */
      resetHandle () {
        this.pageNum = 1
        this.dataForm = {
          name: ''
        }
        this.getDataList()
      },
      // 每页数
      sizeChangeHandle (page) {
        this.pageSize = page
        this.pageNum = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle (page) {
        this.pageNum = page
        this.getDataList()
      }
    }
  }
</script>
