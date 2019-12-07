import { fprice, getChinese } from '@/utils'
// echarts 基础配置
export const chartsConfig = {
  // 设置标签名字样式
  textStyle: {
    padding: [0, 15, 0, 0],
    rich: {
      a: {
        color: 'green',
        fontWeight: 600,
        fontSize: 16,
        lineHeight: 10,
        padding: [0, 0, 0, 5]
      },
      b: {
        color: 'red',
        fontWeight: 600,
        fontSize: 16,
        lineHeight: 10,
        padding: [0, 0, 0, 5]
      },
      c: {
        fontSize: 10.5,
        color: '#000'
      },
      d: {
        fontSize: 12,
        fontWeight: 700,
        color: 'green'
      },
      e: {
        fontSize: 12,
        fontWeight: 700,
        color: 'red'
      },
      f: {
        padding: [5, 0, 5, 0]
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
    position: function (point, params, dom, rect, size) {
      // 鼠标坐标和提示框位置的参考坐标系是：以外层div的左上角那一点为原点，x轴向右，y轴向下
      // 提示框位置
      var x = 0 // x坐标位置
      var y = 0 // y坐标位置
      // 当前鼠标位置
      var pointX = point[0]
      var pointY = point[1]

      // 外层div大小
      // var viewWidth = size.viewSize[0];
      // var viewHeight = size.viewSize[1];
      // 提示框大小
      var boxWidth = size.contentSize[0]
      var boxHeight = size.contentSize[1]

      // boxWidth > pointX 说明鼠标左边放不下提示框
      if (boxWidth > pointX) {
        x = 5
      } else { // 左边放的下
        x = pointX - boxWidth
      }
      // boxHeight > pointY 说明鼠标上边放不下提示框
      if (boxHeight > pointY) {
        y = 5
      } else { // 上边放得下
        y = pointY - boxHeight
      }
      return [x, y]
    },
    axisPointer: {
      type: 'cross',
      label: {
        backgroundColor: '#283b56'
      }
    },
    formatter: params => {
      var result = params[0].axisValue
      params.map((item, i) => {
        if (item.value || item.seriesName.indexOf('昨日') !== -1 || item.seriesName.indexOf('今日') !== -1) {
          result +=
          '<br/><span style="position:relative;left:0;top:-1px;display:inline-block;margin-right:5px;border-radius:  px;width:10px;height:10px;background:' +
          item.color +
          '"></span><span style="color:#fff;">' +
          getChinese(item.seriesName) +
          '</span> : ' +
          fprice(item.value, 0) +
          '</span>'
        }
      })
      return result
    }
  },
  color: ['#FF4040', '#634cff', '#febe76', '#31c5d3', '#f1675d', '#f6e58d', '#686ee0', '#99ce7e', '#b466f0', '#f7b500', '#48a37a'
  ]
}
