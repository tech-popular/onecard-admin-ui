<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="任务ID" prop="taskId">
      <el-input v-model="dataForm.taskId" placeholder="任务ID"></el-input>
    </el-form-item>
    <el-form-item label="数据源ID" prop="datasourceId">
      <el-input v-model="dataForm.datasourceId" placeholder="数据源ID"></el-input>
    </el-form-item>
    <el-form-item label="sql" prop="sql">
      <el-input v-model="dataForm.sql" placeholder="sql"></el-input>
    </el-form-item>
    <el-form-item label="是否启用" prop="enable">
      <el-radio-group v-model="dataForm.enable">
        <el-radio :label="0">禁用</el-radio>
        <el-radio :label="1">正常</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="租户" prop="tenantId">
      <el-input v-model="dataForm.tenantId" placeholder="租户"></el-input>
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
          taskId: '',
          datasourceId: '',
          sql: '',
          enable: 1,
          tenantId: 1,
          createdTime: '',
          updatedTime: ''
        },
        dataRule: {
          taskId: [
            { required: true, message: '任务ID不能为空', trigger: 'blur' }
          ],
          datasourceId: [
            { required: true, message: '数据源ID不能为空', trigger: 'blur' }
          ],
          sql: [
            { required: true, message: 'sql不能为空', trigger: 'blur' }
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
              url: this.$http.adornUrl(`/canary/canarybasetaskdatasource/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.taskId = data.canaryBaseTaskDatasource.taskId
                this.dataForm.datasourceId = data.canaryBaseTaskDatasource.datasourceId
                this.dataForm.sql = data.canaryBaseTaskDatasource.sql
                this.dataForm.enable = data.canaryBaseTaskDatasource.enable
                this.dataForm.tenantId = data.canaryBaseTaskDatasource.tenantId
                this.dataForm.createdTime = data.canaryBaseTaskDatasource.createdTime
                this.dataForm.updatedTime = data.canaryBaseTaskDatasource.updatedTime
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
              url: this.$http.adornUrl(`/canary/canarybasetaskdatasource/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'taskId': this.dataForm.taskId,
                'datasourceId': this.dataForm.datasourceId,
                'sql': this.dataForm.sql,
                'enable': this.dataForm.enable,
                'tenantId': this.dataForm.tenantId,
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
