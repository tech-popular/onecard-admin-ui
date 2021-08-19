<template>
	<el-dialog title="配置" :append-to-body="true" :close-on-click-modal="false" :visible.sync="visible">
		<el-form  v-loading="dataLoading" label-width="120px" :model="dataForm"  :rules="baseRule" ref="dataForm" :disabled="!canUpdate">
			<el-form-item label="名称" prop="resourceName" :rules="{ required: true, message: '请输入名称', trigger: 'blur' }">
				<el-input v-model="dataForm.resourceName" placeholder="请输入名称" style="width: 400px"></el-input>
			</el-form-item>
      <el-form-item label="配置方式" prop="editType">
        <el-radio v-model="dataForm.editType" @change="changeEditType"  label="0">标准模板</el-radio>
        <el-radio v-model="dataForm.editType" @change="changeEditType"  label="1">自定义模板</el-radio>
      </el-form-item>
			 <el-form-item  prop="channelId" v-if="dataForm.editType === '0'"  label="短信渠道" :rules="{ required: true, message: '请选择短信渠道', trigger: 'blur' }">
        <el-select v-model="dataForm.channelId" filterable  @change="getDate(dataForm.channelId,true)" placeholder="请选择渠道" style="width: 400px">
          <el-option v-for="(item, index) in issueChannelList" :key="index" :value="item" :label="item"></el-option>
        </el-select>
      </el-form-item>
      <div style="display:flex">
        <el-form-item prop="resourceCode" v-if="dataForm.editType === '0'" label="短信模板" :rules="{ required: true, message: '请选择短信模板', trigger: 'blur' }">
          <el-select v-model="dataForm.resourceCode" filterable  @change="getSmsTemplate" placeholder="请选择模板" style="width: 400px;margin-right:15px;">
            <el-option v-for="(item, index) in issueTemplateList" :key="index" :value="item.tempCode" :label="item.smsDesc"></el-option>
          </el-select>
        </el-form-item>
        <el-tooltip placement="top" v-if="dataForm.editType === '0' && dataForm.resourceCode">
          <div slot="content">{{dataForm.resourceCode}}</div>
          <i class="el-icon-info cursor-pointer" style="color:#409eff"></i>
        </el-tooltip>
      </div>
      <el-form-item prop="smsTemplate" v-if="dataForm.editType === '0'" label="模板详情">
        <el-input type="textarea" autosize v-model="dataForm.smsTemplate" :disabled="true" >
				</el-input>
					<p style="margin:0">
              需要选择
            <span style="color:red" v-text="paramsNum"></span> 个参数
          </p>
      </el-form-item>
      <el-form-item label="短信类型" v-if="dataForm.editType === '1'"  prop="cusSmsType">
        <el-select v-model="dataForm.cusSmsType" filterable   placeholder="请选择" style="width: 400px;margin-right:15px;">
            <el-option v-for="(item, index) in cusSmsTypeList" :key="index" :value="item.code" :label="item.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="短信签名" v-if="dataForm.editType === '1'"  prop="productNo">
        <el-select v-model="dataForm.productNo" filterable   placeholder="请选择" style="width: 400px;margin-right:15px;">
            <el-option v-for="(item, index) in productNoList" :key="index" :value="item.code" :label="item.name"></el-option>
        </el-select>
      </el-form-item>
        <el-form-item label="短信内容" prop="smsContent" v-if="dataForm.editType === '1'">
          <el-input type="textarea"  class="base-pane-item" v-model="dataForm.smsContent" maxlength="65" :autosize="{ minRows: 3, maxRows: 5}"  show-word-limit />
        </el-form-item>
      <el-form-item  prop="fixedParams"  label="固定出参" v-if="fixedParamsvisible">
				  <Treeselect
						:options="outParamsList"
						:disable-branch-nodes="true"
						:show-count="true"
						:multiple="true"
						:load-options="loadOptions"
						:searchable="true"
						:clearable="true"
						disabled
            placeholder=""
						v-model="dataForm.fixedParams"
						class="base-pane-item"
					/>
			</el-form-item>
      <el-form-item  prop="extraParams"  label="额外出参" v-if="extraParamsVisible">
				  <Treeselect
						:options="outParamsList"
						:disable-branch-nodes="true"
						:show-count="true"
						:multiple="true"
						:load-options="loadOptions"
						:searchable="true"
						:clearable="true"
						:disabled="!canUpdate"
						@input="changeOption"
						@select="outParamsSelect"
						@deselect="outParamsDeselect"
						noChildrenText="暂无数据"
						v-model="dataForm.extraParams"
						placeholder="请选择"
						class="base-pane-item"
					/>
			</el-form-item>
		</el-form>
		<div slot="footer" class="foot">
      <el-button type="primary" @click="submitData" v-if="canUpdate">提交</el-button>
      <el-button @click="visible = false">取消</el-button>
    </div>
	</el-dialog>
