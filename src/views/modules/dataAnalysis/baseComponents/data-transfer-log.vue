<template>
  <el-dialog title="历史日志下发" :modal-append-to-body='false' :append-to-body="true" :close-on-click-modal="false" :visible.sync="visible" width="600px">
  <el-table :data="dataList" border style="width: 100%;">
    <el-table-column prop="id" header-align="center" align="center" label="序号"></el-table-column>
    <el-table-column prop="englishName" header-align="center" align="center" label="下发数据源"></el-table-column>
    <el-table-column prop="chineseName" header-align="center" align="center" label="最近下发时间"></el-table-column>
    <el-table-column prop="fieldType" header-align="center" align="center" label="下发用户数"></el-table-column>
    <el-table-column prop="categoryId" header-align="center" align="center" label="下发类型"></el-table-column>
  </el-table>
  <div class="footer">
    <el-button type="default" @click="cancelHandle" size="small">关闭</el-button>
  </div>
  </el-dialog>
</template>
<script>
export default {
  data () {
    return {
      visible: false,
      dataList: []
    }
  },
  methods: {
    init () {
      this.visible = true
    },
    cancelHandle () {
      this.visible = false
    }
  }
}
</script>
<style scoped>
  .footer {
    margin-top: 20px;
    text-align: right;
  }
</style>
