<template>
  <div class="mod-demo-echarts">
    <el-alert
        title=""
        type="warning"
        :closable="false">
        <el-select v-model="value" placeholder="预授信（常规黑指）" @change="selectGet()">
          <el-option
            v-for="item in list.items"
            :key="item.name"
            :label="item.value"
            :value="item.name">
          </el-option>
        </el-select>
      </el-alert>
    <el-row :gutter="20">
      <el-col  v-for="(outdata, index) in arr" :key="index" :span="12"  class='echartList'>
        <el-card>
          <el-select v-model="value1" class='selectList' multiple placeholder="全部" v-show="outdata.selection[0]" @visible-change="changeValue1(outdata.selection[0])" @remove-tag="changeTag(selection[0])">
            <el-option
              v-for="item in selection"
              :key="item.name"
              :label="item.value"
              :value="item.name">
            </el-option>
          </el-select>
          <div :id="'J_chartLineBox' + outdata.id" class="chart-box"></div>
        </el-card>
        <div class="funnelList">
          <ul v-show="arr[index].type == 'funnel'">
            <li :key = index v-for="(item, index) in funnelList">{{item.name}}{{item.metric}}{{item.metric_unit}}<span class="colorRed" :class="{'percentRise' : item.percentRise}">{{item.percentRise ? '↑' : '↓'}}</span>{{item.percent}}{{item.percent_unit}}</li>
          </ul>
          <ul>
          </ul>
        </div>
      </el-col>
    </el-row>
    <div v-if='quadrantList' class="quadrant">
      <h3>四象限&&小X卡</h3>
      <div class="titleName">
        <p>四象限</p>
        <p>小X卡</p>
      </div>
      <div class="mainText">
        <div class="quadrantLeft">
          <div class="quadrantLeftLeft">
            <div :key="index" v-for="(value, key, index) in quadrantList.quadrantDetails">
              <p>{{key}}</p>
              <ul :key="indexList" v-for="(valueList, keyList, indexList) in value">
                <li>{{keyList}} {{valueList[0].metric}}{{valueList[0].metric_unit}} {{valueList[1].metric}}{{valueList[1].metric_unit}} <span class="colorRed" :class="{'percentRise' : valueList[1].percentRise}">{{valueList[1].percentRise ? '↑' : '↓'}} {{valueList[1].percent}}{{valueList[1].percent_unit}}</span></li>
              </ul>
            </div>
          </div>
          <div class="quadrantLeftRight">
            <div :key="index" v-for="(value, key, index) in quadrantList.quadrant">
              <p>{{key}}</p>
              <ul :key="indexList" v-for="(valueList, keyList, indexList) in value">
                <li>{{valueList.metric}}{{valueList.metric_unit}}<span class="colorRed" :class="{'percentRise' : valueList.percentRise}">{{valueList.percentRise ? '↑' : '↓'}} {{valueList.percent}}{{valueList.percent_unit}}</span></li>
              </ul>
            </div>
          </div>
        </div>
        <div class="quadrantRight">
          <div :key='index' class="quadrantRightList" v-for="(value, key, index) in quadrantList.quadrantCards">
            <div class="quadrantRightListContent">
              <p>{{key}}</p>
              <ul :key="indexValue" v-for="(valueList, keyList, indexValue) in value">
                <li>{{valueList.metric}}{{valueList.metric_unit}}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import echarts from 'echarts'
  import 'echarts/lib/chart/funnel'
  import 'echarts/lib/chart/radar'
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
        selection: [],
        funnelList: [],
        boxList: [],
        quadrantList: '',
        defaultSelection: []
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
      // 获取默认选择项
      getDefaultSelection () {
        this.$http({
          url: this.$http.adornUrl('/phoenix/dashboard/selection'),
          method: 'post',
          data: {
            data: {
              dashboardId: 2
            }
          }
        }).then((resp) => {
          let res = resp.data
          this.defaultSelection = res.response.data[0]
        }).then(() => {
          this.queryList()
        })
      },

      // 获取列表
      queryList (selectionIndex) {
        this.$http({
          url: this.$http.adornUrl('/phoenix/dashboard'),
          method: 'post',
          data: {
            data: {
              dashboardId: 2,
              dashboardSelection: [{ // 大屏
                name: 'dashBoard过滤策略',
                type: 'dashBoard',
                placeholder: this.list.placeholder || this.defaultSelection.placeholder,
                items: [],
                columnName: this.list.columnName || this.defaultSelection.columnName,
                mark: this.list.mark || this.defaultSelection.mark
              }],
              visualizeId: this.visualizeId,
              visualizeSelection: [{ // 图表
                name: 'visualize过滤策略',
                type: 'visualize',
                placeholder: selectionIndex ? (selectionIndex.placeholder) : '',
                items: this.value1 ? this.apiItems : [],
                columnName: selectionIndex ? (selectionIndex.columnName) : '',
                mark: selectionIndex ? (selectionIndex.mark) : ''
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
            this.list = res.data.selection[0] // 下拉列表选项
            if (res.data.visualizes) { // 图标列表
              this.boxList = res.data.visualizes
              res.data.visualizes.forEach((tem, index) => {
                if (tem.type != 'quadrant' && tem.type != 'simple' && tem.type != 'line') {
                  this.arr.push(tem)
                }
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
                  // tem.legend.data.unshift('全选', '全不选')
                } else if (tem.type == 'funnel') { // 漏斗
                  tem.series[0].left = '15%'
                  tem.series[0].width = '70%'

                  tem.series[0]['label'] = {
                    show: true,
                    position: 'inside',
                    color: '#333'
                  }
                  tem.series[0]['label'].rich = this.textStyle.rich

                  tem.series[0].data.forEach((item, index) => {
                    item.name = `${item.name}  ${item.value}人  ${item.percentRise ? '{a|↑}' : '{b|↓}'}  ${item.percent}%`
                  })
                  tem.tooltip.formatter = '{a}<br/>{b}'
                  this.funnelList = tem.legend.data
                } else if (tem.type == 'radar') { // 雷达
                  tem.tooltip = {}
                  tem.series[1].itemStyle = {
                    normal: {
                      color: 'blue'
                    }
                  }
                  tem.legend.orient = 'vertical'
                  tem.legend.left = 'right'
                  tem.legend.itemGap = 20
                } else if (tem.type == 'pies') { // 饼图嵌套
                  tem.series[0].radius = ['55%', '75%']
                  tem.series[1].radius = ['0%', '30%']
                  tem.color = ['red', 'orange', 'yellow', 'green', '#006030', 'blue', 'purple', 'grey']
                  tem.legend.orient = 'vertical'
                  tem.legend.left = 'right'
                  tem.legend.itemGap = 20
                } else if (tem.type == 'quadrant') { // 四象限
                  this.quadrantList = tem.legend.extend
                }
                if (tem.selection[0]) {
                  this.selection = tem.selection[0].items
                  this.visualizeId = tem.id
                }
                setTimeout(() => {
                  if (tem.type != 'quadrant' && tem.type != 'simple' && tem.type != 'line') {
                    let label = 'J_chartLineBox' + tem.id
                    this.chartPie = echarts.init(document.getElementById(label))
                    this.chartPie.setOption(tem, true)
                    window.addEventListener('resize', () => {
                      this.chartPie.resize()
                    })
                  }
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
        this.quadrantList = ''
        this.queryList()
      },
      changeValue1 (selectionIndex) {
        if (this.visibleChange) {
          this.value1.forEach((tem, index) => {
            var obj = {}
            obj.name = tem
            obj.value = tem
            this.apiItems.push(obj)
          })
          this.arr = []
          this.queryList(selectionIndex)
          this.visibleChange = false
        } else {
          this.visibleChange = true
        }
      },
      changeTag (selectionIndex) {
        this.visibleChange = true
        this.apiItems = []
        this.changeValue1(selectionIndex)
      }
    }
  }
</script>

<style lang="scss">

  .mod-demo-echarts {
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
  li{
    list-style: none;
  }
  .funnelList{
    ul{
      position: absolute;
      width: 170px;
      height: 200px;
      top: 90px;
      left: 20px;
      padding: 0;
      li{
        color: #555;
        margin-top: 41px;
      }
      li:nth-child(1){
        margin-top: -71px;
        left: 260px;
        width: 100px;
        position: absolute;
        text-align: center;
      }
    }
  }
  .colorRed{
    color: red;
  }
  .percentRise{
    color: green;
  }
  .quadrant{
    width: 100%;
    background: #f0f4f8;
    padding-bottom: 20px;
    h3{
      padding-top: 10px;
      text-align: center;
    }
    .titleName{
      width: 100%;
      height: 40px;
      display: flex;
      p{
        text-align: center;
      }
      p:nth-child(1){
        flex:3;
      }
      p:nth-child(2){
        flex:1;
      }
    }
    .mainText{
      width: 100%;
      display: flex;
      font-size: 12px;
      height: 400px;
      p{
        padding-top: 20px;
      }
      .quadrantLeft{
        flex: 3;
        display: flex;
        .quadrantLeftLeft{
          flex: 1;
          &>div{
            height: 50%;
            margin-top: -12px;
            ul{
              padding: 0;
            }
          }
          &>div:nth-child(1) {
            background: #f2c9a1;
            // background-image: linear-gradient(to right, #f1d8c3 , #f2c08d);
          }
          &>div:nth-child(2) {
            background: #baa993;
            // background-image: linear-gradient(to right, #baa993 , #825820);
          }
        }
        .quadrantLeftRight{
          color: #fff;
          flex: 2;
          &>div{
            width: 50%;
            display: inline-block;
            text-align: center;
            vertical-align:middle;
            height: 50%;
            ul{
              padding: 0;
            }
          }
          &>div:nth-child(1) {
            background: #f2c9a1;
            // background-image: linear-gradient(to right, #f1d8c3 , #f2c08d);
          }
          &>div:nth-child(2) {
            background: #eb9038;
          }
          &>div:nth-child(3) {
            background: #baa993;
            // background-image: linear-gradient(to right, #baa993 , #825820);
          }
          &>div:nth-child(4) {
            background: #eba25b;
          }
        }
      }
      .quadrantRight{
        flex: 1;
        &>div{
          height: 31.35%;
          margin: 0 20px;
          p{
            text-align: center;
          }
          ul{
            padding: 0;
            text-align: center;
          }
        }
        &>div:nth-child(1){
          background: #f5e8d5;
          margin-top: -12px;
        }
        &>div:nth-child(2){
          background: #faf7d7;
        }
        &>div:nth-child(3){
          background: #d3e6dd;
        }
      }
    }
  }
</style>
