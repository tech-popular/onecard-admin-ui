export const scChartOption = () => { // timesArray, CONFIG
  return {
    title: {
      text: '场景名称：首页推荐PV_CRT(%)'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['IOS', 'ADR', 'H5'],
      left: 'center',
      bottom: 'bottom'
    },
    grid: {
      top: 'middle',
      left: '3%',
      right: '4%',
      bottom: '3%',
      height: '80%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['5月8日', '5月9日', '5月10日', '5月11日', '5月12日', '5月13日', '5月14日', '5月15日', '5月16日', '5月17日', '5月18日']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: 'IOS',
        type: 'line',
        stack: '总量',
        data: [120, 132, 101, 134, 90, 230, 210, 132, 101, 134, 90]
      },
      {
        name: 'ADR',
        type: 'line',
        stack: '总量',
        data: [220, 182, 191, 234, 290, 330, 310, 132, 101, 134, 90]
      },
      {
        name: 'H5',
        type: 'line',
        stack: '总量',
        data: [150, 232, 201, 154, 190, 330, 410, 182, 191, 234, 290]
      }
    ]
  }
}
