<template>
  <el-dialog
      title="授权详情"
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="handleClose">
      <el-form label-width="160px">
        <el-form-item label="授权:">
          <el-tag
            style="margin-left:10px;"
            v-for="tag in checkedCities"
            :key="tag.type"
            :type="tag.type"
          >{{tag.type}}</el-tag>
        </el-form-item>
        <el-form-item label="授权状态:">
          <el-tag
            style="margin-left:10px;"
            v-for="tag in checkedCities"
            :key="tag.flag"
            :type="tag.flag === false ? 'danger' : 'success' "
          >{{tag.flag}}</el-tag>
          <!-- <span>{{checkedCities.flag}}</span> -->
        </el-form-item>
        <el-form-item label="失败原因:">
          <span v-for="item in checkedCities" :key="item.desc">{{item.desc}}</span>
        </el-form-item>
      </el-form>
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
      this.checkedCities = val.grantResultJson.filter(item => item.type !== '项目空间添加用户')
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
