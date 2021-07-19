<template>
	<el-dialog :title="tag === 'view' ? '查看' : dataForm.id ? '修改' : '新增'" :append-to-body="true" :close-on-click-modal="false" :visible.sync="visible">
		<el-form label-width="120px" :model="dataForm"  :rules="baseRule" ref="dataForm" :disabled="viewVisible">
			<el-form-item label="所属渠道" prop="channelCode" :rules="{ required: true, message: '请选择所属渠道', trigger: 'blur' }">
				<el-select
					v-model="dataForm.channelCode"
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
				<el-select v-model="dataForm.type" @change="changeType">
					<el-option label="kafka" value="kafka">kafka</el-option>
					<el-option label="mysql" value="mysql">mysql</el-option>
					<el-option label="sms" value="sms">sms</el-option>
				</el-select>
			</el-form-item>
			<el-form-item v-if="dataForm.type === 'kafka'" label="topic" prop="resourceId" :rules="{ required: true, message: '请选择topic', trigger: 'blur' }">
				<el-select v-model="dataForm.resourceId" @change="kafkaServerChange">
				  <el-option
						v-for="item in kafkaServerList"
						:key="item.id"
						:label="item.name"
						:value="item.id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item v-if="dataForm.type === 'mysql'" label="数据源" prop="resourceId" :rules="{ required: true, message: '请选择数据源', trigger: 'blur' }">
				<el-select v-model="dataForm.resourceId" @change="mysqlServerChange">
				  <el-option
						v-for="item in mysqlServerList"
						:key="item.id"
						:label="item.name"
						:value="item.id">
					</el-option>
				</el-select>
			</el-form-item>
			 <el-form-item  prop="channelId" v-if="dataForm.type === 'sms'" label="短信渠道" :rules="{ required: true, message: '请选择短信渠道', trigger: 'blur' }">
        <el-select v-model="dataForm.channelId" filterable  @change="getDate(dataForm.channelId,true)" placeholder="请选择渠道" style="width: 300px">
          <el-option v-for="(item, index) in issueChannelList" :key="index" :value="item" :label="item"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="resourceCode" v-if="dataForm.type === 'sms'" label="短信模板" :rules="{ required: true, message: '请选择短信模板', trigger: 'blur' }">
        <el-select v-model="dataForm.resourceCode" filterable  @change="getSmsTemplate" placeholder="请选择模板" style="width: 300px">
          <el-option v-for="(item, index) in issueTemplateList" :key="index" :value="item.tempCode" :label="item.smsDesc"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="smsTemplate" v-if="dataForm.type === 'sms'" label="模板详情">
        <el-input type="textarea" autosize v-model="dataForm.smsTemplate" :disabled="true" >
				</el-input>
					<p style="margin:0">
              需要选择
            <span style="color:red" v-text="paramsNum"></span> 个参数
          </p>
      </el-form-item>
			<el-form-item  prop="outParams"  label="出参" v-if="paramsVisible">
				  <Treeselect
						:options="outParamsList"
						:disable-branch-nodes="true"
						:show-count="true"
						:multiple="true"
						:load-options="loadOptions"
						:searchable="true"
						:clearable="true"
						:disabled="viewVisible"
            @open="openParamsSelect"
						@input="changeOption"
						@select="outParamsSelect"
						@deselect="outParamsDeselect"
						noChildrenText="暂无数据"
						v-model="dataForm.outParams"
						placeholder="请选择"
						class="base-pane-item"
					/>
			</el-form-item>
		</el-form>
		<div slot="footer" class="foot">
      <el-button type="primary" @click="submitData" v-if="!viewVisible">提交</el-button>
      <el-button @click="visible = false">取消</el-button>
    </div>
	</el-dialog>
