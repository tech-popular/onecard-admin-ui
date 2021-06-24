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
        <el-select v-model="dataForm.type"  placeholder="请选择方式" style="width: 300px">
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
         <p style="margin:0" v-if="addResourcebind">
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
    <div slot="footer">
      <el-button type="primary" @click="saveHandle" size="small">确定</el-button>
      <el-button type="default" @click="cancelHandle" size="small">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { dataTransferManageOutParams, getAllSmsChannels, getSmsCodeInfo, getSmsMessage } from '@/api/dataAnalysis/dataTransferManage'
import { addDataInfo } from '@/api/dataAnalysis/sourceBinding'
import { deepClone, findVueSelectItemIndex } from '../dataAnalysisUtils/utils'
import Treeselect, { LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  data () {
    return {
      id: '',
      key: '',
      visible: false,
      channelCode: '',
      dataLoading: false,
      viewVisible: false,
      dataForm: {
        type: 'sms',
        channelId: '',
        tempCode: '',
        smsTemplate: '',
        outParams: [] // 绑定的出参
      },
      paramsNum: 0,
      paramsVisible: false,
      outParamsList: [],
      outParams: [], // 分群出参提交格式
      addResourcebind: false,
      resourceName: '',
      resourceCode: '',
      resourceId: '',
      issueTypeList: [
        {value: 'sms', lable: '短信'},
        {value: 'tel', lable: '电销'},
        {value: 'ai', lable: 'AI'}
      ],
      issueChannelList: [],
      issueTemplateList: [],
      dataRules: {
        type: [
          { required: true, message: '请选择方式', trigger: 'change' }
        ],
        channelId: [
          { required: true, message: '请选择渠道', trigger: 'change' }
        ],
        tempCode: [
          { required: true, message: '请选择模板', trigger: 'change' }
        ],
         outParams: [
          { required: true, message: '请选择分群出参', trigger: 'input' }
        ]
        // smsTemplate: [
        //   { required: true, message: '请选择签名', trigger: 'change' }
        // ]
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
    init (data) {
      this.visible = true
      this.dataLoading = true
      this.channelCode = this.$store.state.canvasFlow.channelCode
      this.resourceCode = ''
      this.resourceId = ''
      this.resourceName = ''
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
    // 改变下发方式
    dateType () {
      this.dataForm.channelId = ''
      this.dataForm.tempCode = ''
      this.dataForm.smsTemplate = ''
      this.dataForm.outParams = []
      this.outParams = []
      this.issueTemplateList = []
    },
    getSmsTemplate () {
      this.dataForm.smsTemplate = this.issueTemplateList.filter(item => item.tempCode === this.dataForm.tempCode)[0].smsTemplate
      this.resourceCode = this.dataForm.tempCode
      this.resourceName = this.issueTemplateList.filter(item => item.tempCode === this.dataForm.tempCode)[0].smsDesc
      this.resourceId = this.issueTemplateList.filter(item => item.tempCode === this.dataForm.tempCode)[0].id.toString()
      getSmsMessage(this.resourceId).then(({data}) => {
        if (data && data.status === '1') {
          if (data.data.length > 0) {
            this.paramsVisible = false
            this.addResourcebind = false
          } else {
            this.addResourcebind = true
            this.paramsNum = this.dataForm.smsTemplate.split('%s').length - 1
            if (!this.paramsNum) {
              this.paramsVisible = false
              this.outParams = []
            } else {
              this.getOutParamsList()
              this.paramsVisible = true
            }
          }
        }
      })
    },
    saveHandle () {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          let config = {
            configItems: {
              type: this.dataForm.type,
              channelId: this.dataForm.channelId,
              tempCode: this.dataForm.tempCode
            }
          }
          if (this.addResourcebind) {
              if (this.outParams.length !== this.paramsNum) {
                return this.$message.error(`请选择${this.paramsNum}个参数`)
              }
              let params = {
                id: this.dataForm.id,
                type: 'sms',
                resourceName: this.resourceName,
                resourceCode: this.resourceCode,
                channelCode: this.channelCode,
                resourceId: this.resourceId,
                bindingIndex: this.outParams.join(',')
              }
              addDataInfo(params).then(({data}) => {
                  if (data && data.status === '1') {
                    this.$message({
                      message: '操作成功',
                      type: 'success',
                      duration: 1500,
                      onClose: () => {
                        this.visible = false
                        this.$emit('close', { tag: 'save', data: { config: config, key: this.key } })
                        this.$refs['dataForm'].resetFields()
                      }
                    })
                  } else {
                    this.$message.error(data.message || '数据异常')
                  }
                })
            } else {
              this.visible = false
              this.$emit('close', { tag: 'save', data: { config: config, key: this.key } })
              this.$refs['dataForm'].resetFields()
            }
        }
        // if (valid) {
        //   let config = {
        //     configItems: this.dataForm
        //   }
        //   this.$emit('close', { tag: 'save', data: { config: config, key: this.key } })
        //   this.$parent.outparamsNodeVisible = false
        // }
      })
    },
    // 获取分群出参 指标列表
    getOutParamsList (row, value) {
      let code = this.channelCode.split(',').filter(item => item !== '')
      dataTransferManageOutParams({ channelCode: code, flag: this.id ? '-1' : '1' }).then(({data}) => {
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
    cancelHandle () {
      this.visible = false
      this.$parent.outparamsNodeVisible = false
    }
  }
}
</script>
