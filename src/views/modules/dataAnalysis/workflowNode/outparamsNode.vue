<template>
  <el-dialog title="返参"
    :modal-append-to-body='false'
    :append-to-body="true"
    :visible.sync="visible"
    width="500px"
    :close-on-click-modal="false">
    <el-form :model="dataForm" ref="dataForm" :rules="dataRules">
      <el-form-item prop="outValue" label="出参">
        <el-input v-model="dataForm.outValue" placeholder="请输入出参" style="width: 300px" />
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button type="primary" @click="saveHandle" size="small">确定</el-button>
      <el-button type="default" @click="cancelHandle" size="small">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  data () {
    return {
      id: '',
      key: '',
      visible: false,
      inparamData: [],
      dataForm: {
        outValue: ''
      },
      dataRules: {
        outValue: [
          { required: true, message: '请选择入参', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init (data) {
      this.visible = true
      this.key = data.key
      if (data.data) {
        this.dataForm.outValue = data.data.configItems.outValue
      }
    },
    saveHandle () {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          let config = {
            configItems: this.dataForm
          }
          this.$emit('close', { tag: 'save', data: { config: config, key: this.key } })
          this.$parent.outparamsNodeVisible = false
        }
      })
    },
    cancelHandle () {
      this.visible = false
      this.$parent.outparamsNodeVisible = false
    }
  }
}
</script>
