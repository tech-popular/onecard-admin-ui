<template>
  <div>
    <el-form ref="form" :model="form" label-width="100px" label-position="right">
      <el-form-item
      label="图形名称"
      :rules="{
        required: true, message: '名称不能为空', trigger: 'blur'
      }">
        <el-col :span="6">
          <el-input v-model="form.name"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item
      label="时间范围"
      :rules="{
        required: true, message: '时间不能为空', trigger: 'blur'
      }">
        <el-col :span="6">
          <el-date-picker
            v-model="form.date"
            type="datetimerange"
            align="right"
            unlink-panels
            :picker-options="pickerOptions"
            range-separator="~"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            popper-class="report-header-date">
          </el-date-picker>
        </el-col>
      </el-form-item>
      <el-form-item v-for="(indicator, index) of form.indicators"
        :label="'指标' + index"
        :key="index"
        :prop="'indicators'"
        :rules="{
          required: true, message: '指标不能为空', trigger: 'blur'
        }">
        <el-col :span="12">
          <el-cascader
            :options="options"
            :show-all-levels="false"
            placeholder="可输入关键字进行搜索"
            expand-trigger="hover"
            :props="props"
            v-model="form.indicators[index].indicator"
            filterable
            change-on-select
          ></el-cascader>
          <el-select v-model="form.indicators[index].type" placeholder="显示类型" style="width:106px">
            <el-option label="折线" value="line"></el-option>
            <el-option label="柱子" value="bar"></el-option>
          </el-select>
          <el-select v-model="form.indicators[index].stack" placeholder="堆组" style="width:100px">
            <el-option label="第一组" value="0"></el-option>
            <el-option label="第二组" value="1"></el-option>
            <el-option label="第三组" value="2"></el-option>
            <el-option label="第四组" value="3"></el-option>
          </el-select>
          <el-button @click.prevent="removeIndicator(indicator)">删除</el-button>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-button @click="addIndicators">新增指标</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="onPreview">预览</el-button>
        <el-button type="primary" @click="onSubmit">添加到···</el-button>
      </el-form-item>
    </el-form>
    <div class="mod-demo-echarts">
      <el-row :gutter="10">
        <el-col :span="24">
          <el-card>
            <div class="box">
              <div v-show="form.chainShow" class="huanbi-box">
                <div class="">
                  <p>最近一小时</p>
                  <p>
                    <span class="number">234,143</span>
                    <span class="unit">人</span>
                    <em>
                      <span class="chain">
                        <span>环比</span>
                        <span>32.34%</span>
                      </span>
                      <span class="rose">
                        <span>同比</span>
                        <span>12.34%</span>
                      </span>
                    </em>
                  </p>
                </div>
                <div class="">
                  <em>
                    <span class="total">
                      <span>合计</span>
                      <span><em>12.23</em>万次</span>
                    </span>
                    <span class="mean">
                      <span>均值</span>
                      <span><em>2.34</em>万次</span>
                    </span>
                  </em>
                </div>
              </div>
              <div class="charttype">
                <!-- <el-dropdown @command="handleTypes" size="small" split-button type="primary">
                  <span id="types">
                    线图
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="线图">线图</el-dropdown-item>
                    <el-dropdown-item command="柱图">柱图</el-dropdown-item>
                    <el-dropdown-item command="饼图">饼图</el-dropdown-item>
                    <el-dropdown-item command="累积">累积</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown> -->
                <el-dropdown @command="handleGranules" size="small" split-button type="primary">
                  <span id="granules">
                    按分钟
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="按分钟">按分钟</el-dropdown-item>
                    <el-dropdown-item command="按半小时">按半小时</el-dropdown-item>
                    <el-dropdown-item command="按小时">按小时</el-dropdown-item>
                    <el-dropdown-item command="按天">按天</el-dropdown-item>
                    <el-dropdown-item command="按周">按周</el-dropdown-item>
                    <el-dropdown-item command="按月">按月</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
              <div id="J_chartLineBox" class="chart-box"></div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <el-dialog title="保存地址" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="">
          <el-radio-group v-model="form.resource">
            <el-radio label="添加到当前编辑的报表及图形列表中"></el-radio>
            <el-radio label="仅添加到图形列表中"></el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import echarts from 'echarts'
