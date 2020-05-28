<template>
  <div>
    <el-card class="search-content" shadow="nerver">
      <div class="search-title clearfix" slot="header">
        搜索服务
        <!-- <el-button type="success" size="mini" icon="el-icon-plus" @click="addSearchScene">新建搜索场景</el-button> -->
      </div>
      <div class="search-pane">
        <el-card class="box-card" shadow="hover" v-for="(item, index) in searchServiceList" :key="index">
          <el-row :gutter="20">
            <el-col :span="8">
              <div class="box-left">
                <img width="60px" height="60px" :src="imgList[item.type]" />
              </div>
            </el-col>
            <el-col :span="16">
              <div class="box-right">
                <p>场景名称：{{item.name}}</p>
                <p>场景ID（boxid）：{{item.boxid}}</p>
                <p>状态：{{item.status}}</p>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <div class="box-bottom">
                <el-button type="primary" size="mini" @click="ruleConfigClick">规则配置</el-button>
                <el-button type="default" size="mini" @click="statisticChartClick">统计分析</el-button>
                <el-button type="warning" size="mini" @click="realTimestrategyClick">实时策略</el-button>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </div>
    </el-card>
    <el-card class="recommend-content" shadow="nerver">
      <div class="search-title" slot="header">
        推荐服务
        <el-button type="success" size="mini" icon="el-icon-plus" @click="addRecommendScene">新建推荐场景</el-button>
      </div>
      <div class="recommend-pane">
        <el-card class="box-card" shadow="hover" v-for="(item, index) in recommendServiceList" :key="index">
          <el-row :gutter="20">
            <el-col :span="8">
              <div class="box-left">
                <img width="60px" height="60px" :src="imgList[item.type]" />
              </div>
            </el-col>
            <el-col :span="16">
              <div class="box-right">
                <p>场景名称：{{item.name}}</p>
                <p>场景ID（boxid）：{{item.boxid}}</p>
                <p>状态：{{item.status}}</p>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <div class="box-bottom">
                <el-button type="primary" size="mini" @click="ruleConfigClick">规则配置</el-button>
                <el-button type="default" size="mini" @click="statisticChartClick">统计分析</el-button>
                <el-button type="warning" size="mini" @click="realTimestrategyClick">实时策略</el-button>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </div>
    </el-card>
    <add-search-scene v-if="addSearchSceneVisible" ref="addSearchScene"></add-search-scene>
    <add-recommend-scene v-if="addRecommendSceneVisible" ref="addRecommendScene"></add-recommend-scene>
    <rule-config v-if="ruleConfigVisible" ref="ruleConfig"></rule-config>
    <statistic-chart v-if="statisticChartVisible" ref="statisticChart"></statistic-chart>
    <real-time-strategy v-if="realTimeStrategyVisible" ref="realTimeStrategy" @closeDialog="closeDialogEvent"></real-time-strategy>
  </div>
</template>
<script>
import addRecommendScene from './sceneManageComponents/sceneManage-sceneConfig-add-search-scene'
import addSearchScene from './sceneManageComponents/sceneManage-sceneConfig-add-recommend-scene'
import ruleConfig from './sceneManageComponents/sceneManage-sceneConfig-rule-config'
import statisticChart from './sceneManageComponents/sceneManage-sceneConfig-statistic-chart'
import realTimeStrategy from './sceneManageComponents/sceneManage-sceneConfig-real-time-strategy'
export default {
  data () {
    return {
      imgList: {
        'serachResult': require('./assets/images/img-search.png'),
        'homeRecommend': require('./assets/images/img-recommend.png'),
        'searchNoResult': require('./assets/images/img-noresult.png'),
        'serachInputPage': require('./assets/images/img-input.png')
      },
      searchServiceList: [
        {
          type: 'serachResult',
          name: '搜索结果页',
          boxid: '1232323',
          status: '已上线'
        },
        {
          type: 'serachResult',
          name: '搜索结果页',
          boxid: '545454',
          status: '未上线'
        }
      ],
      recommendServiceList: [
        {
          type: 'homeRecommend',
          name: '首页推荐',
          boxid: '1232323',
          status: '已上线'
        },
        {
          type: 'searchNoResult',
          name: '搜索无结果',
          boxid: '545454',
          status: '未上线'
        },
        {
          type: 'serachInputPage',
          name: '搜索输入页',
          boxid: '545454',
          status: '未上线'
        }
      ],
      addSearchSceneVisible: false,
      addRecommendSceneVisible: false,
      ruleConfigVisible: false,
      statisticChartVisible: false,
      realTimeStrategyVisible: false
    }
  },
  components: { addSearchScene, addRecommendScene, ruleConfig, statisticChart, realTimeStrategy },
  methods: {
    addSearchScene () { // 新建搜索场景
      this.addSearchSceneVisible = true
      this.$nextTick(() => {
        this.$refs.addSearchScene.init()
      })
    },
    addRecommendScene () { // 新建推荐场景
      this.addRecommendSceneVisible = true
      this.$nextTick(() => {
        this.$refs.addRecommendScene.init()
      })
    },
    ruleConfigClick () { // 规则配置
      this.ruleConfigVisible = true
      this.$nextTick(() => {
        this.$refs.ruleConfig.init()
      })
    },
    statisticChartClick () { // 统计分析
      this.statisticChartVisible = true
      this.$nextTick(() => {
        this.$refs.statisticChart.init()
      })
    },
    realTimestrategyClick () { // 实时策略
      this.realTimeStrategyVisible = true
      this.$nextTick(() => {
        this.$refs.realTimeStrategy.init()
      })
    },
    closeDialogEvent () {
      this.realTimeStrategyVisible = false
    }
  }
}
</script>
<style scoped>
  .search-content {
    margin-bottom: 30px
  }
  .search-title {
    font-weight: bold;
    font-size: 16px;
    line-height: 28px;
  }
  .search-title button {
    float: right;
  }
  .search-pane {
    width: 100%;
    overflow: hidden;
  }
  .box-card {
    width: 320px;
    height: 200px;
    float: left;
    margin: 0 50px 20px 0;
  }
  .box-left {
    padding-top: 28px;
    text-align: center;
  }
  .box-right {
    font-size: 14px;
    line-height: 18px;
  }
  .box-bottom {
    margin-top: 10px;
  }
</style>
