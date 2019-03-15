<template>
  <el-row :gutter="20">
    <el-col :span="6" class="report-card" >
      <el-card :body-style="{ padding: 0 }">
        <div class="add-card">
          <h1 class="add-button" @click="newReport">+</h1>
          <p class="add-title">点击创建新报表</p>
        </div>
      </el-card>
    </el-col>
    <el-col :span="6" class="report-card" v-for="(item, index) of list" :key=item.reportId>
      <el-card :body-style="{ padding: 0 }">
        <div class="img-div" @click="openReport(item)">
          <img :src=item.imgurl class="image" />
        </div>
        <div style="padding: 6px 10px;">
          <h1 class="card-title">{{ item.reportTitle }}</h1>
          <div class="info">
            <time class="time">{{ item.defaultTime }}</time>
            <a :data-userid=item.userId>12345e6576</a>
          </div>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
  export default {
    name: 'ReportList',
    data () {
      return {
        list: [],
        newTitle: ''
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
      getReportList () {
        this.$http({
          url: this.$http.adornUrl('api/report/list'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.list = data.reportlist
          }
        })
      },
      newReport () {
        this.$prompt('请输入报表名称', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^([a-zA-Z]|[\u4e00-\u9fa5])+\w*/,
          inputErrorMessage: '名称不能为空且不能以数字和下划线开头!'
        }).then(({ value }) => {
          this.reportName = value
          this.$router.push({
            path: 'create-report'
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          })
        })
      },
      openReport (obj) {
        this.reportName = obj.reportTitle
        this.reportId = obj.reportId
        this.$router.push({name: 'create-report'})
      }
    },
    created () {
      this.getReportList()
    }
  }
</script>

<style lang="scss" scoped>
  .report-card {
    margin-bottom: 20px;
    cursor: pointer;
    &>div {
      cursor: pointer;
      animation: all .4s;
      &:hover {
        box-shadow: 6px 6px 20px #ebeef5;
        .add-title {
          color: #999;
        }
        .add-button {
          transform: scale(1.2, 1.2);
        }
      }
    }
  }
  .add-card, .image {
    width: 100%;
    height: 160px;
    display: block;
  }
  .add-card {
    height: 220px;
    display: flex;
    flex-direction: column;
    &>.add-button {
      width: 100%;
      text-align: center;
      margin: 34px auto;
      font-size: 100px;
      color: #333;
    }
    &>p {
      text-align: center;
      color: #fff;
    }
  }
  .card-title {
    margin-top: 0;
    font-size: 18px;
    line-height: 20px;
    color: #000;
  }
  .info {
    padding-bottom: 16px;
    .time {
      float: left;
      font-size: 13px;
      color: #999;
    }
    &>a {
      float: right;
      font-style: normal;
      text-decoration: none;
      color: #999;
    }
  }
</style>
