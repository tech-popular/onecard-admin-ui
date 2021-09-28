<template>
  <el-dialog title="模板配置"
    :modal-append-to-body='false'
    :append-to-body="true"
    :visible.sync="visible"
    width="800px"
    :close-on-click-modal="false">
    <el-form :model="dataForm" v-loading="dataLoading"  ref="dataForm" label-position="left" label-width="80px" :rules="dataRules">
      <el-form-item prop="type" label="方式">
        <el-select v-model="dataForm.type"  @change="changeType" placeholder="请选择方式" style="width: 300px">
          <el-option v-for="(item, index) in issueTypeList" :key="index" :value="item.value" :label="item.lable"></el-option>
        </el-select>
      </el-form-item>
     <el-row :gutter="20">
        <el-col :span="20" style="display:flex;">
          <el-form-item prop="selectSourceData" label="资源">
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
            <el-tooltip placement="top" v-if="dataForm.selectSourceData">
              <div slot="content">{{dataForm.outParamsData}}</div>
              <i class="el-icon-info cursor-pointer" style="color:#409eff"></i>
            </el-tooltip>
            <div v-if="dataForm.type" style="margin-top:2px;cursor:pointer;font-size:12px;color:#8c8c94;" @click="editConfigure">配置</div>
          </div>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer">
      <el-button type="primary" @click="saveHandle" size="small">确定</el-button>
      <el-button type="default" @click="cancelHandle" size="small">取消</el-button>
    </div>
    <smsNode v-if="smsNodeVisible" ref="smsNode" @updateList="changeType"></smsNode>
    <telNode v-if="telNodeVisible" ref="telNode" @updateList="changeType"></telNode>
    <aiNode v-if="aiNodeVisible" ref="aiNode" @updateList="changeType"></aiNode>
    <pushNode v-if="pushNodeVisible" ref="pushNode" @updateList="changeType"></pushNode>
    <cardNode v-if="cardNodeVisible" ref="cardNode" @updateList="changeType"></cardNode>
  </el-dialog>
</template>
<script>
import { dataTransferManageOutParams, selectResourceBindingList } from '@/api/dataAnalysis/dataTransferManage'
import { lookDataList, selectSmartTransferTopic } from '@/api/dataAnalysis/sourceBinding'
// import { deepClone, findVueSelectItemIndex } from '../dataAnalysisUtils/utils'
import Treeselect, { LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import smsNode from '../baseComponents/transconfigureNode/smsNode'
import telNode from '../baseComponents/transconfigureNode/telNode'
import aiNode from '../baseComponents/transconfigureNode/aiNode'
import pushNode from '../baseComponents/transconfigureNode/pushNode'
import cardNode from '../baseComponents/transconfigureNode/cardVoucherNode'
export default {
  data () {
    return {
      id: '',
      key: '',
      visible: false,
      channelCode: '',
      dataLoading: false,
      canUpdate: true,
      // viewVisible: false,
      // isEdit: false,
      // smsOutParams: [],
      dataForm: {
        type: '',
        topic: '',
        selectSourceData: '',
        outParamsData: ''
      },
      outParamsList: [],
      outParams: [], // 分群出参提交格式
      issueTypeList: [
        {value: 'sms', lable: '短信'},
        {value: 'tel', lable: '电销'},
        {value: 'ai', lable: 'AI'},
        {value: 'push', lable: 'Push'},
        {value: 'card', lable: '红包/卡券'}
      ],
      seletDataList: [],
      smsNodeVisible: false,
      telNodeVisible: false,
      aiNodeVisible: false,
      pushNodeVisible: false,
      cardNodeVisible: false,
      dataRules: {
        type: [
          { required: true, message: '请选择方式', trigger: 'change' }
        ],
        selectSourceData: [
          { required: true, message: '请选择绑定资源', trigger: 'change' }
        ]
      }
    }
  },
 components: { Treeselect, smsNode, telNode, aiNode, pushNode, cardNode },
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
      if (data.data) {
        this.dataForm.type = data.data.configItems.type
        this.dataForm.selectSourceData = data.data.configItems.id
        this.changeType(data.data.configItems.type, true)
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
    changeType (type, isChange) {
      let params = {
        channelCode: this.channelCode,
        type: this.dataForm.type
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
      switch (this.dataForm.type) {
        case 'sms':
          this.smsNodeVisible = true
          this.$nextTick(() => {
            this.$refs.smsNode.init(this.channelCode, this.dataForm.selectSourceData, this.canUpdate)
          })
          break
        case 'tel':
          this.telNodeVisible = true
          this.$nextTick(() => {
            this.$refs.telNode.init(this.channelCode, this.dataForm.selectSourceData, this.canUpdate)
          })
          break
        case 'ai':
          this.aiNodeVisible = true
          this.$nextTick(() => {
            this.$refs.aiNode.init(this.channelCode, this.dataForm.selectSourceData, this.canUpdate)
          })
          break
        case 'push':
          this.pushNodeVisible = true
          this.$nextTick(() => {
            this.$refs.pushNode.init(this.channelCode, this.dataForm.selectSourceData, this.canUpdate)
          })
          break
        case 'card':
          this.cardNodeVisible = true
          this.$nextTick(() => {
            this.$refs.cardNode.init(this.channelCode, this.dataForm.selectSourceData, this.canUpdate)
          })
          break
      }
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
      configItems.topic = postData.topic
      if (postData.type === 'push') {
        configItems.content = arr[0].content
      } else {
        if (postData.type === 'sms' && arr[0].content) {
          let contentData = JSON.parse(arr[0].content)
            configItems.cusSmsType = contentData.cusSmsType
            configItems.content = contentData.content
            configItems.resourceName = arr[0].resourceName
            configItems.productNo = contentData.productNo
        } else {
          lookDataList(postData.selectSourceData).then(({data}) => {
            if (data && data.status === '1') {
              configItems.tempCode = data.data.bindingConfig.resourceCode
                if (data.data.bindingConfig.type === 'sms') {
                  configItems.channelId = data.data.resourceData.channelId
                  configItems.systemCode = data.data.resourceData.systemCode
                  let params = ''
                  if (data.data.bindingConfig.extraParams) {
                    let arr1 = this.getParamsEditList(data.data.bindingConfig.extraParams.split(','), this.outParamsList, [], true)
                    arr1.forEach((item, index) => {
                      index ? params = params + '##' + '${' + item.englishName + '}' : params = params + '${' + item.englishName + '}'
                    })
                  }
                configItems.params = params
              }
            }
          })
        }
      }
      return configItems
    },
    saveHandle () {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          let params = this.formatPostData(this.dataForm)
          let config = {
            configItems: params
          }
          this.$store.commit('canvasFlow/setOutParams', [])
          this.$emit('close', { tag: 'save', data: { config: config, key: this.key } })
          this.dataLoading = false
          this.$parent.outparamsNodeVisible = false
          this.$refs['dataForm'].resetFields()
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
