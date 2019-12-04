<template>
  <div class="mod-demo-echarts" id='dashboard'>
    <!-- <el-alert title type="warning" v-if="list.items && list.items.length > 0" :closable="false">
      <el-select v-model="value" placeholder="预授信（常规黑指）" @change="selectGet()">
        <el-option
          v-for="item in list.items"
          :key="item.name"
          :label="item.value"
          :value="item.name"
        ></el-option>
      </el-select>
    </el-alert> -->
    <el-card class="box-card" v-if="list.items && list.items.length > 0">
      <el-select v-model="value" placeholder="预授信（常规黑指）" @change="selectGet()">
        <el-option
          v-for="item in list.items"
          :key="item.name"
          :label="item.value"
          :value="item.name"
        ></el-option>
      </el-select>
    </el-card>
    <!-- 授信路径监控 -->
    <one-credit
      v-if="type == '1' && !ifMockTest"
      :arr="arr"
      :selection="selection"
      :selectedList="selectedList"
      @checkNode="checkNode"
    ></one-credit>
    <one-test v-if="type == '1' && ifMockTest"></one-test>
    <!-- 彩虹评级期限 -->
    <two-rainbow
      v-if="type == '2' && !ifMockTest"
      :options="options"
      :optionIds="optionIds"
      :arr="arr"
      :hadSelectedList="hadSelectedList"
      @checkNode="checkNode"
    ></two-rainbow>
    <two-test v-if="type == '2' && ifMockTest"></two-test>
    <!-- 机构资金监控 -->
    <three-monitor
      v-if="type == '3' && !ifMockTest"
      :simpleList="simpleList"
      :barRightList="barRightList"
      :options="options"
      :optionIds="optionIds"
      :hadSelectedList="hadSelectedList"
      @checkNode="checkNode"
    ></three-monitor>
    <three-test v-if="type == '3' && ifMockTest"></three-test>
    <!-- 四象限&&小卡 -->
    <four-quadrant v-if="type == '6' && !ifMockTest" :quadrantList="quadrantList"></four-quadrant>
    <four-test v-if="type == '6' && ifMockTest"></four-test>
    <!-- 渠道整体转化率 -->
    <five-funnel
      v-if="type == '5' && !ifMockTest"
      :arr="arr"
      @checkNode="checkNode"
    ></five-funnel>
    <five-test v-if="type == '5' && ifMockTest"></five-test>
    <!-- 万卡漏斗监控 -->
    <six-board
      v-if="type == '4' && !ifMockTest"
      :simpleList="simpleList"
      :barRightList="barRightList"
      :options="options"
      :optionIds="optionIds"
      :hadSelectedList="hadSelectedList"
      @checkNode="checkNode"
    ></six-board>
    <six-test v-if="type == '4' && ifMockTest"></six-test>
    <!-- 其他总体数据展示 -->
    <div v-if="lineList && lineList.length > 0" class="line">
      <div :key="item.id" v-for="(item) in lineList">
        <div class="lineEvery">
          <p>{{item.titleName}}</p>
          <h3>{{item.series[0].data[item.series[0].data.length-1].percent}}</h3>
          <div :id="'lineCharts' + item.id" class="lineCharts"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import echarts from 'echarts'
