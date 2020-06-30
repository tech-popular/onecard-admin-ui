<template>
  <div>
    <el-form :inline="true">
      <el-form-item label="字典名称">
        <el-input v-model.trim="dictionariesName" placeholder="字典名称" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchHandle()">查询</el-button>
        <el-button type="success" @click="addOrUpdateHandle()">新建字典</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList" border
      v-loading="dataListLoading"
      style="width: 100%;">
      <el-table-column
        prop="consumerName"
        header-align="center"
        align="center"
        label="字典名称"
        width="150px"/>
      <el-table-column
        prop="topic"
        header-align="center"
        align="center"
        label="字典类型"/>
      <el-table-column
        prop="groupId"
        header-align="center"
        align="center"
        label="字典值"/>
      <el-table-column
        prop="version"
        header-align="center"
        align="center"
        label="创建时间"
        width="150px"/>
        <el-table-column
        prop="enable"
        header-align="center"
        align="center"
        label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.enable === true" size="small" >启动</el-tag>
          <el-tag v-else size="small" type="danger">停止</el-tag>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" width="200" label="操作">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button type="primary" size="mini" icon="el-icon-edit" circle @click="addOrUpdateHandle(scope.row.id)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="查看" placement="top">
            <el-button type="success" size="mini" icon="el-icon-view" circle @click="addOrUpdateHandle(scope.row.id,'look')"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="管理字典" placement="top">
            <el-button type="warning" size="mini" icon="el-icon-collection" circle @click="dictionariesAdmin(scope.row.id)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageNum"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper"/>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"/>
     <!-- 字典管理 -->
    <dictionariesRun v-if="dictionariesRunVisible" ref="dictionariesRun" @refreshDataList="getDataList"/>
  </div>
</template>

<script>
  import AddOrUpdate from './dictionaries-add-or-update'
  import DictionariesRun from './dictionaries-run'
  import { beeTaskList } from '@/api/workerBee/kafka'
  export default {
    data () {
      return {
        dataList: [],
        dictionariesName: '',
        pageNum: 1, // 当前页
        pageSize: 10, // 默认每页10条
        totalPage: 0,
        dataListLoading: false,
        addOrUpdateVisible: false,
        dictionariesRunVisible: false
      }
    },
    components: {
      AddOrUpdate,
      DictionariesRun
    },
    activated () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        const dataBody = {
          'dictionariesName': this.dictionariesName,
          'pageNum': this.pageNum,
          'pageSize': this.pageSize
        }
        beeTaskList(dataBody).then(({data}) => {
          if (data && data.status === 0) {
            this.dataList = data.list
            this.totalPage = data.totalCount
          } else {
            this.dataList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
        })
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageNum = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageNum = val
        this.getDataList()
      },
      // 新增 / 修改
      addOrUpdateHandle (id, val) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id, val)
        })
      },
      // 字典管理
      dictionariesAdmin (id, val) {
        this.dictionariesRunVisible = true
        this.$nextTick(() => {
          this.$refs.dictionariesRun.init(id, val)
        })
      }
    }
  }
</script>
<style scoped>
  .el-button+.el-button{
    margin: 0 !important;
  }
</style>