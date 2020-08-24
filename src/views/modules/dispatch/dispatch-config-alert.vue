<template>
  <div class="work-content-1">
    <h3>调度报警</h3>
    <el-form label-width="110px" :model="dispatchWarningForm" :rules="dataRule" ref="dispatchWarningForm">
      <el-form-item prop="alertReasonList" label="报警原因：">
        <el-checkbox-group v-model="dispatchWarningForm.alertReasonList">
          <el-checkbox :label="item.value" v-for="item in alertReasonList" :key="item.value">{{item.text}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item prop="alertMethodList" label="报警方式：">
        <el-checkbox-group v-model="dispatchWarningForm.alertMethodList">
          <el-checkbox :label="item.value" v-for="item in alertMethodList" :key="item.value">{{item.text}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item prop="receiverList" label="接收人：">
        <el-select
          ref="receiver"
          v-model="dispatchWarningForm.receiverList"
          multiple
          filterable
          remote
          :remote-method="remoteMethod"
          :loading="loading"
          style="width: 400px"
          @change="receiverChange"
          @focus="receiverFocus"
        >
          <el-option :value="item.id" :label="item.name" v-for="item in warningAccessUserList" :key="item.id" v-show="!item.isNotShow"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="dingToken" label="钉钉群报警：">
        <el-input v-model="dispatchWarningForm.dingToken" style="width: 400px" placeholder="可输入多个钉钉群token，以逗号分隔"/>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import {
  taskAlertInit,
  taskAlertReceiverList,
  taskAlertSave,
  taskAlertUpdate,
  taskAlertInfo
} from '@/api/dispatch/taskManag'
export default {
  props: {
    taskId: Number
  },
  data () {
    return {
      id: '',
      loading: false,
      alertReasonList: [],
      alertMethodList: [],
      dispatchWarningForm: {
        alertReasonList: [],
        alertMethodList: [],
        receiverList: [],
        dingToken: ''
      },
      warningAccessUserList: [],
      cacheOption: [],
      receiverOrigin: [],
      dataRule: {
        alertReasonList: [
          { required: true, message: '请选择报警原因', trigger: 'change' }
        ],
        alertMethodList: [
          { required: true, message: '请选择报警方式', trigger: 'change' }
        ],
        receiverList: [
          { required: true, message: '请选择接收人', trigger: 'change' }
        ],
        dingToken: [
          { required: true, message: '请输入报警群，以逗号分隔', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init () {
      this.cacheOption = []
      this.dispatchWarningForm = []
      this.receiverOrigin = []
      this.dispatchWarningForm = {
        alertReasonList: [],
        alertMethodList: [],
        receiverList: [],
        dingToken: ''
      }
      this.getAlertInit()
      this.getAlertInfo()
    },
    getAlertInfo () {
      taskAlertInfo(this.taskId).then(({data}) => {
        if (data && data.code === 0) {
          if (data.data.id) { // 修改
            this.id = data.data.id
            this.dispatchWarningForm = data.data
            this.warningAccessUserList = data.data.receiverList
            this.cacheOption = data.data.receiverList
            let arr = []
            data.data.receiverList.forEach(item => {
              arr.push(item.id)
            })
            this.dispatchWarningForm.receiverList = arr
          } else {
            this.id = ''
          }
        } else {
          this.$message.error(data.msg)
        }
        this.$refs['dispatchWarningForm'].resetFields()
      })
    },
    getAlertInit () {
      taskAlertInit().then(({data}) => {
        if (data && data.code === 0) {
          this.alertReasonList = data.data.alertReasonList
          this.alertMethodList = data.data.alertMethodList
        } else {
          this.alertReasonList = []
          this.alertMethodList = []
        }
      })
    },
    // 交集
    filterArr (arr1, arr2) {
      return arr1.filter(function (val) { return arr2.indexOf(val.id) > -1 })
    },
    // 取两个对象数组的并集且去重
    unique (arr) {
      const res = new Map()
      return arr.filter((arr) => !res.has(arr.id) && res.set(arr.id, 1))
    },
    receiverChange (val) { // 把已选中的内容也添加到下拉选中，但要隐藏其显示
      if (this.receiverOrigin.length < val.length) { // 添加了一个
        this.cacheOption.push({ ...this.warningAccessUserList.filter(citem => citem.id === val[val.length - 1])[0], isNotShow: true })
      } else {
        this.cacheOption = this.filterArr(this.cacheOption, val)
        this.warningAccessUserList = this.cacheOption
      }
      this.receiverOrigin = val
    },
    receiverFocus (e) {
      if (!e.srcElement.value) return false
    },
    remoteMethod (query) {
      if (query !== '') {
        this.loading = true
        this.getAlertReceiverList(query)
      } else {
        this.warningAccessUserList = []
      }
    },
    getAlertReceiverList (query) {
      taskAlertReceiverList({
        text: query
      }).then(({data}) => {
        this.warningAccessUserList = this.unique(data.data.concat(this.cacheOption))
        this.loading = false
      })
    },
    validateForm () {
      let flag = true
      this.$refs['dispatchWarningForm'].validate((valid) => {
        if (!valid) {
          flag = false
        }
      })
      return flag
    },
    submitData () {
      let url = taskAlertSave
      let params = { ...this.dispatchWarningForm, receiverList: this.cacheOption }
      params.taskId = this.taskId
      if (this.id) {
        url = taskAlertUpdate
        params.id = this.id
      }
      console.log(params)
      url(params).then(({data}) => {
        if (data && data.code === 0) {
          this.$message.success(data.msg)
          this.$emit('refreshList')
        } else {
          this.$message.error(data.msg || '调度报警保存失败')
        }
      })
    }
  }
}
</script>
