<template>
  <el-drawer
    :append-to-body="false"
    :visible.sync="visible"
    :show-close="false"
    :wrapperClosable="false"
    size="1100px"
    class="api-manage-drawer"
  >
    <div slot="title" class="drawer-title">{{!!id ? '编辑调度配置' : '新增调度配置'}}<i class="el-icon-close drawer-close" @click="drawerClose"></i></div>
    <div class="wrap" v-loading="loading">
      <h3>基础信息<span v-if="!!id">最近修改人：<i>{{updateUser}}</i> 最近修改时间：<i>{{updateTime}}</i></span></h3>
      <el-form :model="dataForm" :rules="dataRule" ref="dataForm1" label-width="110px">
        <div class="work-type-pane">
          <el-form-item label="任务名称：" prop="taskName">
            <el-input v-model="dataForm.taskName" placeholder="任务名称" disabled style="width: 400px">
              <template slot="prepend">{{formDs}}_to_{{toDs}}</template>
            </el-input>
          </el-form-item>
          <el-form-item label="任务ID：" prop="id">
            <el-input v-model="dataForm.id" placeholder="任务ID" disabled  style="width: 300px" />
          </el-form-item>
        </div>
        <el-form-item label="所属系统：" prop="projectId">
          <el-select v-model="dataForm.projectId" placeholder="所属系统" disabled style="width: 400px">
            <el-option :label="item.projectSystemName" :value="item.id" v-for="(item, index) in allSystemList" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="任务描述：" prop="taskDescribe">
          <el-input type="textarea" v-model="dataForm.taskDescribe" placeholder="任务描述" disabled />
        </el-form-item>
      </el-form>
      <div class="work-content-1">
        <h3 style="overflow:hidden">任务依赖
          <el-button style="float:right" type="danger">批量删除</el-button>
          <el-button style="float:right;margin-right:20px" type="primary" @click="addDependenceHandle">新增依赖</el-button>
        </h3>
        <div class="work-type-pane" style="align-items: flex-start;margin-top:10px">
          <div style="width: 110px;text-align:right;padding-right: 10px;">已选依赖：</div>
          <el-table
            style="flex:1;"
            ref="multipleTable"
            :data="tableData"
            border
            @selection-change="handleSelectDependenceChange">
            <el-table-column header-align="center" align="center" type="selection" width="55"></el-table-column>
            <el-table-column header-align="center" align="center" prop="taskName" label="任务名称"></el-table-column>
            <el-table-column header-align="center" align="center" prop="taskSys" label="所属系统"></el-table-column>
            <el-table-column label="操作" header-align="center" align="center">
              <template slot-scope="scope">
                <a style="cursor: pointer" @click="deleteDependenceHandle(scope.$index, scope.row)">删除</a>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="work-content-1">
        <h3 style="overflow:hidden">调度时间</h3>
        <el-form label-width="110px" :model="dispatchTimeForm" :rules="dataRule" ref="dispatchTimeForm" class="base-form">
          <el-form-item label="周期：" prop="jobType">
              <template>
                <el-radio-group v-model="dispatchTimeForm.jobType">
                  <el-radio :label="1">运行一次</el-radio>
                  <el-radio :label="2">周期运行</el-radio>
                </el-radio-group>
              </template>
            </el-form-item>
            <!-- 运行一次 -->
            <el-row v-if="dispatchTimeForm.jobType === 1">
              <el-col :span="16">
                <div>
                  <el-form-item label="运行时间：">
                    <el-date-picker
                      v-model="dispatchTimeForm.onceRunTime"
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
            <div class="work-type-pane" v-if="dispatchTimeForm.jobType === 2">
              <el-form-item label="调度周期：" prop="runCycle">
                <el-select v-model="dispatchTimeForm.runCycle" placeholder="请选择" style="width:220px;" @change="disTimeTurnOff (dispatchTimeForm.runCycle)">
                  <el-option
                    v-for="item in dispatchCycleList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="具体时间："  prop="dayOfWeeks" v-if="dispatchTimeForm.runCycle === 'WEEK'">
                <el-select
                  v-model= "dispatchTimeForm.dayOfWeeks"
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
              <el-form-item label="具体时间：" prop="dayOfMonths" v-if="dispatchTimeForm.runCycle === 'MONTH'">
                <el-select
                  v-model="dispatchTimeForm.dayOfMonths"
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
              <el-form-item class="label-remove-margin" prop="runTime" label-width="30px" v-if="dispatchTimeForm.runCycle === 'MONTH' || dispatchTimeForm.runCycle === 'WEEK' || dispatchTimeForm.runCycle === 'DAY'">
                <el-time-picker
                  v-model="dispatchTimeForm.runTime"
                  value-format="timestamp"
                  placeholder="时:分:秒">
                </el-time-picker>
              </el-form-item>
              <el-form-item class="label-remove-margin" prop="cron" label-width="30px" v-if="dispatchTimeForm.runCycle === 'CRON'">
                <el-input v-model="dispatchTimeForm.cron" placeholder="请输CRON表达式" style="width:300px"/>
              </el-form-item>
            </div>
            <div class="work-type-pane" v-if="dispatchTimeForm.jobType === 2 && (dispatchTimeForm.runCycle === 'MINUTE' || dispatchTimeForm.runCycle === 'HOUR')">
              <el-form-item label="开始时间：" prop="startTime">
                <el-time-picker
                  v-model="dispatchTimeForm.startTime"
                  :clearable=false
                  value-format="timestamp"
                  format="HH:mm"
                  placeholder="时:分">
                </el-time-picker>
              </el-form-item>
              <el-form-item label="时间间隔：" prop="timeInterval">
                <el-select v-model="dispatchTimeForm.timeInterval" placeholder="请选择">
                  <el-option
                    v-for="item in timeIntervalList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
                <span>{{ disIntervalMess }}</span>
              </el-form-item>
              <el-form-item label="结束时间：" prop="endTime">
                <el-time-picker
                  v-model="dispatchTimeForm.endTime"
                  :clearable=false
                  value-format="timestamp"
                  format="HH:mm"
                  placeholder="时:分">
                </el-time-picker>
              </el-form-item>
            </div>
            <el-form-item label="最晚完成时间：" prop="lastFinishTime" v-if="dispatchTimeForm.runCycle !== 'MINUTE' && dispatchTimeForm.runCycle !== 'HOUR' && dispatchTimeForm.runCycle !== 'CRON'">
              <el-time-picker
                v-model="dispatchTimeForm.lastFinishTime"
                :clearable=false
                value-format="timestamp"
                format="HH:mm"
                placeholder="时:分">
              </el-time-picker>
            </el-form-item>
            <div class="work-type-pane">
              <el-form-item label="失败重跑：" prop="isRunAgain">
                <el-radio-group v-model="dispatchTimeForm.isRunAgain">
                  <el-radio :label="0">是</el-radio>
                  <el-radio :label="1">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item prop="runNum" label-width="60px" v-if="dispatchTimeForm.isRunAgain === 0">
                重跑<el-input-number v-model="dispatchTimeForm.runNum" style="width:160px;margin: 0 10px" :min="0" />次
              </el-form-item>
            </div>
        </el-form>
      </div>
      <div class="work-content-1">
        <h3>调度报警</h3>
        <el-form label-width="110px" :model="dispatchWarningForm" :rules="dataRule" ref="dispatchWarningForm">
          <el-form-item prop="warningCause" label="报警原因：">
            <el-checkbox-group v-model="dispatchWarningForm.warningCause">
              <el-checkbox :label="0">失败</el-checkbox>
              <el-checkbox :label="1">超时</el-checkbox>
              <el-checkbox :label="2">成功</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item prop="warningType" label="报警方式：">
            <el-checkbox-group v-model="dispatchWarningForm.warningType">
              <el-checkbox label="dingding">钉钉</el-checkbox>
              <el-checkbox label="tel">电话</el-checkbox>
              <el-checkbox label="mail">邮件</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item prop="warningAccessUser" label="接收人：">
            <el-select v-model="dispatchWarningForm.warningAccessUser" multiple filterable style="width: 400px">
              <el-option :value="item.value" :label="item.name" v-for="item in warningAccessUserList" :key="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="ddQunToken" label="钉钉群报警：">
            <el-input v-model="dispatchWarningForm.ddQunToken" style="width: 400px" placeholder="请输入token"/>
          </el-form-item>
        </el-form>
      </div>
      <div class="work-content-1">
        <h3>调度启停</h3>
        <el-form label-width="110px" :model="dataForm" :rules="dataRule" ref="dataForm2">
          <div class="work-type-pane">
            <el-form-item label="状态：" prop="dispatchStatus" label-width="100px">
              <el-radio-group v-model="dataForm.dispatchStatus">
                <el-radio :label="0">有效</el-radio>
                <el-radio :label="1">无效</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="任务责任人：" prop="requestedUser" label-width="200px">
              <el-input v-model="dataForm.requestedUser" placeholder="任务责任人" style="width: 300px" />
            </el-form-item>
          </div>
        </el-form>
      </div>
    </div>
    <div class="footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </div>
    <dispatch-config-task-dependent v-if="dispatchConfigTaskDependentVisible" ref="dispatchConfigTaskDependent"></dispatch-config-task-dependent>
  </el-drawer>
