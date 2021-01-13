<template>
<el-drawer
    :append-to-body="false"
    :visible.sync="visible"
    :show-close="false"
    :wrapperClosable="false"
    size="1200px"
    class="data-transfer-manage-drawer"
  >
  <div slot="title" class="drawer-title">{{tag}}<i class="el-icon-close drawer-close" @click="drawerClose"></i></div>
    <div class="wrap" v-loading="loading">
      <el-form label-width="80px" :model="baseForm" :rules="baseRule" ref="baseForm" class="base-form" :disabled="!canUpdate">
        <div class="base-pane">
          <h3 ref="baseTitle">基本信息</h3>
            <el-form-item label="下发类型" prop="triggerMode" style="width:50%">
              <el-radio v-model="baseForm.triggerMode" label="0" class="radio-item radio-initiative">主动型</el-radio>
              <el-tooltip placement="top">
                <div slot="content">根据调度时间配置进行数据下发</div>
                <i class="el-icon-info cursor-pointer" style="color:#409eff"></i>
              </el-tooltip>
              <el-radio v-model="baseForm.triggerMode" label="1" class="radio-item radio-passive">被动型</el-radio>
              <el-tooltip placement="top">
                <div slot="content">根据下游接口调用进行数据下发</div>
                <i class="el-icon-info cursor-pointer" style="color:#409eff"></i>
              </el-tooltip>
            </el-form-item>
            <el-form-item label="分群名称" prop="templateId">
              <el-select
                filterable
                v-model="baseForm.templateId"
                placeholder="请选择"
                @change="currentSel">
                <el-option
                  v-for="item in templateIdList"
                  :key="item.value"
                  :label="item.text"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="任务名称" prop="transferName" style="width:50%">
              <el-input v-model.trim="baseForm.transferName" class="base-pane-item"/>
            </el-form-item>
            <el-form-item label="分群出参" prop="outParams">
              <Treeselect
                :options="outParamsList"
                :disable-branch-nodes="true"
                :show-count="true"
                :multiple="true"
                :load-options="loadOptions"
                :searchable="true"
                :clearable="true"
                :disabled="isR3DefaultOut || !canUpdate"
                @input="changeOption"
                @select="outParamsSelect"
                @deselect="outParamsDeselect"
                noChildrenText="暂无数据"
                v-model="baseForm.outParams"
                placeholder="请选择"
                class="base-pane-item"
              />
            </el-form-item>
            <el-form-item label="任务描述">
              <el-input type="textarea"  class="base-pane-item" v-model="baseForm.taskDescribtion" maxlength="100" :autosize="{ minRows: 3, maxRows: 5}" />
              <p class="data-description-tips">最多输入100个字符，您还可以输入<span v-text="100 - baseForm.taskDescribtion.length"></span>个字符</p>
            </el-form-item>
        </div>
        <div class="base-pane" v-if="baseForm.triggerMode !== '1'">
          <h3>调度时间</h3>
            <el-form-item label="周期">
              <template>
                <el-radio-group v-model="baseForm.jobType">
                  <el-radio :label="1">运行一次</el-radio>
                  <el-radio :label="2">周期运行</el-radio>
                </el-radio-group>
              </template>
            </el-form-item>
            <!-- 运行一次 -->
            <el-row v-if="baseForm.jobType === 1">
              <el-col :span="12">
                <div>
                  <el-form-item label="运行时间">
                    <el-date-picker
                      v-model="baseForm.onceRunTime"
                      type="datetime"
                      format="yyyy-MM-dd HH:mm:ss"
                      value-format="timestamp"
                      placeholder="选择日期时间">
                    </el-date-picker>
                    （未指定运行时间，默认立即下发）
                  </el-form-item>
                </div>
              </el-col>
            </el-row>
            <!-- 周期运行 -->
            <el-row v-if="baseForm.jobType === 2">
              <el-col :span="7">
                <el-form-item label="调度周期">
                  <el-select v-model="baseForm.runCycle" placeholder="请选择" style="width:220px;" @change="disTimeTurnOff (baseForm.runCycle)">
                    <el-option
                      v-for="item in dispatchCycleList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6" v-if="baseForm.runCycle === 'WEEK'">
                <el-form-item label="具体时间"  prop="dayOfWeeks">
                  <el-select
                    v-model= "baseForm.dayOfWeeks"
                    multiple
                    collapse-tags
                    placeholder="请选择">
                    <el-option
                      v-for="item in dayOfWeeksList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6" v-if="baseForm.runCycle === 'MONTH'">
                <el-form-item label="具体时间" prop="dayOfMonths">
                  <el-select
                    v-model="baseForm.dayOfMonths"
                    multiple
                    collapse-tags
                    placeholder="请选择">
                    <el-option
                      v-for="item in dayOfMonthsList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="7" v-if="baseForm.runCycle !== 'MINUTE' && baseForm.runCycle !== 'HOUR'">
                <el-form-item class="label-remove-margin" prop="runTime">
                  <el-time-picker
                    v-model="baseForm.runTime"
                    value-format="timestamp"
                    placeholder="时:分:秒">
                  </el-time-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="baseForm.jobType === 2 && (baseForm.runCycle === 'MINUTE' || baseForm.runCycle === 'HOUR')">
              <el-col :span="7">
                <el-form-item label="开始时间" prop="startTime">
                  <el-time-picker
                    v-model="baseForm.startTime"
                    :clearable=false
                    value-format="timestamp"
                    format="HH:mm"
                    placeholder="时:分">
                  </el-time-picker>
                </el-form-item>
                </el-col>
                <el-col :span="7">
                <el-form-item label="时间间隔" prop="timeInterval">
                  <el-select v-model="baseForm.timeInterval" placeholder="请选择">
                    <el-option
                      v-for="item in timeIntervalList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <span>{{ disIntervalMess }}</span>
                </el-form-item>
                </el-col>
                <el-col :span="6">
                <el-form-item label="结束时间" prop="endTime">
                  <el-time-picker
                    v-model="baseForm.endTime"
                    :clearable=false
                    value-format="timestamp"
                    format="HH:mm"
                    placeholder="时:分">
                  </el-time-picker>
                </el-form-item>
              </el-col>
            </el-row>
        </div>
        <div class="pane-rules">
          <h3>下发数据源</h3>
          <el-row :gutter="20">
            <el-col style="width: 8.33333%;">
              <el-form-item  prop="transferType">
                <el-checkbox label="kafka" name="transferType" v-model="baseForm.transferType" style="margin-left: 8px;"></el-checkbox>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item prop="kafkaServer">
                <el-select
                  v-model= "baseForm.kafkaServer"
                  collapse-tags
                  filterable
                  @change="kafkaServerChange"
                  style="margin-left: 5px; width:220px;"
                  placeholder="请选择">
                  <el-option
                    v-for="item in kafkaServerList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col style="width: 8.33333%;">
              <el-form-item class="label-remove-margin" prop="transferType">
                  <el-checkbox label="mysql" v-model="baseForm.transferType" style="margin-left: 8px;"></el-checkbox>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item  prop="mysqlServer">
                  <el-select
                    v-model= "baseForm.mysqlServer"
                    collapse-tags
                    filterable
                    style="margin-left: 5px; width:220px;"
                    placeholder="请选择">
                    <el-option
                      v-for="item in mysqlServerList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
              </el-form-item>
            </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col style="width: 8.33333%;">
                <el-form-item class="label-remove-margin" prop="transferType">
                    <el-checkbox label="sqlServer" v-model="baseForm.transferType" @change="transferTypeChage" style="margin-left: 8px;"></el-checkbox>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item prop="sqlServer" inline>
                    <el-select
                      v-model= "baseForm.sqlServer"
                      collapse-tags
                      filterable
                      style="margin-left: 5px; width:220px;"
                      @change="sqlServerChange"
                      placeholder="请选择">
                      <el-option
                        v-for="item in sqlServerList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                    </el-select>
                    <el-button type="success" class="transfer-log" @click="viewLog" size="mini" v-if="baseForm.transferType.includes('sqlServer') && baseForm.sqlServer">下发日志</el-button>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="下发模式" prop="increModel">
              <el-radio v-model="baseForm.increModel" :label="0">全量</el-radio>
              <el-radio v-model="baseForm.increModel" :label="1" v-bind:disabled="isStatic" class="radio-incremodel">增量</el-radio>
              <el-tooltip placement="top" v-if="isStatic">
                <div slot="content">静态分群不支持增量</div>
                <i class="el-icon-info cursor-pointer" style="color:#409eff"></i>
              </el-tooltip>
            </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="footer">
      <el-button
        type="success"
        @click="copyHandle"
        size="small"
        v-if="!!baseForm.id"
      >复制创建新任务</el-button>
      <el-button type="primary" v-if="canUpdate"  @click="saveHandle" size="small">保存</el-button>
      <el-button type="default" @click="cancelHandle" size="small">取消</el-button>
    </div>
    <transfer-log v-if="transferLogVisible" ref="transferLog" :data="transferLogList"></transfer-log>
  </el-drawer>
