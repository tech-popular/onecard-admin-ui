<template>
	<el-dialog title='查看' :append-to-body="true" :close-on-click-modal="false" :visible.sync="visible">
		<el-form label-width="140px" label-position="right" v-model="dataForm" ref="dataForm">
			<el-form-item label="下发类型" prop="type"> 
				<el-select v-model="dataForm.type">
					<el-option label="kafka" value="kafka">kafka</el-option>
					<el-option label="mysql" value="mysql">mysql</el-option>
					<el-option label="sms" value="sms">sms</el-option>
				</el-select>
			</el-form-item>
			<el-form-item v-if="dataForm.type === 'kafka'" label="topic" prop="topic">
				<el-select v-model="dataForm.topic">
				<el-option label="kafka" value="kafka">kafka</el-option>
					<el-option label="mysql" value="mysql">mysql</el-option>
					<el-option label="sms" value="sms">sms</el-option>
				</el-select>
			</el-form-item>
			<el-form-item v-if="dataForm.type === 'mysql'" label="数据源" prop="dataSource">
				<el-select v-model="dataForm.dataSource">
				<el-option label="kafka" value="kafka">kafka</el-option>
					<el-option label="mysql" value="mysql">mysql</el-option>
					<el-option label="sms" value="sms">sms</el-option>
				</el-select>
			</el-form-item>
			 <el-form-item  prop="channelId" v-if="dataForm.type === 'sms'" label="渠道">
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
			<el-form-item  prop="outPamas"  label="出参">
				<el-select v-model="dataForm.outPamas">
				<el-option label="kafka" value="kafka">kafka</el-option>
					<el-option label="mysql" value="mysql">mysql</el-option>
					<el-option label="sms" value="sms">sms</el-option>
				</el-select>
			</el-form-item>
		</el-form>
	</el-dialog>
</template>
<script>
export default {
  data () {
    return {
      visible: false,
      dataForm: {
        type: 'kafka',
        topic: '', // topic
        outPamas: '', // 出参
        dataSource: '', // 数据源
        channelId: '', // 渠道
        tempCode: '', // 模板
        smsTemplate: '' // 模板详情
      },
      issueChannelList: [],
      issueTemplateList: []
    }
  },
  methods: {
    init (row, tag) {
      this.visible = true
    },
    getSmsTemplate () {
      // 获取模板详情
    },
    getDate(value, type) {
      // 获取模板
    }
  }
}
</script>