<template>
  <div class="mod-demo-echarts">
    <el-alert
      title=""
      type="warning"
      :closable="false">
      <el-select v-model="value" placeholder="/a/b/0" @change="selectGet(item.name, item.value)">
        <el-option
          v-for="item in list"
          :key="item.name"
          :label="item.value"
          :value="item.name">
        </el-option>
      </el-select>
    </el-alert>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-card>
          <div id="J_chartLineBox0" class="chart-box"></div>
          <!-- <div :chartType="this.disableCategoryRatoType" :chartData="disableCategoryRatoData" :chartColor="disableCategoryRatoColor" :chartTitle="allValuaPortName"></div> -->
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <div id="J_chartLineBox1" class="chart-box"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <div id="J_chartBarBox" class="chart-box"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <div id="J_chartLineBox3" class="chart-box"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import echarts from 'echarts'
  import api from '@/fetch/api'
  export default {
    data () {
      return {
        chartLine: null,
        chartBar: null,
        chartPie: null,
        chartScatter: null,
        list: [],
        value: '',
        visualizes:[],
        options: {}
      }
    },
    computed: {
      sidebarFold: {
        get () { return this.$store.state.common.sidebarFold },
        set (val) { this.$store.commit('common/updateSidebarFold', val) }
      }
    },
    created () {

    },
    mounted () {
      if (!this.sidebarFold) {
        // set (true) { this.$store.commit('common/updateSidebarFold', val) }
        this.sidebarFold = !this.sidebarFold
      }
      setTimeout(() => {
        // this.initChartLine()
        // this.initChartBar()
        // this.initChartPie()
        // this.initChartScatter()
        this.queryList()
      }, 500)
    },
    activated () {
      // 由于给echart添加了resize事件, 在组件激活时需要重新resize绘画一次, 否则出现空白bug
      if (this.chartLine) {
        this.chartLine.resize()
      }
      if (this.chartBar) {
        this.chartBar.resize()
      }
      if (this.chartPie) {
        this.chartPie.resize()
      }
      if (this.chartScatter) {
        this.chartScatter.resize()
      }
    },
    methods: {
      // 折线图
      initChartLine () {
        var textStyle = {
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
            // c: {
            //   lineHeight: 16,
            //   fontSize: 12,
            //   color: '#151718'
            // }
          }
        }
        var option = {
          'title': {
            'text': '折线图堆叠'
          },
          'tooltip': {
            'trigger': 'axis'
          },
          'legend': {
            show: true,
            type: 'scroll',
            textStyle: {
              color: '#333'
            },
            // 'data': [ '邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎', '搜索引擎', '搜索引擎' ],
            data: [{
              name: '邮件营销'
            }, {
              name: '绑卡成功数（人）\n\n   ' + 2222 + '{a|↑}' + '22%',
              textStyle: textStyle
            }, {
              name: '绑卡失败数（人）\n\n   ' + 2222 + '{a|↑}' + '22%',
              textStyle: textStyle
            }, {
              name: '绑卡成功（率）\n\n   ' + 2222 + '{a|↑}' + '22%',
              textStyle: textStyle,
              icon: 'image://'
            }, {
              name: '搜索引擎'
            }, {
              name: '搜索引擎'
            }, {
              name: '搜索引擎'
            }],
            orient: 'horizontal', // 'vertical'
            x: '120', // 'center' | 'left' | {number},
            y: 'top', // 'center' | 'bottom' | {number}
            backgroundColor: '#fff',
            // borderColor: 'rgba(178,34,34,0.8)',
            // borderWidth: 4,
            padding: 0,    // [5, 10, 15, 20]
            itemGap: 20
            // textStyle: {color: 'red'}
          },
          'grid': {
            'left': '3%',
            'right': '4%',
            'bottom': '3%',
            'containLabel': true
          },
          // 'toolbox': {
          //   'feature': {
          //     'saveAsImage': { }
          //   }
          // },
          'xAxis': {
            'type': 'category',
            'boundaryGap': false,
            'data': [ '周一', '周二', '周三', '周四', '周五', '周六', '周日' ]
          },
          'yAxis': {
            'type': 'value'
          },
          'series': [
            {
              'name': '邮件营销',
              'type': 'line',
              'stack': '总量',
              'data': [ 120, 132, 101, 134, 90, 230, 210 ]
            },
            {
              name: '绑卡成功数（人）\n\n   ' + 2222 + '{a|↑}' + '22%',
              'type': 'line',
              'stack': '总量',
              'data': [ 220, 182, 191, 234, 290, 330, 310 ]
            },
            {
              name: '绑卡失败数（人）\n\n   ' + 2222 + '{a|↑}' + '22%',
              'type': 'line',
              'stack': '总量',
              'data': [ 150, 232, 201, 154, 190, 330, 410 ]
            },
            {
              name: '绑卡成功（率）\n\n   ' + 2222 + '{a|↑}' + '22%',
              'type': 'line',
              'stack': '总量',
              'data': [ 320, 332, 301, 334, 390, 330, 320 ]
            },
            {
              'name': '搜索引擎',
              'type': 'line',
              'stack': '总量',
              'data': [ 820, 932, 901, 934, 1290, 1330, 1320 ]
            }
          ]
        }
        this.chartLine = echarts.init(document.getElementById('J_chartLineBox0'))
        this.chartLine.setOption(option)
        window.addEventListener('resize', () => {
          this.chartLine.resize()
        })
      },
      // 柱状图
      initChartBar () {
        var option = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          legend: {
            data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎', '百度', '谷歌', '必应', '其他']
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
              data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
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
              data: [320, 332, 301, 334, 390, 330, 320]
            },
            {
              name: '邮件营销',
              type: 'bar',
              stack: '广告',
              data: [120, 132, 101, 134, 90, 230, 210]
            },
            {
              name: '联盟广告',
              type: 'bar',
              stack: '广告',
              data: [220, 182, 191, 234, 290, 330, 310]
            },
            {
              name: '视频广告',
              type: 'bar',
              stack: '广告',
              data: [150, 232, 201, 154, 190, 330, 410]
            },
            {
              name: '搜索引擎',
              type: 'bar',
              data: [862, 1018, 964, 1026, 1679, 1600, 1570],
              markLine: {
                lineStyle: {
                  normal: {
                    type: 'dashed'
                  }
                },
                data: [
                  [{ type: 'min' }, { type: 'max' }]
                ]
              }
            },
            {
              name: '百度',
              type: 'bar',
              barWidth: 5,
              stack: '搜索引擎',
              data: [620, 732, 701, 734, 1090, 1130, 1120]
            },
            {
              name: '谷歌',
              type: 'bar',
              stack: '搜索引擎',
              data: [120, 132, 101, 134, 290, 230, 220]
            },
            {
              name: '必应',
              type: 'bar',
              stack: '搜索引擎',
              data: [60, 72, 71, 74, 190, 130, 110]
            },
            {
              name: '其他',
              type: 'bar',
              stack: '搜索引擎',
              data: [62, 82, 91, 84, 109, 110, 120]
            }
          ]
        }
        this.chartBar = echarts.init(document.getElementById('J_chartBarBox'))
        this.chartBar.setOption(option)
        window.addEventListener('resize', () => {
          this.chartBar.resize()
        })
      },
      // 饼状图
      initChartPie () {
        var option = {
          backgroundColor: '#2c343c',
          title: {
            text: 'Customized Pie',
            left: 'center',
            top: 20,
            textStyle: {
              color: '#ccc'
            }
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          visualMap: {
            show: false,
            min: 80,
            max: 600,
            inRange: {
              colorLightness: [0, 1]
            }
          },
          series: [
            {
              name: '访问来源',
              type: 'pie',
              radius: '55%',
              center: ['50%', '50%'],
              data: [
                { value: 335, name: '直接访问' },
                { value: 310, name: '邮件营销' },
                { value: 274, name: '联盟广告' },
                { value: 235, name: '视频广告' },
                { value: 400, name: '搜索引擎' }
              ].sort(function (a, b) { return a.value - b.value }),
              roseType: 'radius',
              label: {
                normal: {
                  textStyle: {
                    color: 'rgba(255, 255, 255, 0.3)'
                  }
                }
              },
              labelLine: {
                normal: {
                  lineStyle: {
                    color: 'rgba(255, 255, 255, 0.3)'
                  },
                  smooth: 0.2,
                  length: 10,
                  length2: 20
                }
              },
              itemStyle: {
                normal: {
                  color: '#c23531',
                  shadowBlur: 200,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              },
              animationType: 'scale',
              animationEasing: 'elasticOut',
              animationDelay: function (idx) {
                return Math.random() * 200
              }
            }
          ]
        }
        this.chartPie = echarts.init(document.getElementById('J_chartPieBox'))
        this.chartPie.setOption(option)
        window.addEventListener('resize', () => {
          this.chartPie.resize()
        })
      },
      // 获取列表
      queryList () {
        this.$http({
          url: api.screenList,
          method: 'post',
          data: {
            "data": {
              "dashboardId": 1,
              "dashboardSelection": [{
                "name": "dashBoard过滤策略",
                "type": "dashBoard",
                "placeholder": "${creditPath}",
                "items": [{
                    "name": "/a/b/0",
                    "value": "/a/b/0"
                  },
                  {
                    "name": "/a/b/1",
                    "value": "/a/b/1"
                  }
                ]
              }],
              "visualizeId": 1,
              "visualizeSelection": [{
                "name": "visualize过滤策略",
                "type": "visualize",
                "placeholder": "${strategy}",
                "items": [{
                    "name": "8,5,29",
                    "value": "8,5,29"
                  },
                  {
                    "name": "8,5,29,3",
                    "value": "8,5,29,3"
                  }
                ]
              }]
            },
            "header": {
              "lat": 0.0,
              "lng": 0.0,
              "t": 1568975236544,
              "traceId": "59235c9c-0dcb-49ee-8c07-acf45b61d913"
            }
          }
        }).then(response => {
          let res = response.data
          if (res.status == 1) {
            //  res.data.visualizes.forEach((tem,index) => {
            //     console.log(tem)
            //     console.log('index', index)
            //     this.disableCategoryRatoData[index].push(tem)
            //     this.disableCategoryRatoType[index].push(tem.title.text)
            // })
            this.list = res.data.selection[0].items
            console.log('options', this.options)
            if (res.data.visualizes) {
              res.data.visualizes.forEach((tem,index) => {
                let label = 'J_chartLineBox'  + index
                this.chartPie = echarts.init(document.getElementById(label))
                this.chartPie.setOption(tem)
                window.addEventListener('resize', () => {
                  this.chartPie.resize()
                })
              })
            }
          }
        })
      },
      selectGet () {
        console.log('修改',  this.value)
      }
    }
  }
</script>

<style lang="scss">
  .mod-demo-echarts {
    > .el-alert {
      margin-bottom: 10px;
    }
    > .el-row {
      margin-top: -10px;
      margin-bottom: -10px;
      .el-col {
        padding-top: 10px;
        padding-bottom: 10px;
      }
    }
    .chart-box {
      min-height: 400px;
    }
  }
</style>
