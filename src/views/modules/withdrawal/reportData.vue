<template>
  <div class="mod-config" v-loading="dataListLoading">
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
      let columnsData = Object.keys(reportData[0])
      columnsData.forEach(item => {
        this.columns.push({
          label: item,
          prop: item,
          align: 'center'
        })
      })
      this.dataList = reportData
      this.dataListLoading = false
    }
  }
}
</script>
