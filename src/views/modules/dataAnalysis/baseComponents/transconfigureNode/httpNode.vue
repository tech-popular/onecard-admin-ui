<template>
	<el-dialog title="配置" :append-to-body="true" :close-on-click-modal="false" :visible.sync="visible">
		<el-form  v-loading="dataLoading" label-width="160px" :model="dataForm"  :rules="baseRule" ref="dataForm" :disabled="!canUpdate">
			<el-form-item label="名称" prop="resourceName" :rules="{ required: true, message: '请输入名称', trigger: 'blur' }">
				<el-input v-model="dataForm.resourceName" placeholder="请输入名称" style="width: 400px"></el-input>
			</el-form-item>
       <el-form-item label="URL" prop="url" :rules="baseRule.url">
          <el-input v-model="dataForm.url" placeholder="请输入URL"/>
        </el-form-item>
        <!-- <el-form-item label="请求参数的fieldId数组" prop="requestFields" :rules="baseRule.requestFields">
          <el-input v-model="dataForm.requestFields" placeholder="param1,param2(多个参数逗号隔开)"/>
        </el-form-item> -->
        <el-form-item label="请求head入参" prop="requestHeadFields">
        <el-input v-model="dataForm.requestHeadFields" placeholder="请输入请求head入参"/>
        </el-form-item>
        <el-form-item label="入参生成方式">
          <el-radio-group v-model="dataForm.requestParamTemplateStatus">
            <el-radio :label="0">普通生成</el-radio>
            <el-radio :label="1">模板生成</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="templateContent" label="模板内容" v-if="dataForm.requestParamTemplateStatus == '1'">
          <el-input type="textarea"  class="base-pane-item" v-model="dataForm.templateContent"  :autosize="{ minRows: 2}" />
        </el-form-item>
        <el-form-item label="响应参数的fieldId数组" prop="responseFields" :rules="baseRule.responseFields">
          <el-input v-model="dataForm.responseFields" placeholder="result1,result2(多个结果逗号隔开)"/>
        </el-form-item>
        <el-form-item label="响应参数的数据类型" prop="responseType" :rules="baseRule.responseType"> 
          <el-select v-model="dataForm.responseType" placeholder="请选择响应参数的数据类型">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
         </el-form-item>
        <el-form-item label="判断表达式" prop="expression" :rules="baseRule.expression">
          <el-input v-model="dataForm.expression" placeholder="请输入缓存生成的key需要的字段"/>
        </el-form-item>
        <el-form-item label="switch判断项集合" prop="switchTemplate" :rules="baseRule.switchTemplate">
          <el-input v-model="dataForm.switchTemplate" placeholder="请输入缓存生成的key需要的字段"/>
        </el-form-item>
      <el-form-item  prop="extraParams"  label="额外出参">
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
import { dataTransferManageOutParams } from '@/api/dataAnalysis/dataTransferManage'
import { addDataInfo, editDataInfo, lookDataList } from '@/api/dataAnalysis/sourceBinding'
import { deepClone, findVueSelectItemIndex } from '../../dataAnalysisUtils/utils'
import Treeselect, { LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  data () {
    /**
      * 空格校验
      * @param rule
      * @param value
      * @param callback
      * @constructor
    */
    let NullKongGeRule = (rule, value, callback) => {
      const nullValue = /^[^\s]+$/
      if (value !== '' && value !== null && value !== undefined) {
        if (!nullValue.test(value)) {
          callback(new Error('不能输入含空格'))
        }
      }
      callback()
    }
    return {
      visible: false,
      canUpdate: true,
      dataLoading: false,
      dataForm: {
        id: '',
        type: 'http',
        channelCode: '',
        resourceName: '',
        extraParams: [],
        url: '',  // url
        // requestFields: '',
        requestHeadFields: '',
        responseFields: '',
        templateContent: '',
        requestParamTemplateStatus: 1,
        responseType: '', // 两个选项map和list 默认是map
        expression: '', // 判断表达式
        switchTemplate: ''  // switch判断项集合
      },
      paramsNum: 0,
      outParamsList: [],
      extraParams: [], // 额外出参
      options: [{
        value: 'map',
        label: 'map'
      }, {
        value: 'list',
        label: 'list'
      }, {
        value: 'object',
        label: 'object'
      }],
      baseRule: { // 基本信息校验规则
        url: [
          { required: true, message: '请输入URL地址', trigger: 'blur' },
          { required: true, validator: NullKongGeRule, trigger: 'change' }
        ],
        responseType: [
          { required: true, message: '请选择响应参数的数据类型', trigger: 'blur' },
          { required: false, validator: NullKongGeRule, trigger: 'change' }
        ],
        expression: [
          { required: true, message: '请输入判断表达式', trigger: 'blur' }
        ],
        switchTemplate: [
          { required: true, message: '请输入switch判断项集合', trigger: 'blur' }
        ],
        templateContent: [
          { required: true, message: '请输入模板内容', trigger: 'blur' }
        ],
        extraParams: [
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
    init (channelCode, id, canUpdate) {
      this.canUpdate = canUpdate
      this.outParamsList = []
      this.dataForm = {
        id: id,
        channelCode: channelCode,
        type: 'http',
        resourceName: '',
        extraParams: [],
        url: '',  // url
        // requestFields: '',
        requestHeadFields: '',
        responseFields: '',
        templateContent: '',
        requestParamTemplateStatus: 1,
        responseType: '', // 两个选项map和list 默认是map
        expression: '', // 判断表达式
        switchTemplate: ''  // switch判断项集合
      }
      this.extraParams = []
      this.paramsNum = 0
      this.dataLoading = true
      this.visible = true
      if (id) {
        this.getLookData(id)
      } else {
        this.getOutParamsList()
      }
    },
    // 回显
    getLookData (id) {
      lookDataList(id).then(res => {
        if (res.data.status === '1') {
          this.dataForm.id = res.data.data.bindingConfig.id
          this.dataForm.channelCode = res.data.data.bindingConfig.channelCode
          this.dataForm.type = res.data.data.bindingConfig.type
          this.dataForm.resourceName = res.data.data.bindingConfig.resourceName
          let bindingContent = JSON.parse(res.data.data.bindingConfig.content)
          this.dataForm.url = bindingContent.url
          // this.dataForm.requestFields = bindingContent.requestFields
          this.dataForm.requestHeadFields = bindingContent.requestHeadFields
          this.dataForm.templateContent = bindingContent.templateContent
          this.dataForm.responseFields = bindingContent.responseFields
          this.dataForm.requestParamTemplateStatus = bindingContent.requestParamTemplateStatus
          this.dataForm.responseType = bindingContent.responseType
          this.dataForm.expression = bindingContent.expression
          this.dataForm.switchTemplate = bindingContent.switchTemplate
          this.getOutParamsList(res.data.data.extraParams)
        }
      })
    },
    // 根据URL判断出参个数
    // urlParamsBlur () {
    //   let urlParams = this.dataForm.url.match(/{(.*?)}/g)
    //   if (urlParams && urlParams.length) {
    //     this.paramsNum = urlParams.length
    //   } else {
    //     this.extraParams = []
    //     this.dataForm.extraParams = []
    //     this.paramsNum = 0
    //   }
    // },
    // 获取分群出参 指标列表
    getOutParamsList (extraParams) {
      dataTransferManageOutParams({ channelCode: this.dataForm.channelCode, flag: this.dataForm.id ? '-1' : '1' }).then(({data}) => {
        if (data && data.status === '1') {
          if (extraParams) {
            this.getOutParamsEditList(extraParams, this.filterAllCata(data.data))
          } else {
            this.outParamsList = this.filterAllCata(data.data)
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
    getOutParamsEditList (extraParams, outList) {
      if (extraParams) {
        let out = []
        let fixedData = extraParams.split(',')
        fixedData.forEach(item => {
          out.push(item.split('@')[0] + '-' + item.split('@')[1])
           this.extraParams.push(item.split('@')[1])
        })
        this.dataForm.extraParams = Array.from(new Set(out))
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

    submitData () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          let httpContent = {
            url: this.dataForm.url,
            // requestFields: this.dataForm.requestFields,
            requestHeadFields: this.dataForm.requestHeadFields,
            responseFields: this.dataForm.responseFields,
            templateContent: this.dataForm.requestParamTemplateStatus == '1' ? this.dataForm.templateContent : '',
            requestParamTemplateStatus: this.dataForm.requestParamTemplateStatus,
            responseType: this.dataForm.responseType,
            expression: this.dataForm.expression,
            switchTemplate: this.dataForm.switchTemplate
          }
          let params = {
            id: this.dataForm.id,
            type: this.dataForm.type,
            resourceName: this.dataForm.resourceName,
            channelCode: this.dataForm.channelCode,
            extraParams: this.extraParams.join(','),
            content: JSON.stringify(httpContent)
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
                      this.$emit('updateList', true)
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
                      this.$emit('updateList', true)
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