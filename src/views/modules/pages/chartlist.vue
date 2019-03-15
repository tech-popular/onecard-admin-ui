<template>
  <div class="">
    <el-row :gutter="20">
      <el-col :span="6" class="chart-card" >
        <el-card :body-style="{ padding: 0 }">
          <div class="add-card">
            <h1 class="add-button" @click="chartTypeClick">+</h1>
            <p class="add-title">点击创建新图形</p>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6" class="chart-card" v-for="(item, index) of list" :key=item.id>
        <el-card :body-style="{ padding: 0 }">
          <div class="img-div" @click="openChart(item)">
            <img :src=item.imgurl class="image" />
          </div>
          <div style="padding: 6px 10px;">
            <h1 class="card-title">{{ item.chartTitle }}</h1>
            <div class="info">
              <time class="time">{{ item.createTime }}</time>
              <a :data-userid=item.userId>{{ item.userName }}</a>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <tips-hive-components :dialogFormVisible="dialogFormVisible" @visible="jump"></tips-hive-components>
  </div>
</template>

<script>
  import TipsHiveComponents from './components/tipshivecomponents'
  export default {
    name: 'ChartList',
    components: {
      TipsHiveComponents
    },
    data () {
      return {
        list: [],
        dialogFormVisible: false,
        chartType: ''
      }
    },
    computed: {
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
      getChartList () {
        this.$http({
          url: this.$http.adornUrl('/api/chart/list'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.list = data.chartlist
          }
        })
      },
      chartTypeClick () {
        this.dialogFormVisible = true
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
      },
      openChart (obj) {
        this.chartName = obj.chartTitle
        this.chartId = obj.chartId
        this.$router.push({name: 'create-chart'})
      }
    },
    mounted () {
      this.getChartList()
    }
  }
</script>

<style lang="scss" scoped>
  .chart-card {
    margin-bottom: 20px;
    cursor: pointer;
    &>div {
      cursor: pointer;
      animation: all .4s;
      &:hover {
        box-shadow: 4px 4px 10px #ebeef5;
        .add-title {
          color: #000;
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
