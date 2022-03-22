<template>
  <div class="mod-config" v-loading="dataListLoading">
    <div name="downloadFile" @click="downDataList"></div>
  </div>
</template>
<style>
</style>
<script>
// import { dingDingPreview } from '@/api/withdrawal/datareport'
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
      a.href = this.$http.adornUrl(`/export/data/excel/template/download/${fileName}`)
      a.click()
      // this.$http({
      //   url: this.$http.adornUrl(`/export/data/excel/template/download/${fileName}`),
      //   method: 'get',
      //   params: this.$http.adornParams()
      // }).then(({ data }) => {
      //   console.log('data: ', data)
      //   if (data && data.code === 0) {
      //     this.dataListLoading = false
      //     // console.log('data: ', data);
      //   } else {
      //     this.$message.error(data.msg)
      //     this.dataListLoading = false
      //   }
      // })
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