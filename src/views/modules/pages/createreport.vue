<template>
  <div class="create-report-wrapper">
    <create-report-header @visible="jump"></create-report-header>
    <h1 v-show="!chartLength" class="create-report-comment">当前报表中还没有内容，请点击右上角加号进行添加···</h1>
    <div v-show="chartLength">
      <el-row :gutter="20">
        <el-col :span="16"><div class="grid-content bg-purple"></div></el-col>
        <el-col :span="8"><div class="grid-content bg-purple"></div></el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24"><div class="grid-content bg-purple"></div></el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12"><div class="grid-content bg-purple"></div></el-col>
        <el-col :span="12"><div class="grid-content bg-purple"></div></el-col>
      </el-row>
    </div>
    <tips-hive-components :dialogFormVisible="dialogFormVisible" @visible="jump"></tips-hive-components>
  </div>
</template>

<script>
  import CreateReportHeader from './components/createreportheader'
  import TipsHiveComponents from './components/tipshivecomponents'
  export default {
    name: 'CreateReport',
    components: {
      CreateReportHeader,
      TipsHiveComponents
    },
    data () {
      return {
        titleContent: '',
        dialogFormVisible: false,
        chartLength: 0
      }
    },
    computed: {
      reportName: {
        get () { return this.$store.state.reportChart.reportName },
        set (val) { this.$store.commit('reportChart/setReportName', val) }
      },
      reportId: {
        get () { return this.$store.state.reportChart.reportId },
        set (val) { this.$store.commit('reportChart/setReportName', val) }
      }
    },
    methods: {
      init () {
        let reportid = this.reportId
        if (reportid) {
          this.$http({
            url: this.$http.adornUrl('api/report/' + reportid),
            method: 'GET',
            data: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              console.log(data)
            }
          })
        } else {
          this.$http({
            url: this.$http.adornUrl('api/report/init'),
            method: 'post',
            params: this.$http.adornParams({
              'reportName': this.reportName
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              console.log(data)
            }
          })
        }
      },
      jump (enlargeAmount) {
        this.dialogFormVisible = enlargeAmount.visibles
        if (!enlargeAmount.visibles && enlargeAmount.chartType.length > 0) {
          this.$router.push({
            path: 'create-chart',
            query: {
              chartType: enlargeAmount.chartType
            }
          })
        }
      }
    },
    mounted () {
      this.init()
    }
  }
</script>

<style lang="scss" scoped>
  .create-report-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .grid-content {
    min-height: 400px;
    background: red;
    margin-top: 20px;
  }
  .create-report-comment {
    position: fixed;
    top: 50%;
    left: 50%;
    margin-left: -100px;
    font-size: 2rem;
    color: #666;
    cursor: pointer;
  }
</style>
