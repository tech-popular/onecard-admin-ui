<template>
  <el-dialog title="查看" :modal-append-to-body='false' :append-to-body="true" :close-on-click-modal="false" :visible.sync="visible">
    <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;">
      <el-table-column prop="redis" header-align="center" align="center" label="REDIS"></el-table-column>
      <el-table-column prop="es" header-align="center" align="center" label="ES"></el-table-column>
    </el-table>
    <div slot="footer">
      <el-button type="primary" @click="dataSubmit">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  data () {
    return {
      dataList: [],
      dataListLoading: false,
      visible: false
    }
  },
  methods: {
    init () {
      this.visible = true
    },
    dataSubmit () {
      this.visible = false
    }
  }
}
</script>
