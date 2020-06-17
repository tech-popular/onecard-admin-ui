<template>
    <el-dialog title="新增" :append-to-body="true" :visible.sync="visible" :show-close="false" width="1000px" >
      <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="160px">
        <el-form-item label="空间名称" prop="name">
          <el-input v-model="dataForm.name" placeholder="标题" />
        </el-form-item>
        <el-form-item label="负责部门" prop="systemmodel">
          <el-cascader
            style="width: 100%"
            :props="props"
            v-model="dataForm.systemmodel"
            clearable
            :options="systemmodelList">
          </el-cascader>
        </el-form-item>
        <el-form-item label="负责人">
          <el-select v-model="applyTypeValue" placeholder="请选择">
            <el-option v-for="item in applyType" :value="item.id" :key="item.id" :label="item.name"/>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="foot">
        <el-button @click="applyDataFormCancel()">取消</el-button>
        <el-button type="primary" @click="dataFormSubmit()" :loading="buttonloading">确定</el-button>
      </div>
  </el-dialog>
</template>


<script>
import { databaseInitInfo, saveAccountAuthApply } from '@/api/oa/apply'
export default {
  data () {
    return {
      totalPage: 0,
      visible: false,
      // 账号权限开始
      dataForm: {
        name: '', // 标题
        system: '', // 申请系统
        systemmodel: '', // 申请系统模块
        userName: '', // 申请人姓名
        phone: '', // 申请人手机号
        email: '', // 申请人邮箱
        reason: '' // 申请理由
      }, // 账号权限form
      dataRule: {
        name: [{ required: true, message: '标题不能为空', trigger: 'blur' }],
        system: [
          { required: true, message: '请选择申请系统', trigger: 'blur' }
        ],
        systemmodel: [
          { required: true, message: '请选择申请系统模块', trigger: 'blur' }
        ],
        reason: [
          { required: true, message: '申请理由不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  components: {},
  methods: {
    init (id, value) {
      this.dataForm.id = id || ''
      this.visible = true
      this.$nextTick(() => {
        this.$refs['severDataForm'].resetFields()
        this.getStaffList()
        databaseInitInfo().then(({ data }) => {
          this.severApplyAuthList = data.data.applyAuthList
          this.severdepartment = data.data.department
          this.severDataForm.applicantEmail = data.data.applicantName
          this.severDataForm.applicantTel = data.data.applicantTel
        })
      })
    },
    dataFormSubmit (form) {
      // 账号权限提交
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          let newData = {
            title: this.dataForm.name,
            applicantName: this.dataForm.userName,
            applicantEmail: this.dataForm.email,
            applicantTel: this.dataForm.phone,
            applyReason: this.dataForm.reason,
            systemId: this.dataForm.system,
            menuList: this.dataForm.systemmodel
          }
          saveAccountAuthApply(newData).then(({ data }) => {
            if (data && data.status === '1') {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.visible = false
                  this.$emit('refreshDataList')
                  this.$refs['dataForm'].resetFields()
                }
              })
            } else {
              this.$message.error(data.message)
            }
          })
        }
      })
    },
    // 账号取消
    applyDataFormCancel () {
      this.visible = false
      this.$refs['dataForm'].resetFields()
    },
    sizeChangeHandle (val) {
      this.getStaffList()
    },
    // 当前页
    currentChangeHandle (val) {
      this.getStaffList()
    }
  }
}
</script>
<style scoped>
.foot {
  text-align: right;
}
</style>>
