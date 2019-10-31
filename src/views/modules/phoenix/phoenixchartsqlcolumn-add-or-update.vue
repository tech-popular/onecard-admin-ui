<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :visible.sync="visible"
    append-to-body>
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="字段名称" prop="columnName">
      <el-input v-model="dataForm.columnName" placeholder="字段名称"></el-input>
    </el-form-item>
    <el-form-item label="字段单位" prop="columnUnit">
      <el-input v-model="dataForm.columnUnit" placeholder="字段单位"></el-input>
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
          chartSqlId: '',
          columnName: '',
          columnUnit: ''
        },
        dataRule: {
          columnName: [
            { required: true, message: '字段名称不能为空', trigger: 'blur' }
          ],
          columnUnit: [
            { required: true, message: '字段单位不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (chartSqlId, id) {
        this.dataForm.id = id || 0
        this.dataForm.chartSqlId = chartSqlId || 0
        this.visible = true
        this.$nextTick(() => {
          if (this.dataForm.id <= 0) {
            this.$refs['dataForm'].resetFields()
          }
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/phoenix/phoenixchartsqlcolumn/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.chartSqlId = data.phoenixChartSqlColumn.chartSqlId
                this.dataForm.columnName = data.phoenixChartSqlColumn.columnName
                this.dataForm.columnUnit = data.phoenixChartSqlColumn.columnUnit
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
              url: this.$http.adornUrl(`/phoenix/phoenixchartsqlcolumn/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'chartSqlId': this.dataForm.chartSqlId,
                'columnName': this.dataForm.columnName,
                'columnUnit': this.dataForm.columnUnit
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
