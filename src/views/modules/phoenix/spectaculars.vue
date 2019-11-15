<template>
  <div class="mod-demo-echarts">
    <el-alert title type="warning" v-if="list.items && list.items.length > 0" :closable="false">
      <el-select v-model="value" placeholder="预授信（常规黑指）" @change="selectGet()">
        <el-option
          v-for="item in list.items"
          :key="item.name"
          :label="item.value"
          :value="item.name"
        ></el-option>
      </el-select>
    </el-alert>
    <!-- 授信路径监控 -->
    <one-credit
      v-if="mark == '1'"
      :arr="arr"
      :selection="selection"
      :selectedList="selectedList"
      @changeValue1="changeValue1"
      @changeTag="changeTag"
    ></one-credit>
    <!-- 彩虹评级期限 -->
    <two-rainbow
      v-if="mark == '2'"
      :options="options"
      :optionIds="optionIds"
      :arr="arr"
      :selection="selection"
      :selectedList="selectedList"
      :hadSelectedList="hadSelectedList"
      @changeValue1="changeValue1"
      @changeTag="changeTag"
      @checkNode="checkNode"
    ></two-rainbow>
    <!-- 机构资金监控 -->
    <three-monitor
      v-if="mark == '3'"
      :simpleList="simpleList"
      :barRightList="barRightList"
      @clickALlCheck="clickALlCheck"
    ></three-monitor>
    <!-- 四象限&&小卡 -->
    <four-quadrant v-if="mark == '4'" :quadrantList="quadrantList"></four-quadrant>
    <!-- 渠道整体转化率 -->
    <five-funnel
      v-if="mark == '5'"
      :arr="arr"
      :selection="selection"
      :selectedList="selectedList"
      @changeValue1="changeValue1"
      @changeTag="changeTag"
    ></five-funnel>
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
import fiveFunnel from './dashboard/fiveFunnel'
import fourQuadrant from './dashboard/fourQuadrant'
import threeMonitor from './dashboard/threeMonitor'
import twoRainbow from './dashboard/twoRainbow'
import oneCredit from './dashboard/oneCredit'
import { chartsConfig } from './dashboard/chartsConfig'
import { getQueryString } from '@/utils'
import 'echarts/lib/chart/funnel'
import 'echarts/lib/chart/radar'
export default {
  components: { fourQuadrant, threeMonitor, twoRainbow, fiveFunnel, oneCredit },
  data () {
    return {
      chartPie: null,
      myCharts: null,
      list: [],
      value: '预授信（常规黑指）',
      visualizes: [],
      arr: [], // 有几个图表
      visibleChange: false,
      apiItems: [],
      visualizeId: 1, // 图表筛选框
      selection: [],
      lineList: [], // 框框加折线图数据
      simpleList: [], // 侧边数据
      quadrantList: {}, // 四象限数据
      defaultSelection: [], // 调用默认接口存的数据
      mark: '', // 区分是哪个列表点过来的
      selectedList: {},
      options: [],
      optionIds: [],
      hadSelectedList: [], // 已选择的数据
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
        this.hadSelectedList = []
        this.mark = getQueryString('mark')
        this.mark == '1' ? this.getDefaultSelection() : this.queryList()
      }
    }
  },
  created () {
    this.mark = getQueryString('mark')
  },
  mounted () {
    if (!this.sidebarFold) {
      this.sidebarFold = !this.sidebarFold
    }
    this.mark == '1' ? this.getDefaultSelection() : this.queryList()
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
  methods: {
    // 全选功能
    clickALlCheck (index, arrValue) {
      let selectall = document.getElementById('selectall' + index)
      let flag = selectall.getAttribute('flag')
      let selectArr = ''
      if (arrValue == 'arr') {
        selectArr = this.arr[index].legend.data
      } else {
        selectArr = this.barRightList[index].legend.data
      }
      let val = ''
      if (flag == 1) {
        val = false
        selectall.setAttribute('flag', 0)
        selectall.value = '全选中'
      } else {
        val = true
        selectall.setAttribute('flag', 1)
        selectall.value = '全不选'
      }
      let obj = {}
      let selectName = []
      selectArr.forEach((item, indx) => {
        selectName.push(item.name)
      })
      selectName.forEach((item, indx) => {
        obj[item] = val
      })
      if (arrValue == 'arr') {
        this.arr[index].legend.selected = obj
      } else {
        this.barRightList[index].legend.selected = obj
      }
      if (arrValue == 'barRightList') {
        let label = 'barCharts' + this.barRightList[index].id
        this.chartsInit(this.chartPie, label, this.barRightList[index])
      } else {
        let label = 'J_chartLineBox' + this.arr[index].id
        this.chartsInit(this.chartPie, label, this.arr[index])
      }
    },
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
    queryList (selectVal, selectionData) {
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
                  value: this.value
                }] : [],
                columnName: this.list.columnName || this.defaultSelection.columnName,
                mark: this.list.mark || this.defaultSelection.mark
              }
            ],
            visualizeId: this.visualizeId,
            visualizeSelection: [
              // 图表
              {
                name: 'visualize过滤策略',
                type: 'visualize',
                placeholder: selectVal ? selectVal.placeholder : '',
                items: selectionData ? this.apiItems : [],
                columnName: selectVal ? selectVal.columnName : '',
                mark: selectVal ? selectVal.mark : ''
              }
            ]
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
      if (
        tem.type != 'quadrant' &&
        tem.type != 'simple' &&
        tem.type != 'line' &&
        this.mark != '3'
      ) {
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
        if (
          tem.type != 'quadrant' &&
          tem.type != 'simple' &&
          tem.type != 'line' &&
          this.mark != '3'
        ) {
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
      this.apiItems = []
      this.quadrantList = []
      this.lineList = []
      this.simpleList = []
      this.queryList()
    },
    changeValue1 (data, type) {
      if (type == 'remove') {
        this.apiItems = []
        this.arr = []
        this.lineList = []
        this.selectedList = {
          id: this.selectedList.id,
          data: this.selectedList.data.selectListArr
        }
        this.selectedList.data.forEach((tem, index) => {
          var obj = {
            name: tem,
            value: tem
          }
          this.apiItems.push(obj)
        })
        this.visibleChange = false
        this.queryList(data.selection[0], data.selectListArr)
        return false
      }
      if (this.visibleChange) {
        this.apiItems = []
        this.arr = []
        this.lineList = []
        data.selectListArr.forEach((tem, index) => {
          var obj = {
            name: tem,
            value: tem
          }
          this.apiItems.push(obj)
        })
        this.selectedList = {
          data: data.selectListArr,
          id: data.id
        }
        this.queryList(data.selection[0], data.selectListArr)
        this.visibleChange = false
      } else {
        this.visibleChange = true
      }
    },
    changeTag (data) {
      this.visibleChange = true
      this.apiItems = []
      this.lineList = []
      this.changeValue1(data, 'remove')
    },
    checkNode (value, index, data) {
      this.hadSelectedList[index] = value
      this.apiItems = value.map((tem, index) => {
        return {
          name: tem,
          value: tem
        }
      })
      this.queryList(data, this.apiItems)
    },
    // 折线柱数据处理
    barConfig (tem, index) {
      for (let i = 0; i < tem.series.length; i++) {
        if (tem.legend.data && tem.legend.data[i].metric && tem.series) {
          var seriesNameElse = tem.series[i].name + '\n\n ' +
                tem.legend.data[i].metric +
                tem.legend.data[i].metric_unit +
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
          var legendNameElse = tem.legend.data[i].name + '\n\n ' +
            tem.legend.data[i].metric +
            tem.legend.data[i].metric_unit +
            (tem.legend.data[i].percentRise ? '{a|↑}' : '{b|↓}') +
            tem.legend.data[i].percent +
            tem.legend.data[i].percent_unit
          tem.legend.data[i].name = legendNameElse
          tem.legend.data[i].textStyle = chartsConfig.textStyle
        }
      }
      tem['tooltip'] = chartsConfig.tooltip
      if (this.mark == '3') {
        var first = JSON.parse(JSON.stringify(tem.legend.data[0]))
        tem.legend.data.splice(0, 1)
        tem.legend.data.sort((a, b) => {
          if (a.metric_unit) {
            return b.metric - a.metric
          }
        })
        tem.legend.data = [...[first], ...tem.legend.data]
      }
      if (this.mark == '2' && (index == 1 || index == 3)) {
        tem.color = [
          '#f1675d',
          '#eee',
          '#f1675d',
          '#febe76',
          '#f6e58d',
          '#99ce7e',
          '#31c5d3',
          '#686ee0',
          '#b466f0',
          'grey'
        ]
        tem.series[1].stack = 'line'
        tem.series[1].type = 'bar'
      }
      if (this.mark == '3' && tem.positi && tem.positi == 'right') {
        // 机构资金右侧数据
        tem.legend.type = tem.legendType || 'scroll'
        tem.title.textStyle = {
          fontSize: '14'
        }
        this.barRightList.push(tem)
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
        left: '15%',
        width: '70%',
        label: {
          show: true,
          position: 'inside',
          color: '#333',
          rich: chartsConfig.textStyle.rich
        }
      }
      Object.assign(tem.series[0], funnelStyle)

      tem.series[0].data.forEach((item, index) => {
        item.name = `${item.name}  ${item.value}人  ${
          item.percentRise ? '{a|↑}' : '{b|↓}'
        }  ${item.percent}%`
      })
      tem.tooltip.formatter = '{a}<br/>{b}'
    },
    // 雷达 数据处理
    radarConfig (tem) {
      tem.tooltip = {}
      tem.series[1] &&
        (tem.series[1].itemStyle = {
          color: '#f6e58d'
        })
      tem.legend.orient = 'vertical'
      tem.legend.left = 'right'
      tem.legend.itemGap = 20
      tem.series.forEach((item, ind) => {
        item.data.map(val => {
          val.label = {
            normal: {
              show: true,
              formatter: function (params) {
                return params.value + '%'
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
        tem.color = [
          '#f1675d',
          '#febe76',
          '#f6e58d',
          '#99ce7e',
          '#31c5d3',
          '#686ee0',
          '#b466f0',
          'grey'
        ]
        // tem.legend.orient = 'vertical'
        // tem.legend.left = 'right'
        tem.legend.top = 'bottom'
        tem.legend.itemGap = 20
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
          })
        }
      }
    },
    // 四象限 数据处理
    quadrantConfig (tem) {
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
      let selectMap = res.data.selection[0].selectMap
      let selectList = []
      this.optionIds = []
      for (let key in selectMap) {
        if (key != '所有产品') {
          selectList.push({
            name: key,
            children: selectMap[key].map(item => {
              return {
                name: item
              }
            })
          })
          this.optionIds = [...this.optionIds, ...selectMap[key]]
        }
      }
      this.options = selectList
    }
  }
}
</script>

<style lang="scss">
.mod-demo-echarts {
  .el-card__body {
    padding: 10px;
  }
  .chart-box {
    min-height: 400px;
  }
  .lineCharts {
    min-height: 200px;
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
