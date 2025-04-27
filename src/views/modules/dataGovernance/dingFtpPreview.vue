<template>
  <div class="mod-config">
    <div class="dingding-preview-title">结果查询中......</div>
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
    this.redirectToResult()
  },
  mounted () {
    this.redirectToResult()
  },
  methods: {
    // 直接跳转到后端接口返回的页面
    redirectToResult() {
      let id = this.$route.query.id
      const url = this.$http.adornUrl(`/export/data/ftp/preview/${id}`)

      // 创建一个隐藏表单
      const form = document.createElement('form')
      form.action = url
      form.method = 'get'
      form.target = '_blank' // 新窗口打开，如果不想新窗口可以去掉

      document.body.appendChild(form)
      form.submit()
      document.body.removeChild(form)
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