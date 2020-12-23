<template>
	<el-dialog
    title="操作权限分配"
    :close-on-click-modal="false"
    :visible.sync="visible">
		<span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
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
    dataFormSubmit() {
      // 提交数据
    }
  }
}
</script>