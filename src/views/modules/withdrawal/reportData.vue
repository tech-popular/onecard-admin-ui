<template>
  <div class="mod-config">
    <tab :list="dataList" :columns="columns" :operates="{}" :fixed="{}" />
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
      this.columns = []
      this.dataListLoading = true
      let reportData = this.$store.state.withdrawal.sqlPreviewDataList
      this.columns = Object.keys(this.dataList[0])
      this.dataList = reportData
      this.dataListLoading = false
    }
  }
}
</script>
