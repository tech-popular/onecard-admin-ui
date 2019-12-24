<template>
  <el-drawer
    title="标题"
    :append-to-body="false"
    :visible.sync="visible"
  >
    <span>我来啦!</span>
  </el-drawer>
</template>
<script>
export default {
  data () {
    return {
      visible: false
    }
  },
  methods: {
    init (row, tag) {
      this.visible = true
      console.log(this.visible)
    }
  }
}
</script>
