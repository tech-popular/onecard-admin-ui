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
            @select="outParamsSelect"
            @deselect="outParamsDeselect"
          />
        </el-form-item>
        <el-form-item>
          <el-button @click="editTable" type="primary" size="small" v-if="isShow">编辑</el-button>
          <el-button @click="saveTable" type="primary" size="small" v-if="!isShow">保存</el-button>
          <el-button @click="editTable" size="small" v-if="!isShow">取消</el-button>
        </el-form-item>
      </el-form>
      <el-row :gutter="20" class="echart-content" v-if="chartLen > 0">
        <el-col :span="12" v-for="(item, index) in chartLen" :key="item" class="order-echarts-col">
          <el-card shadow="never" class="order-echarts-card">
            <div :id="'echart-' + index" class="echart"></div>
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
          <el-table-column prop="type" header-align="center" align="center" label="计算类型"></el-table-column>
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
      outParamsIndexList: [],
      outParams: [],
      templateUserNum: 1000,
      channelInfoNameList: '',
      userRateStr: '3.4%',
      lastCalTime: '2020-04-25',
      templateId: '',
      chartLen: 0,
      ruleForm: {
        region: []
      },
      rules: {
        region: [
          { required: true, message: '请选择', trigger: 'change' }
        ]
      },
      isShow: true,
      props: { multiple: true },
      selectList: [
        {
          value: '1',
          label: '用户属性',
          children: [{
            value: '1.1',
            label: '渠道'
          }, {
            value: '1.2',
            label: '性别'
          }]
        }, {
          value: '2',
          label: '用户交易',
          children: [{
            value: '2.1',
            label: '7日内借款'
          }, {
            value: '2.2',
            label: '其他'
          }]
        }
      ],
      detalListCaent: [{name: '渠道'}, {name: '性别'}],
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
          if (this.filterAllCata(item.dataCataLogList).length) { // 指标层 ，无children
            obj.children = this.filterAllCata(item.dataCataLogList)
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
    outParamsSelect (node) { // 选中出参
      this.outParams.push({
        title: node.label,
        value: node.englishName,
        id: node.id
      })
      if (this.outParams.length) {
        this.$refs.ruleForm.clearValidate('region')
      }
    },
    outParamsDeselect (node) { // 删除出参
      this.outParams = this.outParams.filter(item => item.id !== node.id)
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
        return indexListArr
      } else {
        return indexListArr
      }
    },
    init (val) {
      this.loading = true
      this.dialogVisible = true
      this.title = val.name
      this.templateId = val.id
      this.getOverviewData(val.id, val.channelId.split(','))
      let seriseData = [
        {
          id: '3',
          type: 'bar',
          name: '年龄',
          xAxisData: [
            '[1, 3)',
            '[3, 8)',
            '[8, 12)',
            '[12, 15]'
          ],
          series: [
            3,
            5,
            23,
            19
          ]
        }
      ]
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
        this.ruleForm.region = data.data.lableValList || [5486, 5590]
        this.getChartInfo()
        this.getTranferLogData(id)
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
      chartInfo({
        templateId: this.templateId,
        indicators: this.ruleForm.region.join(',')
      }).then(({data}) => {
        if (data.status !== '1' || !data.data || !data.data.pieChartDataList.length) {
          this.chartLen = 0
          return
        }
        console.log(123)
        let seriseData = data.data.pieChartDataList
        this.chartLen = data.data.pieChartDataList.length
        seriseData.map((item, index) => {
          let option = {}
          option.id = index
          if (item.indicatorsType === 'pie') {
            option = JSON.parse(JSON.stringify(pieJson))
            option.title.text = item.indicatorsName
            option.series.name = item.indicatorsName
            option.series.data = item.valList
            option.legend.data = []
            item.valList.forEach(item => {
              option.legend.data.push(item.name)
            })
            option.series.label = {
              normal: {
                formatter: params => {
                  return (
                    '{icon|●}{name|' + params.name + '}\n\n{value|' + params.value + '}\n\n{percent|' + params.percent + '%}'
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
                    textAlign: 'left'
                  }
                }
              }
            }
          } else {
            option = JSON.parse(JSON.stringify(barJson))
            option.xAxis[0].data = item.xAxisData
            option.series[0].data = item.series
            option.series[0].name = item.name
            // option.legend.data = [item.name]
          }
          option.id = item.id
          option.title.text = item.name
          setTimeout(() => {
            let chart = null
            console.log(option.id)
            const docu = document.getElementById(
              'echart-' + option.id
            )
            chart = echarts.init(docu)
            chart.setOption(option, true)
            window.addEventListener('resize', () => {
              chart.resize()
            })
          }, 500)
        })
      })
    },
    getTranferLogData (id) {
      transferLogList({
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        templateId: id
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
    },
    saveTable () {
      console.log(this.ruleForm.region)
    },
    // 每页数
    sizeChangeHandle (page) {
      this.pageSize = page
      this.pageNum = 1
      this.getDataList()
    },
    // 当前页
    currentChangeHandle (page) {
      this.pageNum = page
      this.getDataList()
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
  height: 450px;
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
