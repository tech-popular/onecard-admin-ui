<template>
  <div class="mod-config">
    <el-table :data="dataList" :column="columns" border v-loading="dataListLoading" style="width: 100%;"></el-table>
  </div>
</template>
<style>
</style>
<script>
export default {
  data () {
    return {
      dataList: [],
      dataListLoading: false,
      columns: []
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
      this.dataListLoading = true
      let reportData = this.$store.state.withdrawal.sqlPreviewDataList
      this.columns = Object.keys(this.dataList[0])
      this.dataList = reportData
      this.dataListLoading = false
    }
  }
}
</script>