import 'echarts/theme/roma.js'
export default {
  name: 'CreateChart',
  data () {
    return {
      options: [],
      optionsList: [],
      props: {
        value: 'taskDescId'
      },
      form: {
        name: '',
        date: [],
        indicators: [],
        taskDescIds: [],
        chainShow: false
      },
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      chartLine: null,
      chartBar: null,
      chartPie: null,
      chartScatter: null,
      firstChartData: {
        data: [],
        time: ''
      },
      dialogFormVisible: false
    }
  },
  computed: {
    timeRange: function () {
      const start = new Date(this.form.date[0])
      const startDate = this.replen(start.getFullYear()) + '-' + this.replen(start.getMonth() + 1) + '-' + this.replen(start.getDate()) + ' ' + this.replen(start.getHours()) + ':' + this.replen(start.getMinutes()) + ':' + this.replen(start.getSeconds())
      const end = new Date(this.form.date[1])
      const endDate = this.replen(end.getFullYear()) + '-' + this.replen(end.getMonth() + 1) + '-' + this.replen(end.getDate()) + ' ' + this.replen(end.getHours()) + ':' + this.replen(end.getMinutes()) + ':' + this.replen(end.getSeconds())
      const timeR = startDate + ' ~ ' + endDate
      return timeR
    },
    reportName: {
      get () { return this.$store.state.reportChart.reportName },
      set (val) { this.$store.commit('reportChart/setReportName', val) }
    },
    reportId: {
      get () { return this.$store.state.reportChart.reportId },
      set (val) { this.$store.commit('reportChart/setReportName', val) }
    },
    chartName: {
      get () { return this.$store.state.reportChart.chartName },
      set (val) { this.$store.commit('reportChart/setChartName', val) }
    },
    chartId: {
      get () { return this.$store.state.reportChart.chartId },
      set (val) { this.$store.commit('reportChart/setChartName', val) }
    }
  },
  methods: {
    init () {
      let chartid = this.reportId
      this.getTarget()
      if (chartid) {
        this.$http({
          url: this.$http.adornUrl('api/cahrt/' + chartid),
          method: 'GET',
          data: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {

          }
        })
      } else {
        this.getTarget()
        this.getTargetList()
      }
    },
    getTarget () {
      this.$http({
        url: this.$http.adornUrl('api/charttarget/list'),
        method: 'GET',
        params: this.$http.adornParams()
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.options = data.targetInfo
        }
      })
    },
    getTargetList () {
      this.$http({
        url: this.$http.adornUrl('api/charttarget/all'),
        method: 'GET',
        params: this.$http.adornParams()
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.optionsList = data.targetInfo
        }
      })
    },
    onSubmit () {
      if (this.form.name.length < 1) {
        this.$message({
          message: '警告哦，图表标题不可为空!',
          type: 'warning'
        })
      } else if (this.form.date.length < 1) {
        this.$message({
          message: '警告哦，默认时间范围不可为空!',
          type: 'warning'
        })
      } else if (this.form.indicators.length < 1) {
        this.$message({
          message: '警告哦，至少要选择一项指标!',
          type: 'warning'
        })
      } else {
        console.log(this.form)
        console.log('submit!')
        this.dialogFormVisible = true
        console.log(this.reportId + '------' + this.chartId)
      }
    },
    onPreview () {
      console.log(this.form.indicators)
      if (this.form.name.length < 1) {
        this.$message({
          message: '警告哦，图表标题不可为空!',
          type: 'warning'
        })
      } else if (this.form.date.length < 1) {
        this.$message({
          message: '警告哦，默认时间范围不可为空!',
          type: 'warning'
        })
      } else if (this.form.indicators.length < 1) {
        this.$message({
          message: '警告哦，至少要选择一项指标!',
          type: 'warning'
        })
      } else {
        this.updata(this.initChartLine, '1')
        this.form.chainShow = true
      }
    },
    addIndicators () {
      this.form.indicators.push({})
    },
    removeIndicator (item) {
      var index = this.form.indicators.indexOf(item)
      if (index !== -1) {
        this.form.indicators.splice(index, 1)
      }
    },
    handleGranules (command) {
      document.getElementById('granules').innerHTML = command
      const aGranules = ['按分钟', '按半小时', '按小时', '按天', '按周', '按月']
      const aMath = ['1', '30', '60', '1440', '10800', '302400']
      aGranules.indexof = function (value) {
        var aGranule = this
        for (var i = 0; i < aGranule.length; i++) {
          if (aGranule[i] === value) {
            return i
          }
        }
      }
      this.updata(this.initChartLine, aMath[aGranules.indexof(command)])
      this.form.chainShow = true
      this.$message('click on item ' + command)
    },
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
    replen (d) {
      let res = d > 9 ? d : '0' + d
      return res
    },
    updata (callback, frequency) {
      this.form.taskDescIds = []
      for (let i of this.form.indicators) {
        this.form.taskDescIds.push(i.indicator[i.indicator.length - 1])
      }
      console.log(this.form.taskDescIds)
      this.$http({
        url: this.$http.adornUrl('api/charttarget/preview'),
        method: 'POST',
        data: this.$http.adornData({
          'beginDate': this.form.date[0],
          'endDate': this.form.date[1],
          'taskDescIds': this.form.taskDescIds,
          'timeInterval': frequency
        })
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.firstChartData = data
          callback()
        }
      })
    },
    // 折线图
    initChartLine () {
      let legend = {
        bottom: 0,
        data: []
      }
      let series = []
      // 循环出legend
      for (let i of this.form.indicators) {
        let k = i.indicator[i.indicator.length - 1]
        let n
        for (let item of this.optionsList) {
          if (k === item.taskDescId) {
            n = item.label
          }
        }
        legend.data.push({
          key: k,
          name: n
        })
        series.push({
          name: n
        })
      }
      // 将数据添加到series
      this.form.indicators.forEach((item, i) => {
        series[i].type = item.type
        series[i].stack = item.stack
        series[i].data = this.firstChartData.previewDate[item.indicator[item.indicator.length - 1]].metriccollect
        if (item.type === 'bar') {
          series[i].barWidth = '40%'
        }
      })
      console.log(this.firstChartData)
      console.log(legend)
      let option = {
        title: {
          text: this.form.name,
          position: 'left',
          textStyle: {
            fontSize: 20,
            lineHeight: '10px',
            fontWeight: 'bolder'
          },
          subtext: this.timeRange,
          subtextStyle: {
            lineHeight: '10px',
            fontSize: 14
          }
        },
        tooltip: {
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
        },
        legend: legend,
        grid: {
          top: '28%',
          left: '1%',
          right: '1%',
          bottom: '11%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: true,
          data: this.firstChartData.datecollect.date
        },
        yAxis: {
          type: 'value',
          axisLine: {
            show: false
          },
          position: 'right'
        },
        dataZoom: [{
          type: 'slider',
          show: true,
          bottom: '22px'
        }],
        series: series
      }
      console.log(option)
      this.chartLine = echarts.init(document.getElementById('J_chartLineBox'), 'roma')
      this.chartLine.setOption(option)
      window.addEventListener('resize', () => {
        this.chartLine.resize()
      })
    }
  },
  mounted () {
    this.init()
  },
  activated () {
    // 由于给echart添加了resize事件, 在组件激活时需要重新resize绘画一次, 否则出现空白bug
    if (this.chartLine) {
      this.chartLine.resize()
    }
  }
}
</script>

