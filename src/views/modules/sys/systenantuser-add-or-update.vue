<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="租户id" prop="tenantId">
      <el-input v-model="dataForm.tenantId" placeholder="租户id"></el-input>
    </el-form-item>
    <el-form-item>
      <el-transfer v-model="userGroupStr" :titles="['全部', '选中']" :props="{
                        key: 'userId',
                        label: 'username'
                      }" :data="allUseOptions" :filterable="true">
      </el-transfer>
    </el-form-item>
    <!--<el-form-item label="系统用户Id" prop="userId">
      <el-input v-model="dataForm.userId" placeholder="系统用户Id"></el-input>
    </el-form-item>-->
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
          id: 0,
          tenantId: '',
          userId: '',
          enable: '',
          createdTime: '',
          updatedTime: ''
        },
        allUseOptions: [],
        userStr: [],
        dataRule: {
          tenantId: [
            { required: true, message: '租户id不能为空', trigger: 'blur' }
          ],
          userId: [
            { required: true, message: '系统用户Id不能为空', trigger: 'blur' }
          ],
          enable: [
            { required: true, message: '是否启用不能为空', trigger: 'blur' }
          ]
        }
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
              url: this.$http.adornUrl(`/sys/systenant/tenantuserinfo/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.allUseOptions = data.allsysUser
                this.dataForm.tenantId = data.sysreltenantuser.tenantId
                this.dataForm.userId = data.sysreltenantuser.userId
                this.dataForm.enable = data.sysreltenantuser.enable
                this.dataForm.createdTime = data.sysreltenantuser.createdTime
                this.dataForm.updatedTime = data.sysreltenantuser.updatedTime
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
              url: this.$http.adornUrl(`/sys/sysreltenantuser/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'tenantId': this.dataForm.tenantId,
                'userId': this.dataForm.userId,
                'enable': this.dataForm.enable,
                'createdTime': this.dataForm.createdTime,
                'updatedTime': this.dataForm.updatedTime
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
