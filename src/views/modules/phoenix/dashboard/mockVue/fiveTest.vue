<template>
  <el-row :gutter="20" v-loading="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.1)">
    <el-col v-for="item in num" :key="item" class="echartList funnelStyle" :span="12">
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
      num: 3,
      loading: true,
      option: {
        color: ['rgb(221, 221, 221)'],
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c}%'
        },
        calculable: true,
        series: [
          {
            name: '漏斗图',
            type: 'funnel',
            left: '10%',
            top: 60,
            bottom: 60,
            width: '80%',
            min: 0,
            max: 100,
            minSize: '0%',
            maxSize: '100%',
            sort: 'descending',
            gap: 2,
            label: {
              show: true,
              position: 'inside'
            },
            labelLine: {
              length: 10,
              lineStyle: {
                width: 1,
                type: 'solid'
              }
            },
            itemStyle: {
              borderColor: '#fff',
              borderWidth: 1
            },
            emphasis: {
              label: {
                fontSize: 20
              }
            },
            data: [
                {value: 60, name: '1'},
                {value: 40, name: '2'},
                {value: 20, name: '3'},
                {value: 80, name: '4'},
                {value: 100, name: '5'}
            ]
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