<style lang="scss" scoped>
.report-header-date {
  right: 0;
}
.mod-demo-echarts {
  .box {
    position: relative;
    &>.charttype {
      position: absolute;
      right: 0;
      top: 0;
      z-index: 99;
    }
    &>.huanbi-box {
      position: absolute;
      top: 10%;
      left: 4px;
      width: 100%;
      height: 80px;
      color: #333;
      display: flex;
    &>div {
      &:first-child {
        flex: 2;
        &>p {
          margin: 0;
          padding: 0;
          &:first-child {
            font-family: Roboto,'Helvetica Neue',Helvetica,Arial,sans-serif;
            margin-top: 22px;
            font-weight: 400;
            color: #8492A6;
            font-size: 13px;
          }
          &:last-child {
            &>.number {
              float: left;
              font-size: 36px;
              font-weight: 500;
              color: #000;
            }
            &>.unit {
              float: left;
              padding: 0 4px;
              font-size: 14px;
              line-height: 56px;
              color: #000;
            }
            &>em {
              float: left;
              font-style: normal;
              line-height: 20px;
              margin-left: 10px;
              font-size: 14px;
              color: #8492A6;
              &>span {
                display: block;
                &.chain {
                  &>span {
                    &:last-child {
                      color: #FC6772;
                      &::before {
                        content: "\25B2";
                        padding: 0 2px;
                      }
                    }
                  }
                }
                &.rose {
                  &>span {
                    &:last-child {
                      color: #67FC72;
                      &::before {
                        content: "\25BC";
                        padding: 0 2px;
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      &:last-child {
        flex: 1;
        border-left: 1px solid rgba(#8492A6, .6);
        padding: 10px 0 0 10px;
        &>em {
          font-style: normal;
          line-height: 20px;
          margin-left: 10px;
          font-size: 14px;
          color: #8492A6;
          &>span {
            display: block;
            &>span {
              &:last-child {
                &>em {
                    padding: 0 4px;
                    color: #000;
                    font-style: normal;
                    font-size: 16px;
                    font-weight: 500;
                  }
                }
              }
            }
          }
        }
      }
    }
    &>.chart-box {
      width: 100%;
      min-height: 500px;
      z-index: 9;
    }
  }
}
</style>
