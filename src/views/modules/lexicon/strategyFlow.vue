<template>
  <div>
    <el-form :inline="true" :model="dataForm" ref="dataForm">
      <el-form-item label="策略流ID">
        <el-input v-model="dataForm.sacherId" placeholder="任务具体id" clearable />
      </el-form-item>
      <el-form-item label="策略流名称">
        <el-input v-model="dataForm.sacherName" placeholder="任务定义名称" clearable />
      </el-form-item>
      <el-form-item label="策略流场景">
        <el-select filterable v-model="dataForm.type" placeholder="请选择数据源类型">
          <el-option v-for="item in typeList" :value="item.value" :key="item.value" :label="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchHandle()">查询</el-button>
        <el-button @click="resetHandle()">重置</el-button>
        <el-button type="primary" @click="addOrUpdateHandle()">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList" border
      v-loading="dataListLoading"
      style="width: 100%;">
      <el-table-column
        prop="flowId"
        header-align="center"
        align="center"
        label="策略流ID"/>
      <el-table-column
        prop="consumerName"
        header-align="center"
        align="center"
        label="策略流名称"
        width="150px"/>
      <el-table-column
        prop="topic"
        header-align="center"
        align="center"
        label="场景类型"/>
      <el-table-column
        prop="groupId"
        header-align="center"
        align="center"
        label="策略流场景"/>
        <el-table-column
        prop="bootstrapServers"
        header-align="center"
        align="center"
        label="推荐类型">
        <template slot-scope="scope">
          <el-tooltip effect="dark" placement="top">
            <div v-html="toBreak(scope.row.bootstrapServers)" slot="content"></div>
            <div class="text-to-long-cut">{{scope.row.bootstrapServers}}</div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        prop="version"
        header-align="center"
        align="center"
        label="创建人"
        width="150px"/>
      <el-table-column
        prop="remark"
        header-align="center"
        align="center"
        label="创建时间"/>
      <el-table-column header-align="center" align="center" width="200" label="操作">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="复制" placement="top">
            <el-button type="primary" size="mini" icon="el-icon-document-copy" circle @click="addOrUpdateHandle(scope.row.id)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="预览" placement="top">
            <el-button type="success" size="mini" icon="el-icon-view" circle @click="addOrUpdateHandle(scope.row.id,'look')"></el-button>
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
  </div>
</template>

<script>
  import AddOrUpdate from './strategyFlow-add-or-update'
  import { beeTaskList } from '@/api/workerBee/kafka'
  export default {
    data () {
      return {
        dataForm: {
          sacherId: '',
          sacherName: '',
          type: 'mysql/oracle'
        },
        typeList: [
          {id: 1, value: '策略类型1'},
          {id: 2, value: '策略类型2'},
          {id: 3, value: '策略类型3'},
          {id: 4, value: '策略类型4'}
        ],
        dataList: [],
        pageNum: 1, // 当前页
        pageSize: 10, // 默认每页10条
        totalPage: 0,
        dataListLoading: false,
        addOrUpdateVisible: false
      }
    },
    components: {
      AddOrUpdate
    },
    activated () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        const dataBody = {
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
       /** 查询 */
      searchHandle () {
        this.pageNum = 1
        this.getDataList()
      },
      /** 重置 */
      resetHandle () {
        this.pageNum = 1
        this.dataForm.type = ''
        this.getDataList()
      },
      // 新增 / 修改
      addOrUpdateHandle (id, val) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id, val)
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