<template>
  <el-dialog :title=" title + '人群特征分析'" :visible.sync="dialogVisible" width="1200px" v-loading="loading" :close-on-click-modal="false" :close-on-press-escape="false" :before-close="handleClose">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" :inline="true" label-width="120px" class="demo-ruleForm">
      <el-form-item label="已选人群：">{{channelInfoNameList}}</el-form-item>
      <el-form-item label="选择对比人群：" style="margin-left: 30px;">
        <el-select v-model="ruleForm.comTemplateId" filterable clearable placeholder="请选择">
          <el-option v-for="(item, index) in custGroupDataList" :key="index" :value="item.id" :label="item.name"></el-option>
        </el-select>
      </el-form-item>
      <br />
      <el-form-item prop="region" label="已选标签">
        <Treeselect
          :options="outParamsIndexList"
          :disable-branch-nodes="true"
          :show-count="true"
          :multiple="true"
          :load-options="loadOptions"
          noChildrenText="暂无数据"
          v-model="ruleForm.region"
          :clearable="false"
          search-nested
          placeholder="请选择"
          class="base-pane-item"
          @select="indexSelect"
          @deselect="indexDeselect"
        />
      </el-form-item>
      <br />
      <el-form-item style="margin-left: 50px;">
        <el-button @click="saveTable" type="success">人群特征分析</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="20" class="echart-content" v-if="chartLen > 0" v-loading="echartLoading">
      <el-col :span="12" v-for="(item, index) in seriesData" :key="index" class="order-echarts-col">
        <el-card shadow="never" class="order-echarts-card" v-if="isShowData(item)">
          <div v-if="item.indicatorsType === 'bar' && ((item.fieldType !== 'string' && item.fieldType !== '') || !item.enumTypeNum)" style="width: 100%; display:flex; justify-content: end;">
            <el-button type="text" @click="tagsGroupHandle(item)" size="small">编辑分组</el-button>
          </div>
          <div :id="'echart-' + item.id" class="echart"></div>
        </el-card>
        <el-card shadow="never" class="order-echarts-card" v-if="!isShowData(item)">
          <div class="echart">
            <h3>{{item.indicatorsName}}</h3>
            <p style="padding-top: 130px;text-align:center">暂无数据</p>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <div class="no-echart-content" v-else>{{dataResultText}}</div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false" type="primary">关闭</el-button>
    </span>
    <tagsGrouped v-if="tagsGroupedVisible" ref="tagsGrouped" @refreshDataList="getChartInfo"></tagsGrouped>
  </el-dialog>
</template>

