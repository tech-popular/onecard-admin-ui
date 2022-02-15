<template>
  <div class="mod-config">
    <el-form :inline="true">
      <el-form-item>
        <el-button type="primary"  @click="addOrUpdateSqlHandle">SQL提数申请</el-button>
        <!-- <el-button type="primary"  @click="searchHistory">申请申请</el-button> -->
        <el-button type="primary" @click="addOrUpdateFtpHandle">FTP提数申请</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      style="width: 100%;"
    >
      <el-table-column prop="id" header-align="center" align="center" label="序号"></el-table-column>
      <el-table-column prop="name" header-align="center" align="center" label="申请原因">
        <template slot-scope="scope">
          <el-tooltip effect="dark" placement="top">
            <div v-html="toBreak(scope.row.name)" slot="content"></div>
            <div class="text-to-long-cut">{{scope.row.name}}</div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="ipAddress" header-align="center" align="center" label="申请时间"></el-table-column>
      <el-table-column prop="cron" header-align="center" align="center" show-overflow-tooltip label="提数类型"></el-table-column>
      <el-table-column prop="sql" header-align="center" align="center" label="接收时间"></el-table-column>
			<el-table-column prop="inDatasourceName" header-align="center" align="center" label="申请状态"></el-table-column>
			<el-table-column prop="inDatasourceName" header-align="center" align="center" label="是否失效"></el-table-column>
			<el-table-column prop="inDatasourceName" header-align="center" align="center" label="失效原因"></el-table-column>
			<el-table-column prop="inDatasourceName" header-align="center" align="center" label="距离失效日期"></el-table-column>
      <el-table-column prop="inDatasourceName" header-align="center" align="center" label="接收人"></el-table-column>
      <!-- <el-table-column prop="enable" header-align="center" align="center" label="是否启用">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.enable === 1" size="small">正常</el-tag>
          <el-tag v-else size="small" type="danger">禁用</el-tag>
        </template>
      </el-table-column> -->
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper"
    ></el-pagination>
		<addOrUpdateSql v-if="addOrUpdateSqlVisible" ref="addOrUpdateSql"></addOrUpdateSql>
    <addOrUpdateFtp  v-if="addOrUpdateFtpVisible" ref="addOrUpdateftp"></addOrUpdateFtp>
    <!-- <dataServiceHistory v-if="dataServiceHistoryVisible" ref="dataServiceHistory"></dataServiceHistory> -->
  </div>
</template>
<style>
.input-with-select {
  width: 180px;
}
</style>
<script>
// import addOrUpdate from './service-add-or-update'
import addOrUpdateSql from './sql-add-or-update'
import addOrUpdateFtp from './ftp-add-or-update'
// import dataServiceHistory from './dataService-history'
export default {
  data () {
    return {
      restaurants: [],
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      addOrUpdateSqlVisible: false,
      addOrUpdateFtpVisible: false,
      dataServiceHistoryVisible: false
    }
  },
  components: { addOrUpdateSql, addOrUpdateFtp },
  activated () {
    this.getDataList()
  },
  mounted () {
  },
  methods: {
    // 获取数据列表
    getDataList () {
      // this.dataListLoading = true
    },
    // 每页数
    sizeChangeHandle (val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getDataList()
    },
    // 当前页
    currentChangeHandle (val) {
      this.pageIndex = val
      this.getDataList()
    },
    // 新增 / 修改
    addOrUpdateSqlHandle () {
      this.addOrUpdateSqlVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdateSql.init()
      })
    },
    addOrUpdateFtpHandle () {
      this.addOrUpdateFtpVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdateftp.init()
      })
    },
    searchHistory () {
      this.dataServiceHistoryVisible = true
      this.$nextTick(() => {
        this.$refs.dataServiceHistory.init()
      })
    }
  }
}
</script>
