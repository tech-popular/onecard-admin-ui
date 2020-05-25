<template>
  <div>
    <el-dialog title="统计分析" :modal-append-to-body='false' :append-to-body="true" :close-on-click-modal="false" :visible.sync="visible" width="1200px">
      <div class="btn-group">
        <el-button @click="exportDataClick">导出</el-button>
        <el-button type="primary" @click="moreClick">查看更多</el-button>
      </div>
      <div class="chart-group">
        <el-card class="chart-left">
          <div id="chartIdOne"></div>
        </el-card>
        <el-card class="chart-right">
          <div id="chartIdTwo"></div>
        </el-card>
      </div>
      <div slot="footer">
        <el-button type="primary" @click="cancel">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import echarts from 'echarts'
import { scChartOption } from '../assets/js/scChartOption'
export default {
  data () {
    return {
      visible: false
    }
  },
  methods: {
    init () {
      this.visible = true
      this.$nextTick(() => {
        let chartOne = null
        const docuOne = document.getElementById('chartIdOne')
        chartOne = echarts.init(docuOne)
        chartOne.setOption(scChartOption())

        let chartTwo = null
        const docuTwo = document.getElementById('chartIdTwo')
        chartTwo = echarts.init(docuTwo)
        chartTwo.setOption(scChartOption())
      })
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
  .chart-group {
    width: 100%;
    overflow: hidden;
    margin-top: 30px;
  }
  .chart-left, .chart-right {
    width: 49%;
    float: left;
  }
  .chart-right {
    margin-left: 2%;
  }
  #chartIdOne, #chartIdTwo {
    width: 100%;
    height: 500px;
  }
</style>
