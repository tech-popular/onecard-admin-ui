<template>
  <el-dialog :title="title"
    :modal-append-to-body='false'
    :append-to-body="true"
    :visible.sync="visible"
    width="530px"
    :close-on-click-modal="false">
    <el-form :model="dataForm" ref="dataForm" :rules="dataRules" inline>
      <el-form-item label="连线名称：" prop="name">
        <el-input v-model.trim="dataForm.name" placeholder="只可输入字母、数字、下划线，且不能以数字开头" style="width:350px"></el-input>
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
      title: '',
      from: '',
      to: '',
      visible: false,
      allLinkText: [],
      dataForm: {
        name: ''
      },
      dataRules: {
        name: [
          { required: true, pattern: /^([a-zA-z_]{1})([\w]*)$/g, message: '只可输入字母、数字、下划线，且不能以数字开头', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init (link, linkTextData) {
      console.log(linkTextData)
      this.visible = true
      this.from = link.data.from
      this.to = link.data.to
      this.allLinkText = linkTextData
      if (link.data.data) {
        this.dataForm = link.data.data.configItems
      }
    },
    saveHandle () {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          let otherLineText = this.allLinkText.filter(item => item.to !== this.to) // 获取除了当前线之外，其他的内容
          let isFilter = otherLineText.length && otherLineText.filter(item => item.text === this.dataForm.name)
          if (isFilter.length) {
            return this.$message.error('连线名称重复，请重新输入！')
          }
          let config = {
            configItems: this.dataForm
          }
          this.$emit('close', { tag: 'save', data: { config: config, from: this.from, to: this.to } })
          this.$parent.dataQueryLineVisible = false
        }
      })
    },
    cancelHandle () {
      this.visible = false
      this.$parent.dataQueryLineVisible = false
    }
  }
}
</script>
