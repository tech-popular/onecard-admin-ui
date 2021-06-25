<template>
  <el-dialog title="模板配置"
    :modal-append-to-body='false'
    :append-to-body="true"
    :visible="visible"
    v-loading="dataLoading"
    width="800px"
    :close-on-click-modal="false">
    <el-form :model="dataForm" ref="dataForm" label-position="left" label-width="100px" :rules="dataRules" :disabled="!canUpdate">
      <el-form-item  prop="channelId" label="渠道" >
        <el-select v-model="dataForm.channelId" @change="getSmsCodeDate(dataForm.channelId,true)" placeholder="请选择渠道" style="width: 300px">
          <el-option v-for="(item, index) in issueChannelList" :key="index" :value="item" :label="item"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="tempCode"  label="模板">
        <el-select v-model="dataForm.tempCode" @change="getSmsTemplate" placeholder="请选择模板" style="width: 300px">
          <el-option v-for="(item, index) in issueTemplateList" :key="index" :value="item.tempCode" :label="item.smsDesc"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="smsTemplate"  label="模板详情">
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
      <el-button type="primary" @click="saveHandle" size="small" v-if="canUpdate">确定</el-button>
      <el-button type="default" @click="cancelHandle" size="small">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { dataTransferManageOutParams, getAllSmsChannels, getSmsCodeInfo, getSmsMessage, getSmsAllMessage } from '@/api/dataAnalysis/dataTransferManage'
import { addDataInfo } from '@/api/dataAnalysis/sourceBinding'
import { deepClone, findVueSelectItemIndex } from '../dataAnalysisUtils/utils'
import Treeselect, { LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  data () {
    return {
      id: '',
      visible: false,
      canUpdate: true,
      dataLoading: false,
      channelCode: '',
      viewVisible: false,
      dataForm: {
        channelId: '',
        tempCode: '',
        smsTemplate: '',
        outParams: [] // 绑定的出参
      },
      isEdit: false,
      paramsNum: 0,
      paramsVisible: false,
      outParamsList: [],
      outParams: [], // 分群出参提交格式
      addResourcebind: false,
      issueChannelList: [],
      issueTemplateList: [],
      resourceName: '',
      resourceCode: '',
      resourceId: '',
      dataRules: {
        channelId: [
          { required: true, message: '请选择渠道', trigger: 'change' }
        ],
        tempCode: [
          { required: true, message: '请选择模板', trigger: 'change' }
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
    init (channelCode, data, canUpdate) {
      this.dataLoading = true
      this.addResourcebind = false
      this.canUpdate = canUpdate
      this.channelCode = channelCode
      this.isEdit = false
      this.dataForm = {
        channelId: '',
        tempCode: '',
        smsTemplate: '',
        outParams: [] // 绑定的出参
      }
      this.resourceCode = ''
      this.resourceId = ''
      this.resourceName = ''
      this.outParamsList = []
      this.visible = true
      this.getAllSmsChannels()
      if (data.length) { // 修改
        this.isEdit = true
        this.dataForm.type = data[0].type
        this.dataForm.tempCode = data[0].topic
        this.getLookData(data)
      } else {
        this.getOutParamsList()
      }
    },
    /* 获取短信所有渠道 */
    getAllSmsChannels() {
       getAllSmsChannels().then(({data}) => {
        if (data.status === '1') {
          this.issueChannelList = data.data
        }
      })
    },
    /* 根据渠道获取模板 */
    getSmsCodeDate (value, isChange) {
      getSmsCodeInfo(value).then(({data}) => {
        if (data.status === '1') {
          this.issueTemplateList = data.data
          if (isChange) {
            this.dataForm.tempCode = ''
            this.dataForm.smsTemplate = ''
            this.viewVisible = false
            this.outParams = []
            this.dataForm.outParams = []
            this.paramsVisible = false
            this.addResourcebind = false
          }
        }
      })
    },
    // 回显时获取短信详细信息
    getLookData (row) {
      getSmsAllMessage(row[0].id).then(res => {
        if (res.data.status === '1') {
          this.resourceName = res.data.data.bindingConfig.resourceName
          this.resourceCode = res.data.data.bindingConfig.resourceCode
          this.resourceId = parseInt(res.data.data.bindingConfig.resourceId)
          this.dataForm.channelId = res.data.data.resourceData.channelId
          this.dataForm.smsTemplate = res.data.data.resourceData.smsTemplate
          this.paramsNum = res.data.data.resourceData.smsTemplate.split('%s').length - 1
          this.getSmsCodeDate(res.data.data.resourceData.channelId, false)
          if (res.data.data.bindingIndex.length) {
              this.paramsNum ? this.paramsVisible = true : this.paramsVisible = false
              this.viewVisible = true
              this.addResourcebind = true
              this.dataLoading = true
              this.getOutParamsList(row, res.data.data.bindingIndex)
            } else {
              this.dataLoading = false
            }
        }
      })
    },
    // 根据所选短信模板获取详情及判断是否进行参数配置
    getSmsTemplate () {
      this.viewVisible = false
      this.dataForm.smsTemplate = this.issueTemplateList.filter(item => item.tempCode === this.dataForm.tempCode)[0].smsTemplate
      this.resourceCode = this.dataForm.tempCode
      this.resourceName = this.issueTemplateList.filter(item => item.tempCode === this.dataForm.tempCode)[0].smsDesc
      this.resourceId = this.issueTemplateList.filter(item => item.tempCode === this.dataForm.tempCode)[0].id.toString()
      this.outParams = []
      this.dataForm.outParams = []
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
            } else {
              this.paramsVisible = true
            }
          }
        }
      })
    },
    // 保存
    saveHandle () {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          if (this.addResourcebind && !this.viewVisible) {
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
                      this.$emit('close', {id: this.resourceId, type: 'sms', topic: this.resourceCode})
                      this.$refs['dataForm'].resetFields()
                    }
                  })
                } else {
                  this.$message.error(data.message || '数据异常')
                }
              })
          } else {
            this.visible = false
            this.$store.commit('dataTransferManage/setOutParams', [])
            this.$emit('close', {id: this.resourceId, type: 'sms', topic: this.resourceCode})
            this.$refs['dataForm'].resetFields()
          }
          this.$parent.outparamsNodeVisible = false
        }
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
        this.dataLoading = false
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
    getOutParamsEditList (data, outList) {
      let out = []
      this.outParams = []
      data.forEach(item => {
        out.push(item.englishName + '-' + item.id)
        this.outParams.push(item.id)
      })
      this.dataForm.outParams = Array.from(new Set(out))
      this.outParamsList = this.updateOutParamsList(outList)
      this.$nextTick(() => {
        this.dataLoading = false
      })
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
    // 取消
    cancelHandle () {
      this.visible = false
      this.$parent.outparamsNodeVisible = false
      this.$refs['dataForm'].resetFields()
      if (!this.isEdit) {
        this.$emit('close', false)
      }
    }
  }
}
</script>
