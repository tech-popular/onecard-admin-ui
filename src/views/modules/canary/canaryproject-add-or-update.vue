<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="项目" prop="project">
      <el-input v-model="dataForm.project" placeholder="项目"></el-input>
    </el-form-item>
    <el-form-item label="服务名称" prop="servicename">
      <el-input v-model="dataForm.servicename" placeholder="服务名称"></el-input>
    </el-form-item>
    <el-form-item label="组名" prop="group">
      <el-input v-model="dataForm.group" placeholder="组名"></el-input>
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
          project: '',
          servicename: '',
          group: '',
          enable: 1
        },
        dataRule: {
          project: [
            { required: true, message: '项目不能为空', trigger: 'blur' }
          ],
          servicename: [
            { required: true, message: '服务名称不能为空', trigger: 'blur' }
          ],
          group: [
            { required: true, message: '组名不能为空', trigger: 'blur' }
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
              url: this.$http.adornUrl(`/canary/canaryproject/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.project = data.canaryProject.project
                this.dataForm.servicename = data.canaryProject.servicename
                this.dataForm.group = data.canaryProject.group
                this.dataForm.enable = data.canaryProject.enable
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
              url: this.$http.adornUrl(`/canary/canaryproject/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'project': this.dataForm.project,
                'servicename': this.dataForm.servicename,
                'group': this.dataForm.group,
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
