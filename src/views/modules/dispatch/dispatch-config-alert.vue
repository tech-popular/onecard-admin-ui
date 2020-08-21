<template>
  <div class="work-content-1">
    <h3>调度报警</h3>
    <el-form label-width="110px" :model="dispatchWarningForm" :rules="dataRule" ref="dispatchWarningForm">
      <el-form-item prop="alertReasonList" label="报警原因：">
        <el-checkbox-group v-model="dispatchWarningForm.alertReasonList">
          <el-checkbox :label="0">失败</el-checkbox>
          <el-checkbox :label="1">超时</el-checkbox>
          <el-checkbox :label="2">成功</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item prop="alertMethodList" label="报警方式：">
        <el-checkbox-group v-model="dispatchWarningForm.alertMethodList">
          <el-checkbox label="dingding">钉钉</el-checkbox>
          <el-checkbox label="tel">电话</el-checkbox>
          <el-checkbox label="mail">邮件</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item prop="receiverList" label="接收人：">
        <el-select
          v-model="dispatchWarningForm.receiverList"
          multiple
          filterable
          remote
          :remote-method="remoteMethod"
          :loading="loading"
          style="width: 400px"
        >
          <el-option :value="item.value" :label="item.name" v-for="item in warningAccessUserList" :key="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="dingToken" label="钉钉群报警：">
        <el-input v-model="dispatchWarningForm.dingToken" style="width: 400px" placeholder="请输入token"/>
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
      dispatchWarningForm: {
        alertReasonList: [1],
        alertMethodList: ['dingding'],
        receiverList: ['zhangbing'],
        dingToken: ''
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
      dataRule: {
        alertReasonList: [
          { required: true, message: '请选择报警原因', trigger: 'change' }
        ],
        alertMethodList: [
          { required: true, message: '请选择报警方式', trigger: 'change' }
        ],
        warningAccessUser: [
          { required: true, message: '请选择报警接收人', trigger: 'change' }
        ],
        dingToken: [
          { required: true, message: '请输入报警群', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init () {
      this.getAlertInit()
      this.getAlertInfo()
    },
    getAlertInfo () {
      taskAlertInfo(this.taskId).then(({data}) => {
        console.log(data)
        this.id = data.data.id
      })
    },
    getAlertInit () {
      taskAlertInit().then(({data}) => {
        console.log(data)
      })
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
        console.log(data)
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
      let params = {}
      if (this.id) {
        url = taskAlertUpdate
        params.id = this.id
      }
      console.log(params)
      url(params).then(({data}) => {
        if (data && data.code === 0) {
          console.log(data)
        }
      })
    }
  }
}
</script>
