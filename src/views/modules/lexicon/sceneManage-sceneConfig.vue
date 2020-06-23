<template>
  <div>
    <el-card class="search-content" shadow="nerver">
      <div class="search-title clearfix" slot="header">
        搜索服务
        <el-button type="success" size="mini" icon="el-icon-plus" @click="addSearchScene">新建搜索场景</el-button>
      </div>
      <div class="recommend-pane" v-if="searchServiceList.length === 0">暂无搜索服务，快去新建吧～</div>
      <div class="search-pane" v-else>
        <el-card class="box-card" shadow="hover" v-for="(item, index) in searchServiceList" :key="index">
          <el-row :gutter="20">
            <el-col :span="8">
              <div class="box-left">
                <img width="60px" height="60px" :src="imgList.serachResult" />
              </div>
            </el-col>
            <el-col :span="16">
              <div class="box-right">
                <p>场景名称：{{item.sceneName}}</p>
                <p>场景ID（boxid）：{{item.boxId}}</p>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <div class="box-bottom">
                <el-button type="primary" size="mini" @click="ruleConfigClick(item.boxId,'sousuo')">规则配置</el-button>
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
      <div class="recommend-pane" v-if="recommendServiceList.length === 0">暂无推荐服务，快去新建吧～</div>
      <div class="recommend-pane" v-else>
        <el-card class="box-card" shadow="hover" v-for="(item, index) in recommendServiceList" :key="index">
          <el-row :gutter="20">
            <el-col :span="8">
              <div class="box-left">
                <img width="60px" height="60px" :src="imgList.homeRecommend" />
              </div>
            </el-col>
            <el-col :span="16">
              <div class="box-right">
                <p>场景名称：{{item.sceneName}}</p>
                <p>boxid：{{item.boxId}}</p>
                <p>推荐类型：{{item.recommendTypeId}}</p>
                <p>接口类型：{{item.interfaceType}}</p>
                <!-- <p>状态：{{item.status}}</p> -->
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <div class="box-bottom">
                <el-button type="primary" size="mini" @click="ruleConfigClick(item.boxId)">规则配置</el-button>
                <el-button type="default" size="mini" @click="statisticChartClick">统计分析</el-button>
                <el-button type="warning" size="mini" @click="realTimestrategyClick">实时策略</el-button>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </div>
    </el-card>
    <add-search-scene v-if="addSearchSceneVisible" ref="addSearchScene" @childByValue="childByValue"></add-search-scene>
    <add-recommend-scene v-if="addRecommendSceneVisible" ref="addRecommendScene" @childByValue="childByValue"></add-recommend-scene>
    <rule-config v-if="ruleConfigVisible" ref="ruleConfig" :boxId='boxId' :sacherRule='rules'></rule-config>
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
import { listSearchScene } from '@/api/lexicon/sceneManage'
export default {
  data () {
    return {
      imgList: {
        'serachResult': require('./assets/images/img-search.png'),
        'homeRecommend': require('./assets/images/img-recommend.png'),
        'searchNoResult': require('./assets/images/img-noresult.png'),
        'serachInputPage': require('./assets/images/img-input.png')
      },
      searchServiceList: [],
      recommendServiceList: [],
      addSearchSceneVisible: false,
      addRecommendSceneVisible: false,
      ruleConfigVisible: false,
      statisticChartVisible: false,
      realTimeStrategyVisible: false,
      boxId: '',
      rules: false
    }
  },
  components: { addSearchScene, addRecommendScene, ruleConfig, statisticChart, realTimeStrategy },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      listSearchScene().then(({data}) => {
        this.searchServiceList = data.data.listSearchSceneSets
        this.recommendServiceList = data.data.listRecommendSceneSets
      })
    },
    addSearchScene () { // 新建搜索场景
      this.addSearchSceneVisible = true
      this.$nextTick(() => {
        this.$refs.addSearchScene.init()
      })
    },
    childByValue (value) {
      this.init()
    },
    addRecommendScene () { // 新建推荐场景
      this.addRecommendSceneVisible = true
      this.$nextTick(() => {
        this.$refs.addRecommendScene.init()
      })
    },
    ruleConfigClick (boxId, val) { // 规则配置
      this.rules = val
      this.boxId = boxId
      this.ruleConfigVisible = true
      // if (val === 'sousuo') {
      //   this.rules = true
      // }
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
