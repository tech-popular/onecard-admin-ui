<template>
  <el-dialog title="模板配置"
    :modal-append-to-body='false'
    :append-to-body="true"
    :visible.sync="visible"
    width="800px"
    :close-on-click-modal="false">
    <el-form :model="dataForm" ref="dataForm" label-position="right" label-width="100px" :rules="dataRules">
      <el-form-item prop="issueType" label="方式">
        <el-select v-model="dataForm.issueType" placeholder="请选择下发方式" style="width: 300px">
          <el-option v-for="(item, index) in issueTypeList" :key="index" :value="item.value" :label="item.text"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="issueChannel" label="渠道">
        <el-select v-model="dataForm.issueChannel" placeholder="请选择渠道" style="width: 300px">
          <el-option v-for="(item, index) in issueChannelList" :key="index" :value="item.value" :label="item.text"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="issueTemplate" label="模板">
        <el-select v-model="dataForm.issueTemplate" placeholder="请选择模板" style="width: 300px">
          <el-option v-for="(item, index) in issueTemplateList" :key="index" :value="item.value" :label="item.text"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="issueAutograph" label="签名">
        <el-select v-model="dataForm.issueAutograph" placeholder="请选择签名" style="width: 300px">
          <el-option v-for="(item, index) in issueAutographList" :key="index" :value="item.value" :label="item.text"></el-option>
        </el-select>
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
      dataForm: {
        issueType: '',
        issueChannel: '',
        issueTemplate: '',
        issueAutograph: ''
      },
      issueTypeList: [],
      issueChannelList: [],
      issueTemplateList: [],
      issueAutographList: [],
      dataRules: {
        issueType: [
          { required: true, message: '请选择下发方式', trigger: 'change' }
        ],
        issueChannel: [
          { required: true, message: '请选择渠道', trigger: 'change' }
        ],
        issueTemplate: [
          { required: true, message: '请选择模板', trigger: 'change' }
        ],
        issueAutograph: [
          { required: true, message: '请选择签名', trigger: 'change' }
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
