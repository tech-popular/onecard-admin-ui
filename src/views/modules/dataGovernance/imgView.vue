<template>
  <div class="img-mod-config" v-loading="dataListLoading">
    <img :src="pngBase64" />
  </div>
</template>
<style>
</style>
<script>
// import { dingDingPreview } from '@/api/dataGovernance/datareport'
export default {
  data () {
    return {
      dataListLoading: false,
      pngBase64: ''
    }
  },
  mounted () {
    this.downDataList()
  },
  methods: {
    // 下载
    downDataList () {
      this.dataListLoading = true
      let fileName = this.$route.query.fileName
      // let a = document.createElement('a')
      // a.href = this.$http.adornUrl(`/export/data/excel/template/download/${fileName}`)
      // a.click()
      this.$http({
        url: this.$http.adornUrl(`/export/data/excel/img/view/${fileName}`),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        console.log('data: ', data)
        if (data && data.code === 0) {
          this.dataListLoading = false
          this.pngBase64 = 'data:image/png;base64,' + data.data
          // console.log('data: ', data);
        } else {
          this.$message.error(data.msg)
          this.dataListLoading = false
        }
      })
    }
  }
}
</script>
<style scoped>
.img-mod-config {
  display: flex;
  justify-content: center;
  width: 100%;
}
</style>