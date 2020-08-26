<template>
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
                  value-format="yyyy-MM-dd HH:mm:ss"
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
            <el-select v-model="dispatchTimeForm.runCycle" placeholder="请选择" style="width:220px;" @change="disTimeTurnOff(dispatchTimeForm.runCycle)">
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
          <el-form-item class="label-remove-margin" prop="execTime" label-width="30px" v-if="dispatchTimeForm.runCycle === 'MONTH' || dispatchTimeForm.runCycle === 'WEEK' || dispatchTimeForm.runCycle === 'DAY'">
            <el-time-picker
              v-model="dispatchTimeForm.execTime"
              format="HH:mm:ss"
              value-format="HH:mm:ss"
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
              format="HH:mm"
              value-format="HH:mm"
              placeholder="时:分">
            </el-time-picker>
          </el-form-item>
          <el-form-item label="时间间隔：" prop="interval">
            <el-select v-model="dispatchTimeForm.interval" placeholder="请选择">
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
              format="HH:mm"
              value-format="HH:mm"
              placeholder="时:分">
            </el-time-picker>
          </el-form-item>
        </div>
        <el-form-item label="最晚完成时间：" prop="latestTime" v-if="dispatchTimeForm.jobType === 2 && dispatchTimeForm.runCycle !== 'MINUTE' && dispatchTimeForm.runCycle !== 'HOUR' && dispatchTimeForm.runCycle !== 'CRON'">
          <el-time-picker
            v-model="dispatchTimeForm.latestTime"
            :clearable=false
            format="HH:mm:ss"
            value-format="HH:mm:ss"
            placeholder="时:分:秒">
          </el-time-picker>
        </el-form-item>
        <div class="work-type-pane">
          <el-form-item label="失败重跑：" prop="isRunAgain">
            <el-radio-group v-model="dispatchTimeForm.isRunAgain">
              <el-radio :label="0">是</el-radio>
              <el-radio :label="1">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="failRepeatTrigger" label-width="60px" v-if="dispatchTimeForm.isRunAgain === 0">
            重跑<el-input-number v-model="dispatchTimeForm.failRepeatTrigger" style="width:160px;margin: 0 10px" :min="1" />次
          </el-form-item>
        </div>
    </el-form>
  </div>
