<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
<!--    <el-form-item label="chart_id号" prop="chartId">
      <el-input v-model="dataForm.chartId" placeholder="chart_id号"></el-input>
    </el-form-item>
    <el-form-item label="大屏号" prop="screenId">
      <el-input-number v-model="dataForm.screenId" placeholder="大屏号"></el-input-number>
    </el-form-item>-->
    <el-form-item label="名称" prop="name">
      <el-input v-model="dataForm.name" placeholder="名称"></el-input>
    </el-form-item>
    <el-form-item label="选择项值" prop="type">
      <el-input v-model="dataForm.type" placeholder="选择项值"></el-input>
    </el-form-item>
    <el-form-item label="占位符" prop="placeholder">
      <el-input v-model="dataForm.placeholder" placeholder="占位符"></el-input>
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
          screenId: '',
          name: '',
          type: '',
          placeholder: ''
        },
        dataRule: {
         /* chartId: [
            { required: true, message: 'chart_id号不能为空', trigger: 'blur' }
          ],
          screenId: [
            { required: true, message: '大屏号不能为空', trigger: 'blur' }
          ], */
          name: [
            { required: true, message: '名称不能为空', trigger: 'blur' }
          ],
          type: [
            { required: true, message: '选择项值不能为空', trigger: 'blur' }
          ],
          placeholder: [
            { required: true, message: '占位符不能为空', trigger: 'blur' }
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
              url: this.$http.adornUrl(`/phoenix/phoenixselection/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.chartId = data.phoenixSelection.chartId
                this.dataForm.screenId = data.phoenixSelection.screenId
                this.dataForm.name = data.phoenixSelection.name
                this.dataForm.type = data.phoenixSelection.type
                this.dataForm.placeholder = data.phoenixSelection.placeholder
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
              url: this.$http.adornUrl(`/phoenix/phoenixselection/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'chartId': this.dataForm.chartId,
                'screenId': this.dataForm.screenId,
                'name': this.dataForm.name,
                'type': this.dataForm.type,
                'placeholder': this.dataForm.placeholder
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
