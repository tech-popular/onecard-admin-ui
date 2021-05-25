<template>
  <el-dialog title="数据查询"
    :modal-append-to-body='false'
    :append-to-body="true"
    :visible.sync="visible"
    width="500px"
    :close-on-click-modal="false">
      <el-form ref="saveForm" :model="saveForm" :rules="saveFormValidate" label-width="100px">
          <el-form-item prop="name" label="流程名称">
              <el-input v-model="saveForm.name" placeholder="请输入流程名称" />
          </el-form-item>
          <el-form-item prop="flowCode" label="流程编号">
              <el-input v-model="saveForm.flowCode" placeholder="请输入流程编号，只可输入字母、数字、下划线" />
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
      visible: false,
      saveForm: {
        name: '',
        flowCode: ''
      },
      saveFormValidate: {
        name: [
          { required: true, message: '请输入流程名称', trigger: 'blur' }
        ],
        flowCode: [
          { required: true, pattern: /^(?!_)(?!.*?_$)[a-zA-Z0-9_]+$/, message: '请输入流程编号，只可输入字母、数字、下划线', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init () {
      this.visible = true
    },
    saveHandle () {
      this.$refs.saveForm.validate((valid) => {
        if (valid) {
          this.$emit('close', this.saveForm)
          this.$parent.saveDataVisible = false
        }
      })
    },
    cancelHandle () {
      this.visible = false
      this.$parent.saveDataVisible = false
    }
  }
}
</script>
