<template>
	<el-dialog 
	  title="过滤节点"
    :modal-append-to-body='false'
    :append-to-body="true"
    :visible.sync="visible"
    width="600px"
    :close-on-click-modal="false">
		<el-form :model="dataForm" v-loading="dataLoading"  ref="dataForm"  label-width="80px" :rules="dataRules">
      <el-row :gutter="20">
        <el-col :span="20" style="display:flex;">
          <el-form-item prop="selectSourceData" label="http任务">
            <el-select
              v-model="dataForm.selectSourceData"
              clearable
              filterable
              @change="sourceSelectChange"
              style="margin-right:10px;width: 300px"
              placeholder="请选择">
              <el-option
                v-for="item in seletDataList"
                :key="item.id"
                :label="item.resourceName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
            <div>
            <el-tooltip placement="top" v-if="dataForm.selectSourceData && dataForm.outParamsData">
              <div slot="content">{{dataForm.outParamsData}}</div>
              <i class="el-icon-info cursor-pointer" style="color:#409eff"></i>
            </el-tooltip>
            <div style="margin-top:2px;cursor:pointer;font-size:12px;color:#8c8c94;" @click="editConfigure">配置</div>
          </div>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer">
      <el-button type="primary" @click="saveHandle" size="small">确定</el-button>
      <el-button type="default" @click="cancelHandle" size="small">取消</el-button>
    </div>
		 <httpNode v-if="httpNodeVisible" ref="httpNode" @updateList="changeType"></httpNode>
	</el-dialog>
</template>
<script>
import { dataTransferManageOutParams, selectResourceBindingList } from '@/api/dataAnalysis/dataTransferManage'
import { lookDataList, selectSmartTransferTopic } from '@/api/dataAnalysis/sourceBinding'
// import { deepClone, findVueSelectItemIndex } from '../dataAnalysisUtils/utils'
import Treeselect, { LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import httpNode from '../baseComponents/transconfigureNode/httpNode'
export default {
  data () {
    return {
      id: '',
      key: '',
      visible: false,
      channelCode: '',
      dataLoading: false,
      canUpdate: true,
      dataForm: {
        type: '',
        topic: '',
        selectSourceData: '',
        outParamsData: ''
      },
      outParamsList: [],
      outParams: [], // 分群出参提交格式
      seletDataList: [],
      httpNodeVisible: false,
      dataRules: {
        selectSourceData: [
          { required: true, message: '请选择绑定资源', trigger: 'change' }
        ]
      }
    }
  },
 components: { Treeselect, httpNode },
  methods: {
     // 树加载
    async loadOptions ({ action, parentNode, callback }) {
      if (action === LOAD_CHILDREN_OPTIONS) {
        callback()
      }
    },
    init (data) {
      this.visible = true
      this.dataLoading = true
      this.channelCode = this.$store.state.canvasFlow.channelCode
      this.key = data.key
      this.outParams = []
      this.changeType(true)
      if (data.data) {
        this.dataForm.type = data.data.configItems.type
        this.dataForm.selectSourceData = data.data.configItems.id
        lookDataList(this.dataForm.selectSourceData).then(res => {
          if (res.data.status === '1') {
            let paramsData = res.data.data.bindingConfig.extraParams
            if (res.data.data.bindingConfig.fixedParams) {
              paramsData = res.data.data.bindingConfig.extraParams + ',' + res.data.data.bindingConfig.fixedParams
            }
            if (paramsData) {
              this.getOutParamsList(this.dataForm.selectSourceData, paramsData.split(','))
            } else {
              this.getOutParamsList()
            }
          }
        })
      } else {
        this.dataForm.type = ''
        this.dataForm.topic = ''
        this.dataForm.outParamsData = ''
        this.dataForm.selectSourceData = ''
        this.getOutParamsList()
      }
    },
    // 改变下发方式
    changeType (isChange) {
      let params = {
        channelCode: this.channelCode,
        type: 'http'
      }
      if (!isChange) {
        this.dataForm.selectSourceData = ''
      }
      selectResourceBindingList(params).then(({data}) => {
        if (data && data.status === '1') {
          this.seletDataList = data.data
        } else {
          this.seletDataList = []
        }
      })
      selectSmartTransferTopic(params).then(({data}) => {
        if (data && data.status === '1') {
          this.dataForm.topic = data.data
        } else {
          this.dataForm.topic = ''
        }
      })
    },
    editConfigure () {
      this.httpNodeVisible = true
      this.$nextTick(() => {
        this.$refs.httpNode.init(this.channelCode, this.dataForm.selectSourceData, this.canUpdate)
      })
    },
    sourceSelectChange () {
      if (this.dataForm.selectSourceData) {
        let arr = this.seletDataList.filter(item => item.id === this.dataForm.selectSourceData)
        let paramsData = arr[0].extraParams
        if (arr[0].fixedParams) {
          paramsData = arr[0].extraParams + ',' + arr[0].fixedParams
        }
        if (paramsData) {
          let arr1 = this.getParamsEditList(paramsData.split(','), this.outParamsList, [])
          this.dataForm.outParamsData = arr1.join(',')
        } else {
          this.dataForm.outParamsData = ''
        }
      }
    },
      // 获取分群出参 指标列表
    getOutParamsList (id, value) {
      dataTransferManageOutParams({ channelCode: this.channelCode, flag: this.id ? '-1' : '1' }).then(({data}) => {
        if (data && data.status === '1') {
          this.outParamsList = this.filterAllCata(data.data)
          if (id) {
            if (value.length) {
              let arr1 = this.getParamsEditList(value, this.outParamsList, [])
              this.dataForm.outParamsData = arr1.join(',')
            } else {
              this.dataForm.outParamsData = ''
            }
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
     getParamsEditList (data, outList, arr, isSms) {
      this.outParams = []
      outList && outList.forEach(item => {
        if (!item.children) {
          if (data.filter(x => x == item.fieldId).length) {
            if (isSms) {
              arr.push(item)
            } else {
              arr.push(item.label)
            }
          }
        } else {
          this.getParamsEditList(data, item.children, arr, isSms)
        }
      })
      return arr
    },
    formatPostData (postData) {
      this.dataLoading = true
      let arr = this.seletDataList.filter(item => item.id === postData.selectSourceData)
      let configItems = {}
      configItems.id = postData.selectSourceData
      configItems.type = postData.type
      configItems.resourceName = arr[0].resourceName
      configItems.topic = postData.topic
      let bindingContent = JSON.parse(arr[0].content)
      configItems.url = bindingContent.url
      configItems.requestFields = bindingContent.requestFields
      configItems.requestHeadFields = bindingContent.requestHeadFields
      configItems.responseFields = bindingContent.responseFields
      configItems.requestParamTemplateStatus = bindingContent.requestParamTemplateStatus
      configItems.responseType = bindingContent.responseType
      configItems.expression = bindingContent.expression
      configItems.switchTemplate = bindingContent.switchTemplate
      configItems.templateContent = bindingContent.templateContent
      return configItems
    },
    saveHandle () {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          let params = this.formatPostData(this.dataForm)
          let config = {
            configItems: params
          }
          this.$emit('close', { tag: 'save', data: { config: config, key: this.key } })
          this.dataLoading = false
          this.$parent.httpQueryNodeVisible = false
          this.$refs['dataForm'].resetFields()
        }
      })
    },
    cancelHandle () {
      this.visible = false
      this.$parent.httpQueryNodeVisible = false
    }
  }
}
</script>
