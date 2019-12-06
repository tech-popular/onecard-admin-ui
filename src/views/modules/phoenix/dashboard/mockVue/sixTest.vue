<template>
  <div
    class="monitor"
    v-loading="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.1)"
  >
    <div class="monitorLeft">
      <div :key="item" v-for="item in num"></div>
    </div>
    <div class="monitorRight">
      <div class="monitorRightList" :key="item" v-for="item in nums">
        <div :id="'mock' + item" class="barCharts"></div>
      </div>
    </div>
  </div>
</template>
<script>
import echarts from 'echarts'
export default {
  data () {
    return {
      num: 2,
      nums: 4,
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
            data: [ '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20' ],
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
            data: [10, 52, 200, 334, 390, 330, 220, 123, 167, 190, 156, 245, 123, 167, 190, 156, 245, 190, 156, 245]
          }
        ]
      }
    }
  },
  mounted () {
    for (let i = 1; i <= this.nums; i++) {
      const chart = echarts.init(document.getElementById('mock' + i))
      chart.setOption(this.option, true)
    }
  }
}
</script>
<style lang="scss">
li {
  list-style: none;
}

.colorRed {
  color: red;
}
.percentRise {
  color: green;
}

.monitor {
  width: 100%;
  margin-top: 20px;
  display: flex;
  .monitorLeft {
    flex: 1;
    & > div {
      border-radius: 10px;
      margin: 40px 20px;
      background: #ccc;
      text-align: center;
      padding: 100px 7px;
      height: 300px;
      div {
        font-size: 12px;
        line-height: 12px;
        margin-bottom: 10px;
      }
    }
  }
  .monitorRight {
    flex: 7;
    .monitorRightList {
      margin: 20px;
      width: 46%;
      display: inline-block;
      position: relative;
      box-sizing: border-box;
    }
    .barCharts {
      min-height: 300px;
      max-height: 300px;
    }
  }
}
.allChecked {
  position: absolute;
  top: 0;
  left: 50%;
  background: #f1675d;
  color: #fff;
  border: none;
  border-radius: 5px;
}
.monitorSelectList {
  position: absolute;
  width: 200px;
  top: -8px;
  left: 160px;
  z-index: 9;
}
</style>