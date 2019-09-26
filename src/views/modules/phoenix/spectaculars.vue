<template>
  <div class="mod-demo-echarts">
    <el-alert
      title=""
      type="warning"
      :closable="false">
      <el-select v-model="value" placeholder="请选择授信流程" @change="selectGet()">
        <el-option
          v-for="item in list"
          :key="item.name"
          :label="item.value"
          :value="item.name">
        </el-option>
      </el-select>
    </el-alert>

    <el-row :gutter="20">
      <el-col  v-for="(outdata, index) in arr" :key="index" :span="12">
        <el-card>
          <el-select v-model="value1" class='selectList' multiple placeholder="通知策略" v-show="outdata" @visible-change="changeValue1()">
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
      <!-- <el-col :span="12">
        <el-card>
          <div id="J_chartLineBox01" class="chart-box"></div>
        </el-card>
      </el-col> -->
    </el-row>
  </div>
</template>

<script>
  import echarts from 'echarts'
  import api from '@/fetch/api'
  export default {
    data () {
      return {
        props: { multiple: true },
        chartLine: null,
        chartBar: null,
        chartPie: null,
        chartScatter: null,
        list: [],
        value: '',
        value1: '',
        visualizes: [],
        arr: [], // 有几个图表
        legend: { // 设置标签样式
          textStyle: {
            color: '#333'
          },
          type: 'scroll',
          x: 'left', // 'center' | 'left' | {number},
          y: '40', // 'center' | 'bottom' | {number}
          backgroundColor: '#fff',
          padding: 0,
          itemGap: 20
        },
        visibleChange: false,
        apiItems: [{name: '', value: ''}]
      }
    },
    computed: {
      sidebarFold: {
        get () { return this.$store.state.common.sidebarFold },
        set (val) { this.$store.commit('common/updateSidebarFold', val) }
      }
    },
    created () {
      this.queryList()
    },
    mounted () {
      if (!this.sidebarFold) {
        // set (true) { this.$store.commit('common/updateSidebarFold', val) }
        this.sidebarFold = !this.sidebarFold
      }
    },
    activated () {
      // 由于给echart添加了resize事件, 在组件激活时需要重新resize绘画一次, 否则出现空白bug
      if (this.chartPie) {
        this.chartPie.resize()
      }
      // if (this.chartBar) {
      //   this.chartBar.resize()
      // }
      // if (this.chartPie) {
      //   this.chartPie.resize()
      // }
      // if (this.chartScatter) {
      //   this.chartScatter.resize()
      // }
    },
    methods: {
      // 获取列表
      queryList () {
        this.$http({
          url: api.screenList,
          method: 'post',
          data: {
            data: {
              dashboardId: 1,
              dashboardSelection: [{
                name: 'dashBoard过滤策略',
                type: 'dashBoard',
                placeholder: '\\{creditCondition\\}',
                items: this.value ? [{
                  name: this.value,
                  value: this.value
                }] : []
              }],
              visualizeId: 1,
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
        }).then(response => {
          let res = response.data
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
            }
          }
          var xAxis = {
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
          }
          var title = {
            textAlign: 'center'
          }
          if (res.status == 1) {
            this.list = res.data.selection[0].items
            if (res.data.visualizes) {
              res.data.visualizes.forEach((tem, index) => {
                this.arr.push(tem.selection[0])
                let label = 'J_chartLineBox' + index
                if (tem.selection[0]) {
                  this.selection = tem.selection[0].items
                }
                Object.assign(tem.title, title)
                Object.assign(tem.legend, this.legend)
                if (tem.xAxis) {
                  Object.assign(tem.xAxis, xAxis)
                }
                // Object.assign(tem.xAxis, xAxis)
                if (tem.series.length > 1) {
                  for (let i = 0; i < tem.series.length; i++) {
                    if (tem.legend.data[i].metric) {
                      var seriesNameElse = tem.series[i].name + '\n\n ' + tem.legend.data[i].metric + tem.legend.data[i].metric_unit + (tem.legend.data[i].percentRise ? '{a|↑}' : '{b|↓}') + tem.legend.data[i].percent + tem.legend.data[i].percent_unit
                      tem.series[i].name = seriesNameElse
                      if (!tem.series[i].data) {
                        tem.legend.data[i]['icon'] = 'image://'
                      }
                    }
                  }
                  for (let i = 0; i < tem.legend.data.length; i++) {
                    if (tem.legend.data[i].metric) {
                      var legendNameElse = tem.legend.data[i].name + '\n\n ' + tem.legend.data[i].metric + tem.legend.data[i].metric_unit + (tem.legend.data[i].percentRise ? '{a|↑}' : '{b|↓}') + tem.legend.data[i].percent + tem.legend.data[i].percent_unit
                      tem.legend.data[i].name = legendNameElse
                      tem.legend.data[i].textStyle = textStyle
                    }
                  }
                } else {
                  for (let i = 0; i < tem.series[0].data.length; i++) {
                    var seriesName = tem.series[0].data[i].name + '\n\n ' + tem.legend.data[i].metric + tem.legend.data[i].metric_unit + (tem.legend.data[i].percentRise ? '{a|↑}' : '{b|↓}') + tem.legend.data[i].percent + tem.legend.data[i].percent_unit
                    tem.series[0].data[i].name = seriesName
                  }
                  for (let i = 0; i < tem.legend.data.length; i++) {
                    var legendName = tem.legend.data[i].name + '\n\n ' + tem.legend.data[i].metric + tem.legend.data[i].metric_unit + (tem.legend.data[i].percentRise ? '{a|↑}' : '{b|↓}') + tem.legend.data[i].percent + tem.legend.data[i].percent_unit
                    tem.legend.data[i].name = legendName
                    tem.legend.data[i].textStyle = textStyle
                  }
                }
                setTimeout(() => {
                  this.chartPie = echarts.init(document.getElementById(label))
                  this.chartPie.setOption(tem)
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
        this.apiItems = [{name: ''}, {value: ''}]
        this.value1 = ''
        this.queryList()
      },
      changeValue1 () {
        if (this.visibleChange && this.value1.length >= 1) {
          // if (this.value1.length > 1) {
          //   this.value1.forEach((tem, index) => {
          //     this.apiItems[index]['name'] = tem
          //     this.apiItems[index]['value'] = tem
          //   })
          // } else {
          //   this.apiItems['name'] = this.value1
          //   this.apiItems['value'] = this.value1
          // }
          this.value1.forEach((tem, index) => {
            this.apiItems[index]['name'] = tem
            this.apiItems[index]['value'] = tem
          })
          console.log('this.value1', this.value1, this.apiItems)
          this.arr = []
          this.queryList()
          this.visibleChange = false
        } else {
          this.visibleChange = true
        }
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
    .selectList{
      position: relative;
      width: 50%;
      top: 0px;
      left: 160px;
      z-index: 9;
    }
  }
</style>
