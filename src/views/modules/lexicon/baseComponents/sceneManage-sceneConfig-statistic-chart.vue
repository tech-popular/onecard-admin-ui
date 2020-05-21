<template>
  <div>
    <el-dialog title="统计分析" :modal-append-to-body='false' :append-to-body="true" :close-on-click-modal="false" :visible.sync="visible" width="900px">
      <div class="btn-group">
        <el-button @click="exportDataClick">导出</el-button>
        <el-button type="primary" @click="moreClick">查看更多</el-button>
      </div>
      <el-row>
        <el-col :span="12">
          <div id="chartIdOne"></div>
        </el-col>
        <el-col :span="12">
          <div id="chartIdTwo"></div>
        </el-col>
      </el-row>
      <div slot="footer">
        <el-button type="primary" @click="cancel">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
// import echarts from 'echarts'
// import { scChartOption } from '../assets/js/scChartOption'
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
    exportDataClick () { // 导出
      console.log(3)
    },
    moreClick () { // 查看更多
      console.log('more')
    },
    cancel () {
      this.visible = false
    }
  }
}
</script>
<style scoped>
  .btn-group {
    text-align: right;
  }
</style>
