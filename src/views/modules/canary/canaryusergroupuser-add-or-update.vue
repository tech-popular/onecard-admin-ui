<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="用户Id" prop="userId">
      <el-input v-model="dataForm.userId" placeholder="用户Id"></el-input>
    </el-form-item>
    <el-form-item label="租户Id" prop="tenantId">
      <el-input v-model="dataForm.tenantId" placeholder="租户Id"></el-input>
    </el-form-item>
    <el-form-item label="是否启用" prop="enable">
      <el-input v-model="dataForm.enable" placeholder="是否启用"></el-input>
    </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          userGroupId: 0,
          userId: '',
          tenantId: '',
          enable: 1
        },
        dataRule: {
          userId: [
            { required: true, message: '用户Id不能为空', trigger: 'blur' }
          ],
          tenantId: [
            { required: true, message: '租户Id不能为空', trigger: 'blur' }
          ],
          enable: [
            { required: true, message: '是否启用不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.userGroupId = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.userGroupId) {
            this.$http({
              url: this.$http.adornUrl(`/canary/canaryusergroupuser/info/${this.dataForm.userGroupId}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.userId = data.canaryusergroupuser.userId
                this.dataForm.tenantId = data.canaryusergroupuser.tenantId
                this.dataForm.enable = data.canaryusergroupuser.enable
              }
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/canary/canaryusergroupuser/${!this.dataForm.userGroupId ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'userGroupId': this.dataForm.userGroupId || undefined,
                'userId': this.dataForm.userId,
                'tenantId': this.dataForm.tenantId,
                'enable': this.dataForm.enable
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
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
        })
      }
    }
  }
</script>
