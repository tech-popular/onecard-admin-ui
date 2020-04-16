<template>
  <el-dialog
      title="授权详情"
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="handleClose">
      <p>{{checkedCities}}</p>
    </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      dialogVisible: false,
      checkedCities: []
    }
  },
  components: {
  },
  methods: {
    init (val) {
      this.dialogVisible = true
      // this.checkedCities = val.grantResultJson.filter(item => item.type !== '项目空间添加用户')
      this.checkedCities = val.grantResultJson
    },

    // 弹窗状态
    handleClose () {
      this.dialogVisible = false
      this.checkedCities = []
    }
  }
}
</script>
<style scoped>
</style>>
