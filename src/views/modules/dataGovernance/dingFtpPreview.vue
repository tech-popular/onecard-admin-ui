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
      let id = this.$route.query.id  // 从路由中获取 id
      let baseUrl = window.SITE_CONFIG.baseUrl  // 获取配置中的 baseUrl
      // 动态构建后端接口地址，进行跳转
      window.location.href = `${baseUrl}/export/data/ftp/preview/${id}` // 替换为实际的后端接口路径
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