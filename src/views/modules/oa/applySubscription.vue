<template>
  <div>
    <el-form
      :model="subscriptionForm"
      :rules="subscriptionRules"
      ref="subscriptionForm"
      label-width="150px">
      <el-form-item label="申请系统：" prop="system">
        <el-radio-group v-model="subscriptionForm.system" @change="changeSystem">
          <el-radio :label="item.value" :key="item.value" v-for="item in systemList" style="margin-left:0">{{item.label}}</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item 
        label="用户组：" 
        prop="userGroupId" 
        v-if="subscriptionForm.system === 8 || subscriptionForm.system === 9">
        <el-select v-model="subscriptionForm.userGroupId" placeholder="请选择用户组" style="width:100%">
          <el-option
            v-for="item in userGroupList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="申请系统模块：" prop="systemmodel" v-if="isShow">
        <el-cascader
          style="width: 100%"
          :props="props"
          v-model="subscriptionForm.systemmodel"
          clearable
          :options="systemmodelListFilter"
        ></el-cascader>
      </el-form-item>
      
      <el-form-item label="发送主题：" prop="title">
        <el-input v-model="subscriptionForm.title" placeholder="请输入发送主题"></el-input>
      </el-form-item>

      <el-form-item label="申请理由：" prop="applyReason">
        <el-input type="textarea" v-model="subscriptionForm.applyReason" placeholder="请输入申请理由"></el-input>
      </el-form-item>

      <el-form-item label="允许接收时间段：" prop="receiveTime">
        <el-time-picker
          is-range
          v-model="subscriptionForm.receiveTime"
          :picker-options="pickerOptions"
          value-format="HH:mm"
          range-separator="-"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          placeholder="选择时间范围">
        </el-time-picker>
      </el-form-item>

      <el-form-item label="通知方式：" prop="notifyType">
        <el-checkbox-group v-model="subscriptionForm.notifyType">
          <el-checkbox label="2">邮件</el-checkbox>
          <el-checkbox label="1">钉钉消息</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>

    <div class="foot">
      <el-button @click="cancel()">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()" :loading="buttonloading">确定</el-button>
    </div>
  </div>
</template>

<script>
import {
  applyScription,
  getUserGroupList,
  getSystemModulesById
} from '@/api/oa/apply'

export default {
  name: 'applySubscription',
  props: ['systemList', 'systemmodelList'],
  data() {
    return {
      subscriptionForm: {
        system: '',
        userGroupId: '',
        systemmodel: '',
        notifyType: [],
        title: '',
        applyReason: '',
        receiveTime: ['10:00', '18:00']
      },
      subscriptionRules: {
        system: [{ required: true, message: '请选择申请系统', trigger: 'change' }],
        userGroupId: [{ required: true, message: '请选择用户组', trigger: 'change' }],
        systemmodel: [{ required: true, message: '请选择申请系统模块', trigger: 'change' }],
        title: [{ required: true, message: '请输入发送主题', trigger: 'blur' }],
        applyReason: [{ required: true, message: '请输入申请理由', trigger: 'blur' }],
        receiveTime: [{ required: true, message: '请选择允许接收时间段', trigger: 'blur' }],
        notifyType: [{ required: true, message: '请选择通知方式', trigger: 'change' }]
      },
      userGroupList: [],
      systemmodelListFilter: [],
      props: {
        multiple: true
      },
      isShow: false,
      pickerOptions: {
        format: 'HH:mm'
      },
      buttonloading: false
    }
  },
  methods: {
    // 系统选择
    changeSystem(value) {
      this.isShow = true
      this.systemmodelListFilter = []

      if (value === 8 || value === 9) {
        let params = {
          'userId': sessionStorage.getItem('id'),
          'type': value === 8 ? 0 : 1
        }
        getUserGroupList(params).then(({ data }) => {
          this.userGroupList = data.data
        })
      }

      getSystemModulesById({
        systemId: value
      }).then(({ data }) => {
        this.systemmodelListFilter = data.data[0].children
      })
    },
    cancel() {
      this.subscriptionForm = {
        system: '',
        userGroupId: '',
        systemmodel: '',
        notifyType: [],
        title: '',
        applyReason: '',
        receiveTime: ['10:00', '18:00']
      }
      this.$refs['subscriptionForm'].resetFields()
      this.$emit('cancel')
    },
    dataFormSubmit() {
      this.$refs['subscriptionForm'].validate(valid => {
        if (valid) {
          this.buttonloading = true

          const { userGroupId, systemmodel, title, applyReason, system } = this.subscriptionForm
          const selectedSystem = this.systemList.filter(item => item.value == system)
          let params = {
            userGroupId,
            menuList: systemmodel,
            content: title,
            applyReason,
            type: 3, // 订阅申请
            notifyType: this.subscriptionForm.notifyType.join(','),
            receiveTimeStart: this.subscriptionForm.receiveTime[0] + ':00',
            receiveTimeEnd: this.subscriptionForm.receiveTime[1] + ':00',
            systemName: selectedSystem[0].label,
            systemId: selectedSystem[0].value
          }
          console.log('params: ', params)
          applyScription(params).then(({ data }) => {
            if (data && data.status === '1') {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.$emit('submitSuccess')
                  this.cancel()
                }
              })
            } else {
              this.$message.error(data.message)
            }
          }).finally(() => {
            this.buttonloading = false
          })
        }
      })
    }
  }
}
</script>

<style scoped>
.foot {
  text-align: right;
}
</style>