<template>
  <div>
    <el-form :inline="true" :model="dataForm" ref="dataForm">
      <el-form-item label="指标名称">
        <el-input v-model="dataForm.name" placeholder="指标名称" clearable />
      </el-form-item>
      <el-form-item label="指标类别">
        <el-select v-model="dataForm.type" placeholder="指标类别">
          <el-option label="全部" value="-1"></el-option>
          <el-option label="类别一" value="1"></el-option>
          <el-option label="类别二" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="指标状态">
        <el-select v-model="dataForm.status" placeholder="指标状态">
          <el-option label="全部" value="-1"></el-option>
          <el-option label="有效" value="1"></el-option>
          <el-option label="无效" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="业务线">
        <el-input v-model="dataForm.business" placeholder="业务线" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchHandle()">查询</el-button>
        <el-button @click="resetHandle()">重置</el-button>
        <el-button type="success" @click="addOrUpdateHandle()">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;">
      <el-table-column prop="id" header-align="center" align="center" label="指标ID"></el-table-column>
      <el-table-column prop="enName" header-align="center" align="center" label="指标名"></el-table-column>
      <el-table-column prop="name" header-align="center" align="center" label="指标标题"></el-table-column>
      <el-table-column prop="type" header-align="center" align="center" label="指标类型"></el-table-column>
      <el-table-column prop="classic" header-align="center" align="center" label="指标类别"></el-table-column>
      <el-table-column prop="status" header-align="center" align="center" label="指标状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 1" size="small" >有效</el-tag>
          <el-tag v-else size="small" type="danger">无效</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="origin" header-align="center" align="center" label="指标数据源"></el-table-column>
      <el-table-column prop="business" header-align="center" align="center" label="业务线"></el-table-column>
      <el-table-column prop="desc" header-align="center" align="center" label="指标说明"></el-table-column>
      <el-table-column prop="creator" header-align="center" align="center" label="创建人"></el-table-column>
      <el-table-column prop="createTime" header-align="center" align="center" label="创建时间"></el-table-column>
      <el-table-column prop="updateTime" header-align="center" align="center" label="修改时间"></el-table-column>
      <el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="addOrUpdateHandle(scope.row)">编辑</el-button>
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
      layout="total, sizes, prev, pager, next, jumper"/>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"/>
  </div>
</template>

<script>
  import { indexManageList } from '@/api/dataAnalysis/indexManage'
  import AddOrUpdate from './baseComponents/indexManage-add-or-update'
  export default {
    data () {
      return {
        dataForm: {
          name: '',
          type: '-1',
          status: '-1',
          business: ''
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
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.dataListLoading = true
            let params = {
              ...this.dataForm,
              'pageNum': this.pageNum,
              'pageSize': this.pageSize
            }
            indexManageList(params, false).then(({data}) => {
              console.log(data)
              if (data && data.msg === 'success') {
                this.dataList = data.data.list
                this.totalCount = data.data.totalCount
                console.log(this.dataList)
              } else {
                this.dataList = []
                this.totalCount = 0
              }
              this.dataListLoading = false
            })
          }
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
          name: '',
          type: '-1',
          status: '-1',
          business: ''
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
<style scoped>

</style>