</template>

<script>
import {
  info,
  save,
  update,
  projectAll,
  taskBaseInfo,
  taskDependenceAdd,
  taskBaseList,
  taskDependenceDelete,
  taskSelectDependence
} from '@/api/dispatch/taskManag'
import dispatchConfigTaskDependent from './dispatchConfig-task-dependent'
export default {
  components: {
    dispatchConfigTaskDependent
  },
  data () {
    let validateTime = (rule, value, callback) => {
      let tempTime1 = new Date(this.dispatchTimeForm.startTime)
      let tempTime2 = new Date(this.dispatchTimeForm.endTime)
      let hour1 = tempTime1.getHours()
      let minute1 = tempTime1.getMinutes()
      let hour2 = tempTime2.getHours()
      let minute2 = tempTime2.getMinutes()
      let tempDate = new Date()
      if (tempDate.setHours(hour1, minute1) >= tempDate.setHours(hour2, minute2)) {
        callback(new Error('开始时间大于等于结束时间'))
      } else {
        this.$refs.dispatchTimeForm.clearValidate('startTime')
        this.$refs.dispatchTimeForm.clearValidate('endTime')
        callback()
      }
    }
    return {
      visible: false,
      loading: false,
      id: '',
      formDs: '',
      toDs: '',
      updateUser: '',
      updateTime: '',
      dataForm: {
        taskName: '',
        id: '',
        projectId: '',
        taskDescribe: '',
        selectedDpendece: '',
        dispatchStatus: 0,
        requestedUser: ''
      },
      dispatchTimeForm: {
        jobType: 1, // 周期
        onceRunTime: '', // 运行一次运行时间
        runTime: '', // 周期运行具体时间
        runCycle: 'MINUTE', // 调度周期
        timeInterval: '',
        startTime: '',
        endTime: '',
        lastFinishTime: '',
        cron: '',
        dayOfWeeks: [], // 周
        dayOfMonths: [], // 月
        runNum: '',
        isRunAgain: 1
      },
      dispatchWarningForm: {
        warningCause: [1],
        warningType: ['dingding'],
        warningAccessUser: ['zhangbing'],
        ddQunToken: ''
      },
      warningAccessUserList: [
        {
          name: '章冰',
          value: 'zhangbing'
        },
        {
          name: '王一',
          value: 'wangyi'
        }
      ],
      disIntervalMess: '分钟',
      timeIntervalList: [],
      dispatchCycleList: [
        {value: 'MINUTE', label: '分钟'},
        {value: 'HOUR', label: '小时'},
        {value: 'DAY', label: '日'},
        {value: 'WEEK', label: '周'},
        {value: 'MONTH', label: '月'},
        {value: 'CRON', label: 'CRON表达式'}
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
      dataRule: {
        jobType: [
          {required: true, message: '请选择周期', trigger: 'change'}
        ],
        runCycle: [
          { required: true, message: '请选择调度周期', trigger: 'change' }
        ],
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
          { required: true, validator: validateTime }
        ],
        timeInterval: [
          {type: 'number', required: true, message: '请选择间隔时间', trigger: 'change'}
        ],
        endTime: [
          { required: true, validator: validateTime }
        ],
        isRunAgain: [
          {required: true, message: '请选择', trigger: 'change'}
        ],
        warningCause: [
          { required: true, message: '请选择报警原因', trigger: 'change' }
        ],
        warningType: [
          { required: true, message: '请选择报警方式', trigger: 'change' }
        ],
        warningAccessUser: [
          { required: true, message: '请选择报警接收人', trigger: 'change' }
        ],
        ddQunToken: [
          { required: true, message: '请输入报警群', trigger: 'blur' }
        ],
        dispatchStatus: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        requestedUser: [
          { required: true, message: '请输入任务责任人', trigger: 'blur' }
        ]
      },
      tableData: [
        {
          taskName: '1232323',
          taskSys: 'maxcompute'
        },
        {
          taskName: '1232323',
          taskSys: 'maxcompute'
        }
      ],
      allSystemList: [],
      dispatchConfigTaskDependentVisible: false
    }
  },
  methods: {
    init (id) {
      this.id = id ? id.id : ''
      this.visible = true
      this.getAllSystem()
      this.dataAssembly()
      this.disTimeTurnOff('MINUTE')
      this.$nextTick(() => {
        if (id) {
          // this.getInfo()
        }
        this.$refs['dataForm1'].resetFields()
      })
    },
    getInfo () {
      this.loading = true
      info(this.id).then(({data}) => {
        if (data.code !== 0) {
          return this.$message.error(data.msg || '获取数据异常')
        }
        this.updateUser = data.data.updateUser
        this.updateTime = data.data.updateTime
        this.dataForm.id = data.data.id
        this.dataForm.projectId = data.data.projectId
        this.dataForm.taskDescribe = data.data.taskDescribe
        this.dataForm.dispatchStatus = data.data.dispatchStatus
        this.dataForm.requestedUser = data.data.requestedUser
        this.acquisitionTask = data.data.acquisitionTask
        this.acquisitionTask.sqlField = this.acquisitionTask.sqlField.split(',')
        let filterInArr = this.getAllinDatasourceList.filter(item => item.name === this.acquisitionTask.inDatasourceType)[0]
        let filterOutArr = this.getAlloutDatasourceList.filter(item => item.name === this.acquisitionTask.outDatasourceType)[0]
        this.getAllinDatasourceNameList = filterInArr.source
        this.getAlloutDatasourceNameList = filterOutArr.source
        this.formDs = filterInArr.alias
        this.toDs = filterOutArr.alias
        let strLen = this.formDs.length + this.toDs.length + 5
        this.dataForm.taskName = data.data.taskName.substr(strLen)
        this.getAllAccount('in', data.data.acquisitionTask.inDatasourceId)
        this.getAllAccount('out', data.data.acquisitionTask.outDatasourceId)
        this.loading = false
      })
    },
    getAllSystem () {
      projectAll().then(({data}) => {
        this.allSystemList = data.data
      })
    },
    // 已选依赖选中操作
    handleSelectDependenceChange (val) {
      console.log(val)
    },
    // 删除所选依赖
    deleteDependenceHandle () {

    },
    // 新增依赖
    addDependenceHandle () {
      this.dispatchConfigTaskDependentVisible = true
      this.$nextTick(() => {
        this.$refs.dispatchConfigTaskDependent.init()
      })
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
      this.dispatchTimeForm.timeInterval = ''
      this.timeIntervalList = tempArry
    },
    drawerClose () { // 关闭抽屉弹窗
      this.visible = false
      this.$parent.computAddOrUpdateVisible = false
    },
    // 提交
    dataFormSubmit (form) {
      let flag = true
      this.$refs['dataForm1'].validate((valid) => {
        if (!valid) {
          flag = false
        }
      })
      this.$refs['dataForm2'].validate((valid) => {
        if (!valid) {
          flag = false
        }
      })
      this.$refs['acquisitionTask'].validate((valid) => {
        if (!valid) {
          flag = false
        }
      })
      if (flag) {
        console.log(this.dataForm, this.acquisitionTask)
        let url = save
        if (this.dataForm.id) {
          url = update
        }
        url({
          ...this.dataForm,
          taskName: `${this.formDs}_to_${this.toDs}_${this.dataForm.taskName}`,
          taskType: 'ACQUISITION',
          acquisitionTask: { ...this.acquisitionTask, sqlField: this.acquisitionTask.sqlField.join(',') }
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$message({
              message: data.msg || '操作成功',
              type: 'success',
              onClose: () => {
                this.visible = false
                this.$emit('refreshDataList')
              }
            })
          } else {
            this.$message.error(data.msg)
          }
        })
      }
    }
  }
}
</script>
<style>
.api-manage-drawer .wrap {
    padding: 0 20px 20px;
    margin-top: -12px;
    width: 100%;
    overflow-y: auto;
    position: absolute;
    top: 75px;
    bottom: 55px;
  }
  .wrap h3 span  {
    float: right;
    font-size: 12px;
    font-weight: normal;
  }
  .wrap h3 span i {
    font-style: normal;
    padding-right: 10px;
    color: #000;
  }
  .drawer-title {
    padding: 15px;
    background: #333;
    color: #fff;
    font-size: 15px;
    margin: -20px -20px 0 -20px;
    position: relative;
  }
  .drawer-close {
    position: absolute;
    right: 20px;
  }
  .codesql {
    font-size: 11pt;
    font-family: Consolas, Menlo, Monaco, Lucida Console, Liberation Mono,
      DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace, serif;
  }
  .btn-code-continue {
    text-align: right;
  }
  .work-content-1 {
    border-top: 1px #cccccc dashed;
    padding: 20px 20px 10px 0;
    margin-top: 20px;
  }
  .footer {
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
  .CodeMirror {
    height: 260px
  }
  .styled-background {
    color: red
  }
  .work-type-pane {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
  }
  .CodeMirror-hints.xq-light, .CodeMirror-hints.idea {
    position: absolute;
    z-index: 9999;
    display: block;
  }
  .inputTag {
    border-radius: 4px;
    width: 600px;
    line-height: 22px;
    border: 1px solid #dcdfe6
  }
</style>
