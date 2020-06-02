<template>
  <div>
    <el-row style="margin-bottom: 15px;">
      <el-col span="2">
        <el-select v-model="type" style="width:120px;" @on-change="reload">
          <el-option value="全部" >全部</el-option>
          <el-option value="钱包" :disabled="true">钱包</el-option>
          <el-option value="悟空" :disabled="true">悟空</el-option>
        </el-select>
      </el-col>
      <el-col span="7" offset="15" >
        <span style="margin-right: 15px;">数据时间 {{ts}}</span>
        <el-button type="primary" icon="ios-download" @click="down">下载</el-button>
      </el-col>
    </el-row>
    <el-table ref="tab" stripe border size="small" :loading="loading" :columns="columns" :data="data">
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
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
import { log, list, chart } from '@/api/phRealtimeBoard/fundBoard'
export default {
  data () {
    return {
      type: '全部',
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
    log().then(({data}) => {
      console.log(data)
    })
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
        'sheetjs.xlsx'
        )
      } catch (e) {
        if (typeof console !== 'undefined') console.log(e, wbout)
      }
      return wbout
    },
    reload () {
      list().then(({data}) => {
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
        let chart = this.$echarts.init(document.getElementById('echarts'))
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