</template>
<script>
  import { addDataTransferManage, updateDataTransferManage, dataTransferManageOutParams, dataTransferManageOutParamsEdit, dataTransferManageCuster, dataTransferManageKafka, dataTransferManageMysql, infoDataTransferManage, defaultOutParams } from '@/api/dataAnalysis/dataTransferManage'
  import { deepClone, findVueSelectItemIndex } from '../dataAnalysisUtils/utils'
  import Treeselect, { LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect'
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'
  import transferLog from './data-transfer-r3-log'
  export default {
    data () {
      // 验证枚举类型的函数
      let validateKafkaServer = (rule, value, callback) => {
        if (this.baseForm.transferType.indexOf('kafka') > -1 && this.baseForm.kafkaServer === '') {
          callback(new Error('请选择数据源'))
        } else {
          callback()
        }
      }

      let validateMysqlServer = (rule, value, callback) => {
        if (this.baseForm.transferType.indexOf('mysql') > -1 && this.baseForm.mysqlServer === '') {
          callback(new Error('请选择数据源'))
        } else {
          callback()
        }
      }

      let validateSqlServer = (rule, value, callback) => {
        if (this.baseForm.transferType.indexOf('sqlServer') > -1 && this.baseForm.sqlServer === '') {
          callback(new Error('请选择数据源'))
        } else {
          callback()
        }
      }

      let validateTime = (rule, value, callback) => {
        let tempTime1 = new Date(this.baseForm.startTime)
        let tempTime2 = new Date(this.baseForm.endTime)
        let hour1 = tempTime1.getHours()
        let minute1 = tempTime1.getMinutes()
        let hour2 = tempTime2.getHours()
        let minute2 = tempTime2.getMinutes()
        let tempDate = new Date()
        if (tempDate.setHours(hour1, minute1) >= tempDate.setHours(hour2, minute2)) {
          callback(new Error('开始时间大于等于结束时间'))
        } else {
          this.$refs.baseForm.clearValidate('startTime')
          this.$refs.baseForm.clearValidate('endTime')
          callback()
        }
      }

      return {
        loading: false,
        visible: true,
        isStatic: false,
        channelCode: '',
        // originOutParamsList: [],
        baseForm: {
          id: '',
          taskUniqueFlag: null, // 蜂巢任务ID
          dolphinProcessId: null,
          transferName: '', // 任务名称
          templateId: '', // 分群名称
          outParams: [],
          taskDescribtion: '', // 描述
          jobType: 1, // 周期
          onceRunTime: '', // 运行一次运行时间
          runTime: '', // 周期运行具体时间
          runCycle: 'MINUTE', // 调度周期
          timeInterval: '',
          startTime: '',
          endTime: '',
          dayOfWeeks: [], // 周
          dayOfMonths: [], // 月
          transferType: [], // 下发数据源
          increModel: 0, // 下发模式
          kafkaServer: '', // kafka数据源地址
          topic: '',
          mysqlServer: '', // sftp数据源地址
          sqlServer: '',
          triggerMode: '0' // 下发类型，默认0主动型 1被动
        },
        tag: '新建', // 说明是否是“查看”
        readonly: false, // 不可编辑
        disIntervalMess: '分钟',
        templateIdList: [],
        outParams: [], // 分群出参提交格式
        outParamsList: [ // 分群出参list
        ],
        timeIntervalList: [],
        dispatchCycleList: [
          {value: 'MINUTE', label: '分钟'},
          {value: 'HOUR', label: '小时'},
          {value: 'DAY', label: '日'},
          {value: 'WEEK', label: '周'},
          {value: 'MONTH', label: '月'}
        ],
        dayOfWeeksList: [
          {value: '1', label: '周日'},
          {value: '2', label: '周一'},
          {value: '3', label: '周二'},
          {value: '4', label: '周三'},
          {value: '5', label: '周四'},
          {value: '6', label: '周五'},
          {value: '7', label: '周六'}
        ],
        dayOfMonthsList: [
        ],
        kafkaServerList: [],
        mysqlServerList: [],
        sqlServerList: [],
        transferLogVisible: false,
        transferLogList: [],
        baseRule: {
          templateId: [
            { required: true, message: '请选择分群名称', trigger: 'change' }
          ],
          transferName: [
            { required: true, message: '请输入任务名称', trigger: 'blur' }
          ],
          outParams: [
            { required: true, message: '请选择分群出参', trigger: 'input' }
          ],
          // onceRunTime: [
          //   {type: 'date', required: true, message: '请选择时间', trigger: 'change'}
          // ],
          runTime: [
            {type: 'date', required: true, message: '请选择时间', trigger: 'change'}
          ],
          dayOfWeeks: [
            {type: 'array', required: true, message: '请选择具体时间', trigger: 'change'}
          ],
          dayOfMonths: [
            {type: 'array', required: true, message: '请选择具体时间', trigger: 'change'}
          ],
          startTime: [
            // {type: 'date', required: true, message: '请选择开始时间', trigger: 'change'},
            { validator: validateTime }
          ],
          timeInterval: [
            {type: 'number', required: true, message: '请选择间隔时间', trigger: 'change'}
          ],
          endTime: [
            // {type: 'date', required: true, message: '请选择结束时间', trigger: 'change'},
            { validator: validateTime }
          ],
          transferType: [
            { type: 'array', required: true, message: '请选择下发数据源', trigger: 'change' }
          ],
          kafkaServer: [
            { validator: validateKafkaServer }
          ],
          mysqlServer: [
            { validator: validateMysqlServer }
          ],
          sqlServer: [
            { validator: validateSqlServer }
          ]
        },
        isR3DefaultOut: false, // 选中R3下发源，且有默认出参时，不可再操作出参
        rowData: { // 修改时数据内容
          authOwner: '',
          authOtherList: [],
          authOthers: ''
        },
        canUpdate: true // 可编辑
      }
    },
    mounted () {
      this.dataAssembly()
      this.disTimeTurnOff('MINUTE')
      this.getKafkaServerList()
      this.getMysqlServerList()
      this.getSqlServerList()
    },

    computed: {

    },

    components: { Treeselect, transferLog },

    methods: {
      // 树加载
      async loadOptions ({ action, parentNode, callback }) {
        if (action === LOAD_CHILDREN_OPTIONS) {
          callback()
        }
      },
      //  调度周期 月 数据组装
      dataAssembly () {
        let tempArry = []
        for (let i = 1, j = 32; i < j; i++) {
          tempArry.push({value: i.toString(), label: '每月' + i + '号'})
        }
        tempArry.push({value: '-1', label: '每月最后一天'})
        this.dayOfMonthsList = tempArry
      },
      //  调度 时间间隔 数据切换
      disTimeTurnOff (disType) {
        let tempArry = []
        if (disType === 'MINUTE') {
          for (let i = 5, j = 60; i < j; i += 5) {
            tempArry.push({value: i, label: i})
          }
          this.disIntervalMess = '分钟'
        } else if (disType === 'HOUR') {
          for (let i = 1, j = 24; i < j; i++) {
            tempArry.push({value: i, label: i})
          }
          this.disIntervalMess = '小时'
        }
        this.baseForm.timeInterval = ''
        this.timeIntervalList = tempArry
      },
      // 清洗数据，按selectVue的格式重新组织指标数据
      filterAllCata (tree) {
        let arr = []
        if (!!tree && tree.length !== 0) {
          tree.forEach((item, index) => {
            let obj = {}
            if (item.fieldType) {
              obj.id = item.englishName + '-' + item.id
              obj.englishName = item.englishName
              obj.label = item.chineseName
              obj.fieldType = item.fieldType
              obj.enumTypeNum = item.enumTypeNum
              obj.sourceTable = item.sourceTable
              obj.dataStandar = item.dataStandar
              obj.fieldId = item.id
              obj.channelCode = item.channelCode
            } else {
              obj.id = item.id
              obj.label = item.name
            }
            // if (this.filterAllCata(item.dataCataLogList).length) { // 指标层 ，无children
            //   obj.children = this.filterAllCata(item.dataCataLogList)
            //   arr.push(obj)
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
      // 获取分群名称
      getCusterList (tag, fn) {
        dataTransferManageCuster().then(({data}) => {
          if (data && data.status === '1') {
            this.templateIdList = data.data
          } else {
            this.templateIdList = []
          }
          this.$nextTick(() => {
            this.loading = false
          })
          if (fn) {
            fn(this.templateIdList)
          }
        })
      },
      // 获取分群出参 指标列表
      getOutParamsList (row) {
        let code = this.channelCode.split(',').filter(item => item !== '')
        dataTransferManageOutParams({ channelCode: code, flag: this.baseForm.id ? '-1' : '1' }).then(({data}) => {
          if (data && data.status === '1') {
            if (row) {
              // this.originOutParamsList = data.data
              this.getOutParamsEditList(row.id, this.filterAllCata(data.data))
            } else {
              // this.originOutParamsList = data.data
              this.outParamsList = this.filterAllCata(data.data)
            }
            // console.log(this.originOutParamsList)
          } else {
            this.outParamsList = []
          }
        })
      },
      // 修改，回显时查询分群出参选中
      getOutParamsEditList (id, outList) {
        dataTransferManageOutParamsEdit(id).then(({data}) => {
          if (data && data.status === '1') {
            let out = []
            this.outParams = []
            data.data.forEach(item => {
              out.push(item.fieldCode + '-' + item.fieldId)
              this.outParams.push({value: item.fieldCode, id: item.fieldId, sourceTable: item.sourceTable})
            })
            this.baseForm.outParams = Array.from(new Set(out))
            this.outParamsList = this.updateOutParamsList(outList)
            this.$nextTick(() => {
              this.loading = false
            })
          }
        })
      },
      // kafka 数据源
      getKafkaServerList () {
        let params = {
          type: 'kafka'
        }
        dataTransferManageKafka(params).then(({data}) => {
          if (data && data.status === '1') {
            this.kafkaServerList = data.data
          }
        })
      },
      // kafka选择时
      kafkaServerChange (value) {
        let arr = this.kafkaServerList.filter(item => item.id === value)
        this.baseForm.topic = arr[0].target
      },
      // mysql 数据源
      getMysqlServerList () {
        let params = {
          type: 'mysql'
        }
        dataTransferManageMysql(params).then(({data}) => {
          if (data && data.status === '1') {
            this.mysqlServerList = data.data
          }
        })
      },
      // mysql 数据源
      getSqlServerList () {
        let params = {
          type: 'sqlServer'
        }
        dataTransferManageMysql(params).then(({data}) => {
          if (data && data.status === '1') {
            this.sqlServerList = data.data
          }
        })
      },
      sqlServerChange (val) { // 选中sqlServer时
        if (this.baseForm.transferType.includes('sqlServer')) {
          let code = this.channelCode.split(',').filter(item => item !== '')
          if (code.includes('2001') && !code.includes('1001')) { // 商城渠道时，把万卡渠道也传过去
            code.push('1001')
          }
          this.getSqlServerDefaultOutParams({channelCode: code}, val) // 渠道多选后，传参方式改变
        }
      },
      getSqlServerDefaultOutParams (channelCode, id) { // 选择r3下发数据源时，先判断是否需要指定默认出参
        defaultOutParams(channelCode, id).then(({data}) => {
          if (data && data.status === '1') {
            if (!data.data || !data.data.length) return
            let out = []
            this.outParams = []
            data.data.forEach(item => {
              out.push(item.value + '-' + item.id)
              this.outParams.push({value: item.value, id: item.id, sourceTable: item.sourceTable})
            })
            this.baseForm.outParams = Array.from(new Set(out))
            this.outParamsList = this.updateOutParamsList(this.outParamsList)
            this.isR3DefaultOut = true
          }
        })
      },
      transferTypeChage (val) { // 选中sqlServer与否
        if (!this.baseForm.transferType.includes('sqlServer')) { // 取消选中sqlServer时。出参变为可选状态，且清除原有的
          if (this.isR3DefaultOut) {
            this.isR3DefaultOut = false
            this.baseForm.outParams = []
            this.outParams = []
          }
        } else { // 选中时，之前有选择下拉项则直接请求接口数据，获取出参
          if (this.baseForm.sqlServer != '') {
            this.getSqlServerDefaultOutParams(this.channelCode, this.baseForm.sqlServer)
          }
        }
      },
      // 分群名称改变任务名称改变
      currentSel (selVal) {
        console.log(this.templateIdList)
        let obj = {}
        obj = this.templateIdList.find((item) => {
          if (item.value === selVal) {
            this.channelCode = item.channelCode
          }
          if (item.value === selVal && item.type === 'static') {
            this.isStatic = true
          } else {
            this.isStatic = false
          }
          this.baseForm.increModel = 0
          return item.value === selVal
        })
        this.baseForm.transferName = obj.text + '下发任务'
        // 改变分群名称时，出参及sqlserver选项都初始化，因为他们依赖分群
        this.getOutParamsList()
        this.baseForm.outParams = []
        this.outParams = []
        this.baseForm.sqlServer = ''
        this.isR3DefaultOut = false
        // this.outParamsList = this.filterAllCata(this.originOutParamsList)
        // console.log(this.outParamsList, this.originOutParamsList)
      },
      // 选中出参
      outParamsSelect (node) {
        this.outParams.push({
          value: node.englishName,
          id: node.fieldId,
          sourceTable: node.sourceTable
        })
        if (this.outParams.length) {
          this.$refs.baseForm.clearValidate('outParams')
        }
      },
      // 删除出参
      outParamsDeselect (node) {
        this.outParams = this.outParams.filter(item => item.id !== node.fieldId)
      },
      // 获取出参，默认展开列表
      updateOutParamsList (indexList) {
        let indexListArr = deepClone(indexList)
        this.baseForm.outParams.forEach(item => {
          let indexPath = findVueSelectItemIndex(indexListArr, item) + ''
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
      },
      // 下发日志
      viewLog () {
        this.transferLogVisible = true
        this.$nextTick(() => {
          this.$refs.transferLog.init(this.baseForm.id)
        })
      },
      // 提交数据格式化
      formatPostData (data, outParams) {
        let postData = {}
        postData.id = data.id ? data.id : ''
        postData.triggerMode = data.triggerMode
        postData.taskUniqueFlag = data.taskUniqueFlag
        postData.dolphinProcessId = data.dolphinProcessId
        postData.transferName = data.transferName
        postData.templateId = data.templateId
        postData.transferType = data.transferType.join(',')
        postData.taskDescribtion = data.taskDescribtion
        postData.outParams = outParams
        postData.authOwner = this.rowData.authOwner
        postData.authOtherList = this.rowData.authOtherList
        postData.authOthers = this.rowData.authOthers
        postData.datasourceParams = []
        if (data.kafkaServer != '' && data.transferType.includes('kafka')) {
          let tempServer = {
            type: 'kafka',
            id: data.kafkaServer,
            topic: data.topic
          }
          postData.datasourceParams.push(tempServer)
        }
        if (data.mysqlServer != '' && data.transferType.includes('mysql')) {
          let tempServer = {
            type: 'mysql',
            id: data.mysqlServer
          }
          postData.datasourceParams.push(tempServer)
        }
        if (data.sqlServer != '' && data.transferType.includes('sqlServer')) {
          let tempServer = {
            type: 'sqlServer',
            id: data.sqlServer
          }
          postData.datasourceParams.push(tempServer)
        }
        postData.increModel = data.increModel
        postData.taskScheduleConfig = {}
        let tempTime = new Date(data.jobType == 1 ? data.onceRunTime : data.runTime)
        let year = tempTime.getFullYear().toString()
        let month = (tempTime.getMonth() + 1) < 10 ? '0' + (tempTime.getMonth() + 1) : tempTime.getMonth().toString()
        let day = tempTime.getDate() < 10 ? '0' + tempTime.getDate() : tempTime.getDate().toString()
        let hour = tempTime.getHours() < 10 ? '0' + tempTime.getHours() : tempTime.getHours().toString()
        let minute = tempTime.getMinutes() < 10 ? '0' + tempTime.getMinutes() : tempTime.getMinutes().toString()
        let second = tempTime.getSeconds() < 10 ? '0' + tempTime.getSeconds() : tempTime.getSeconds().toString()
        if (data.jobType == 1) {
          postData.taskScheduleConfig.jobType = 'ONCE_ONLY'
          if (data.onceRunTime !== '') {
            let obgExec = {
              year: year,
              month: month,
              day: day,
              hour: hour,
              minute: minute,
              second: second
            }
            postData.taskScheduleConfig.execTime = obgExec
          }
        } else {
          postData.taskScheduleConfig.jobType = data.runCycle
          if (data.runCycle == 'WEEK') {
            postData.taskScheduleConfig.jobValue = data.dayOfWeeks.join(',')
          } else if (data.runCycle == 'MONTH') {
            postData.taskScheduleConfig.jobValue = data.dayOfMonths.join(',')
          } else if (data.runCycle == 'MINUTE' || data.runCycle == 'HOUR') {
            let startTime = new Date(typeof this.baseForm.startTime === 'object' ? this.baseForm.startTime : parseInt(this.baseForm.startTime))
            let startHour = startTime.getHours() < 10 ? '0' + startTime.getHours() : startTime.getHours().toString()
            let startMinute = startTime.getMinutes() < 10 ? '0' + startTime.getMinutes() : startTime.getMinutes().toString()
            let endTime = new Date(typeof this.baseForm.endTime === 'object' ? this.baseForm.endTime : parseInt(this.baseForm.endTime))
            let endHour = endTime.getHours() < 10 ? '0' + endTime.getHours() : endTime.getHours().toString()
            let endMinute = endTime.getMinutes() < 10 ? '0' + endTime.getMinutes() : endTime.getMinutes().toString()
            let obgStart = {
              hour: startHour,
              minute: startMinute
            }
            let obgEnd = {
              hour: endHour,
              minute: endMinute
            }
            postData.taskScheduleConfig.startTime = obgStart
            postData.taskScheduleConfig.endTime = obgEnd
            postData.taskScheduleConfig.interval = this.baseForm.timeInterval
          }
          if ((data.runCycle !== 'WEEK' || data.runCycle !== 'MONTH') && data.runTime !== '') {
            let obgExec = {
              hour: hour,
              minute: minute,
              second: second
            }
            postData.taskScheduleConfig.execTime = obgExec
          }
        }
        return postData
      },
      // 数据回显
      dataDisplay (row) {
        infoDataTransferManage(row.id).then(({data}) => {
          if (data && data.status === '1') {
            let disData = data.data
            this.baseForm.id = disData.id
            this.baseForm.taskUniqueFlag = disData.taskUniqueFlag
            this.baseForm.dolphinProcessId = disData.dolphinProcessId
            this.baseForm.templateId = disData.templateId
            this.baseForm.transferName = disData.transferName
            this.baseForm.triggerMode = disData.triggerMode ? disData.triggerMode + '' : '0'
            this.baseForm.taskDescribtion = disData.taskDescribtion === null ? '' : disData.taskDescribtion
            this.baseForm.transferType = disData.transferType.split(',')
            // 要先拿到this.templateIdList
            this.channelCode = this.templateIdList.filter(item => item.value === disData.templateId)[0].channelCode
            let custerType = this.templateIdList.filter(item => item.value === disData.templateId)[0].type
            // if (this.channelCode !== '0000') {
            //   this.templateIdList = this.templateIdList.filter(item => item.channelCode !== '0000')
            // } else {
            //   this.templateIdList = this.templateIdList
            // }
            this.templateIdList = this.templateIdList
            // 要先拿到this.channelCode,才能去获取对应的出参列表
            this.getOutParamsList(row)
            if (custerType === 'static') {
              this.isStatic = true
            } else {
              this.isStatic = false
            }
            this.baseForm.increModel = disData.increModel == -1 ? 0 : disData.increModel
            disData.datasourceParams.forEach((item, index) => {
              if (item.type == 'kafka') {
                this.baseForm.kafkaServer = item.id
                this.baseForm.topic = item.topic
              } else if (item.type == 'mysql') {
                this.baseForm.mysqlServer = item.id
              } else if (item.type == 'sqlServer') {
                this.baseForm.sqlServer = item.id
                this.isR3DefaultOut = true
              }
            })
            let tempTime = disData.taskScheduleConfig
            switch (disData.taskScheduleConfig.jobType) {
              case 'ONCE_ONLY':
                this.baseForm.jobType = 1
                if (tempTime.execTime != null && tempTime.execTime.hasOwnProperty('year')) {
                  this.baseForm.onceRunTime = new Date(parseInt(tempTime.execTime.year), parseInt(tempTime.execTime.month) - 1, parseInt(tempTime.execTime.day), parseInt(tempTime.execTime.hour), parseInt(tempTime.execTime.minute), parseInt(tempTime.execTime.second)).getTime()
                } else {
                  this.baseForm.onceRunTime = ''
                }
                break
              case 'MINUTE':
                this.disTimeTurnOff('MINUTE')
                this.baseForm.jobType = 2
                this.baseForm.runCycle = 'MINUTE'
                this.baseForm.startTime = new Date(2020, 3, 4, parseInt(tempTime.startTime.hour), parseInt(tempTime.startTime.minute), 0)
                this.baseForm.endTime = new Date(2020, 3, 4, parseInt(tempTime.endTime.hour), parseInt(tempTime.endTime.minute), 0)
                this.baseForm.timeInterval = tempTime.interval
                break
              case 'HOUR':
                this.disTimeTurnOff('HOUR')
                this.baseForm.jobType = 2
                this.baseForm.runCycle = 'HOUR'
                this.baseForm.startTime = new Date(2020, 3, 4, parseInt(tempTime.startTime.hour), parseInt(tempTime.startTime.minute), 0)
                this.baseForm.endTime = new Date(2020, 3, 4, parseInt(tempTime.endTime.hour), parseInt(tempTime.endTime.minute), 0)
                this.baseForm.timeInterval = tempTime.interval
                break
              case 'DAY':
                this.baseForm.jobType = 2
                this.baseForm.runCycle = 'DAY'
                this.baseForm.runTime = new Date(2020, 3, 4, parseInt(tempTime.execTime.hour), parseInt(tempTime.execTime.minute), parseInt(tempTime.execTime.second))
                break
              case 'WEEK':
                this.baseForm.jobType = 2
                this.baseForm.runCycle = 'WEEK'
                this.baseForm.runTime = new Date(2020, 3, 4, parseInt(tempTime.execTime.hour), parseInt(tempTime.execTime.minute), parseInt(tempTime.execTime.second))
                this.baseForm.dayOfWeeks = tempTime.jobValue.split(',')
                break
              case 'MONTH':
                this.baseForm.jobType = 2
                this.baseForm.runCycle = 'MONTH'
                this.baseForm.runTime = new Date(2020, 3, 4, parseInt(tempTime.execTime.hour), parseInt(tempTime.execTime.minute), parseInt(tempTime.execTime.second))
                this.baseForm.dayOfMonths = tempTime.jobValue.split(',')
                break
            }
          }
        })
      },
      // 分群出参
      changeOption () {
        this.$refs.baseForm.validateField('outParams')
      },
      // 打开抽屉弹窗
      init (row, tag, canUpdate) {
        this.baseForm.taskUniqueFlag = null
        this.baseForm.dolphinProcessId = null
        this.baseForm.id = ''
        this.baseForm.transferName = ''
        this.baseForm.taskDescribtion = ''
        this.baseForm.jobType = 1
        this.baseForm.onceRunTime = ''
        this.baseForm.runTime = ''
        this.baseForm.runCycle = 'MINUTE'
        this.baseForm.startTime = ''
        this.baseForm.endTime = ''
        this.baseForm.timeInterval = ''
        this.baseForm.dayOfWeeks = []
        this.baseForm.dayOfMonths = []
        this.baseForm.transferType = []
        this.isStatic = false
        this.baseForm.increModel = 0
        this.baseForm.kafkaServer = ''
        this.baseForm.topic = ''
        this.baseForm.mysqlServer = ''
        this.baseForm.sqlServer = ''
        this.baseForm.outParams = []
        this.baseForm.templateId = ''
        this.rowData.authOwner = ''
        this.rowData.authOtherList = []
        this.rowData.authOthers = ''
        this.tag = canUpdate ? tag == 'edit' ? '编辑' : '新建' : '查看'
        this.canUpdate = canUpdate
        this.visible = true
        this.loading = true
        this.outParamsList = []
        if (tag) {
          this.getCusterList(tag, (data) => {
            this.dataDisplay(row) // 选获取到分群列表再去渲染页面
            this.$nextTick(() => {
              this.$refs['baseForm'].resetFields()
            })
          })
        } else {
          if (canUpdate) {
            this.rowData.authOwner = row.authOwner
            this.rowData.authOtherList = row.authOtherList
            this.rowData.authOthers = row.authOthers
          }
          this.getCusterList(tag)
          // this.getOutParamsList()
          this.$nextTick(() => {
            this.$refs['baseForm'].resetFields()
          })
        }
      },
      // 关闭抽屉弹窗
      drawerClose () {
        this.visible = false
        this.$parent.addOrUpdateVisible = false
      },
      // 保存
      saveHandle () {
        console.log(this.formatPostData(this.baseForm, this.outParams))
        this.$refs['baseForm'].validate((valid) => {
          if (valid) {
            let params = this.formatPostData(this.baseForm, this.outParams)
            console.log(params)
            this.loading = true
            if (!this.baseForm.id) {
              addDataTransferManage(params).then(({data}) => {
                this.loading = false
                if (data && data.status === '1') {
                  this.$message({
                    message: '操作成功',
                    type: 'success',
                    duration: 1500,
                    onClose: () => {
                      this.$emit('refreshDataList')
                      this.visible = false
                    }
                  })
                } else {
                  this.$message.error(data.message || '数据异常')
                }
              })
            } else {
              updateDataTransferManage(params).then(({data}) => {
                this.loading = false
                if (data && data.status === '1') {
                  this.$message({
                    message: '操作成功',
                    type: 'success',
                    duration: 1500,
                    onClose: () => {
                      this.$emit('refreshDataList')
                      this.visible = false
                    }
                  })
                } else {
                  this.$message.error(data.message || '数据异常')
                }
              })
            }
          }
        })
      },
      copyHandle () { // 复制功能
        this.$confirm('流转已复制，点击“确定”开始编辑新流转任务', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => { // 确认创建分群时的操作
          this.tag = '新建'
          this.baseForm.transferName = '复制' + this.baseForm.transferName
          this.baseForm.id = ''
          this.baseForm.taskUniqueFlag = null
          this.baseForm.dolphinProcessId = null
          this.canUpdate = true
          this.rowData.authOwner = ''
          this.rowData.authOtherList = []
          this.rowData.authOthers = ''
          this.$refs.baseTitle.scrollIntoView() // 滚动到页面最上面
        }).catch(() => {
          console.log('cancel')
        })
      },
      // 关闭
      cancelHandle () {
        this.visible = false
        this.$parent.addOrUpdateVisible = false
      }
    }
  }
</script>
<style lang="scss">
  .data-transfer-manage-drawer  {
    & .wrap{
      padding: 0 20px 20px;
      margin-top: -12px;
      width: 100%;
      overflow-y: auto;
      position: absolute;
      top: 75px;
      bottom: 55px;

    }
    & .drawer-title {
      padding: 15px;
      background: #333;
      color: #fff;
      font-size: 15px;
      margin: -20px -20px 0 -20px;
      position: relative;
    }
    & .drawer-close {
      position: absolute;
      right: 20px;
    }
    & .footer {
      position: absolute;
      bottom: 0;
      background: #fff;
      padding: 10px 22px 10px 10px;
      width: 100%;
      height: 55px;
      text-align: right;
      box-shadow: 0 -2px 9px 0 rgba(153,169,191,.17);
      z-index: 500;
    }
    & .data-description-tips {
      color: #999;
      margin-top: 0;
      & span {
        color: red
      }
    }
    & .vue-treeselect {
      min-height: 38px;
      line-height: 24px;
      max-width: 100%;
    }
    & .base-pane {
      border-bottom: 1px dashed #ccc;
      & .label-remove-margin{
        & .el-form-item__content{
          margin-left: 0px !important;
        }
      }
    }
    & .base-pane-item {
      width: 80%;
    }
    & .base-select{
      width: 40%;
    }
    & .base-form{
      & .pane-rules{
        & .el-form-item__content{
          margin-left: 0px !important;
        }
      }
    }
    & .radio-item {
      margin-right: 15px;
    }
    & .radio-passive {
      margin-left: 30px
    }
    & .radio-incremodel {
      margin-right: 15px;
    }
    & .transfer-log {
      margin-left: 20px;
    }
  }
</style>
