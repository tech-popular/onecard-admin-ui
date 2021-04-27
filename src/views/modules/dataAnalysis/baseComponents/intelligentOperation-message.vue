<template>
	<el-dialog
	width="30%"
	:visible="visible"
  title="模板编辑"
  :append-to-body="true"
  @close="closed"
	>
	 模板编辑
	</el-dialog>
</template>
<script>
export default {
  data () {
    return {
      visible: false
    }
  },
  methods: {
    init () {
      this.visible = true
    },
    closed () {
      this.visible = false
    }
  }
}
</script>