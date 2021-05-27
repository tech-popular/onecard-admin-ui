<template>
  <el-dialog title="模板配置"
    :modal-append-to-body='false'
    :append-to-body="true"
    :visible.sync="visible"
    v-loading="dataLoading"
    width="800px"
    :close-on-click-modal="false">
    <el-form :model="dataForm" ref="dataForm" label-position="left" label-width="100px" :rules="dataRules">
      <el-form-item prop="type" label="方式">
        <el-select v-model="dataForm.type" @change="dateType" placeholder="请选择下发方式" style="width: 300px">
          <el-option v-for="(item, index) in issueTypeList" :key="index" :value="item.value" :label="item.lable"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="dataForm.type === 'sms'" prop="channelId" label="渠道" >
        <el-select v-model="dataForm.channelId" @change="getDate(dataForm.channelId,true)" placeholder="请选择渠道" style="width: 300px">
          <el-option v-for="(item, index) in issueChannelList" :key="index" :value="item" :label="item"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="tempCode" v-if="dataForm.type === 'sms'" label="模板">
        <el-select v-model="dataForm.tempCode" @change="getSmsTemplate" placeholder="请选择模板" style="width: 300px">
          <el-option v-for="(item, index) in issueTemplateList" :key="index" :value="item.tempCode" :label="item.smsDesc"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="smsTemplate" v-if="dataForm.type === 'sms'" label="模板详情">
        <el-input type="textarea" autosize v-model="dataForm.smsTemplate" :disabled="true" ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button type="primary" @click="saveHandle" size="small">确定</el-button>
      <el-button type="default" @click="cancelHandle" size="small">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { getAllSmsChannels, getSmsCodeInfo } from '@/api/dataAnalysis/dataTransferManage'
export default {
  data () {
    return {
      id: '',
      key: '',
      visible: false,
      dataLoading: false,
      dataForm: {
        type: 'sms',
        channelId: '',
        tempCode: '',
        smsTemplate: ''
      },
      issueTypeList: [
        {value: 'sms', lable: '短信'},
        {value: 'tel', lable: '电销'},
        {value: 'ai', lable: 'AI'}
      ],
      issueChannelList: [],
      issueTemplateList: [],
      dataRules: {
        type: [
          { required: true, message: '请选择下发方式', trigger: 'change' }
        ],
        channelId: [
          { required: true, message: '请选择渠道', trigger: 'change' }
        ],
        tempCode: [
          { required: true, message: '请选择模板', trigger: 'change' }
        ]
        // smsTemplate: [
        //   { required: true, message: '请选择签名', trigger: 'change' }
        // ]
      }
    }
  },
  methods: {
    init (data) {
      this.visible = true
      this.dataLoading = true
      this.key = data.key
      this.getAllSmsChannels()
      if (data.data) {
        this.dataForm = data.data.configItems
        if (this.dataForm.type === 'sms') {
          this.getDate(data.data.configItems.channelId, false)
        }
      }
    },
    getAllSmsChannels() {
       getAllSmsChannels().then(({data}) => {
        if (data.status === '1') {
          this.issueChannelList = data.data
          this.dataLoading = false
        }
      })
    },
    getDate (value, isChange) {
      getSmsCodeInfo(value).then(({data}) => {
        if (data.status === '1') {
          this.issueTemplateList = data.data
          if (isChange) {
            this.dataForm.tempCode = ''
            this.dataForm.smsTemplate = ''
          }
        }
      })
    },
    dateType () {
      this.dataForm.channelId = ''
      this.dataForm.tempCode = ''
      this.dataForm.smsTemplate = ''
      this.issueTemplateList = []
    },
    getSmsTemplate () {
      this.dataForm.smsTemplate = this.issueTemplateList.filter(item => item.tempCode === this.dataForm.tempCode)[0].smsTemplate
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