</template>
<script>
import { dataTransferManageOutParams, getAllSmsChannels, getSmsCodeInfo } from '@/api/dataAnalysis/dataTransferManage'
import { addDataInfo, editDataInfo, lookDataList, getFixedParams, getSmsStyleInfo, getSmsSignInfo } from '@/api/dataAnalysis/sourceBinding'
import { deepClone, findVueSelectItemIndex } from '../../dataAnalysisUtils/utils'
import Treeselect, { LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  data () {
    return {
      visible: false,
      extraParamsVisible: true,
      fixedParamsvisible: false,
      canUpdate: true,
      dataLoading: false,
      target: '',
      dataForm: {
        id: '',
        type: 'sms',
        resourceId: '',
        resourceName: '',
        resourceCode: '',
        channelId: '',
        smsTemplate: '',
        editType: '0', // 编辑类型
        productNo: '', // 签名
        cusSmsType: '', // 短信类型
        smsContent: '', // 短信内容
        fixedParams: [], // 固定出参
        extraParams: [], // 额外出参
        channelCode: '' // 用户渠道
        // outParams: [] // 绑定的出参
      },
      paramsNum: 0,
      outParamsList: [],
      fixedParams: [], // 固定出参
      extraParams: [], // 额外出参
      // outParams: [], // 分群出参提交格式
      issueChannelList: [],
      issueTemplateList: [],
      cusSmsTypeList: [], // 短信类型list
      productNoList: [], // 短信签名list
      baseRule: { // 基本信息校验规则
        cusSmsType: [
          { required: true, message: '请选择短信类型', trigger: 'blur' }
        ],
        extraParams: [
          { required: true, message: '请选择额外出参', trigger: 'input' }
        ],
        productNo: [
          { required: true, message: '请选择短信签名', trigger: 'blur' }
        ],
        smsContent: [
          { required: true, message: '请输入短信内容', trigger: 'blur' }
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
    init (channelCode, id, canUpdate) {
      this.extraParamsVisible = true
      this.fixedParamsvisible = false
      this.canUpdate = canUpdate
      this.getAllSmsChannels()
      this.getSmsSignInfo()
      this.getSmsStyleInfo()
      this.outParamsList = []
      this.dataForm = {
        id: id,
        channelCode: channelCode,
        type: 'sms',
        resourceId: '',
        resourceName: '',
        resourceCode: '',
        channelId: '',
        smsTemplate: '',
        editType: '0', // 编辑类型
        productNo: '', // 签名
        cusSmsType: '', // 短信类型
        smsContent: '', // 短信内容
        extraParams: [],
        fixedParams: []
      }
      this.target = ''
      this.extraParams = []
      this.fixedParams = []
      this.dataLoading = true
      this.visible = true
      if (id) {
        this.getLookData(id)
      } else {
        this.getOutParamsList()
      }
    },
    // 短信签名
    getSmsSignInfo () {
      getSmsSignInfo().then(({data}) => {
        if (data && data.status === '1') {
          this.productNoList = data.data
        } else {
          this.productNoList = []
        }
      })
    },
    // 短信类型
    getSmsStyleInfo () {
      getSmsStyleInfo().then(({data}) => {
        if (data && data.status === '1') {
          this.cusSmsTypeList = data.data
        } else {
          this.cusSmsTypeList = []
        }
      })
    },
    // 回显
    getLookData (id) {
      lookDataList(id).then(res => {
        if (res.data.status === '1') {
          // console.log('res.data: ', res.data)
          this.dataForm.id = res.data.data.bindingConfig.id
          this.dataForm.channelCode = res.data.data.bindingConfig.channelCode
          this.dataForm.type = res.data.data.bindingConfig.type
          if (res.data.data.bindingConfig.content) {
            this.dataForm.editType = '1'
            this.extraParamsVisible = false
            this.dataForm.resourceName = res.data.data.bindingConfig.resourceName.split('自定义短信_')[1]
            let bindingContent = JSON.parse(res.data.data.bindingConfig.content)
            this.dataForm.cusSmsType = bindingContent.cusSmsType
            this.dataForm.productNo = bindingContent.productNo
            this.dataForm.smsContent = bindingContent.content
          } else {
            this.dataForm.editType = '0'
            this.dataForm.resourceName = res.data.data.bindingConfig.resourceName.split('标准短信_')[1]
            this.dataForm.resourceCode = res.data.data.bindingConfig.resourceCode
            this.dataForm.resourceId = parseInt(res.data.data.bindingConfig.resourceId)
            this.dataForm.channelId = res.data.data.resourceData.channelId
            this.dataForm.smsTemplate = res.data.data.resourceData.smsTemplate
            this.paramsNum = res.data.data.resourceData.smsTemplate.split('%s').length - 1
            this.getDate(res.data.data.resourceData.channelId, false)
          }
          this.getOutParamsList(res.data.data.extraParams, res.data.data.fixedParams)
        }
        // this.$nextTick(() => {
        //   if (row.type === 'sms') {
        //     this.target = this.kafkaServerList.filter(item => item.id == this.dataForm.resourceId)[0].target
        //   }
        // })
      })
    },
    // 短信渠道
    getAllSmsChannels() {
      getAllSmsChannels().then(({data}) => {
        if (data.status === '1') {
          this.issueChannelList = data.data
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
            this.target = ''
          }
        }
      })
    },
    // 获取分群出参 指标列表
    getOutParamsList (extraParams, fixedParams) {
      dataTransferManageOutParams({ channelCode: this.dataForm.channelCode, flag: this.dataForm.id ? '-1' : '1' }).then(({data}) => {
        if (data && data.status === '1') {
          if (extraParams || fixedParams) {
            this.getOutParamsEditList(extraParams, fixedParams, this.filterAllCata(data.data))
          } else {
            this.outParamsList = this.filterAllCata(data.data)
            this.getFixedParams()
          }
          this.dataLoading = false
        } else {
          this.outParamsList = []
          this.dataLoading = false
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
    // // 修改，回显时查询分群出参选中
    getOutParamsEditList (extraParams, fixedParams, outList) {
      if (extraParams) {
        let out = []
        let fixedData = extraParams.split(',')
        fixedData.forEach(item => {
          out.push(item.split('@')[0] + '-' + item.split('@')[1])
           this.extraParams.push(item.split('@')[1])
        })
        this.dataForm.extraParams = Array.from(new Set(out))
      }
      if (fixedParams) {
        let out = []
        let fixedData = fixedParams.split(',')
        fixedData.forEach(item => {
          out.push(item.split('@')[0] + '-' + item.split('@')[1])
           this.fixedParams.push(item.split('@')[1])
        })
        this.dataForm.fixedParams = Array.from(new Set(out))
        this.fixedParamsvisible = true
      }
      this.outParamsList = this.updateOutParamsList(outList)
    },
    // 获取出参，默认展开列表
    updateOutParamsList (indexList) {
      let indexListArr = deepClone(indexList)
      this.dataForm.extraParams.forEach(item => {
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
    // 固定参数
    getFixedParams() {
      let out = []
      this.fixedParams = []
      let params = {
        channelCode: this.dataForm.channelCode,
        type: this.dataForm.type
      }
      getFixedParams(params).then(({data}) => {
        if (data && data.status === '1') {
          if (data.data) {
            let fixedData = data.data.split(',')
            fixedData.forEach(item => {
              out.push(item.split('@')[0] + '-' + item.split('@')[1])
              this.fixedParams.push(item.split('@')[1])
            })
            this.dataForm.fixedParams = Array.from(new Set(out))
            this.fixedParamsvisible = true
          } else {
            this.fixedParamsvisible = false
            this.dataForm.fixedParams = []
            this.fixedParams = []
            return this.$message.error(`请联系管理员配置固定流程参数`)
          }
        }
      })
    },
    getSmsTemplate () {
      this.dataForm.smsTemplate = this.issueTemplateList.filter(item => item.tempCode === this.dataForm.resourceCode)[0].smsTemplate
      this.paramsNum = this.dataForm.smsTemplate.split('%s').length - 1
      if (!this.paramsNum) {
        this.extraParamsVisible = false
        this.extraParams = []
      } else {
        this.extraParamsVisible = true
      }
      // this.dataForm.resourceName = this.issueTemplateList.filter(item => item.tempCode === this.dataForm.resourceCode)[0].smsDesc
      this.dataForm.resourceId = this.issueTemplateList.filter(item => item.tempCode === this.dataForm.resourceCode)[0].id
    },
     // 电销或AI模板
    changeTelTemplate () {
      this.dataForm.resourceCode = this.telOrAiList.filter(item => item.id === this.dataForm.resourceId)[0].code
    },
    changeOption () {
      // 出参选择
      this.$refs.dataForm.clearValidate('extraParams')
    },
    // 选中出参
    outParamsSelect (node) {
      this.extraParams.push(node.fieldId)
      if (this.extraParams.length) {
        this.$refs.dataForm.clearValidate('extraParams')
      }
    },
    // 删除出参
    outParamsDeselect (node) {
      this.extraParams = this.extraParams.filter(item => Number(item) !== node.fieldId)
    },
    // 编辑类型改变
    changeEditType () {
      if (this.dataForm.editType === '0') {
        this.dataForm.productNo = ''
        this.dataForm.cusSmsType = ''
        this.dataForm.smsContent = ''
        this.extraParamsVisible = true
      } else {
        this.extraParamsVisible = false
        this.dataForm.resourceId = ''
        this.dataForm.resourceCode = ''
        this.dataForm.smsTemplate = ''
        this.dataForm.extraParams = []
        this.extraParams = []
        this.paramsNum = 0
      }
    },
    submitData () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.fixedParams.length === 0) {
            return this.$message.error(`请联系管理员配置固定流程参数`)
          }
          if (this.dataForm.type === 'sms' && this.extraParams.length !== this.paramsNum) {
            return this.$message.error(`请选择${this.paramsNum}个参数`)
          }
          let congiger = {
            'cusSmsType': this.dataForm.cusSmsType,
            'productNo': this.dataForm.productNo,
            'content': this.dataForm.smsContent
          }
          let params = {
            id: this.dataForm.id,
            type: this.dataForm.type,
            resourceName: this.dataForm.editType === '0' ? '标准短信_' + this.dataForm.resourceName : '自定义短信_' + this.dataForm.resourceName,
            resourceCode: this.dataForm.resourceCode,
            channelCode: this.dataForm.channelCode,
            resourceId: this.dataForm.editType === '0' ? this.dataForm.resourceId.toString() : null,
            fixedParams: this.fixedParams.join(','),
            extraParams: this.extraParams.join(','),
            content: this.dataForm.editType === '0' ? '' : JSON.stringify(congiger)
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
                      this.$emit('updateList', true, 'sms')
                      this.$refs['dataForm'].resetFields()
                    }
                  })
                } else {
                  this.$message.error(data.message || '数据异常')
                }
              })
            } else {
              editDataInfo(params).then(({data}) => {
                if (data && data.status === '1') {
                  this.$message({
                    message: '操作成功',
                    type: 'success',
                    duration: 1500,
                    onClose: () => {
                      this.visible = false
                      this.$emit('updateList', true, 'sms')
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