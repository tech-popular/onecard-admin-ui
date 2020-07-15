<template>
 <!-- 创建要插入Tableau可视化元素的容器 -->
  <div class="tableau-container" ref="container">
    <iframe
      :src="tableauUrl"
      width="100%" height="800px" frameborder="0" scrolling="yes">
    </iframe>
  </div>
</template>
<script>
export default {
  data () {
    return {
      tableauUrl: sessionStorage.getItem('tableauUrl')
    }
  },
  mounted () {
    // // 获取容器元素
    // let containerDiv = this.$refs.container
    // // 数据服务器路径
    // let url = 'http://public.tableau.com/views/RegionalSampleWorkbook/Storms'

    // // 配置选项
    // let options = {
    //   // 隐藏tab栏
    //   hideTabs: true,
    //   // 加载后执行的回调函数
    //   onFirstInteractive: function () {
    //     console.log('Run this code when the viz has finished loading.')
    //   }
    // }
    // // 实例化一个Talleau视图对象,并传入上述三个参数
    // // eslint-disable-next-line
    // this.view = new tableau.Viz(containerDiv, url, options)
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
