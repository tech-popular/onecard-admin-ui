<template>
<el-dialog :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" :visible.sync="visible">
  <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="用户组名称" prop="name">
      <el-input v-model="dataForm.name" placeholder="用户组名称"></el-input>
    </el-form-item>
    <el-transfer v-model="userGroupUserArray" :props="{
                  key: 'id',
                  label: 'name'
                }" :data="allUserEntities"></el-transfer>
    <el-form-item label="租户Id" prop="tenantId">
      <el-input v-model="dataForm.tenantId" placeholder="租户Id"></el-input>
    </el-form-item>
    <el-form-item label="是否启用" prop="enable">
      <el-radio-group v-model="dataForm.enable">
        <el-radio :label="0">禁用</el-radio>
        <el-radio :label="1">正常</el-radio>
      </el-radio-group>
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
        id: 0,
        name: '',
        tenantId: 1,
        enable: 1
      },
      dataRule: {
        name: [{
          required: true,
          message: '用户组名称不能为空',
          trigger: 'blur'
        }],
        tenantId: [{
          required: true,
          message: '租户Id不能为空',
          trigger: 'blur'
        }],
        enable: [{
          required: true,
          message: '是否启用不能为空',
          trigger: 'blur'
        }]
      },
      allUserEntities: [],
      userGroupUserArray: []
    }
  },
  methods: {
    init (id) {
      this.dataForm.id = id || 0
      this.visible = true

      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl(`/canary/canaryusergroup/info/${this.dataForm.id}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({
            data
          }) => {
            if (data && data.code === 0) {
              this.dataForm.name = data.canaryUserGroup.name
              this.dataForm.tenantId = data.canaryUserGroup.tenantId
              this.dataForm.enable = data.canaryUserGroup.enable
              this.allUserEntities = data.canaryUserGroup.allUserList
              this.userGroupUserArray = data.canaryUserGroup.userGroupUserArray
            }
          })
        } else {
          this.$http({
            url: this.$http.adornUrl(`/canary/canaryusergroup/getalluser`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({
                     data
                   }) => {
            if (data && data.code === 0) {
              this.allUserEntities = data.canaryUserEntities
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
            url: this.$http.adornUrl(`/canary/canaryusergroup/${!this.dataForm.id ? 'save' : 'update'}`),
            method: 'post',
            data: this.$http.adornData({
              'id': this.dataForm.id || undefined,
              'name': this.dataForm.name,
              'tenantId': this.dataForm.tenantId,
              'enable': this.dataForm.enable,
              'userGroupUserArray': this.userGroupUserArray
            })
          }).then(({
            data
          }) => {
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
