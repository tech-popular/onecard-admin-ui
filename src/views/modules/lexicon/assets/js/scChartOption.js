export const chartOption = (timesArray, CONFIG) => {
  return {
    animation: true,
    tooltip: { // 鼠标悬浮时显示提示框浮层
      trigger: 'axis', // 坐标轴触发，主要在柱状图，折线图等会使用类目轴的图表中使用。
      show: true
    },
    grid: { // 配置整个表格
      left: '0%',
      top: '5%',
      width: 'auto',
      height: 'auto',
      containLabel: true
    },
    xAxis: {
      type: 'category', // time
      axisLine: { // x轴线样式
        lineStyle: {
          color: '#fff',
          width: '2'
        }
      },
      position: 'bottom',
      boundaryGap: false,
      axisTick: { // x轴刻度样式
        show: false
      },
      axisLabel: { // x轴刻度标签样式
        fontSize: 20,
        margin: 15,
        inside: false,
        interval: 15
      },
      data: timesArray
    },
    yAxis: {
      show: true,
      boundaryGap: false, // 可解决最大值溢出画布的问题
      // max:8000,
      axisLine: { // y轴线是否显示
        show: false
      },
      axisTick: { // y轴刻度样式
        show: false
      },
      axisLabel: { // y轴刻度标签样式
        show: true,
        margin: 50,
        formatter: ''
      },
      nameTextStyle: {
        width: 0,
        color: 'red',
        padding: [0, 0, 0, 20]
      },
      splitLine: { // 坐标轴在 grid 区域中的分隔线。
        show: true,
        lineStyle: {
          color: 'rgba(89,144,241,0.4)',
          width: 2
        }
      }
    },
    series: [{
      name: '全部',
      type: 'line',
      data: CONFIG.totalLineArr,
      smooth: true,
      lineStyle: {
        normal: {
          color: '#fff',
          width: 2.5,
          shadowColor: '#fff',
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowOffsetY: 0
        }
      },
      itemStyle: { // 设置圆点的样式
        normal: {
          color: '#fff',
          shadowBlur: 20,
          shadowColor: '#fff'
        }
      }
    }, {
      name: '钱包',
      type: 'line',
      data: CONFIG.qbLineArr,
      smooth: true,
      lineStyle: {
        normal: {
          color: '#649cff',
          width: 2.5,
          shadowColor: '#649cff',
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowOffsetY: 0
        }
      },
      itemStyle: {
        normal: {
          color: '#649cff',
          shadowBlur: 20,
          shadowColor: '#649cff'
        }
      }
    }, {
      name: '悟空',
      type: 'line',
      data: CONFIG.wkLineArr,
      smooth: true,
      lineStyle: {
        normal: {
          color: '#24e3c6',
          width: 2.5,
          shadowColor: '#24e3c6',
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowOffsetY: 0
        }
      },
      itemStyle: {
        normal: {
          color: '#24e3c6',
          shadowBlur: 20,
          shadowColor: '#24e3c6'
        }
      }
    }]
  }
}
