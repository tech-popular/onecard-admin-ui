<template>
  <el-dialog
      :title="'【' + title + '】分群概览'"
      :visible.sync="dialogVisible"
      width="1200px"
      v-loading="loading"
      :before-close="handleClose">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" :inline="true" label-width="120px" class="demo-ruleForm">
        <el-form-item label="分群用户数：">{{templateUserNum}}人，在<span class="channl">{{channelInfoNameList}}</span>渠道中占比{{userRateStr}}</el-form-item>
        <el-form-item label="最近计算时间：" style="margin-left: 30px;">{{lastCalTime}}</el-form-item>
        <br/>
        <el-form-item prop="region" label="可视化筛选：">
          <Treeselect
            :options="outParamsIndexList"
            :disable-branch-nodes="true"
            :show-count="true"
            :multiple="true"
            :load-options="loadOptions"
            noChildrenText="暂无数据"
            v-model="ruleForm.region"
            :clearable="false"
            :disabled="isShow"
            search-nested
            placeholder="请选择"
            class="base-pane-item"
            @select="indexSelect"
            @deselect="indexDeselect"
          />
        </el-form-item>
        <el-form-item>
          <el-tooltip placement="top">
            <div slot="content">渠道多选时，图表显示指标所在渠道用户数据</div>
            <i class="el-icon-info cursor-pointer" style="color:#409eff"></i>
          </el-tooltip>
        </el-form-item>
        <el-form-item>
          <el-button @click="editTable" type="primary" size="small" v-if="isShow">编辑</el-button>
          <el-button @click="saveTable" type="primary" size="small" v-if="!isShow">保存</el-button>
          <el-button @click="cancelTable" size="small" v-if="!isShow">取消</el-button>
        </el-form-item>
      </el-form>
      <el-row :gutter="20" class="echart-content" v-if="chartLen > 0" v-loading="echartLoading">
        <el-col :span="12" v-for="(item, index) in seriesData" :key="index" class="order-echarts-col">
          <el-card shadow="never" class="order-echarts-card">
            <div :id="'echart-' + item.id" class="echart"></div>
          </el-card>
        </el-col>
      </el-row>
      <div class="no-echart-content" v-else style="">
        暂无图表数据
      </div>
      <div class="custer-history">
        <p>分群历史情况：</p>
        <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;">
          <el-table-column label="序号" header-align="center" align="center" width="100">
            <template slot-scope="scope">
              {{scope.$index + 1}}
            </template>
          </el-table-column>
          <el-table-column prop="lastCalTime" header-align="center" align="center" label="计算完成时间"></el-table-column>
          <el-table-column prop="templateUserNum" header-align="center" align="center" label="分群用户数"></el-table-column>
          <el-table-column prop="type" header-align="center" align="center" label="计算类型">
            <template slot-scope="scope">
              <span>{{scope.row.type === 'static' ? '静态' : '动态'}}</span>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="pageNum"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        :total="totalCount"
        layout="total, sizes, prev, pager, next, jumper"/>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" type="primary">关闭</el-button>
      </span>
    </el-dialog>
</template>

