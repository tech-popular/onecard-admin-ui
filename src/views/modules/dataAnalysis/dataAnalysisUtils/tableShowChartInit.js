export const pieJson = {
  id: 0,
  title: {
    show: true,
    text: ''
  },
  legend: {
    orient: 'vertical',
    right: '0',
    top: '0',
    itemGap: 10,
    itemWidth: 10,
    itemHeight: 10,
    data: [],
    textStyle: {
      color: '#666'
    }
  },
  tooltip: {
    trigger: 'item',
    axisPointer: {
      type: 'cross',
      crossStyle: {
        color: '#fff'
      }
    },
    formatter: '{b} : {c},  {d}%'
  },
  // color: ['#FD866A', '#FFC175', '#59CBDD', '#A3D47D', '#5C62E6'],
  color: [
    '#e75840', '#929fff', '#50c48f', '#f7b13f', '#ffa897',
    '#7dc3fe', '#af87fe', '#bb60b2', '#433e7c', '#f47a75',
    '#009db2', '#024b51', '#0780cf', '#765005', '#26ccd8',
    '#3685fe', '#9977ef', '#f5616f', '#f9e264', '#9de0ff'
  ],
  series: [
    {
      name: '',
      type: 'pie',
      radius: '50%',
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      },
      data: []
    }
  ],
  yAxis: null
}

export const barJson = {
  title: {
    show: true,
    text: ''
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    },
    formatter: '{b} : {c}'
  },
  legend: {
    right: '0',
    top: '0',
    itemWidth: 10,
    itemHeight: 10,
    textStyle: {
      color: '#666'
    }
  },
  grid: [
    {
      top: 100,
      bottom: 101
    },
    {
      height: 60,
      bottom: 40
    }
  ],
  xAxis: [{
    type: 'category',
    data: [],
    gridIndex: 0,
    axisLabel: {
      color: '#333'
    },
    axisLine: {
      lineStyle: {
        color: '#e7e7e7'
      }
    },
    axisTick: {
      lineStyle: {
        color: '#e7e7e7'
      }
    },
    zlevel: 2
  }, {
    type: 'category',
    gridIndex: 1,
    axisLine: {
      show: false
    },
    zlevel: 1
  }],
  yAxis: [{
    type: 'value',
    gridIndex: 0,
    axisLabel: {
      color: '#333'
    },
    splitLine: {
      lineStyle: {
        type: 'dashed'
      }
    },
    axisLine: {
      lineStyle: {
        color: '#ccc'
      }
    },
    axisTick: {
      lineStyle: {
        color: '#ccc'
      }
    }
  }, {
    type: 'value',
    gridIndex: 1,
    axisLabel: {
      show: false
    },
    axisLine: {
      show: false
    },
    splitLine: {
      show: false
    },
    axisTick: {
      show: false
    }
  }],
  series: [{
    type: 'bar',
    data: [],
    name: '',
    label: {
      show: true,
      position: 'top',
      textStyle: {
        color: '#555'
      }
    },
    itemStyle: {
      normal: {
        color: '#1F78B4'
      }
    },
    xAxisIndex: 0,
    yAxisIndex: 0
  }]
}
