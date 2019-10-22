<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    append-to-body>
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit(this.dataForm.chartId)" label-width="80px">
<!--    <el-form-item label="chart_id关联" prop="chartId">
      <el-input v-model="dataForm.chartId" placeholder="chart_id关联"></el-input>
    </el-form-item>-->
    <el-form-item label="类型" prop="type">
      <el-input v-model="dataForm.type" placeholder="类型"></el-input>
    </el-form-item>
    <el-form-item label="步长" prop="step">
      <el-input v-model="dataForm.step" placeholder="步长"></el-input>
    </el-form-item>
    <el-form-item label="刻度" prop="number">
      <el-input v-model="dataForm.number" placeholder="刻度"></el-input>
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
          chartId: '',
          type: '',
          step: '',
          number: ''
        },
        dataRule: {
          /* chartId: [
            { required: true, message: 'chart_id关联不能为空', trigger: 'blur' }
          ], */
          type: [
            { required: true, message: '类型不能为空', trigger: 'blur' }
          ],
          step: [
            { required: true, message: '步长不能为空', trigger: 'blur' }
          ],
          number: [
            { required: true, message: '刻度不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (chartId) {
        this.dataForm.chartId = chartId
        this.visible = true
        this.$nextTick(() => {
          // this.$refs['dataForm'].resetFields()
          if (this.dataForm.chartId) {
            this.$http({
              url: this.$http.adornUrl(`/phoenix/phoenixchartdegree/chartdegreeinfo/${this.dataForm.chartId}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.id = data.phoenixChartDegree.id
                this.dataForm.chartId = data.phoenixChartDegree.chartId
                this.dataForm.type = data.phoenixChartDegree.type
                this.dataForm.step = data.phoenixChartDegree.step
                this.dataForm.number = data.phoenixChartDegree.number
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
              url: this.$http.adornUrl(`/phoenix/phoenixchartdegree/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'chartId': this.dataForm.chartId,
                'type': this.dataForm.type,
                'step': this.dataForm.step,
                'number': this.dataForm.number
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
