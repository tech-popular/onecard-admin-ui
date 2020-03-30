<template>
  <div>
    <el-form :inline="true" :model="dataForm" ref="dataForm">
			<el-form-item label="词组ID">
        <el-input v-model="dataForm.id" placeholder="请输入词组ID" clearable />
      </el-form-item>
      <el-form-item label="词组名称">
        <el-input v-model="dataForm.name" placeholder="请输入词组名称" clearable />
      </el-form-item>
			<el-form-item label="词组类型">
        <el-select v-model="dataForm.type" filterable placeholder="请选择">
          <el-option label="全部" value="-1"></el-option>
          <el-option
            v-for="item in queryTypeList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
			<el-form-item label="词组状态">
        <el-select v-model="dataForm.status" filterable placeholder="请选择">
          <el-option label="全部" value="-1"></el-option>
          <el-option label="启用" value="1"></el-option>
          <el-option label="停用" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchHandle()">查询</el-button>
        <el-button @click="resetHandle()">重置</el-button>
        <el-button type="success" @click="addOrUpdateHandle()">新增</el-button>
        <!-- <el-button type="primary" @click="importFile()" plain>导入</el-button>
        <el-button type="success" @click="exportFile()" plain>导出</el-button> -->
      </el-form-item>
    </el-form>
    <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;">
      <el-table-column prop="id" header-align="center" align="center" label="ID"></el-table-column>
      <el-table-column prop="name" header-align="center" align="center" label="词组名称"></el-table-column>
      <el-table-column prop="code" header-align="center" align="center" label="词组类型"></el-table-column>
      <el-table-column prop="creator" header-align="center" align="center" label="创建人"></el-table-column>
      <el-table-column prop="createTime" header-align="center" align="center" label="创建时间"></el-table-column>
      <el-table-column prop="updateTime" header-align="center" align="center" label="最后修改时间"></el-table-column>
      <el-table-column prop="status" header-align="center" align="center" label="词组状态"></el-table-column>
      <el-table-column header-align="center" width="260" align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="success" plain size="mini" @click="startUsing(scope.row)" v-if="scope.row.flowId">启用</el-button>
          <el-button type="danger" plain size="mini" @click="stopUsing(scope.row)" v-else>停用</el-button>
          <el-button type="primary" plain size="mini" @click="addOrUpdateHandle(scope.row)">编辑</el-button>
          <el-button type="warning" plain size="mini" @click="deleteHandle(scope.row)">删除</el-button>
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
  import AddOrUpdate from './baseComponents/mallLexicon-add-or-update'
  export default {
    data () {
      return {
        dataForm: {
          id: '',
          name: '',
          type: '-1',
          status: '-1'
        },
        queryTypeList: [
          {
            name: '近义词',
            id: '1'
          },
          {
            name: '同义词',
            id: '2'
          },
          {
            name: '热门词',
            id: '3'
          }
        ],
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
      addOrUpdateHandle (row) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(row)
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