</template>
<script>
import { dataTransferManageOutParams, dataTransferManageKafka, dataTransferManageMysql, getAllSmsChannels, getSmsCodeInfo } from '@/api/dataAnalysis/dataTransferManage'
import { getChannelist, addDataInfo, editDataInfo, lookDataList } from '@/api/dataAnalysis/sourceBinding'
import { deepClone, findVueSelectItemIndex } from '../dataAnalysisUtils/utils'
import Treeselect, { LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  data () {
    return {
      visible: false,
      paramsVisible: true,
      viewVisible: false,
      tag: '',
      createTime: '', // 创建时间
      createUser: '', // 创建人
      dataForm: {
        id: '',
        type: 'kafka',
        resourceId: '',
        resourceName: '',
        resourceCode: '',
        channelCode: '', // 用户渠道
        outParams: [] // 绑定的出参
      },
      paramsNum: 0,
      outParamsList: [],
      outParams: [], // 分群出参提交格式
      issueChannelList: [],
      issueTemplateList: [],
      channelList: [],
      kafkaServerList: [],
      mysqlServerList: [],
      baseRule: { // 基本信息校验规则
        type: [
          { required: true, message: '请选择下发类型', trigger: 'blur' }
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
      console.log('row: ', row)
      this.paramsVisible = true
      this.getChannelsList()
      this.getKafkaServerList()
      this.getMysqlServerList()
      this.getAllSmsChannels()
      this.outParamsList = []
      this.tag = row ? tag : ''
      if (this.tag === 'view') {
        this.viewVisible = true
      } else {
        this.viewVisible = false
      }
      this.dataForm = {
        id: '',
        channelCode: '',
        type: 'kafka',
        resourceId: '',
        resourceName: '',
        resourceCode: '',
        outParams: []
      }
      this.createTime = ''
      this.createUser = ''
      this.outParams = []
      this.visible = true
      if (row) {
        this.createTime = row.createTime
        this.createUser = row.createUser
        this.getLookData(row)
      }
    },
    // 回显
    getLookData (row) {
      lookDataList(row.id).then(res => {
        if (res.data.status === '1') {
          this.dataForm.id = row.id
          this.dataForm.channelCode = res.data.data.bindingConfig.channelCode
          this.dataForm.resourceName = res.data.data.bindingConfig.resourceName
          this.dataForm.resourceCode = res.data.data.bindingConfig.resourceCode
          this.dataForm.type = res.data.data.bindingConfig.type
          this.dataForm.resourceId = parseInt(res.data.data.bindingConfig.resourceId)
          if (row.type === 'sms') {
            this.dataForm.channelId = res.data.data.resourceData.channelId
            this.dataForm.smsTemplate = res.data.data.resourceData.smsTemplate
            this.paramsNum = res.data.data.resourceData.smsTemplate.split('%s').length - 1
            this.getDate(res.data.data.resourceData.channelId, false)
          }
          this.getOutParamsList(row, res.data.data.bindingIndex)
        }
      })
    },
    getChannelsList () {
      getChannelist().then(res => {
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
      // kafka 数据源
    getKafkaServerList () {
      let params = {
        type: 'kafka'
      }
      dataTransferManageKafka(params).then(({data}) => {
        if (data && data.status === '1') {
          this.kafkaServerList = data.data
        }
      })
    },
    // kafka选择时
    kafkaServerChange (value) {
      let arr = this.kafkaServerList.filter(item => item.id === value)
      this.dataForm.resourceName = arr[0].name
      this.dataForm.resourceCode = arr[0].code
    },
    // mysql选择时
    mysqlServerChange (value) {
      let arr = this.mysqlServerList.filter(item => item.id === value)
      this.dataForm.resourceName = arr[0].name
      this.dataForm.resourceCode = arr[0].code
    },
    // mysql 数据源
    getMysqlServerList () {
      let params = {
        type: 'mysql'
      }
      dataTransferManageMysql(params).then(({data}) => {
        if (data && data.status === '1') {
          this.mysqlServerList = data.data
        }
      })
    },
    // 短信渠道
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
            this.dataForm.resourceCode = ''
            this.dataForm.smsTemplate = ''
          }
        }
      })
    },
    // 获取分群出参 指标列表
    getOutParamsList (row, value) {
      dataTransferManageOutParams({ channelCode: this.dataForm.channelCode, flag: this.dataForm.id ? '-1' : '1' }).then(({data}) => {
        if (data && data.status === '1') {
          if (row) {
            this.getOutParamsEditList(value, this.filterAllCata(data.data))
          } else {
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
      if (this.dataForm.channelCode.length === 0) {
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
    // // 修改，回显时查询分群出参选中
    getOutParamsEditList (data, outList) {
      let out = []
      this.outParams = []
      data.forEach(item => {
        out.push(item.englishName + '-' + item.id)
        this.outParams.push(item.id)
      })
      this.dataForm.outParams = Array.from(new Set(out))
      this.outParamsList = this.updateOutParamsList(outList)
    },
    // 获取出参，默认展开列表
    updateOutParamsList (indexList) {
      let indexListArr = deepClone(indexList)
      this.dataForm.outParams.forEach(item => {
        let indexPath = findVueSelectItemIndex(indexListArr, item) + ''
        let indexPathArr = indexPath.split(',')
        let a = indexListArr
        indexPathArr.forEach((pitem, index) => {
          if (index < indexPathArr.length - 1) {
            a[pitem].isDefaultExpanded = true
            a = a[pitem].children
          }
        })
      })
      return indexListArr
    },
    // 类型改变
    changeType (value) {
      this.paramsVisible = true
      if (value === 'mysql' || value === 'kafka') {
        this.dataForm = {
          id: this.dataForm.id,
          channelCode: this.dataForm.channelCode,
          type: this.dataForm.type,
          resourceId: '',
          resourceName: '',
          resourceCode: '',
          outParams: []
        }
      }
      if (value === 'sms') {
        this.dataForm = {
          id: this.dataForm.id,
          channelCode: this.dataForm.channelCode,
          type: this.dataForm.type,
          outParams: [],
          channelId: '', // 渠道channelId
          resourceId: '', // 渠道id
          resourceCode: '', // 模板code
          resourceName: '', // 模板name
          smsTemplate: '' // 模板详情
        }
      }
      this.outParams = []
    },
    getSmsTemplate () {
      this.dataForm.smsTemplate = this.issueTemplateList.filter(item => item.tempCode === this.dataForm.resourceCode)[0].smsTemplate
      this.paramsNum = this.dataForm.smsTemplate.split('%s').length - 1
      if (!this.paramsNum) {
        this.paramsVisible = false
        this.outParams = []
      } else {
        this.paramsVisible = true
      }
      this.dataForm.resourceName = this.issueTemplateList.filter(item => item.tempCode === this.dataForm.resourceCode)[0].smsDesc
      this.dataForm.resourceId = this.issueTemplateList.filter(item => item.tempCode === this.dataForm.resourceCode)[0].id
    },
    changeOption () {
      // 出参选择
      this.$refs.dataForm.clearValidate('outParams')
    },
    // 选中出参
    outParamsSelect (node) {
      this.outParams.push(node.fieldId)
      if (this.outParams.length) {
        this.$refs.dataForm.clearValidate('outParams')
      }
    },
    // 删除出参
    outParamsDeselect (node) {
      this.outParams = this.outParams.filter(item => item !== node.fieldId)
    },
    // 打开出参菜单
    openParamsSelect () {
      console.log('122211')
      if (!this.dataForm.channelCode) return this.$message.error('请先选择所属渠道')
    },
    submitData () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.dataForm.type === 'sms' && this.outParams.length !== this.paramsNum) {
            return this.$message.error(`请选择${this.paramsNum}个参数`)
          }
          let params = {
            id: this.dataForm.id,
            type: this.dataForm.type,
            resourceName: this.dataForm.resourceName,
            resourceCode: this.dataForm.resourceCode,
            channelCode: this.dataForm.channelCode,
            resourceId: this.dataForm.resourceId.toString(),
            bindingIndex: this.outParams.join(',')
          }
          if (!this.dataForm.id) {
              addDataInfo(params).then(({data}) => {
                if (data && data.status === '1') {
                  this.$message({
                    message: '操作成功',
                    type: 'success',
                    duration: 1500,
                    onClose: () => {
                      this.visible = false
                      this.$emit('refreshDataList')
                      this.$refs['dataForm'].resetFields()
                    }
                  })
                } else {
                  this.$message.error(data.message || '数据异常')
                }
              })
            } else {
              params.createTime = this.createTime
              params.createUser = this.createUser
              editDataInfo(params).then(({data}) => {
                if (data && data.status === '1') {
                  this.$message({
                    message: '操作成功',
                    type: 'success',
                    duration: 1500,
                    onClose: () => {
                      this.visible = false
                      this.$emit('refreshDataList')
                      this.$refs['dataForm'].resetFields()
                    }
                  })
                } else {
                  this.$message.error(data.message)
                }
              })
            }
          }
        })
    }
  }
}
</script>