<template>
  <div>
    <el-row style="margin-bottom: 15px;">
      <el-col :span="7" :offset="17" style="text-align: right;">
        <span style="margin-right: 15px;">数据时间 {{ts}}</span>
        <el-button type="primary" icon="ios-download" @click="down">下载</el-button>
      </el-col>
    </el-row>
    <el-table ref="tab" id="tab" stripe border size="small" v-loading="loading" :data="data" >
      <el-table-column prop="channel_id" label="渠道"></el-table-column>
      <el-table-column prop="fundcode" label="基金代码"></el-table-column>
      <el-table-column prop="fundname" label="基金名称"></el-table-column>
      <el-table-column prop="user_count" label="申购人数" align="right"></el-table-column>
      <el-table-column prop="invest_count" label="申购笔数" align="right"></el-table-column>
      <el-table-column prop="invest_amount" label="申购金额" align="right"></el-table-column>
    </el-table>
    <el-card style="margin-top: 15px;">
      <div id="echarts" style="height: 230px; "></div>
    </el-card>
  </div>
</template>
<script>
  import echarts from 'echarts'
  import FileSaver from 'file-saver'
  import XLSX from 'xlsx'
  import { list, chart } from '@/api/phRealtimeBoard/fundBoard'
  export default {
    nickname: 'Jjkb',
    data () {
      return {
        loading: false,
        ts: '',
        data: [],
        timer: ''
      }
    },
    methods: {
      down () {
        var xlsxParam = { raw: true } // 导出的内容只做解析，不进行格式转换
        var wb = XLSX.utils.table_to_book(document.querySelector('#tab'), xlsxParam)
        var wbout = XLSX.write(wb, {
          bookType: 'xlsx',
          bookSST: true,
          type: 'array'
        })
        try {
          FileSaver.saveAs(
          new Blob([wbout], { type: 'application/octet-stream' }),
          // 设置导出文件名称
          'data.xlsx'
          )
        } catch (e) {
          if (typeof console !== 'undefined') console.log(e, wbout)
        }
        return wbout
      },
      reload () {
        this.loading = true
        list().then(({data}) => {
          this.loading = false
          this.data = []
          let total = {
            channel_id: '总计',
            user_count: 0,
            invest_count: 0,
            invest_amount: 0
          }
          if (data.data) {
            for (let i of data.data) {
              if (i.channel_id === '') {
                total.user_count = i.user_count
                total.invest_count = i.invest_count
                total.invest_amount = i.invest_amount
              } else {
                this.data.push(i)
              }
              this.ts = i.tsn
            }
          }
          this.data.push(total)
        })
        chart().then(({data}) => {
          let seriesData = []
          if (data.data) {
            for (let i of data.data) {
              seriesData.push(
                {
                  value: i.v,
                  name: i.k
                }
              )
            }
          }
          let option = {
            title: {
              text: '各基金申购金额占比'
            },
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            series: [
              {
                name: '申购金额',
                type: 'pie',
                data: seriesData,
                itemStyle: {
                  emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                }
              }
            ]
          }
          let chart = echarts.init(document.getElementById('echarts'))
          chart.setOption(option, true)
          this.$nextTick(() => {
            window.addEventListener('resize', () => {
              chart.resize()
            })
            chart.resize()
          })
        })
      }
    },
    mounted () {
      this.reload()
      this.timer = setInterval(() => {
        this.reload()
      }, 300000)
    },
    beforeDestroy () {
      clearInterval(this.timer)
    }
  }
</script>