</template>
<script>
import {
  taskPeriodInfo,
  taskPeriodSaveOrUpdate
} from '@/api/dispatch/taskManag'
export default {
  props: {
    taskId: Number,
    dispatchStatus: Object
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
      dispatchTimeForm: {
        jobType: 1, // 周期
        onceRunTime: '', // 运行一次运行时间
        execTime: '', // 周期运行具体时间
        runCycle: 'MINUTE', // 调度周期
        interval: '',
        startTime: '',
        endTime: '',
        latestTime: '',
        cron: '',
        dayOfWeeks: [], // 周
        dayOfMonths: [], // 月
        failRepeatTrigger: 3,
        isRunAgain: 1
      },
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
        execTime: [
          {required: true, message: '请选择时间', trigger: 'change'}
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
        interval: [
          {type: 'number', required: true, message: '请选择间隔时间', trigger: 'change'}
        ],
        endTime: [
          { required: true, validator: validateTime }
        ],
        isRunAgain: [
          {required: true, message: '请选择', trigger: 'change'}
        ],
        failRepeatTrigger: [
          {required: true, message: '请输入重跑次数', trigger: 'change'}
        ],
        latestTime: [
          {required: true, message: '请选择', trigger: 'change'}
        ],
        cron: [
          {required: true, message: '请选择', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    init () {
      this.dispatchTimeForm.onceRunTime = ''
      this.$refs['dispatchTimeForm'].resetFields()
      this.dataAssembly()
      this.disTimeTurnOff('MINUTE')
      this.getTaskPeriodInfo()
    },
    // 获取周期信息 & 状态信息
    getTaskPeriodInfo () {
      taskPeriodInfo(this.taskId).then(({data}) => {
        if (data && data.code === 0) {
          if (data.data !== null) {
            this.dispatchConfigPeriodData = data.data
            this.$emit('getStatus', {
              dispatchStatus: data.data.dispatchStatus,
              dutyUser: data.data.dutyUser
            })
            let jobType = data.data.jobType
            if (jobType === 'ONCE_ONLY') {
              this.dispatchTimeForm.jobType = 1
              this.dispatchTimeForm.onceRunTime = data.data.execTime
            } else {
              this.dispatchTimeForm.jobType = 2
              this.dispatchTimeForm.runCycle = jobType
              if (jobType === 'MINUTE' || jobType === 'HOUR') {
                this.dispatchTimeForm.startTime = data.data.startTime
                this.dispatchTimeForm.endTime = data.data.endTime
                this.dispatchTimeForm.interval = data.data.interval
              } else if (jobType === 'DAY') {
                this.dispatchTimeForm.execTime = data.data.execTime
                this.dispatchTimeForm.latestTime = data.data.latestTime
              } else if (jobType === 'WEEK' || jobType === 'MONTH') {
                this.dispatchTimeForm.execTime = data.data.execTime
                this.dispatchTimeForm.latestTime = data.data.latestTime
              }
              // dayOfWeeks
              if (jobType === 'WEEK') {
                this.dispatchTimeForm.dayOfWeeks = data.data.jobValue.split(',')
              }
              if (jobType === 'MONTH') {
                this.dispatchTimeForm.dayOfMonths = data.data.jobValue.split(',')
              }
            }
            // 是否重跑判断
            if (data.data.failRepeatTrigger !== 0) {
              this.dispatchTimeForm.isRunAgain = 0
              this.dispatchTimeForm.failRepeatTrigger = data.data.failRepeatTrigger
            } else {
              this.dispatchTimeForm.isRunAgain = 1
              this.dispatchTimeForm.failRepeatTrigger = 3
            }
          }
        } else {
          this.$message.error(data.msg)
        }
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
      this.dispatchTimeForm.interval = ''
      this.timeIntervalList = tempArry
    },
    formatDispatchTime (data) {
      let postData = {}
      // 组织外层数据
      if (data.jobType == 1) {
        postData.jobType = 'ONCE_ONLY'
        postData.execTime = data.onceRunTime
      } else {
        postData.jobType = data.runCycle
        if (data.runCycle == 'MINUTE' || data.runCycle == 'HOUR') {
          postData.startTime = data.startTime
          postData.endTime = data.endTime
          postData.interval = data.interval
        } else if (data.runCycle == 'DAY') {
          postData.execTime = data.execTime
          postData.latestTime = data.latestTime
        } else if (data.runCycle === 'WEEK') {
          postData.jobValue = data.dayOfWeeks.join(',')
          postData.execTime = data.execTime
          postData.latestTime = data.latestTime
        } else if (data.runCycle === 'MONTH') {
          postData.jobValue = data.dayOfMonths.join(',')
          postData.execTime = data.execTime
          postData.latestTime = data.latestTime
        } else {
          postData.cron = data.cron
        }
      }
      if (data.isRunAgain === 0) {
        postData.failRepeatTrigger = data.failRepeatTrigger
      } else {
        postData.failRepeatTrigger = 0
      }
      // 组织内层数据
      postData.taskScheduleConfig = {}
      if (data.jobType == 1) {
        let tempTime = new Date(data.onceRunTime)
        let year = tempTime.getFullYear().toString()
        let month = (tempTime.getMonth() + 1) < 10 ? '0' + (tempTime.getMonth() + 1) : tempTime.getMonth().toString()
        let day = tempTime.getDate() < 10 ? '0' + tempTime.getDate() : tempTime.getDate().toString()
        let hour = tempTime.getHours() < 10 ? '0' + tempTime.getHours() : tempTime.getHours().toString()
        let minute = tempTime.getMinutes() < 10 ? '0' + tempTime.getMinutes() : tempTime.getMinutes().toString()
        let second = tempTime.getSeconds() < 10 ? '0' + tempTime.getSeconds() : tempTime.getSeconds().toString()
        postData.taskScheduleConfig.jobType = 'ONCE_ONLY'
        if (data.onceRunTime) {
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
        let tempTime = data.execTime.split(':')
        let hour = tempTime[0]
        let minute = tempTime[1]
        let second = tempTime[2]
        postData.taskScheduleConfig.jobType = data.runCycle
        if (data.runCycle == 'WEEK') {
          postData.taskScheduleConfig.jobValue = data.dayOfWeeks.join(',')
        } else if (data.runCycle == 'MONTH') {
          postData.taskScheduleConfig.jobValue = data.dayOfMonths.join(',')
        } else if (data.runCycle == 'MINUTE' || data.runCycle == 'HOUR') {
          let obgStart = {
            hour: data.startTime && data.startTime.split(':')[0],
            minute: data.startTime && data.startTime.split(':')[1]
          }
          let obgEnd = {
            hour: data.endTime && data.endTime.split(':')[0],
            minute: data.endTime && data.endTime.split(':')[1]
          }
          postData.taskScheduleConfig.startTime = obgStart
          postData.taskScheduleConfig.endTime = obgEnd
          postData.taskScheduleConfig.interval = data.interval
        } else if (data.runCycle == 'CRON') {
          postData.taskScheduleConfig.cron = data.cron
        }
        if ((data.runCycle == 'WEEK' || data.runCycle == 'MONTH' || data.runCycle == 'DAY') && data.execTime !== '') {
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
    validateForm () {
      let flag = true
      this.$refs['dispatchTimeForm'].validate((valid) => {
        if (!valid) {
          flag = false
        }
      })
      return flag
    },
    submitData (fn) {
      let params = { ...this.dispatchStatus, ...this.formatDispatchTime(this.dispatchTimeForm), taskId: this.taskId }
      taskPeriodSaveOrUpdate(params).then(({data}) => {
        if (data && data.code === 0) {
          fn()
        } else {
          this.$message.error(data.msg)
        }
      })
    }
  }
}
</script>
