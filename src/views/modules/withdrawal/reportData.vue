<template>
  <div class="mod-config">
    <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;">
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
    </el-table>
  </div>
</template>
<style>
</style>
<script>
export default {
  data () {
    return {
      dataList: [],
      dataListLoading: false
    }
  },
  activated () {
    this.getDataList()
  },
  mounted () {
  },
  methods: {
    // 获取数据列表
    getDataList () {
      // this.dataListLoading = true
    }
  }
}
</script>
