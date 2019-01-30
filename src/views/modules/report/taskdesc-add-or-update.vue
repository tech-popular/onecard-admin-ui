<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="任务ID" prop="taskId">
      <el-input v-model="dataForm.taskId" placeholder="任务ID"></el-input>
    </el-form-item>
    <el-form-item label="指标名称" prop="tartgetName">
      <el-input v-model="dataForm.tartgetName" placeholder="指标名称"></el-input>
    </el-form-item>
    <el-form-item label="指标值" prop="targetValue">
      <el-input v-model="dataForm.targetValue" placeholder="指标值"></el-input>
    </el-form-item>
    <el-form-item label="指标dsl" prop="dsl">
      <el-input v-model="dataForm.dsl" placeholder="指标dsl"></el-input>
    </el-form-item>
    <el-form-item label="支持时间分区 字典" prop="timeInterval">
      <el-input v-model="dataForm.timeInterval" placeholder="支持时间分区 字典"></el-input>
    </el-form-item>
    <el-form-item label="显示堆" prop="showStack">
      <el-input v-model="dataForm.showStack" placeholder="显示堆"></el-input>
    </el-form-item>
    <el-form-item label="显示类型" prop="showType">
      <el-input v-model="dataForm.showType" placeholder="显示类型"></el-input>
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
          taskDescId: 0,
          taskId: '',
          tartgetName: '',
          targetValue: '',
          dsl: '',
          timeInterval: '',
          showStack: '',
          showType: ''
        },
        dataRule: {
          taskId: [
            { required: true, message: '任务ID不能为空', trigger: 'blur' }
          ],
          tartgetName: [
            { required: true, message: '指标名称不能为空', trigger: 'blur' }
          ],
          targetValue: [
            { required: true, message: '指标值不能为空', trigger: 'blur' }
          ],
          timeInterval: [
            { required: true, message: '支持时间分区 字典不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.taskDescId = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.taskDescId) {
            this.$http({
              url: this.$http.adornUrl(`/report/taskdesc/info/${this.dataForm.taskDescId}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.taskId = data.taskDesc.taskId
                this.dataForm.tartgetName = data.taskDesc.tartgetName
                this.dataForm.targetValue = data.taskDesc.targetValue
                this.dataForm.dsl = data.taskDesc.dsl
                this.dataForm.timeInterval = data.taskDesc.timeInterval
                this.dataForm.showStack = data.taskDesc.showStack
                this.dataForm.showType = data.taskDesc.showType
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
              url: this.$http.adornUrl(`/report/taskdesc/${!this.dataForm.taskDescId ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'taskDescId': this.dataForm.taskDescId || undefined,
                'taskId': this.dataForm.taskId,
                'tartgetName': this.dataForm.tartgetName,
                'targetValue': this.dataForm.targetValue,
                'dsl': this.dataForm.dsl,
                'timeInterval': this.dataForm.timeInterval,
                'showStack': this.dataForm.showStack,
                'showType': this.dataForm.showType
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