<script>
import echarts from 'echarts'
import Treeselect, { LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect'
import { selectAllCata, overviewData, transferLogList, chartInfo } from '@/api/dataAnalysis/dataInsightManage'
import { findVueSelectItemIndex, deepClone } from '../dataAnalysisUtils/utils'
import { pieJson, barJson } from '../dataAnalysisUtils/tableShowChartInit'
export default {
  data () {
    return {
      dialogVisible: false,
      title: '',
      loading: false,
      echartLoading: false,
      outParamsIndexList: [],
      selectedIndex: [], // 选中的指标，实时
      limitLen: 10, // 限制选中指标个数
      templateUserNum: 1000,
      channelInfoNameList: '',
      userRateStr: '3.4%',
      lastCalTime: '2020-04-25',
      templateId: '',
      chartLen: 0,
      seriesData: [],
      originRegion: [],
      ruleForm: {
        region: []
      },
      rules: {
        region: [
          { required: true, message: '请选择', trigger: 'change' }
        ]
      },
      isShow: true,
      dataList: [],
      pageNum: 1, // 当前页
      pageSize: 10, // 默认每页10条
      totalCount: 0,
      dataListLoading: false
    }
  },
  components: { Treeselect },
  methods: {
    async loadOptions ({ action, parentNode, callback }) {
      if (action === LOAD_CHILDREN_OPTIONS) {
        callback()
      }
    },
    getSelectAllCata (channelCode, fn) { // 获取所有指标
      selectAllCata({ channelCode: channelCode, flag: '-1', type: ['number', 'enums'] }).then(({data}) => {
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
      if (this.selectedIndex.length >= this.limitLen) {
        let indexListArr = deepClone(this.indexList)
        this.outParamsIndexList = this.disabledOutParamsList(this.selectedIndex.length, indexListArr)
      }
    },
    indexDeselect (node) { // 删除出参
      let originLen = this.selectedIndex.length // 删除之前的数据长度
      this.selectedIndex = this.selectedIndex.filter(item => item !== node.id) // 删除数据
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
    init (val) {
      this.loading = true
      this.dialogVisible = true
      this.isShow = true
      this.title = val.name
      this.templateId = val.id
      this.getOverviewData(val.id, val.channelId.split(','))
    },
    getOverviewData (id, channelCode) {
      overviewData(id).then(({data}) => {
        if (data.status * 1 !== 1) {
          this.loading = false
          return this.$message({
            type: 'error',
            message: data.message
          })
        }
        this.templateUserNum = data.data.templateUserNum
        this.userRateStr = data.data.userRateStr
        this.lastCalTime = data.data.lastCalTime
        this.ruleForm.region = data.data.lableValList ? data.data.lableValList.map(item => item * 1) : [5486, 5590]
        this.selectedIndex = this.ruleForm.region
        this.getChartInfo()
        this.getTranferLogData()
        this.channelInfoNameList = data.data.channelInfoNameList.join('、')
        this.channelInfoNameList.slice(0, data.data.channelInfoNameList.length - 1)
        this.getSelectAllCata(channelCode, (indexList) => {
          this.outParamsIndexList = this.updateOutParamsList(indexList)
          this.$nextTick(() => {
            this.loading = false
          })
        })
      })
    },
    getChartInfo () {
      this.echartLoading = true
      chartInfo({
        templateId: this.templateId,
        indicators: this.ruleForm.region.join(',')
      }).then(({data}) => {
        if (data.status !== '1' || !data.data.data || !data.data.data.length) {
          this.chartLen = 0
          return
        }
        let resData = data.data.data
        this.seriesData = resData
        this.chartLen = resData.length
        this.seriesData.map((item, index) => {
          let option = {}
          if (item.indicatorsType === 'pie') {
            option = JSON.parse(JSON.stringify(pieJson))
            option.id = item.id
            option.title.text = item.indicatorsName
            option.series[0].name = item.indicatorsName
            option.series[0].data = item.valList
            option.legend.data = []
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
            option = JSON.parse(JSON.stringify(barJson))
            option.id = item.id
            option.title.text = item.indicatorsName
            option.series[0].name = item.indicatorsName
            option.xAxis[0].data = item.xaxisData
            option.series[0].data = item.series
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
    getTranferLogData () {
      transferLogList({
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        templateId: this.templateId
      }).then(({data}) => {
        if (data.status !== '1' || !data.data.list || !data.data.list.length) {
          this.totalCount = 0
          this.dataList = []
        } else {
          this.totalCount = data.data.total
          this.dataList = data.data.list
        }
      })
    },
    // 编辑
    editTable () {
      this.isShow = false
      this.originRegion = this.ruleForm.region
    },
    saveTable () {
      console.log(this.ruleForm.region)
      this.getChartInfo()
      this.isShow = true
    },
    cancelTable () {
      this.ruleForm.region = this.originRegion
      this.isShow = true
    },
    // 每页数
    sizeChangeHandle (page) {
      this.pageSize = page
      this.pageNum = 1
      this.getTranferLogData()
    },
    // 当前页
    currentChangeHandle (page) {
      this.pageNum = page
      this.getTranferLogData()
    },
    // 弹窗状态
    handleClose () {
      this.dialogVisible = false
    }
  }
}
</script>
<style scoped>
.channl{
  color: #2093f7;
}
.echart {
  height: 400px;
}
.order-echarts-col {
  margin-bottom: 20px;
}
.echart-content {
  border-bottom: 1px dashed #d8d8d8;
}
.no-echart-content {
  width: 100%;
  padding: 30px 0;
  text-align: center;
  border-bottom: 1px dashed #d8d8d8;
}
.base-pane-item {
  width: 700px;
  line-height: 38px;
}
.vue-treeselect {
  min-height: 38px;
  line-height: 24px;
  max-width: 100%;
}
</style>>
