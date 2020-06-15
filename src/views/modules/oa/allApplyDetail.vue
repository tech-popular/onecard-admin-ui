<template>
  <el-dialog
      title="授权详情"
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="handleClose">
      <p>失败原因：{{checkedCities}}</p>
      <p @click="see(aliUrl)"><a style="cursor:pointer">点击查看错误码对照表</a></p>
    </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      dialogVisible: false,
      checkedCities: [],
      aliUrl: 'https://error-center.aliyun.com/status/product/Ram?spm=a2c4g.11186623.2.13.32143215SY7Iiv'
    }
  },
  components: {
  },
  methods: {
    init (val) {
      this.dialogVisible = true
      this.checkedCities = val.grantResultJson
    },
    // 查看对照表
    see (e) {
      window.open(e, '_blank')
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
