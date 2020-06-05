<template>
  <div>
    <el-row style="margin-bottom: 15px;">
      <el-col :span="7" :offset="17">
        <span style="margin-right: 15px;">数据时间 {{ts}}</span>
        <el-button type="primary" icon="ios-download" @click="down">下载</el-button>
      </el-col>
    </el-row>
    <el-table ref="tab" id="tab" stripe border size="small" v-loading="loading" :data="data">
      <el-table-column prop="dts_bank_name" label="银行名称"></el-table-column>
      <el-table-column prop="dts_product_name" width="300" label="产品名称"></el-table-column>
      <el-table-column prop="invest_user_count" label="购买人数" align="right"></el-table-column>
      <el-table-column prop="invest_count" label="购买笔数" align="right"></el-table-column>
      <el-table-column prop="invest_amount" label="购买金额" align="right"></el-table-column>
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
import { list, chart } from '@/api/phRealtimeBoard/bankSelection'
export default {
  data () {
    return {
      loading: false,
      ts: '',
      data: [],
      timer: ''
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
  },
  methods: {
    down () {
      var xlsxParam = { raw: true } // 导出的内容只做解析，不进行格式转换
      var wb = XLSX.utils.table_to_book(document.querySelector('#tab'), xlsxParam)
      /* 获取二进制字符串作为输出 */
      var wbout = XLSX.write(wb, {
        bookType: 'xlsx',
        bookSST: true,
        type: 'array'
      })
      try {
        FileSaver.saveAs(
        // Blob 对象表示一个不可变、原始数据的类文件对象。
        // Blob 表示的不一定是JavaScript原生格式的数据。
        // File 接口基于Blob，继承了 blob 的功能并将其扩展使其支持用户系统上的文件。
        // 返回一个新创建的 Blob 对象，其内容由参数中给定的数组串联组成。
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
          dts_bank_name: '总计',
          invest_user_count: 0,
          invest_count: 0,
          invest_amount: 0
        }
        if (data.data) {
          for (let i of data.data) {
            if (i.dts_bank_name === '') {
              total.invest_user_count = i.invest_user_count
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
            text: '各银行金额占比'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          series: [
            {
              name: '购买金额',
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
  }
}
</script>
