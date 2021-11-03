<template>
	<div 
	  class="dashboard"
		:style="{ 'min-height': documentClientHeight - 90 + 'px' }"
		>
        <iframe src="http://192.168.216.1:8787/r/13" :style="{ 'min-height': documentClientHeight - 90 + 'px' }"></iframe>
    </div>
</template>
<script>
export default {
  data () {
      return {
        loading: true
      }
    },
  computed: {
    documentClientHeight: {
      get () { return this.$store.state.common.documentClientHeight },
      set (val) { this.$store.commit('common/updateDocumentClientHeight', val) }
    }
  },
  mounted () {
    this.resetDocumentClientHeight()
  },
  methods: {
    // 重置窗口可视高度
    resetDocumentClientHeight () {
      this.documentClientHeight = document.documentElement['clientHeight'] - 90
      window.onresize = () => {
        this.documentClientHeight = document.documentElement['clientHeight'] - 90
      }
      this.$nextTick(() => {
        this.loading = false
      })
    }
  }
}
</script>
<style>
	.dashboard {
		width: 100%;
		margin: 0 auto;
	}
	.dashboard iframe {
		width: 100%;
		height: 100%;
		margin-top: -75px;
	}
</style>