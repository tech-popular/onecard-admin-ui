<template>
  <div class="mod-config" v-loading="dataListLoading">
    <div name="downloadFile" @click="downDataList"></div>
  </div>
</template>
<style>
</style>
<script>
// import { dingDingPreview } from '@/api/dataGovernance/datareport'
export default {
  data () {
    return {
      dataListLoading: false
    }
  },
  mounted () {
    this.downDataList()
  },
  methods: {
    // 下载
    downDataList () {
      // this.dataListLoading = true
      let fileName = this.$route.query.fileName
      let a = document.createElement('a')
      a.href = this.$http.adornUrl(`/export/data/excel/ftp/download/${fileName}`)
      a.click()
    }
  }
}
</script>
<style scoped>
.dingding-preview-title {
  padding: 14px;
  background: #c3c3c3;
  font-size: 14px;
  margin: 20px 0px;
  position: relative;
}
</style>