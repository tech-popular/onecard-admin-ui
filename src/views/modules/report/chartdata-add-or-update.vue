<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="图表Id" prop="chartId">
      <el-input v-model="dataForm.chartId" placeholder="图表Id"></el-input>
    </el-form-item>
    <el-form-item label="任务ID" prop="taskId">
      <el-input v-model="dataForm.taskId" placeholder="任务ID"></el-input>
    </el-form-item>
    <el-form-item label="指标名称" prop="label">
      <el-input v-model="dataForm.label" placeholder="指标名称"></el-input>
    </el-form-item>
    <el-form-item label="指标值" prop="value">
      <el-input v-model="dataForm.value" placeholder="指标值"></el-input>
    </el-form-item>
    <el-form-item label="显示类型" prop="showType">
      <el-input v-model="dataForm.showType" placeholder="显示类型"></el-input>
    </el-form-item>
    <el-form-item label="显示堆" prop="showStack">
      <el-input v-model="dataForm.showStack" placeholder="显示堆"></el-input>
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
          targetId: 0,
          chartId: '',
          taskId: '',
          label: '',
          value: '',
          showType: '',
          showStack: ''
        },
        dataRule: {
          chartId: [
            { required: true, message: '图表Id不能为空', trigger: 'blur' }
          ],
          taskId: [
            { required: true, message: '任务ID不能为空', trigger: 'blur' }
          ],
          label: [
            { required: true, message: '指标名称不能为空', trigger: 'blur' }
          ],
          value: [
            { required: true, message: '指标值不能为空', trigger: 'blur' }
          ],
          showType: [
            { required: true, message: '显示类型不能为空', trigger: 'blur' }
          ],
          showStack: [
            { required: true, message: '显示堆不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.targetId = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.targetId) {
            this.$http({
              url: this.$http.adornUrl(`/report/chartdata/info/${this.dataForm.targetId}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.chartId = data.chartData.chartId
                this.dataForm.taskId = data.chartData.taskId
                this.dataForm.label = data.chartData.label
                this.dataForm.value = data.chartData.value
                this.dataForm.showType = data.chartData.showType
                this.dataForm.showStack = data.chartData.showStack
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
              url: this.$http.adornUrl(`/report/chartdata/${!this.dataForm.targetId ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'targetId': this.dataForm.targetId || undefined,
                'chartId': this.dataForm.chartId,
                'taskId': this.dataForm.taskId,
                'label': this.dataForm.label,
                'value': this.dataForm.value,
                'showType': this.dataForm.showType,
                'showStack': this.dataForm.showStack
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
