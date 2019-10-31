<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    append-to-body>
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="名称" prop="name">
      <el-input v-model="dataForm.name" placeholder="名称"></el-input>
    </el-form-item>
    <el-form-item label="选择项值" prop="value">
      <el-input v-model="dataForm.value" placeholder="选择项值"></el-input>
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
          selectionId: '',
          name: '',
          value: ''
        },
        dataRule: {
          name: [
            { required: true, message: '名称不能为空', trigger: 'blur' }
          ],
          value: [
            { required: true, message: '选择项值不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (selectionId, id) {
        this.dataForm.id = id || 0
        this.dataForm.selectionId = selectionId || 0
        this.visible = true
        this.$nextTick(() => {
          if (this.dataForm.id <= 0) {
            this.$refs['dataForm'].resetFields()
          }
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/phoenix/phoenixselectiondata/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.selectionId = data.phoenixSelectionData.selectionId
                this.dataForm.name = data.phoenixSelectionData.name
                this.dataForm.value = data.phoenixSelectionData.value
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
              url: this.$http.adornUrl(`/phoenix/phoenixselectiondata/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'selectionId': this.dataForm.selectionId,
                'name': this.dataForm.name,
                'value': this.dataForm.value
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
