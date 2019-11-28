<template>
  <el-row :gutter="20" v-loading="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.1)">
    <el-col v-for="item in num" :key="item" class="echartList" :span="12">
      <el-card>
        <div :id="'mock' + item" class="chart-box"></div>
      </el-card>
    </el-col>
  </el-row>
</template>
<script>
import echarts from 'echarts'
export default {
  data () {
    return {
      num: 4,
      loading: true,
      option: {
        color: ['rgb(221, 221, 221)'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '直接访问',
            type: 'bar',
            barWidth: '60%',
            data: [10, 52, 200, 334, 390, 330, 220, 123, 167, 190, 156, 245]
          }
        ]
      }
    }
  },
  mounted () {
    for (let i = 1; i <= this.num; i++) {
      const chart = echarts.init(document.getElementById('mock' + i))
      chart.setOption(this.option, true)
    }
  }
}
</script>
<style lang="scss">
.mod-demo-echarts {
  .el-card__body {
    padding: 10px;
    color: rgb(221, 221, 221);
  }
  .chart-box {
    min-height: 400px;
  }
  .lineCharts {
    min-height: 200px;
  }
  .echartList {
    position: relative;
  }
  .selectList {
    position: absolute;
    width: 40%;
    top: 5px;
    left: 57%;
    z-index: 9;
  }
}
li {
  list-style: none;
}
</style>