import sixBoard from './dashboard/sixBoard'
import fiveFunnel from './dashboard/fiveFunnel'
import fourQuadrant from './dashboard/fourQuadrant'
import threeMonitor from './dashboard/threeMonitor'
import twoRainbow from './dashboard/twoRainbow'
import oneCredit from './dashboard/oneCredit'
import oneTest from './dashboard/mockVue/oneTest'
import twoTest from './dashboard/mockVue/twoTest'
import threeTest from './dashboard/mockVue/threeTest'
import fourTest from './dashboard/mockVue/fourTest'
import fiveTest from './dashboard/mockVue/fiveTest'
import sixTest from './dashboard/mockVue/sixTest'
import { chartsConfig } from './dashboard/chartsConfig'
import { getQueryString } from '@/utils'
import 'echarts/lib/chart/funnel'
import 'echarts/lib/chart/radar'
export default {
  components: { sixBoard, fourQuadrant, threeMonitor, twoRainbow, fiveFunnel, oneCredit, oneTest, twoTest, threeTest, fourTest, fiveTest, sixTest },
  data () {
    return {
      chartPie: null,
      myCharts: null,
      list: [],
      value: '预授信（常规黑指）',
      visualizes: [],
      arr: [], // 有几个图表
      visibleChange: false,
      visualizeId: 1, // 图表筛选框
      selection: [],
      lineList: [], // 框框加折线图数据
      simpleList: [], // 侧边数据
      quadrantList: {}, // 四象限数据
      defaultSelection: [], // 调用默认接口存的数据
      mark: '', // 区分是哪个列表点过来的
      type: '', // 区分是什么类型的大屏
      selectedList: {},
      timer: null, // 定时器
      ifMockTest: true,
      visualizeSelection: [],
      params1: [{
        'name': 'visualize过滤策略',
        'type': 'visualize',
        'placeholder': '',
        'items': [],
        'columnName': '',
        'mark': ''
      }],
      params5: [{
        'name': 'visualize过滤策略',
        'type': 'visualize',
        'placeholder': '\\{sourceType\\}',
        'items': [{
          'name': '市场渠道',
          'value': ['市场渠道']
        }],
        'columnName': 'source_type',
        'mark': 'IN'
      }],
      options: [],
      optionIds: [],
      hadSelectedList: [], // 已选择的数据
      hadSelectedParamsList: [], // 已选择的参数
      barRightList: [] // 右侧柱状图数据
    }
  },
  computed: {
    sidebarFold: {
      get () {
        return this.$store.state.common.sidebarFold
      },
      set (val) {
        this.$store.commit('common/updateSidebarFold', val)
      }
    }
  },
  watch: {
    $route (to) {
      if (to.path.indexOf('phoenix-spectaculars') != -1) {
        this.visualizeId = 1
        this.list = []
        this.ifMockTest = true
        this.hadSelectedList = []
        this.hadSelectedParamsList = []
        this.mark = getQueryString('mark')
        this.type = getQueryString('type')
        if (this.mark == '5') {
          this.visualizeSelection = this.params5
        } else {
          this.visualizeSelection = this.params1
        }
        this.mark == '1' ? this.getDefaultSelection() : this.queryList()
      }
    }
  },
  created () {
    this.mark = getQueryString('mark')
    this.type = getQueryString('type')
  },
  mounted () {
    if (!this.sidebarFold) {
      this.sidebarFold = !this.sidebarFold
    }
    if (this.mark == '5') {
      this.visualizeSelection = this.params5
    } else {
      this.visualizeSelection = this.params1
    }
    this.mark == '1' ? this.getDefaultSelection() : this.queryList()
    this.autoReload()
  },
  activated () {
    // 由于给echart添加了resize事件, 在组件激活时需要重新resize绘画一次, 否则出现空白bug
    if (this.chartPie) {
      this.chartPie.resize()
    }
    if (this.myCharts) {
      this.myCharts.resize()
    }
  },
  destroyed () {
    clearInterval(this.timer)
    this.timer = null
  },
  methods: {
    // 获取默认选择项
    getDefaultSelection () {
      this.$http({
        url: this.$http.adornUrl('/phoenix/dashboard/selection'),
        method: 'post',
        data: {
          data: {
            dashboardId: 1
          }
        }
      })
        .then(resp => {
          let res = resp.data
          this.defaultSelection = res.response.data[0]
        })
        .then(() => {
          this.queryList()
        })
    },
    // 获取列表
    queryList (visualizeSelection = this.visualizeSelection, selectionData) {
      let { mark } = this.$data
      this.$http({
        url: this.$http.adornUrl('/phoenix/dashboard'),
        method: 'post',
        data: {
          data: {
            dashboardId: mark,
            dashboardSelection: [
              // 大屏
              {
                name: 'dashBoard过滤策略',
                type: 'dashBoard',
                placeholder: this.list.placeholder || this.defaultSelection.placeholder,
                items: mark == '1' ? [{
                  name: this.value,
                  value: [this.value]
                }] : [],
                columnName: this.list.columnName || this.defaultSelection.columnName,
                mark: this.list.mark || this.defaultSelection.mark
              }
            ],
            visualizeId: this.visualizeId,
            visualizeSelection
          },
          header: {
            lat: 0.0,
            lng: 0.0,
            t: 1568975236544,
            traceId: '59235c9c-0dcb-49ee-8c07-acf45b61d913'
          }
        }
      }).then(({ data }) => {
        let res = data.response
        if (res.status == '1') {
          this.ifMockTest = false
          if (res.data.selection.length) {
            this.list = res.data.selection[0]
            this.selectConfig(res)
          }
          this.arr = []
          this.lineList = []
          this.barRightList = []
          this.simpleList = []
          if (res.data.visualizes) {
            res.data.visualizes.forEach((tem, index) => {
              this.initCharts(tem, index)
            })
          }
        }
      })
    },
    initCharts (tem, index) {
      tem.selectListArr = []
      if (tem.type != 'quadrant' && tem.type != 'simple' && tem.type != 'line' && this.mark != '3') {
        this.arr.push(tem)
      }
      tem['grid'] = chartsConfig.grid
      tem['color'] = chartsConfig.color
      Object.assign(tem.title, chartsConfig.title)
      Object.assign(tem.legend, chartsConfig.legend)
      if (tem.xAxis) {
        Object.assign(tem.xAxis, chartsConfig.xAxis)
      }
      // 通过tem.type类型找到对应的方法执行 参数是 tem, index
      this[`${tem.type}Config`](tem, index)

      if (tem.selection[0]) {
        this.selection =
          tem.selection[0].selectList && tem.selection[0].selectList.length > 0
            ? tem.selection[0].selectList
            : tem.selection[0].items
        this.visualizeId = tem.id
      }
      setTimeout(() => {
        if (this.mark == '3' && tem.positi == 'right') {
          let label = 'barCharts' + tem.id
          this.chartsInit(this.myCharts, label, tem)
          return false
        }
        if (tem.type != 'quadrant' && tem.type != 'simple' && tem.type != 'line' && this.mark != '3') {
          let label = 'J_chartLineBox' + tem.id
          this.chartsInit(this.chartPie, label, tem)
        } else if (tem.type == 'line') {
          let label = 'lineCharts' + tem.id
          this.chartsInit(this.myCharts, label, tem)
        }
      }, 500)
    },
    selectGet () {
      this.arr = []
      this.quadrantList = {}
      this.lineList = []
      this.simpleList = []
      this.queryList()
    },
    checkNode (value, index, data) {
      // this.hadSelectedList = []
      this.hadSelectedList[index] = value
      data.items = value.map((tem, index) => {
        return {
          name: tem,
          value: [tem]
        }
      })
      this.hadSelectedParamsList[index] = data
      this.queryList(this.hadSelectedParamsList)
    },
    // 折线柱数据处理
    barConfig (tem, index) {
      this.parLegendConfig(tem)
      tem['tooltip'] = chartsConfig.tooltip
      if (this.mark == '2' && (index == 1 || index == 3)) {
        tem.color = ['#f1675d', '#eee', '#ED6354', '#FFC175', '#FEEC8D', '#A3D47D', '#59CBDD', '#5C62E6', '#A85BF8', '#999999']
        tem.series[1].stack = '11' // 将柱状图变成双列 柱状图
        tem.series[1].type = 'bar'
      }
      if (this.type == '3' && tem.positi && tem.positi == 'right') {
        // 机构资金右侧数据
        this.threeMarkConfig(tem)
      }
    },
    // 对 机构资金 config配置
    threeMarkConfig (tem) {
      let first = {}
      let second = {}
      if (tem.legend.data[0].name.indexOf('昨日') !== -1 || tem.legend.data[0].name.indexOf('今日') !== -1) {
        first = JSON.parse(JSON.stringify(tem.legend.data[0]))
        tem.legend.data.splice(0, 1)
      }
      if (tem.legend.data[0].name.indexOf('昨日') !== -1 || tem.legend.data[0].name.indexOf('今日') !== -1) {
        second = JSON.parse(JSON.stringify(tem.legend.data[0]))
        tem.legend.data.splice(0, 1)
      }
      tem.legend.data.sort((a, b) => {
        if (a.metric_unit) {
          return b.metric - a.metric
        }
      })
      if (JSON.stringify(first) !== '{}') {
        tem.legend.data = [...[first], ...[second], ...tem.legend.data]
      }
      tem.legend.type = tem.legendType || 'scroll'
      tem.title.textStyle = {
        fontSize: '12'
      }
      tem.color[1] = '#eee'
      tem.series[1].stack = '11' // 将柱状图变成双列 柱状图
      this.barRightList.push(tem)
    },
    // 对柱状图的legend 做统一处理
    parLegendConfig (tem) {
      for (let i = 0; i < tem.series.length; i++) {
        if (tem.legend.data && tem.legend.data[i].metric && tem.series) {
          var seriesNameElse = tem.series[i].name + '\n' +
                tem.legend.data[i].metric +
                (tem.legend.data[i].metric_unit == '￥' ? '' : tem.legend.data[i].metric_unit) +
                (tem.legend.data[i].percentRise ? '{a|↑}' : '{b|↓}') +
                tem.legend.data[i].percent +
                tem.legend.data[i].percent_unit
          tem.series[i].name = seriesNameElse
          if (!tem.series[i].data) {
            tem.legend.data[i]['icon'] = 'image://'
          }
        }
      }
      for (let i = 0; i < tem.legend.data.length; i++) {
        if (tem.legend.data[i].metric) {
          var legendNameElse = tem.legend.data[i].name + '\n' +
            tem.legend.data[i].metric +
            (tem.legend.data[i].metric_unit == '￥' ? '' : tem.legend.data[i].metric_unit) +
            (tem.legend.data[i].percentRise ? '{a|↑}' : '{b|↓}') +
            tem.legend.data[i].percent +
            tem.legend.data[i].percent_unit
          tem.legend.data[i].name = legendNameElse
          tem.legend.data[i].textStyle = chartsConfig.textStyle
        } else {
          tem.legend.data[i].textStyle = chartsConfig.textStyle
        }
      }
    },
    // 饼图数据处理
    pieConfig (tem) {
      for (let i = 0; i < tem.legend.data.length; i++) {
        var legendName =
          tem.legend.data[i].name +
          '\n\n ' +
          tem.legend.data[i].metric +
          tem.legend.data[i].metric_unit +
          (tem.legend.data[i].percentRise ? '{a|↑}' : '{b|↓}') +
          tem.legend.data[i].percent +
          tem.legend.data[i].percent_unit
        tem.legend.data[i].name = legendName
        tem.legend.data[i].textStyle = chartsConfig.textStyle
      }
      if (tem.series[0]) {
        for (let i = 0; i < tem.legend.data.length; i++) {
          if (tem.series[0].data) {
            var seriesName =
              tem.series[0].data[i].name +
              '\n\n ' +
              (tem.legend.data[i].metric ? tem.legend.data[i].metric : '') +
              tem.legend.data[i].metric_unit +
              (tem.legend.data[i].percentRise ? '{a|↑}' : '{b|↓}') +
              tem.legend.data[i].percent +
              tem.legend.data[i].percent_unit
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
    },
    // 漏斗数据处理
    funnelConfig (tem) {
      let funnelStyle = {
        left: 'center',
        top: '80px',
        width: '70%',
        label: {
          show: true,
          position: 'inside',
          color: '#333',
          rich: chartsConfig.textStyle.rich
        }
      }
      tem.series[0].data.forEach((item, index) => {
        item.name = `{c|${item.name}  ${item.value}人}  ${
          item.percentRise ? '{a|↑}' : '{b|↓}'
        }  ${item.percentRise ? '{d|' + item.percent + '%}' : '{e|' + item.percent + '%}'}`
      })
      Object.assign(tem.series[0], funnelStyle)
      // tem.tooltip.formatter = '{a}<br/>{b}'
      tem.title.left = 'center'
      tem.title.top = '10px'
      delete tem.tooltip
      tem.color = ['#634cff', '#febe76', '#31c5d3', '#FF4040', '#f1675d', '#f6e58d', '#686ee0', '#99ce7e', '#b466f0', '#f7b500', '#48a37a']
    },
    // 雷达 数据处理
    radarConfig (tem) {
      const dataLabel = ['3期', '6期', '12期', '24期', '36期', '其他期限']
      const color = ['#ED6354', '#5C62E6']
      tem.color = color
      tem.tooltip = {
        formatter: function (params, ticket, callback) {
          var showHtm = ''
          for (var i = 0; i < params.value.length; i++) {
            showHtm += dataLabel[i] + '：' + params.value[i] + '%' + '<br>'
          }
          return showHtm
        }
      }
      tem.legend.orient = 'vertical'
      tem.legend.left = 'right'
      tem.legend.itemGap = 20
      tem.series.forEach((item, ind) => {
        item.itemStyle = {
          normal: {
            color: color[ind],
            lineStyle: {
              color: color[ind]
            },
            areaStyle: {
              color: color[ind]
            }
          }
        }
        item.data.map((val, i) => {
          val.label = {
            normal: {
              show: true,
              position: ind == 0 ? 'bottom' : 'right',
              formatter: function (params) {
                return params.value ? (params.value + '%') : ''
              }
            }
          }
        })
      })
    },
    // 环形饼图嵌套
    piesConfig (tem) {
      if (tem.series.length > 0) {
        tem.series[0].radius = ['45%', '65%']
        tem.series[1] && (tem.series[1].radius = ['0%', '20%'])
        tem.color = ['#ED6354', '#FFC175', '#FEEC8D', '#A3D47D', '#59CBDD', '#5C62E6', '#A85BF8', '#999999']
        tem.legend.top = 'bottom'
        tem.legend.itemGap = 20
        tem.legend.data = []
        if (tem.type == 'pies') {
          tem.series.forEach((item, ind) => {
            item.label = {
              normal: {
                formatter: '{per|{d}%}',
                rich: {
                  per: {
                    color: '#000',
                    padding: [2, 4],
                    borderRadius: 2
                  }
                }
              }
            }
            item.data.forEach((val, i) => {
              if (val.value == 0) {
                item.data.splice(i, 1)
              }
            })
          })
        }
      }
    },
    // 四象限 数据处理
    quadrantConfig (tem) {
      let arr = []
      for (let key in tem.legend.extend.quadrant) {
        arr.push({
          name: key,
          value: tem.legend.extend.quadrant[key]
        })
      }
      const newArr = arr.splice(0, 2)
      tem.legend.extend.quadrant = [...arr, ...newArr]
      this.quadrantList = tem.legend.extend
    },
    // line 折现数据处理
    lineConfig (tem) {
      tem.titleName = tem.title.text
      tem.title = {}
      tem.series[0].name = ''
      tem.grid.top = ''
      tem.series[0].areaStyle = {}
      this.lineList.push(tem)
    },
    simpleConfig (tem) {
      this.simpleList.push(tem)
    },
    chartsInit (chart, label, tem) {
      chart = echarts.init(document.getElementById(label))
      chart.setOption(tem, true)
      window.addEventListener('resize', () => {
        chart.resize()
      })
    },
    // 下拉框数据 处理
    selectConfig (res) {
      let selectList = res.data.selection[0].selectList
      let list = []
      this.optionIds = []
      selectList.forEach(item => {
        this.optionIds = [...this.optionIds, ...item.value]
        list.push({
          name: item.name,
          children: item.value.map(val => {
            return {
              name: val
            }
          })
        })
      })
      this.options = list
    },
    autoReload () {
      this.timer = setInterval(() => {
        this.hadSelectedList = []
        this.hadSelectedParamsList = []
        this.queryList()
      }, 1000 * 60 * 30)
    }
  }
}
</script>

<style lang="scss">
.mod-demo-echarts {
  .box-card {
    margin-bottom: 8px;
  }
  .el-card__body {
    padding: 10px;
  }
  .chart-box {
    min-height: 400px;
  }
  .lineCharts {
    min-height: 200px;
  }
  .el-loading-spinner {
    font-size: 40px;
  }
}
li {
  list-style: none;
}
.line {
  width: 100%;
  height: 300px;
  background: #f0f4f8;
  margin-top: 20px;
  & > div {
    .lineEvery {
      text-align: center;
      max-width: 400px;
      p {
        padding-top: 20px;
      }
    }
  }
}
.lineCharts {
  width: 400px;
}
</style>
