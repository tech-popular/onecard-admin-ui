<template>
  <el-row>
  <el-col :span="12">
    <div class="grid-content bg-purple">
      <h1 class="report-header-title">{{reportName}}</h1>
      <el-tooltip content="点击修改报表名称" placement="right" effect="light">
        <i class="el-icon-edit" @click="changeIconClick"></i>
      </el-tooltip>
    </div>
  </el-col>
  <el-col :span="12">
    <el-button-group class="report-header-btns">
      <el-button type="primary" icon="el-icon-refresh"></el-button>
      <el-button type="primary" icon="el-icon-setting"></el-button>
      <el-button type="primary" icon="el-icon-plus" @click="ChartTypeClick"></el-button>
    </el-button-group>
    <el-date-picker
      v-model="value"
      type="daterange"
      align="right"
      unlink-panels
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      :picker-options="pickerOptions"
      class="report-header-date">
    </el-date-picker>
  </el-col>
</el-row>
</template>

<script>
  export default {
    name: 'CreateReportHeader',
    data () {
      return {
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
        value: ''
      }
    },
    computed: {
      reportName: {
        get () { return this.$store.state.reportChart.reportName },
        set (val) { this.$store.commit('reportChart/setReportName', val) }
      }
    },
    methods: {
      changeIconClick () {
        this.$prompt('请输入报表名称', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^([a-zA-Z]|[\u4e00-\u9fa5])+\w*/,
          inputErrorMessage: '不能以数字开头'
        }).then(({ value }) => {
          this.reportName = value
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          })
        })
      },
      ChartTypeClick () {
        this.$emit('visible', {visibles: true, chartType: ''})
      }
    }
  }
</script>

<style lang="scss">
  $--color-primary: #17B3A3;
  .report-header-title {
    float: left;
    margin: 0 8px 0 0;
    padding: 0;
    height: 2rem;
    line-height: 2rem;
    font-size: 2rem;
    font-weight: 600;
  }
  .el-icon-edit {
    float: left;
    cursor: pointer;
    padding-top: .4rem;
    font-size: 1.8rem;
  }
  .report-header-btns {
    float: right;
  }
  .report-header-date {
    float: right;
    margin-right: 10px;
    &>.el-range-separator {
      padding: 0;
    }
  }
</style>
