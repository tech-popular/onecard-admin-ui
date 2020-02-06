<template>
  <div>
    <el-form :inline="true" :model="dataForm" ref="dataForm">
      <el-form-item label="分群ID">
        <el-input v-model="dataForm.id" placeholder="分群ID" clearable />
      </el-form-item>
      <el-form-item label="分群名称">
        <el-input v-model="dataForm.name" placeholder="分群名称" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchHandle()">查询</el-button>
        <el-button @click="resetHandle()">重置</el-button>
        <el-button type="success" @click="addOrUpdateHandle()">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;">
      <el-table-column prop="id" header-align="center" align="center" label="分群ID"></el-table-column>
      <el-table-column prop="name" header-align="center" align="center" label="分群名称"></el-table-column>
      <el-table-column prop="desc" header-align="center" align="center" label="分群说明">
        <template slot-scope="scope">
          <el-tooltip placement="right" v-if="scope.row.desc.length > 10">
          <div slot="content" style="max-width: 200px;line-height: 1.5">{{scope.row.desc}}</div>
          <span>{{`${scope.row.desc.substr(0, 10)}...`}}</span>
        </el-tooltip>
        <span v-else>{{scope.row.desc}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" header-align="center" align="center" label="创建时间"></el-table-column>
      <el-table-column prop="creator" header-align="center" align="center" label="创建人"></el-table-column>
      <el-table-column prop="updateTime" header-align="center" align="center" label="最后修改时间"></el-table-column>
      <el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="addOrUpdateHandle(scope.row, 'update')">编辑</el-button>
          <el-button type="text" @click="deleteHandle(scope.row)">删除</el-button>
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
  import { dataInsightManageList, deleteDataInfo } from '@/api/dataAnalysis/dataInsightManage'
  import AddOrUpdate from './baseComponents/dataInsightManage-add-or-update'
  export default {
    data () {
      return {
        dataForm: {
          id: '',
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
        dataInsightManageList(params).then(({data}) => {
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
      // 删除
      deleteHandle (row) {
        this.$confirm(`确认删除分群名称为【${row.name}】的数据?`, '提示', {
          confirmButtonText: '删除',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteDataInfo(row.id).then(({data}) => {
            if (data.status !== '1') {
              return this.$message({
                type: 'error',
                message: data.message
              })
            }
            this.$message({
              type: 'success',
              message: data.message
            })
            this.getDataList()
          })
        }).catch(() => {
          // console.log('quxiao')
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
          name: '',
          id: ''
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
