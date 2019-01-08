<template>
<el-dialog :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" :visible.sync="visible">
  <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="任务Id" prop="taskId">
      <el-input v-model="dataForm.taskId" placeholder="任务Id"></el-input>
    </el-form-item>
    <el-form-item label="级别" prop="level">
      <!-- <el-input v-model="dataForm.level" placeholder="级别"></el-input>-->
      <el-select v-model="dataForm.level" placeholder="请选择">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="阈值表达式" prop="thresholdExpression">
      <el-input type="textarea" v-model="dataForm.thresholdExpression" placeholder="阈值表达式"></el-input>
    </el-form-item>
    <el-form-item label="错误连续次数" prop="mostConsecutiveLosses">
      <!--<el-input v-model="dataForm.mostConsecutiveLosses" placeholder="错误连续次数"></el-input>-->
      <el-input-number v-model="dataForm.mostConsecutiveLosses" :min="1" :max="10" label="错误连续次数"></el-input-number>
    </el-form-item>
    <el-form-item label="检查点内错误次数" prop="incontinuity">
      <!--<el-input v-model="dataForm.incontinuity" placeholder="检查点内错误次数"></el-input>-->
      <el-input-number v-model="dataForm.incontinuity" :min="1" :max="10" label="检查点内错误次数"></el-input-number>
    </el-form-item>
    <el-form-item label="是否启用" prop="enable">
      <el-radio-group v-model="dataForm.enable">
        <el-radio :label="0">禁用</el-radio>
        <el-radio :label="1">正常</el-radio>
      </el-radio-group>
    </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="closeUpdateBox">取消</el-button>
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
        level: '',
        thresholdExpression: '',
        mostConsecutiveLosses: '',
        incontinuity: '',
        enable: 1
      },
      dataRule: {
        taskId: [{
          required: true,
          message: '任务Id不能为空',
          trigger: 'blur'
        }],
        level: [{
          required: true,
          message: '级别不能为空',
          trigger: 'blur'
        }],
        thresholdExpression: [{
          required: true,
          message: '阈值表达式不能为空',
          trigger: 'blur'
        }],
        mostConsecutiveLosses: [{
          required: true,
          message: '错误连续次数不能为空',
          trigger: 'blur'
        }],
        incontinuity: [{
          required: true,
          message: '检查点内错误次数不能为空',
          trigger: 'blur'
        }],
        enable: [{
          required: true,
          message: '是否启用不能为空',
          trigger: 'blur'
        }]
      },
      options: [{
        value: 1,
        label: '一级'
      }, {
        value: 2,
        label: '二级'
      }, {
        value: 3,
        label: '三级'
      }]
    }
  },
  methods: {
    closeUpdateBox () {
      this.$emit('closeUpdateBox')
    },
    init (id) {
      this.dataForm.id = id || 0
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl(`/canary/canarytaskthreshold/info/${this.dataForm.id}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({
            data
          }) => {
            if (data && data.code === 0) {
              this.dataForm.taskId = data.canaryTaskThreshold.taskId
              this.dataForm.level = data.canaryTaskThreshold.level
              this.dataForm.thresholdExpression = data.canaryTaskThreshold.thresholdExpression
              this.dataForm.mostConsecutiveLosses = data.canaryTaskThreshold.mostConsecutiveLosses
              this.dataForm.incontinuity = data.canaryTaskThreshold.incontinuity
              this.dataForm.enable = data.canaryTaskThreshold.enable
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
            url: this.$http.adornUrl(`/canary/canarytaskthreshold/${!this.dataForm.id ? 'save' : 'update'}`),
            method: 'post',
            data: this.$http.adornData({
              'id': this.dataForm.id || undefined,
              'taskId': this.dataForm.taskId,
              'level': this.dataForm.level,
              'thresholdExpression': this.dataForm.thresholdExpression,
              'mostConsecutiveLosses': this.dataForm.mostConsecutiveLosses,
              'incontinuity': this.dataForm.incontinuity,
              'enable': this.dataForm.enable
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
                  this.$emit('closeUpdateBox')
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
