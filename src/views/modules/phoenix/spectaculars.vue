<template>
  <div class="mod-demo-echarts">
    <el-alert
      title=""
      type="warning"
      :closable="false">
      <el-select v-model="value" placeholder="预授信（常规黑指）" @change="selectGet()">
        <el-option
          v-for="item in list"
          :key="item.name"
          :label="item.value"
          :value="item.name">
        </el-option>
      </el-select>
    </el-alert>

    <el-row :gutter="20">
      <el-col  v-for="(outdata, index) in arr" :key="index" :span="12"  class='echartList'>
        <el-card>
          <el-select v-model="value1" class='selectList' multiple placeholder="全部" v-show="outdata" @visible-change="changeValue1()" @remove-tag="changeTag()">
            <el-option
              v-for="item in selection"
              :key="item.name"
              :label="item.value"
              :value="item.name">
            </el-option>
          </el-select>
          <div :id="'J_chartLineBox' + index" class="chart-box"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import echarts from 'echarts'
  // import api from '@/fetch/api'
  export default {
    data () {
      return {
        props: { multiple: true },
        chartLine: null,
        chartBar: null,
        chartPie: null,
        chartScatter: null,
        list: [],
        value: '预授信（常规黑指）',
        value1: '',
        visualizes: [],
        arr: [], // 有几个图表
        legend: { // 设置标签样式
          type: 'scroll',
          top: '12%',
          backgroundColor: '#fff',
          padding: 0,
          itemGap: 0
        },
        grid: { // 设置柱状样式
          top: '90',
          right: '0',
          bottom: '0',
          left: '0',
          containLabel: true
        },
        textStyle: { // 设置标签名字样式
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
        title: {
          top: 'top',
          left: 'left'
        },
        color: ['#FF4040', '#634cff', '#febe76', '#31c5d3', '#f1675d', '#f6e58d', '#686ee0', '#99ce7e', '#b466f0', '#f7b500', '#48a37a'],
        visibleChange: false,
        apiItems: [],
        visualizeId: 1, // 图表筛选框
        selection: []
      }
    },
    computed: {
      sidebarFold: {
        get () { return this.$store.state.common.sidebarFold },
        set (val) { this.$store.commit('common/updateSidebarFold', val) }
      }
    },
    watch: {
      arr (oldValue, newValue) {
        console.log(newValue)
      }
    },
    created () {
    },
    mounted () {
      if (!this.sidebarFold) {
        // set (true) { this.$store.commit('common/updateSidebarFold', val) }
        this.sidebarFold = !this.sidebarFold
      }
      this.queryList()
    },
    activated () {
      // 由于给echart添加了resize事件, 在组件激活时需要重新resize绘画一次, 否则出现空白bug
      if (this.chartPie) {
        this.chartPie.resize()
      }
    },
    methods: {
      getChinese (name) {
        let names = name.split('\n')[0]
        names = names.trim()
        return names
      },
      fprice (s, n) {
        s = parseFloat((s + '').replace(/[^\d.-]/g, '')).toFixed(n) + ''
        let l = s.split('.')[0].split('').reverse()
        let r = s.split('.')[1]
        let t = ''
        for (let i = 0; i < l.length; i++) {
          t += l[i] + ((i + 1) % 3 === 0 && (i + 1) !== l.length ? ',' : '')
        }
        if (n === 0) {
          return t.split('').reverse().join('')
        } else {
          return t.split('').reverse().join('') + '.' + r
        }
      },
      // 获取列表
      queryList () {
        this.$http({
          url: this.$http.adornUrl('/phoenix/dashboard'),
          method: 'post',
          data: {
            data: {
              dashboardId: 1,
              dashboardSelection: [{
                name: 'dashBoard过滤策略',
                type: 'dashBoard',
                placeholder: '\\{creditCondition\\}',
                items: [{
                  name: this.value,
                  value: this.value
                }]
              }],
              visualizeId: this.visualizeId,
              visualizeSelection: [{
                name: 'visualize过滤策略',
                type: 'visualize',
                placeholder: '\\{notifyCondition\\}',
                items: this.value1 ? this.apiItems : []
              }]
            },
            header: {
              lat: 0.0,
              lng: 0.0,
              t: 1568975236544,
              traceId: '59235c9c-0dcb-49ee-8c07-acf45b61d913'
            }
          }
        }).then(({data}) => {
          let res = data.response
          if (res.status == '1') {
            this.list = res.data.selection[0].items // 下拉列表选项
            if (res.data.visualizes) { // 图标列表
              res.data.visualizes.forEach((tem, index) => {
                this.arr.push(tem.selection[0])
                tem['grid'] = this.grid
                tem['color'] = this.color
                Object.assign(tem.title, this.title)
                Object.assign(tem.legend, this.legend)
                if (tem.xAxis) {
                  Object.assign(tem.xAxis, this.xAxis)
                }
                if (tem.type == 'bar') { // 折现柱状
                  for (let i = 0; i < tem.series.length; i++) {
                    if (tem.legend.data) {
                      if (tem.legend.data[i].metric) {
                        if (tem.series) {
                          var seriesNameElse = tem.series[i].name + '\n\n ' + tem.legend.data[i].metric + tem.legend.data[i].metric_unit + (tem.legend.data[i].percentRise ? '{a|↑}' : '{b|↓}') + tem.legend.data[i].percent + tem.legend.data[i].percent_unit
                          tem.series[i].name = seriesNameElse
                          if (!tem.series[i].data) {
                            tem.legend.data[i]['icon'] = 'image://'
                          }
                        }
                      }
                    }
                  }
                  for (let i = 0; i < tem.legend.data.length; i++) {
                    if (tem.legend.data[i].metric) {
                      var legendNameElse = tem.legend.data[i].name + '\n\n ' + tem.legend.data[i].metric + tem.legend.data[i].metric_unit + (tem.legend.data[i].percentRise ? '{a|↑}' : '{b|↓}') + tem.legend.data[i].percent + tem.legend.data[i].percent_unit
                      tem.legend.data[i].name = legendNameElse
                      tem.legend.data[i].textStyle = this.textStyle
                    }
                  }
                  var tooltip = { // 工具框
                    trigger: 'axis',
                    axisPointer: {
                      type: 'cross',
                      label: {
                        backgroundColor: '#283b56'
                      }
                    },
                    formatter: (params) => {
                      var result = params[0].axisValue
                      params.map((item, i) => {
                        result += '<br/><span style="position:relative;left:0;top:-1px;display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background:' + item.color + '"></span><span style="color:#fff;">' + this.getChinese(
                          item.seriesName) + '</span> : ' + this.fprice(item.value, 0) + '人</span>'
                      })
                      return result
                    }
                  }
                  tem['tooltip'] = tooltip
                } else if (tem.type == 'pie') { // 饼图
                  for (let i = 0; i < tem.legend.data.length; i++) {
                    var legendName = tem.legend.data[i].name + '\n\n ' + tem.legend.data[i].metric + tem.legend.data[i].metric_unit + (tem.legend.data[i].percentRise ? '{a|↑}' : '{b|↓}') + tem.legend.data[i].percent + tem.legend.data[i].percent_unit
                    tem.legend.data[i].name = legendName
                    tem.legend.data[i].textStyle = this.textStyle
                  }
                  if (tem.series[0]) {
                    for (let i = 0; i < tem.legend.data.length; i++) {
                      if (tem.series[0].data) {
                        var seriesName = tem.series[0].data[i].name + '\n\n ' + (tem.legend.data[i].metric ? tem.legend.data[i].metric : '') + tem.legend.data[i].metric_unit + (tem.legend.data[i].percentRise ? '{a|↑}' : '{b|↓}') + tem.legend.data[i].percent + tem.legend.data[i].percent_unit
                        tem.series[0].data[i].name = seriesName
                      }
                    }
                    if (tem.series[0].type == 'pie') {
                      var center = ['50%', '65%'] // 设置饼图大小
                      var radius = '60%'
                      tem.series[0]['center'] = center
                      tem.series[0]['radius'] = radius
                    }
                  }
                } else if (tem.type == 'funnel') { // 漏斗
                  tem.series[0].left = '25%'
                  tem.series[0].width = '50%'

                  tem.series[0].data.forEach((item, index) => {
                    item.name = `${item.name}  ${item.value}人  ${item.percentRise ? '↑' : '↓'}  ${item.percent}%`
                  })

                  tem.tooltip.formatter = '{a}<br/>{b}'

                  tem.legend.data.forEach((item, index) => {
                    tem.legend.data[index] = `${item.name}</br>`
                  })
                  console.log(tem.legend.data)
                } else if (tem.type == 'radar') { // 雷达
                } else if (tem.type == 'pies') { // 饼图嵌套
                  tem.series[0].radius = ['40%', '55%']
                  tem.series[1].radius = ['0%', '30%']
                }
                if (tem.selection[0]) {
                  this.selection = tem.selection[0].items
                  this.visualizeId = tem.id
                }
                let label = 'J_chartLineBox' + index
                setTimeout(() => {
                  this.chartPie = echarts.init(document.getElementById(label))
                  this.chartPie.setOption(tem, true)
                  window.addEventListener('resize', () => {
                    this.chartPie.resize()
                  })
                }, 500)
              })
            }
          }
        })
      },
      selectGet () {
        this.arr = []
        this.apiItems = []
        this.value1 = ''
        this.queryList()
      },
      changeValue1 () {
        if (this.visibleChange) {
          this.value1.forEach((tem, index) => {
            var obj = {}
            obj.name = tem
            obj.value = tem
            this.apiItems.push(obj)
          })
          this.arr = []
          this.queryList()
          this.visibleChange = false
        } else {
          this.visibleChange = true
        }
      },
      changeTag () {
        this.visibleChange = true
        this.apiItems = []
        this.changeValue1()
      }
    }
  }
</script>

<style lang="scss">
  .mod-demo-echarts {
    .el-alert {
      // margin-bottom: 10px;
    }
    .el-row {
      // margin-top: -10px;
      // margin-bottom: -10px;
      .el-col {
        // padding-top: 10px;
        // padding-bottom: 10px;
      }
    }
    .el-card__body{
      padding: 10px;
    }
    .chart-box {
      min-height: 400px;
    }
    .echartList{
      position: relative;
    }
    .selectList{
      position: absolute;
      width: 25%;
      top: 20px;
      left: 70%;
      z-index: 9;
    }
  }
</style>
