<template>
	<el-dialog title='查看' :append-to-body="true" :close-on-click-modal="false" :visible.sync="visible">
		<el-form label-width="120px" v-model="dataForm" :rules="baseRule" ref="dataForm">
			<el-form-item label="所属渠道" prop="channelId" :rules="{ required: true, message: '请选择所属渠道', trigger: 'blur' }">
				<el-select
					v-model="dataForm.channelId"
					@change="channelIdChange"
					filterable
					style="width: 400px"
				>
					<template v-for="(item, index) in channelList">
						<el-option
							:key="index"
							:label="item.text"
							:value="item.value"
							:disabled="item.disabled"
						></el-option>
					</template>
				</el-select>
				</el-form-item>
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
			 <el-form-item  prop="smsChannelId" v-if="dataForm.type === 'sms'" label="渠道">
        <el-select v-model="dataForm.smsChannelId" @change="getDate(dataForm.smsChannelId,true)" placeholder="请选择渠道" style="width: 300px">
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
			<el-form-item  prop="outParams"  label="出参">
				  <Treeselect
						:options="outParamsList"
						:disable-branch-nodes="true"
						:show-count="true"
						:multiple="true"
						:load-options="loadOptions"
						:searchable="true"
						:clearable="true"
						@input="changeOption"
						@select="outParamsSelect"
            @deselect="outParamsDeselect"
						noChildrenText="暂无数据"
						v-model="dataForm.outParams"
						placeholder="请选择"
						style="width: 400px"
						class="base-pane-item"
					/>
			</el-form-item>
		</el-form>
		<div slot="footer" class="foot">
      <el-button type="primary" @click="submitData">提交</el-button>
      <el-button @click="visible = false">取消</el-button>
    </div>
	</el-dialog>
</template>
<script>
import { dataTransferManageOutParams } from '@/api/dataAnalysis/dataTransferManage'
import {
  channelsList
} from '@/api/dataAnalysis/dataInsightManage'
// import { getDataList } from '@/dataAnalysis/soureceBinding'
// import { deepClone } from '../dataAnalysisUtils/utils'
import Treeselect, { LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect'
export default {
  data () {
    return {
      visible: false,
      dataForm: {
        id: '',
        type: 'kafka',
        topic: '', // topic
        dataSource: '', // 数据源
        channelId: '', // 渠道
        smsChannelId: '', // 短信渠道
        tempCode: '', // 模板
        outParams: [],
        smsTemplate: '' // 模板详情
      },
      outParamsList: [],
      outParams: [], // 分群出参提交格式
      issueChannelList: [],
      issueTemplateList: [],
      channelList: [],
      baseRule: { // 基本信息校验规则
        type: [
          { required: true, message: '请选择下发类型', trigger: 'change' }
        ],
        topic: [
          { required: true, message: '请选择topic', trigger: 'change' }
        ],
        dataSource: [
          { required: true, message: '请选择数据源', trigger: 'change' }
        ],
        smsChannelId: [
          { required: true, message: '请选择短信渠道', trigger: 'change' }
        ],
        tempCode: [
          { required: true, message: '请选择短信模板', trigger: 'change' }
        ],
        outParams: [
          { required: true, message: '请选择分群出参', trigger: 'input' }
        ]
      }
    }
  },
  components: { Treeselect },
  methods: {
     // 树加载
    async loadOptions ({ action, parentNode, callback }) {
      if (action === LOAD_CHILDREN_OPTIONS) {
        callback()
      }
    },
    init (row, tag) {
      this.visible = true
      this.getChannelsList()
      this.outParamsList = []
    },
    getChannelsList () {
      channelsList().then(res => {
        if (res.data.status * 1 !== 1) {
          this.channelList = []
          return
        }
        this.channelList = res.data.data.map(item => {
          if (item.value === '0000') {
            item.disabled = true
          } else {
            item.disabled = false
          }
          return item
        })
      })
    },
    // 获取分群出参 指标列表
    getOutParamsList (row) {
      dataTransferManageOutParams({ channelCode: this.dataForm.channelId, flag: this.dataForm.id ? '-1' : '1' }).then(({data}) => {
        if (data && data.status === '1') {
          if (row) {
            // this.originOutParamsList = data.data
            this.getOutParamsEditList(row.id, this.filterAllCata(data.data))
          } else {
            // this.originOutParamsList = data.data
            this.outParamsList = this.filterAllCata(data.data)
          }
        } else {
          this.outParamsList = []
        }
      })
    },
    // 清洗数据，按selectVue的格式重新组织指标数据
    filterAllCata (tree) {
      let arr = []
      if (!!tree && tree.length !== 0) {
        tree.forEach((item, index) => {
          let obj = {}
          if (item.fieldType) {
            obj.id = item.englishName + '-' + item.id
            obj.englishName = item.englishName
            obj.label = item.chineseName
            obj.fieldType = item.fieldType
            obj.enumTypeNum = item.enumTypeNum
            obj.sourceTable = item.sourceTable
            obj.dataStandar = item.dataStandar
            obj.fieldId = item.id
            obj.channelCode = item.channelCode
          } else {
            obj.id = item.id
            obj.label = item.name
          }
          // if (this.filterAllCata(item.dataCataLogList).length) { // 指标层 ，无children
          //   obj.children = this.filterAllCata(item.dataCataLogList)
          //   arr.push(obj)
          if (this.filterAllCata(item.dataCata).length) { // 指标层 ，无children
            obj.children = this.filterAllCata(item.dataCata) // 指标集合
            arr.push(obj)
          } else if (this.filterAllCata(item.dataIndex).length) {
            obj.children = this.filterAllCata(item.dataIndex) // 指标集合
            arr.push(obj)
          } else {
            if (!item.fieldType) {
              obj.children = null
            } else {
              arr.push(obj)
            }
          }
        })
      }
      return arr
    },
    channelIdChange () {
      // 用户渠道改变时，重新过滤指标数据
      if (this.dataForm.channelId.length === 0) {
        this.channelList.forEach(item => {
          if (item.value === '0000') {
            item.disabled = true
          } else {
            item.disabled = false
          }
        })
      }
      this.getOutParamsList()
    },
    // 修改，回显时查询分群出参选中
    getOutParamsEditList (id, outList) {
      // dataTransferManageOutParamsEdit(id).then(({data}) => {
      //   if (data && data.status === '1') {
      //     let out = []
      //     this.outParams = []
      //     data.data.forEach(item => {
      //       out.push(item.fieldCode + '-' + item.fieldId)
      //       this.outParams.push({value: item.fieldCode, id: item.fieldId, sourceTable: item.sourceTable})
      //     })
      //     this.baseForm.outParams = Array.from(new Set(out))
      //     this.outParamsList = this.updateOutParamsList(outList)
      //     this.$nextTick(() => {
      //       this.loading = false
      //     })
      //   }
      // })
    },
    getSmsTemplate () {
      // 获取模板详情
    },
    getDate(value, type) {
      // 获取模板
    },
    changeOption () {
      // 出参选择
    },
    // 选中出参
    outParamsSelect (node) {
      this.outParams.push({
        // value: node.englishName,
        id: node.fieldId
        // sourceTable: node.sourceTable
      })
      if (this.outParams.length) {
        this.$refs.baseForm.clearValidate('outParams')
      }
    },
    // 删除出参
    outParamsDeselect (node) {
      this.outParams = this.outParams.filter(item => item.id !== node.fieldId)
    },
    submitData () {
      console.log(this.dataForm)
    }
  }
}
</script>