<template>
  <div class="tableau-container" ref="container">
    <iframe
      :src="tableauUrl"
      width="100%" height="800px" frameborder="0" scrolling="yes">
    </iframe>
  </div>
</template>
<script>
import http from '@/utils/httpRequest'
export default {
  data () {
    return {
      tableauUrl: ''
    }
  },
  created () {
    this.getTableauUrl()
  },
  methods: {
    getTableauUrl () {
      http({
        url: http.adornUrl('/dataSCInfo/selectSCInfoUrl'),
        method: 'get'
      }).then(({data}) => {
        if (data.status !== '1') {
          return this.$message({
            type: 'error',
            message: data.message || '数据异常'
          })
        }
        this.tableauUrl = data.data
      })
    }
  }
}
</script>
<style lang="scss">
  .tableau-container {
    width: 100%;
    min-height: 800px;
    margin: 0;
  }
</style>
