<template>
  <div class="mod-config" v-loading="dataListLoading">
    <tab :list="dataList" :columns="columns" :operates="{}" :fixed="{}" />
  </div>
</template>
<style>
</style>
<script>
// import { dingDingPreview } from '@/api/withdrawal/datareport'
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
    this.getDataList()
  },
  methods: {
    // 获取数据列表
    getDataList () {
      this.columns = []
      this.dataListLoading = true
      let id = this.$route.query.id
      this.$http({
        url: this.$http.adornUrl(`/export/data/sql/preview/${id}`),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        if (data && data.code === 0) {
          let reportData = data.data
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
        } else {
          this.dataList = []
          this.dataListLoading = false
        }
      })
    }
  }
}
</script>