<script>
import echarts from 'echarts'
import Treeselect, { LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect'
import { selectAllCata, overviewData, chartInfo, custGroupList, getAnalysisIndicators } from '@/api/dataAnalysis/dataInsightManage'
import { findVueSelectItemIndex, deepClone } from '../dataAnalysisUtils/utils'
import { pieJson, barJson } from '../dataAnalysisUtils/tableShowChartInit'
import tagsGrouped from './tagsGrouped.vue'
export default {
  data () {
    return {
      dialogVisible: false,
      title: '',
      loading: false,
      echartLoading: false,
      outParamsIndexList: [],
      selectedIndex: [], // 选中的指标，实时
      selectedData: [], // 存储fieldType
      limitLen: 10, // 限制选中指标个数
      channelInfoNameList: '',
      dataResultText: '暂无图表数据',
      chartLen: 0,
      seriesData: [],
      originRegion: [],
      regionList: [], // 可视化筛选数据的默认值
      indexGroups: [], // 默认分组
      indexId: null, // 选中分组ID
      channelId: '',
      ruleForm: {
        region: [],
        templateId: '',
        comTemplateId: ''
      },
      custGroupDataList: [],
      tagsGroupedVisible: false,
      rules: {
        region: [
          { required: true, message: '请选择', trigger: 'change' }
        ]
      },
      canUpdate: true // 可编辑
    }
  },
  components: { Treeselect, tagsGrouped },
  methods: {
    async loadOptions ({ action, parentNode, callback }) {
      if (action === LOAD_CHILDREN_OPTIONS) {
        callback()
      }
    },
    getSelectAllCata (channelCode, fn) { // 获取所有指标
      selectAllCata({ channelCode: channelCode, flag: '1', isSetGroup: '1' }).then(({ data }) => {
        if (data.status !== '1') {
          this.indexList = []
        } else {
          this.indexList = this.filterAllCata(data.data)
        }
        if (fn) {
          fn(this.indexList)
        }
      })
    },
    filterAllCata (tree) { // 清洗数据，按selectVue的格式重新组织指标数据
      let arr = []
      if (!!tree && tree.length !== 0) {
        tree.forEach((item, index) => {
          let obj = {}
          if (item.fieldType) {
            obj.id = item.id
            obj.englishName = item.englishName
            obj.label = item.chineseName
            obj.fieldType = item.fieldType
            obj.enumTypeNum = item.enumTypeNum
          } else {
            obj.id = item.id
            obj.label = item.name
          }
          if (this.filterAllCata(item.dataCata).length) { // 指标层 ，无children
            obj.children = this.filterAllCata(item.dataCata) // 指标集合
            arr.push(obj)
          } else if (this.filterAllCata(item.dataIndex).length) {
            obj.children = this.filterAllCata(item.dataIndex) // 指标集合
            arr.push(obj)
          } else {
            if (!item.fieldType) {
              obj.children = null
            } else {
              arr.push(obj)
            }
          }
        })
      }
      return arr
    },
    indexSelect (node) { // 选中出参
      this.selectedIndex.push(node.id)
      this.selectedData.push(node)
      if (this.selectedIndex.length >= this.limitLen) {
        let indexListArr = deepClone(this.indexList)
        this.outParamsIndexList = this.disabledOutParamsList(this.selectedIndex.length, indexListArr)
      }
    },
    indexDeselect (node) { // 删除出参
      let originLen = this.selectedIndex.length // 删除之前的数据长度
      this.selectedIndex = this.selectedIndex.filter(item => item !== node.id) // 删除数据
      this.selectedData = this.selectedData.filter(item => item.id !== node.id) // 删除数据
      let newLen = this.selectedIndex.length // 删除后的数据长度
      if (originLen === this.limitLen && newLen === this.limitLen - 1) {
        let indexListArr = deepClone(this.indexList)
        this.outParamsIndexList = this.disabledOutParamsList(newLen, indexListArr)
      }
    },
    updateOutParamsList (indexList) { // 获取出参默认展开列表
      let indexListArr = deepClone(indexList)
      if (this.ruleForm.region && this.ruleForm.region.length) {
        this.ruleForm.region.forEach(item => {
          let indexPath = findVueSelectItemIndex(indexListArr, item * 1) + ''
          let indexPathArr = indexPath.split(',')
          let a = indexListArr
          indexPathArr.forEach((pitem, index) => {
            if (index < indexPathArr.length - 1) {
              a[pitem].isDefaultExpanded = true
              a = a[pitem].children
            }
          })
        })
        // 如果已选的指标已经等于限制个数时，默认其他的不可选
        if (this.ruleForm.region.length >= this.limitLen) {
          indexListArr = this.disabledOutParamsList(this.ruleForm.region.length, indexListArr)
        }
        return indexListArr
      } else {
        return indexListArr
      }
    },
    disabledOutParamsList (len, indexListArr) { // 选择超出N个后，其他的禁选
      if (len >= this.limitLen) { // 多于N条时，不可再选
        indexListArr.forEach((citem, cindex) => {
          if (citem.children && citem.children.length) {
            this.disabledOutParamsList(len, citem.children)
          } else {
            if (!this.selectedIndex.includes(citem.id)) {
              citem.isDisabled = true
            } else {
              citem.isDisabled = false
            }
          }
        })
        return indexListArr
      } else { // 少于N条时，可以随便选
        indexListArr.forEach((citem, cindex) => {
          if (citem.children && citem.children.length) {
            this.disabledOutParamsList(len, citem.children)
          } else {
            citem.isDisabled = false
          }
        })
        return indexListArr
      }
    },
    // 获取已选择的节点
    getSelectCata (indexList, selectedIndex) {
      let indexListArr = deepClone(indexList)
      indexListArr.forEach((citem, cindex) => {
        if (citem.children && citem.children.length) {
          this.getSelectCata(citem.children, selectedIndex)
        } else {
          if (selectedIndex.includes(citem.id)) {
            this.selectedData.push(citem)
          }
        }
      })
      // this.getSelectColumns()
    },
    init (val, canUpdate) {
      this.loading = true
      this.regionList = []
      this.dialogVisible = true
      this.title = val.name
      this.ruleForm.templateId = val.id
      this.canUpdate = canUpdate
      this.indexGroups = []
      this.ruleForm.comTemplateId = ''
      this.indexId = null
      this.$nextTick(() => {
        this.$refs.ruleForm.clearValidate()
      })
      this.getOverviewData(val.id, val.channelId.split(','))
      custGroupList().then(({ data }) => {
        if (data.status * 1 !== 1) {
          this.loading = false
          return this.$message({
            type: 'error',
            message: data.message
          })
        }
        this.custGroupDataList = data.data
      })
    },
    getOverviewData (id, channelCode) {
      let type = '2' // 明细预览传1，特征分析传2
      overviewData(id, type).then(({ data }) => {
        if (data.status * 1 !== 1) {
          this.loading = false
          return this.$message({
            type: 'error',
            message: data.message
          })
        }
        // this.ruleForm.region = data.data.lableValList ? data.data.lableValList.map(item => item * 1) : [5486, 5590]
        // this.selectedIndex = this.ruleForm.region
        // this.getChartInfo()
        this.channelInfoNameList = data.data.channelInfoNameList.join('、')
        this.channelInfoNameList.slice(0, data.data.channelInfoNameList.length - 1)
        this.getSelectAllCata(channelCode, (indexList) => {
          // this.getRegionList(indexList)
          if (!data.data.lableValList) {
            this.getIndicators(channelCode, indexList)
          } else {
            this.ruleForm.region = data.data.lableValList.map(item => item * 1)
            this.handleParameters(indexList)
          }
          // this.ruleForm.region = data.data.lableValList ? data.data.lableValList.map(item => item * 1) : deepClone(this.regionList)
          // this.selectedIndex = this.ruleForm.region
          // this.outParamsIndexList = this.updateOutParamsList(indexList)
          // this.getSelectCata(indexList, this.selectedIndex)
          // this.getChartInfo(this.indexGroups, this.indexId)
          // this.$nextTick(() => {
          //   this.loading = false
          // })
        })
      })
    },
    // 处理其余参数
    handleParameters (indexList) {
      this.selectedIndex = this.ruleForm.region
      this.outParamsIndexList = this.updateOutParamsList(indexList)
      this.getSelectCata(indexList, this.selectedIndex)
      this.getChartInfo(this.indexGroups, this.indexId)
      this.$nextTick(() => {
        this.loading = false
      })
    },
    // 获取默认已选标签
    getIndicators (channelCode, indexList) {
      getAnalysisIndicators(channelCode).then(({ data }) => {
        if (data.status * 1 !== 1) {
          this.loading = false
          return this.$message({
            type: 'error',
            message: data.message
          })
        }
        if (data.data.length) {
          data.data.forEach(item => {
            this.regionList.push(Number(item.fieldId))
          })
        } else {
          this.getRegionList(indexList)
        }
        // this.ruleForm.region = data.data.lableValList ? data.data.lableValList.map(item => item * 1) : deepClone(this.regionList)
        this.ruleForm.region = this.regionList
        this.handleParameters(indexList)
      })
    },
    getRegionList (indexList) {
      indexList && indexList.forEach((item, index) => {
        if (!item.children && this.regionList.length < 4) {
          this.regionList.push(item.id)
        } else {
          this.getRegionList(item.children)
        }
      })
    },
    isShowData (item) {
      if ((item.indicatorsType === 'pie' && item.valList) || (item.indicatorsType === 'bar' && item.series)) {
        return true
      } else {
        return false
      }
    },
    getChartInfo (indexGroups, indexId) {
      console.log('this.ruleForm.region: ', this.ruleForm.region)
      this.seriesData = []
      this.chartLen = 0
      this.echartLoading = true
      this.dataResultText = '数据加载中...'
      chartInfo({
        templateId: this.ruleForm.templateId,
        indicators: this.ruleForm.region,
        comTemplateId: this.ruleForm.comTemplateId,
        indexId: indexId,
        // templateId: 985,
        // indicators: [16694, 16211],
        // comTemplateId: 986,
        indexGroupConfigs: indexGroups
      }).then(({ data }) => {
        if (data.status !== '1' || !data.data.data || !data.data.data.length) {
          this.$message({
            type: 'error',
            message: data.message || '数据异常'
          })
          this.dataResultText = '图表数据异常'
          this.chartLen = 0
          return
        }
        let resData = data.data.data
        this.seriesData = resData
        this.chartLen = resData.length
        this.seriesData.map((item, index) => {
          let option = {}
          if (item.indicatorsType === 'pie') {
            if (!item.valList || !item.valList.length) {
              this.echartLoading = false
              this.dataResultText = '暂无图表数据'
              return
            }
            let optionSeriesData = []
            item.valList.forEach(item => {
              optionSeriesData.push({
                name: item.name,
                value: item.percentStr
              })
            })
            option = JSON.parse(JSON.stringify(pieJson))
            option.id = item.id
            option.title.text = item.indicatorsName
            option.series[0].name = item.indicatorsName
            option.series[0].data = optionSeriesData
            item.valList.forEach(item => {
              option.legend.data.push(item.name)
            })
            option.series[0].label = {
              normal: {
                formatter: params => {
                  return (
                    '{icon|●}{name|' + params.name + '}：{value|' + params.value + '}{percent|，' + params.percent + '%}'
                  )
                },
                textAlign: 'center',
                rich: {
                  color: '#666',
                  name: {
                    color: '#666',
                    textAlign: 'left'
                  },
                  percent: {
                    color: '#666',
                    textAlign: 'left'
                  },
                  value: {
                    color: '#666',
                    textAlign: 'center'
                  }
                }
              }
            }
          }
          if (item.indicatorsType === 'bar') {
            if (!item.series || !item.series.length) {
              this.echartLoading = false
              this.dataResultText = '暂无图表数据'
              return
            }
            option = JSON.parse(JSON.stringify(barJson))
            option.id = item.id
            option.title.text = item.indicatorsName
            option.xAxis.data = item.xaxisData
            option.tooltip = {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow'
              }
            }
            option.legend = {
              orient: 'vertical',
              left: 'right',
              icon: "rect",
              itemHeight: 10,
              itemWidth: 10,
              top: 10
            }
            item.fieldType = this.selectedData.filter(citem => citem.id === item.id)[0].fieldType
            if (this.ruleForm.comTemplateId) {
              option.series = item.series
            } else {
              option.series[0].name = item.indicatorsName
              option.series[0].data = item.series
            }
            option.yAxis.axisLabel.formatter = value => {
              if (value >= 10000) {
                value = (value / 10000) + 'w'
              }
              if (value >= 1000) {
                value = (value / 1000) + 'k'
              }
              return value
            }
          }
          setTimeout(() => {
            let chart = null
            const docu = document.getElementById(
              'echart-' + option.id
            )
            chart = echarts.init(docu)
            chart.setOption(option, true)
            this.echartLoading = false
            window.addEventListener('resize', () => {
              chart.resize()
            })
          }, 500)
        })
      })
    },

    saveTable () {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.getChartInfo(this.indexGroups, this.indexId)
        }
      })
    },
    tagsGroupHandle (val) {
      let selected = this.selectedData.filter(item => item.id === val.id)[0]
      this.tagsGroupedVisible = true
      this.$nextTick(() => {
        this.$refs.tagsGrouped.init(val, selected)
      })
    },
    // 弹窗状态
    handleClose () {
      this.dialogVisible = false
    }
  }
}
</script>
<style scoped>
.echart {
  height: 400px;
}
.echart h3 {
  margin: 0;
}
.order-echarts-col {
  margin-bottom: 20px;
}
.no-echart-content {
  width: 100%;
  padding: 30px 0;
  text-align: center;
  border-bottom: 1px dashed #d8d8d8;
}
.base-pane-item {
  width: 900px;
  line-height: 38px;
}
.vue-treeselect {
  min-height: 38px;
  line-height: 24px;
  max-width: 100%;
}
</style>>
