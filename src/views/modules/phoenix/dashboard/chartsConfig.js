import { fprice, getChinese } from '@/utils'
// echarts 基础配置
export const chartsConfig = {
  // 设置标签名字样式
  textStyle: {
    rich: {
      a: {
        color: 'green',
        fontWeight: 600,
        fontSize: 16,
        lineHeight: 10
      },
      b: {
        color: 'red',
        fontWeight: 600,
        fontSize: 16,
        lineHeight: 10
      }
    }
  },
  // 设置柱状样式
  grid: {
    top: '90',
    right: '0',
    bottom: '0',
    left: '0',
    containLabel: true
  },
  // 设置标签样式
  legend: {
    type: 'scroll',
    top: '12%',
    backgroundColor: '#fff',
    padding: 0,
    itemGap: 0
  },
  title: {
    top: 'top',
    left: 'left'
  },
  xAxis: {
    axisLabel: {
      show: true,
      interval: 0, // {number} 0为全部显示
      rotate: 60
    },
    axisTick: {
      alignWithLabel: true,
      interval: 0,
      rotate: -30,
      margin: -15
    }
  },
  tooltip: {
    // 工具框
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      label: {
        backgroundColor: '#283b56'
      }
    },
    formatter: params => {
      var result = params[0].axisValue
      params.map((item, i) => {
        result +=
          '<br/><span style="position:relative;left:0;top:-1px;display:inline-block;margin-right:5px;border-radius:  px;width:10px;height:10px;background:' +
          item.color +
          '"></span><span style="color:#fff;">' +
          getChinese(item.seriesName) +
          '</span> : ' +
          fprice(item.value, 0) +
          '人</span>'
      })
      return result
    }
  },
  color: ['#FF4040', '#634cff', '#febe76', '#31c5d3', '#f1675d', '#f6e58d', '#686ee0', '#99ce7e', '#b466f0', '#f7b500', '#48a37a'
  ]
}
