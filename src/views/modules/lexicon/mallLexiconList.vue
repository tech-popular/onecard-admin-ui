<template>
  <div>
    <el-form :inline="true" :model="dataForm" ref="dataForm">
			<el-form-item label="词组ID">
        <el-input v-model="dataForm.id" placeholder="请输入词组ID" clearable />
      </el-form-item>
      <el-form-item label="词组名称">
        <el-input v-model="dataForm.wordName" placeholder="请输入词组名称" clearable />
      </el-form-item>
			<el-form-item label="词组类型">
        <el-select v-model="dataForm.wordType" filterable placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option
            v-for="item in queryTypeList"
            :key="item"
            :label="item"
            :value="item"
          >
          </el-option>
        </el-select>
      </el-form-item>
			<el-form-item label="词组状态">
        <el-select v-model="dataForm.status" filterable placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option label="启用" value="1"></el-option>
          <el-option label="停用" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchHandle()">查询</el-button>
        <el-button @click="resetHandle()">重置</el-button>
        <el-button type="success" @click="addOrUpdateHandle()">新增</el-button>
        <el-button type="warning" @click="publishHandle()">发布</el-button>
        <!-- <el-button type="primary" @click="importFile()" plain>导入</el-button>
        <el-button type="success" @click="exportFile()" plain>导出</el-button> -->
      </el-form-item>
    </el-form>
    <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;">
      <el-table-column prop="id" header-align="center" align="center" label="ID"></el-table-column>
      <el-table-column prop="wordName" header-align="center" align="center" label="词组名称"></el-table-column>
      <el-table-column prop="wordType" header-align="center" align="center" label="词组类型"></el-table-column>
      <el-table-column prop="creator" header-align="center" align="center" label="创建人"></el-table-column>
      <el-table-column prop="createTime" header-align="center" align="center" label="创建时间"></el-table-column>
      <el-table-column prop="updateTime" header-align="center" align="center" label="最后修改时间"></el-table-column>
      <el-table-column prop="status" header-align="center" align="center" label="词组状态">
        <template slot-scope="scope">
          {{scope.row.status === 1 ? '启用' : '停用'}}
        </template>
      </el-table-column>
      <el-table-column header-align="center" width="260" align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="success" plain size="mini" @click="changeStatus(scope.row)" v-if="scope.row.status === 0">启用</el-button>
          <el-button type="danger" plain size="mini" @click="changeStatus(scope.row)" v-else>停用</el-button>
          <el-button type="primary" plain size="mini" @click="addOrUpdateHandle(scope.row)">编辑</el-button>
          <el-button type="warning" plain size="mini" @click="deleteHandle(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageNo"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalCount"
      layout="total, sizes, prev, pager, next, jumper" />
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" :type-list="queryTypeList" @refreshDataList="getDataList"/>
    <publish-handle v-if="publishHandleVisible" ref="publishHandle" :type-list="queryTypeList"></publish-handle>
  </div>
</template>
<script>
  import { wordList, wordTypeList, deleteWordsInfo, changeWordsInfoStatus } from '@/api/lexicon/mallLexiconList'
  import AddOrUpdate from './baseComponents/mallLexicon-add-or-update'
  import publishHandle from './baseComponents/mallLexicon-publish'
  export default {
    data () {
      return {
        dataForm: {
          id: '',
          wordName: '',
          wordType: '',
          status: ''
        },
        queryTypeList: [],
        dataList: [],
        pageNo: 1, // 当前页
        pageSize: 10, // 默认每页10条
        totalCount: 0,
        dataListLoading: false,
        addOrUpdateVisible: false,
        publishHandleVisible: false
      }
    },
    components: {
      AddOrUpdate,
      publishHandle
    },
    mounted () {
      this.getDataList()
      this.getWordTypeList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        let params = {
          ...this.dataForm,
          'pageNo': this.pageNo,
          'pageSize': this.pageSize
        }
        wordList(params).then(({data}) => {
          this.dataListLoading = false
          if (data.code !== 0 || !data.data || !data.data.list.length) {
            this.dataList = []
            this.totalCount = 0
            return
          }
          this.dataList = data.data.list
          this.totalCount = data.data.totalCount
        })
      },
      getWordTypeList () { // 词组类型
        wordTypeList().then(({data}) => {
          if (data.code !== 0) {
            this.queryTypeList = []
          } else {
            this.queryTypeList = data.data
          }
        })
      },
      deleteHandle (row) { // 删除
        this.$confirm(`确定删除名称为【${row.wordName}】的词组吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteWordsInfo(row.id).then(({data}) => {
            if (data.code !== 0) {
              return this.$message({
                type: 'error',
                message: data.msg || '删除失败'
              })
            }
            this.$message({
              type: 'success',
              message: data.msg || '删除成功'
            })
            this.getDataList()
          })
        }).catch(() => {
          console.log('取消')
        })
      },
      changeStatus (row) { // 改变状态
        let status = row.status === 1 ? 0 : 1
        let content = row.status === 1 ? `确定停用名称为【${row.wordName}】的词组吗？` : `确定启用名称为【${row.wordName}】的词组吗？`
        this.$confirm(content, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => { // 确认创建分群时的操作
          changeWordsInfoStatus(row.id, status).then(({data}) => {
            if (data.code !== 0) {
              return this.$message({
                type: 'error',
                message: data.msg
              })
            }
            this.$message({
              type: 'success',
              message: data.msg
            })
            this.getDataList()
          })
        }).catch(() => {
          console.log('取消')
        })
      },
      // 新增 / 修改
      addOrUpdateHandle (row) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(row)
        })
      },
      /** 查询 */
      searchHandle () {
        this.pageNo = 1
        this.getDataList()
      },
      /** 重置 */
      resetHandle () {
        this.pageNo = 1
        this.dataForm = {
          name: ''
        }
        this.getDataList()
      },
      // 每页数
      sizeChangeHandle (page) {
        this.pageSize = page
        this.pageNo = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle (page) {
        this.pageNo = page
        this.getDataList()
      },
      publishHandle () { // 发布
        this.publishHandleVisible = true
        this.$nextTick(() => {
          this.$refs.publishHandle.init()
        })
      }
    }
  }
</script>
<style scoped>
  .el-button--primary.is-plain {
    color: #409eff;
    background: #ecf5ff;
    border-color: #b3d8ff;
  }
  .el-button--primary.is-plain:hover {
    background: #409eff;
    color: #fff;
  }
</style>
