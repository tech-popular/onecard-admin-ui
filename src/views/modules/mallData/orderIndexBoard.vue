<template>
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
