<template>
  <el-dialog
      :title="'【' + title + '】分群概览'"
      :visible.sync="dialogVisible"
      width="1200px"
      :before-close="handleClose">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" :inline="true" label-width="120px" class="demo-ruleForm">
        <el-form-item label="分群用户数：">{{peopNum}}人，在<span class="channl">{{channl}}</span>中占比{{proportion}}</el-form-item>
        <el-form-item label="最近计算时间：" style="margin-left: 30px;">{{lately}}</el-form-item>
        <br/>
        <el-form-item prop="region" label="可视化筛选：">
          <el-select v-model="ruleForm.region" placeholder="请选择" :disabled="isShow" multiple :multiple-limit="1" style="width:500px">
            <el-option-group
              v-for="group in selectList"
              :key="group.label"
              :label="group.label">
              <el-option
                v-for="item in group.children"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-option-group>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="editTable" type="primary" size="small" v-if="isShow">编辑</el-button>
          <el-button @click="saveTable" type="primary" size="small" v-if="!isShow">保存</el-button>
          <el-button @click="editTable" size="small" v-if="!isShow">取消</el-button>
        </el-form-item>
      </el-form>
      <el-row :gutter="20" class="echart-content">
        <el-col :span="12" v-for="item in 3" :key="item" class="order-echarts-col">
          <el-card shadow="never" class="order-echarts-card">
            <div :id="'echart-' + item" class="echart"></div>
          </el-card>
        </el-col>
      </el-row>
      <div class="custer-history">
        <p>分群历史情况：</p>
        <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;">
          <el-table-column label="序号" header-align="center" align="center" width="100">
            <template slot-scope="scope">
              {{scope.$index + 1}}
            </template>
          </el-table-column>
          <el-table-column prop="computedTime" header-align="center" align="center" label="计算完成时间"></el-table-column>
          <el-table-column prop="computedNum" header-align="center" align="center" label="分群用户数"></el-table-column>
          <el-table-column prop="computedType" header-align="center" align="center" label="计算类型"></el-table-column>
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
export default {
  data () {
    return {
      dialogVisible: false,
      title: '',
      peopNum: 1000,
      channl: '万卡',
      proportion: '3.4%',
      lately: '2020-04-25',
      ruleForm: {
        region: ['1.1', '2.1']
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
      dataListLoading: false,
      pieJson: {
        id: 0,
        title: {
          show: true,
          text: ''
        },
        legend: {
          orient: 'vertical',
          right: '0',
          top: '0',
          itemGap: 10,
          itemWidth: 10,
          itemHeight: 10,
          data: [],
          textStyle: {
            color: '#666'
          }
        },
        tooltip: {
          trigger: 'item',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#fff'
            }
          },
          formatter: '{b} : {c}  {d}%'
        },
        color: ['#FFC175', '#59CBDD', '#A3D47D', '#5C62E6'],
        series: [],
        yAxis: null
      },
      barJson: {
        title: {
          show: true,
          text: ''
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          right: '0',
          top: '0',
          itemWidth: 10,
          itemHeight: 10,
          textStyle: {
            color: '#666'
          }
        },
        grid: [
          {
            top: 100,
            bottom: 101
          },
          {
            height: 60,
            bottom: 40
          }
        ],
        xAxis: [{
          type: 'category',
          data: [],
          gridIndex: 0,
          axisLabel: {
            color: '#333'
          },
          axisLine: {
            lineStyle: {
              color: '#e7e7e7'
            }
          },
          axisTick: {
            lineStyle: {
              color: '#e7e7e7'
            }
          },
          zlevel: 2
        }, {
          type: 'category',
          gridIndex: 1,
          axisLine: {
            show: false
          },
          zlevel: 1
        }],
        yAxis: [{
          type: 'value',
          gridIndex: 0,
          axisLabel: {
            color: '#333'
          },
          splitLine: {
            lineStyle: {
              type: 'dashed'
            }
          },
          axisLine: {
            lineStyle: {
              color: '#ccc'
            }
          },
          axisTick: {
            lineStyle: {
              color: '#ccc'
            }
          }
        }, {
          type: 'value',
          gridIndex: 1,
          axisLabel: {
            show: false
          },
          axisLine: {
            show: false
          },
          splitLine: {
            show: false
          },
          axisTick: {
            show: false
          }
        }],
        series: [{
          type: 'bar',
          data: [],
          name: '',
          label: {
            show: true,
            position: 'top',
            textStyle: {
              color: '#555'
            }
          },
          itemStyle: {
            normal: {
              color: '#4150d8'
            }
          },
          xAxisIndex: 0,
          yAxisIndex: 0
        }]
      }
    }
  },
  components: {},
  methods: {
    init (val) {
      this.dialogVisible = true
      this.title = val.name
      // lookAccout(val.id).then(({data}) => {
      // })
      let seriseData = [
        {
          id: '1',
          type: 'pie',
          name: '性别',
          radius: [0, 150],
          data: [
            {value: 20, percent: '30', name: '男'},
            {value: 30, percent: '50', name: '女'}
          ]
        },
        {
          id: '2',
          type: 'pie',
          name: '会员等级',
          radius: [0, 150],
          data: [
            {value: 20, percent: '20', name: '王者'},
            {value: 30, percent: '30', name: '青铜'},
            {value: 40, percent: '40', name: '白银'},
            {value: 10, percent: '10', name: '黄金'}
          ]
        },
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
      seriseData.map((item, index) => {
        let option = {}
        if (item.type === 'pie') {
          option = JSON.parse(JSON.stringify(this.pieJson))
          option.series = item
          option.legend.data = []
          item.data.forEach(item => {
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
          option = JSON.parse(JSON.stringify(this.barJson))
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
    },
    // 编辑
    editTable () {
      this.isShow = false
    },
    saveTable () {
      console.log(9)
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
</style>>
