<template>
  <el-dialog title="报表订阅申请" :visible.sync="dialogVisible" width="1000px" :before-close="handleClose">
    <el-form :disabled="editDisabled" :model="subscriptionForm" :rules="subscriptionRules" ref="subscriptionForm" label-width="150px">
      <el-form-item label="申请系统：" prop="system">
        <el-radio-group v-model="subscriptionForm.system" @change="changeSystem">
          <el-radio :label="item.value" :key="item.value" v-for="item in systemList" style="margin-left:0">{{item.label}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="用户组：" prop="userGroupId">
        <el-select v-model="subscriptionForm.userGroupId" multiple placeholder="请选择用户组" style="width:100%">
          <el-option v-for="item in userGroupList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="申请系统模块：" prop="systemmodel" v-if="!editDisabled">
        <el-cascader style="width: 100%" :props="props" v-model="subscriptionForm.systemmodel" clearable :options="systemmodelListFilter"></el-cascader>
      </el-form-item>

      <el-form-item label="系统模块" prop="systemmodel" v-if="editDisabled">
        <el-input style="width: 100%" type="textare" :props="props" v-model="subscriptionForm.systemmodel"></el-input>
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
          placeholder="选择时间范围"
        ></el-time-picker>
      </el-form-item>

      <el-form-item label="通知方式：" prop="notifyType">
        <el-radio v-model="subscriptionForm.notifyType" label="1">钉钉消息</el-radio>
        <el-radio v-model="subscriptionForm.notifyType" label="2" style="margin-left:5px;">邮件</el-radio>
      </el-form-item>
    </el-form>

    <div class="foot">
      <el-button @click="cancel()">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()" :loading="buttonloading">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  applyScriptions,
  getUserGroupList,
  getSystemModulesById,
  infoData
} from '@/api/dataGovernance/reportSubscribe'
export default {
  data () {
    return {
      subscriptionForm: {
        system: '',
        userGroupId: [],
        systemmodel: '',
        notifyType: '',
        receiveTime: ['10:00', '18:00']
      },
      subscriptionRules: {
        system: [{ required: true, message: '请选择申请系统', trigger: 'change' }],
        userGroupId: [{ required: true, message: '请选择用户组', trigger: 'change' }],
        systemmodel: [{ required: true, message: '请选择申请系统模块', trigger: 'change' }],
        receiveTime: [{ required: true, message: '请选择允许接收时间段', trigger: 'blur' }],
        notifyType: [{ required: true, message: '请选择通知方式', trigger: 'change' }]
      },
      userGroupList: [],
      systemmodelListFilter: [],
      editDisabled: false,
      props: {
        multiple: true
      },
      pickerOptions: {
        format: 'HH:mm'
      },
      buttonloading: false,
      dialogVisible: false,
      systemList: [
        { label: '新BI_PC端', value: 8 },
        { label: '新BI_移动端', value: 9 }
      ] // 申请系统数据
    }
  },
  methods: {
    init (id) {
      this.dialogVisible = true
      if (id) {
        this.editDisabled = true
        infoData(id).then(({ data }) => {
          if (data.code === 0) {
            let userGroupIds = data.data.userGroupIds.split(',')
            this.subscriptionForm.userGroupId = userGroupIds.map(item => { return +item })
            this.subscriptionForm.systemmodel = data.data.menuList
            this.subscriptionForm.notifyType = data.data.notifyType
            this.subscriptionForm.receiveTime = [data.data.receiveTimeStart, data.data.receiveTimeEnd]
            this.subscriptionForm.system = data.data.systemId
            this.changeSystem(data.data.systemId)
          } else {
            this.$message.error(data.message)
          }
        })
      }
    },
    // 系统选择
    changeSystem (value) {
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
    cancel () {
      this.subscriptionForm = {
        system: '',
        userGroupId: [],
        systemmodel: '',
        notifyType: '',
        receiveTime: ['10:00', '18:00']
      }
      this.$refs['subscriptionForm'].resetFields()
      this.dialogVisible = false
    },
    dataFormSubmit () {
      this.$refs['subscriptionForm'].validate(valid => {
        if (valid) {
          this.buttonloading = true
          const { userGroupId, systemmodel, system } = this.subscriptionForm
          const selectedSystem = this.systemList.filter(item => item.value == system)
          const menuList = []
          systemmodel.map(item => {
            menuList.push(item[item.length - 1])
          })
          let params = {
            userGroupIds: userGroupId.join(','),
            menuList: menuList.join(','),
            notifyType: this.subscriptionForm.notifyType,
            receiveTimeStart: this.subscriptionForm.receiveTime[0] + ':00',
            receiveTimeEnd: this.subscriptionForm.receiveTime[1] + ':00',
            systemId: selectedSystem[0].value
          }
          applyScriptions(params).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.$emit('refreshDataList')
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
    },
    // 弹窗状态
    handleClose () {
      this.dialogVisible = false
    }
  }
}
</script>
<style scoped>
.foot {
  text-align: right;
}
</style>
