<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="输出数据源Id" prop="outDatasource">
      <el-input v-model="dataForm.outDatasource" placeholder="输出数据源Id"></el-input>
    </el-form-item>
    <el-form-item label="输出表" prop="outTableName">
      <el-input v-model="dataForm.outTableName" placeholder="输出表"></el-input>
    </el-form-item>
    <el-form-item label="是否开启" prop="enable">
      <el-input v-model="dataForm.enable" placeholder="是否开启"></el-input>
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
          taskId: 0,
          outDatasource: '',
          outTableName: '',
          enable: ''
        },
        dataRule: {
          outDatasource: [
            { required: true, message: '输出数据源Id不能为空', trigger: 'blur' }
          ],
          outTableName: [
            { required: true, message: '输出表不能为空', trigger: 'blur' }
          ],
          enable: [
            { required: true, message: '是否开启不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.taskId = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.taskId) {
            this.$http({
              url: this.$http.adornUrl(`/honeycomb/honeycomboutdatasource/info/${this.dataForm.taskId}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.outDatasource = data.honeycomboutdatasource.outDatasource
                this.dataForm.outTableName = data.honeycomboutdatasource.outTableName
                this.dataForm.enable = data.honeycomboutdatasource.enable
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
              url: this.$http.adornUrl(`/honeycomb/honeycomboutdatasource/${!this.dataForm.taskId ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'taskId': this.dataForm.taskId || undefined,
                'outDatasource': this.dataForm.outDatasource,
                'outTableName': this.dataForm.outTableName,
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
