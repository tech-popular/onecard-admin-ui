<template>
  <div class="mod-demo-echarts">
    <el-alert
        title=""
        type="warning"
        v-if="list.items && list.items.length>0"
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
      <el-col v-for="(outdata, index) in arr" :key="outdata.id" :span="12"  class='echartList' :class="`${mark == '2' ? 'Rainbow' : ''}${mark == '5' ? 'funnelStyle' : ''}`">
        <el-card>
          <el-select v-model="selectedList && selectedList.data && selectedList.data.length>0 && selectedList.id == outdata.id ? selectedList.data : outdata.selectListArr" class='selectList' multiple placeholder="全部" v-show="outdata.selection[0]" @visible-change="changeValue1(outdata, index)" @remove-tag="changeTag(outdata)">
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
            <li :key='index' v-for="(item, index) in outdata.legend.data">{{item.name}}{{item.metric}}{{item.metric_unit}}<span class="colorRed" :class="{'percentRise' : item.percentRise}">{{item.percentRise ? '↑' : '↓'}}</span>{{item.percent}}{{item.percent_unit}}</li>
          </ul>
          <ul>
          </ul>
        </div>
        <!-- <input class="allChecked" :id="'selectall' + index" @click="clickALlCheck(index, 'arr')" type="button" value="全不选" flag="1"/> -->
      </el-col>
    </el-row>
    <!-- 四象限 -->
    <div v-if="quadrantList && mark == '4'" class="quadrant">
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
    <!-- 其他总体数据展示 -->
    <div v-if='lineList && lineList.length>0' class="line">
      <div :key="item.id" v-for="(item) in lineList">
        <div class="lineEvery">
          <p>{{item.titleName}}</p>
          <h3>{{item.series[0].data[item.series[0].data.length-1].percent}}</h3>
          <div :id="'lineCharts' + item.id" class="lineCharts"></div>
        </div>
      </div>
    </div>
    <!-- 合计放款 -->
    <!-- <div class="allPay">
      <div class="allPayLeft">
        <div>
          <p>{{simpleList[0].title.text}}</p>
          <h3>{{simpleList[0].legend.extend.simple[0].metric}}{{simpleList[0].legend.extend.simple[0].metric_unit}}</h3>
        </div>
        <div>
          <div :key="index" v-for="(item, index) in simpleList[1].legend.extend.simple">
            <p>{{item.name}}</p>
            <p>{{item.metric}}{{item.metric_unit}} <span class="colorRed" :class="{'percentRise' : item.percentRise}">{{item.percentRise ? '↑' : '↓'}} {{item.percent}}{{item.percent_unit}}</span></p>
          </div>
        </div>
        <div>
          <div :key="index" v-for="(item, index) in simpleList[2].legend.extend.simple">
            <p>{{item.name}}</p>
            <p>{{item.metric}}{{item.metric_unit}} <span class="colorRed" :class="{'percentRise' : item.percentRise}">{{item.percentRise ? '↑' : '↓'}} {{item.percent}}{{item.percent_unit}}</span></p>
          </div>
        </div>
      </div>
      <div class="allPayRight"></div>
    </div> -->
    <!-- 机构资金监控 -->
    <div class="monitor" v-if="mark == '3'">
      <div class="monitorLeft" v-if="simpleList[0] || simpleList[1] || simpleList[2]">
        <div :key='item.id' v-for="(item) in simpleList">
          <p>{{item.legend.extend.simple[0].name}}</p>
          <p>{{item.legend.extend.simple[0].metric}}{{item.legend.extend.simple[0].metric_unit}}<span class="colorRed" :class="{'percentRise' : item.legend.extend.simple[0].percentRise}">{{item.legend.extend.simple[0].percentRise ? '↑' : '↓'}} {{item.legend.extend.simple[0].percent}}{{item.legend.extend.simple[0].percent_unit}}</span></p>
        </div>
      </div>
      <div class="monitorRight">
        <div class="monitorRightList" :key="item.id" v-for="(item, index) in barRightList">
          <div :id="'barCharts' + item.id" class="barCharts"></div>
          <input class="allChecked" :id="'selectall' + index" @click="clickALlCheck(index, 'barRightList')" type="button" value="全不选" flag="1"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import echarts from 'echarts'
  import { fprice, getChinese, getQueryString } from '@/utils'
  import 'echarts/lib/chart/funnel'
  import 'echarts/lib/chart/radar'
  export default {
    data () {
      return {
        props: { multiple: true },
        // chartLine: null,
        // chartBar: null,
        chartPie: null,
        myCharts: null,
        chartScatter: null,
        list: [],
        value: '预授信（常规黑指）',
        visualizes: [],
        arr: [], // 有几个图表
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
        visibleChange: false,
        apiItems: [],
        visualizeId: 1, // 图表筛选框
        selection: [],
        lineList: [], // 框框加折线图数据
        simpleList: [], // 侧边数据
        funnelList: [], // 漏斗图数据
        quadrantList: '', // 四象限数据
        defaultSelection: [], // 调用默认接口存的数据
        mark: '', // 区分是哪个列表点过来的
        selectedList: {},
        barRightList: [] // 右侧柱状图数据
      }
    },
    computed: {
      sidebarFold: {
        get () { return this.$store.state.common.sidebarFold },
        set (val) { this.$store.commit('common/updateSidebarFold', val) }
      }
    },
    watch: {
      $route (to) {
        if (to.path.indexOf('phoenix-spectaculars') != -1) {
          this.visualizeId = 1
          this.list = []
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
          this.chartPie = echarts.init(document.getElementById(label))
          this.chartPie.setOption(this.barRightList[index], true)
          window.addEventListener('resize', () => {
            this.chartPie.resize()
          })
        } else {
          let label = 'J_chartLineBox' + this.arr[index].id
          this.chartPie = echarts.init(document.getElementById(label))
          this.chartPie.setOption(this.arr[index], true)
          window.addEventListener('resize', () => {
            this.chartPie.resize()
          })
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
        }).then((resp) => {
          let res = resp.data
          this.defaultSelection = res.response.data[0]
        }).then(() => {
          this.queryList()
        })
      },

      // 获取列表
      queryList (selectionIndex, selectionData) {
        let { mark } = this.$data
        this.$http({
          url: this.$http.adornUrl('/phoenix/dashboard'),
          method: 'post',
          data: {
            data: {
              dashboardId: mark,
              dashboardSelection: [{ // 大屏
                name: 'dashBoard过滤策略',
                type: 'dashBoard',
                placeholder: this.list.placeholder || this.defaultSelection.placeholder,
                items: mark == '1' ? [{
                  name: this.value,
                  value: this.value
                }] : [],
                columnName: this.list.columnName || this.defaultSelection.columnName,
                mark: this.list.mark || this.defaultSelection.mark
              }],
              visualizeId: this.visualizeId,
              visualizeSelection: [{ // 图表
                name: 'visualize过滤策略',
                type: 'visualize',
                placeholder: selectionIndex ? (selectionIndex.placeholder) : '',
                items: selectionData ? this.apiItems : [],
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
            (res.data.selection.length > 0) && (this.list = res.data.selection[0]) // 下拉列表选项
            this.arr = []
            this.lineList = []
            this.barRightList = []
            this.simpleList = []
            if (res.data.visualizes) { // 图标列表
              res.data.visualizes.forEach((tem, index) => {
                tem.selectListArr = []
                if (tem.type != 'quadrant' && tem.type != 'simple' && tem.type != 'line' && this.mark != '3') {
                  this.arr.push(tem)
                }
                let grid = { // 设置柱状样式
                  top: '90',
                  right: '0',
                  bottom: '0',
                  left: '0',
                  containLabel: true
                }
                let legend = { // 设置标签样式
                  type: 'scroll',
                  top: '12%',
                  backgroundColor: '#fff',
                  padding: 0,
                  itemGap: 0
                }
                let color = ['#FF4040', '#634cff', '#febe76', '#31c5d3', '#f1675d', '#f6e58d', '#686ee0', '#99ce7e', '#b466f0', '#f7b500', '#48a37a']
                let title = {
                  top: 'top',
                  left: 'left'
                }
                let xAxis = {
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

                tem['grid'] = grid
                tem['color'] = color

                Object.assign(tem.title, title)
                Object.assign(tem.legend, legend)

                if (tem.xAxis) {
                  Object.assign(tem.xAxis, xAxis)
                }

                if (tem.type == 'bar') { // 折现柱状
                  if (this.mark == '2' && tem.id == '16') {
                    tem.color = ['#f1675d', '#f1675d', '#febe76', '#f6e58d', '#99ce7e', '#31c5d3', '#686ee0', '#b466f0', 'grey']
                  }
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
                        result += '<br/><span style="position:relative;left:0;top:-1px;display:inline-block;margin-right:5px;border-radius:  px;width:10px;height:10px;background:' + item.color + '"></span><span style="color:#fff;">' + getChinese(
                          item.seriesName) + '</span> : ' + fprice(item.value, 0) + '人</span>'
                      })
                      return result
                    }
                  }
                  tem['tooltip'] = tooltip
                  if (this.mark == '3' && tem.positi && tem.positi == 'right') { // 机构资金右侧数据
                    tem.legend.type = tem.legendType || 'scroll'
                    tem.title.textStyle = {
                      fontSize: '14'
                    }
                    this.barRightList.push(tem)
                  }
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
                  let funnelStyle = {
                    left: '15%',
                    width: '70%',
                    label: {
                      show: true,
                      position: 'inside',
                      color: '#333',
                      rich: this.textStyle.rich
                    }
                  }
                  Object.assign(tem.series[0], funnelStyle)

                  tem.series[0].data.forEach((item, index) => {
                    item.name = `${item.name}  ${item.value}人  ${item.percentRise ? '{a|↑}' : '{b|↓}'}  ${item.percent}%`
                  })
                  tem.tooltip.formatter = '{a}<br/>{b}'
                  this.funnelList = tem.legend.data
                } else if (tem.type == 'radar') { // 雷达
                  tem.tooltip = {}
                  tem.series[1] && (tem.series[1].itemStyle = {
                    color: 'blue'
                  })
                  tem.legend.orient = 'vertical'
                  tem.legend.left = 'right'
                  tem.legend.itemGap = 20
                } else if (tem.type == 'pies') { // 饼图嵌套
                  if (tem.series.length > 0) {
                    tem.series[0].radius = ['45%', '65%']
                    tem.series[1] && (tem.series[1].radius = ['0%', '20%'])
                    tem.color = ['#f1675d', '#febe76', '#f6e58d', '#99ce7e', '#31c5d3', '#686ee0', '#b466f0', 'grey']
                    // tem.legend.orient = 'vertical'
                    // tem.legend.left = 'right'
                    tem.legend.top = 'bottom'
                    tem.legend.itemGap = 20
                  }
                  console.log(tem)
                } else if (tem.type == 'quadrant') { // 四象限
                  this.quadrantList = tem.legend.extend
                } else if (tem.type == 'line') { // 框框嵌套折线图
                  tem.titleName = tem.title.text
                  tem.title = {}
                  tem.series[0].name = ''
                  tem.grid.top = ''
                  tem.series[0].areaStyle = {}
                  this.lineList.push(tem)
                } else if (tem.type == 'simple') {
                  this.simpleList.push(tem)
                }
                if (tem.selection[0]) {
                  this.selection = tem.selection[0].selectList && tem.selection[0].selectList.length > 0 ? tem.selection[0].selectList : tem.selection[0].items
                  this.visualizeId = tem.id
                }
                setTimeout(() => {
                  if (this.mark == '3' && tem.positi == 'right') {
                    let label = 'barCharts' + tem.id
                    this.myCharts = echarts.init(document.getElementById(label))
                    this.myCharts.setOption(tem, true)
                    window.addEventListener('resize', () => {
                      this.myCharts.resize()
                    })
                    return false
                  }
                  if (tem.type != 'quadrant' && tem.type != 'simple' && tem.type != 'line' && this.mark != '3') {
                    let label = 'J_chartLineBox' + tem.id
                    this.chartPie = echarts.init(document.getElementById(label))
                    this.chartPie.setOption(tem, true)
                    window.addEventListener('resize', () => {
                      this.chartPie.resize()
                    })
                  } else if (tem.type == 'line') {
                    let label = 'lineCharts' + tem.id
                    this.myCharts = echarts.init(document.getElementById(label))
                    this.myCharts.setOption(tem, true)
                    window.addEventListener('resize', () => {
                      this.myCharts.resize()
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
        this.quadrantList = ''
        this.lineList = []
        this.simpleList = []
        this.funnelList = ''
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
    .lineCharts {
      min-height: 200px;
    }
    .echartList{
      position: relative;
    }
    .funnelStyle{
      width: 33.33%;
    }
    .Rainbow:nth-child(odd){
      width: 30%;
    }
    .Rainbow:nth-child(even){
      width: 70%;
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
        left: 150px;
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
  .line{
    width: 100%;
    height: 300px;
    background: #f0f4f8;
    margin-top: 20px;
    &>div{
      .lineEvery{
        text-align: center;
        max-width: 400px;
        p{
          padding-top: 20px;
        }
      }
    }
    
  }
  .lineCharts{
    width: 400px;
  }
  .allPay{
    width: 100%;
    background: #f0f4f8;
    margin-top: 20px;
    display: flex;
    .allPayLeft{
      flex: 1;
      &>div{
        border-radius: 10px;
        margin: 20px;
        background: #ccc;
        text-align: center;
        padding: 20px 7px;
        div{
          font-size: 12px;
          line-height: 12px;
          margin-bottom: 10px;
        }
      }
    }
    .allPayRight{
      flex: 5;
    }
  }
  .monitor{
    width: 100%;
    // background: #f0f4f8;
    margin-top: 20px;
    display: flex;
    .monitorLeft{
      flex: 1;
      &>div{
        border-radius: 10px;
        margin: 40px 20px;
        background: #ccc;
        text-align: center;
        padding: 100px 7px;
        div{
          font-size: 12px;
          line-height: 12px;
          margin-bottom: 10px;
        }
      }
    }
    .monitorRight{
      flex: 5;
      .monitorRightList{
        // background: #ccc;
        margin: 20px;
        position: relative;
        box-sizing: border-box;
      }
      .barCharts{
        min-height: 300px;
        max-height: 300px;
      }
    }
  }
  .allChecked{
    position: absolute;
    top: 0;
    left: 50%;
    background: #f1675d;
    color: #fff;
    border: none;
    border-radius: 5px;
  }
</style>
