<template>
	<el-dialog title="配置" width = "800px" :append-to-body="true" :close-on-click-modal="false" :visible.sync="visible">
		<el-form v-loading="dataLoading" label-width="160px" :model="baseForm"  ref="baseForm">
			<el-form-item label="名称" prop="resourceName" :rules="{ required: true, message: '请输入名称', trigger: 'blur' }">
				<el-input v-model="baseForm.resourceName" placeholder="请输入名称"></el-input>
			</el-form-item>
		<el-form-item label="推送方式：" prop="flag" :rules="{ required: true, message: '请选择推送方式', trigger: 'blur' }">
			<el-checkbox v-model="baseForm.flag" label="pushFlag" @change="checked=>changeDistribution(checked, 'pushFlag')">push</el-checkbox>
			<el-checkbox v-model="baseForm.flag " label="msgFlag" @change="checked=>changeDistribution(checked, 'msgFlag')">个人消息</el-checkbox>
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
						v-model="baseForm.fixedParams"
						class="base-pane-item"
					/>
			</el-form-item>
		<div v-if="baseForm.flag.includes('pushFlag')">
			<el-divider content-position="center">push</el-divider>
			<el-form-item label="Push类型：" prop="pushType" :rules="{ required: true, message: '请选择Push类型', trigger: 'blur' }">
				<el-select v-model="baseForm.pushType">
					<el-option value="PUM" label="服务通知"></el-option>
					<el-option value='SYS' label="系统公告"></el-option>
					<el-option value="ACTIVITY" label="精选活动"></el-option>
					<el-option value="BONUS" label="专属福利"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="Push标题：" prop="pushTitle" :rules="{ required: true, message: '请输入Push标题', trigger: 'blur' }">
				<el-input v-model="baseForm.pushTitle" placeholder="请输入Push标题"></el-input>
			</el-form-item>
			<el-form-item label="查看详情跳转目标：" prop="pageType" v-if="baseForm.pushType === 'ACTIVITY' || baseForm.pushType === 'BONUS'" :rules="{ required: true, message: '请选择查看详情跳转目标', trigger: 'blur' }">
				<el-radio label="internal" v-model="baseForm.pageType">新H5</el-radio>
				<el-radio label="external" v-model="baseForm.pageType">外部H5</el-radio>
			</el-form-item>
			<el-form-item label="查看详情跳转链接：" prop="linkUrl" v-if="baseForm.pushType === 'ACTIVITY' || baseForm.pushType === 'BONUS'" :rules="{ required: true, message: '请输入查看详情跳转链接', trigger: 'blur' }">
				<el-input v-model="baseForm.linkUrl" ></el-input>
			</el-form-item>
			<el-form-item label="内容：" prop="pushContent" :rules="{ required: true, message: '请输入内容', trigger: 'blur' }">
				<el-input type="textarea"  v-model="baseForm.pushContent" :autosize="{ minRows: 3}"  show-word-limit />
			</el-form-item>
		</div>
		<div v-if="baseForm.flag.includes('msgFlag')">
			<el-divider content-position="center">个人消息</el-divider>
			<el-form-item label="App跳转目标：" prop="pageType" :rules="{ required: true, message: '请选择App跳转目标', trigger: 'blur' }">
				<el-radio label="native" v-model="baseForm.pageType">原生页</el-radio>
				<el-radio label="internal" v-model="baseForm.pageType">新H5</el-radio>
				<el-radio label="h5" v-model="baseForm.pageType">老H5</el-radio>
				<el-radio label="external" v-model="baseForm.pageType">外部H5</el-radio>
			</el-form-item>
			<el-form-item label="App跳转链接：" prop="msgUrl" :rules="{ required: true, message: '请输入App跳转链接', trigger: 'blur' }">
				<el-input v-model="baseForm.msgUrl" ></el-input>
			</el-form-item>
			<el-form-item label="标题：" prop="msgTitle" :rules="{ required: true, message: '请输入标题', trigger: 'blur' }">
				<el-input v-model="baseForm.msgTitle" placeholder="请输入标题"></el-input>
			</el-form-item>
		<el-form-item label="内容：" prop="msgContent" :rules="{ required: true, message: '请输入内容', trigger: 'blur' }">
					<el-input type="textarea"  v-model="baseForm.msgContent" :autosize="{ minRows: 3}"  show-word-limit />
			</el-form-item>
		</div>
		</el-form>
		<div slot="footer" class="foot">
      <el-button type="primary" @click="submitData" >提交</el-button>
      <el-button @click="visible = false">取消</el-button>
    </div>
	</el-dialog>
</template>
<script>
import { dataTransferManageOutParams } from '@/api/dataAnalysis/dataTransferManage'
import { addDataInfo, editDataInfo, lookDataList, getFixedParams } from '@/api/dataAnalysis/sourceBinding'
import { deepClone, findVueSelectItemIndex } from '../../dataAnalysisUtils/utils'
import Treeselect, { LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  data () {
    return {
      visible: false,
      fixedParamsvisible: false,
      dataLoading: false,
      target: '',
      baseForm: {
        id: '',
        type: 'push',
        resourceName: '',
        channelCode: '',
        pushType: '',
        pushTitle: '',
        pageType: '',
        // pushFlag: '',
        flag: [],
        linkUrl: '',
        pushContent: '',
        // msgFlag: '',
        msgTitle: '',
        msgUrl: '',
        msgContent: '',
        fixedParams: [] // 绑定的出参
      },
      paramsNum: 0,
      outParamsList: [],
      fixedParams: [], // 固定出参
      telOrAiList: [],
      channelList: []
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
    init (channelCode, id) {
      this.baseForm = {
        id: '',
        type: 'push',
        resourceName: '',
        channelCode: channelCode,
        pushType: '',
        pushTitle: '',
        pageType: '',
        // pushFlag: '',
        flag: [],
        linkUrl: '',
        pushContent: '',
        // msgFlag: '',
        msgTitle: '',
        msgUrl: '',
        msgContent: '',
        fixedParams: []
      }
      this.fixedParams = []
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
          this.baseForm.id = res.data.data.bindingConfig.id
          this.baseForm.channelCode = res.data.data.bindingConfig.channelCode
          this.baseForm.resourceName = res.data.data.bindingConfig.resourceName
          this.baseForm.type = res.data.data.bindingConfig.type
          let bindContent = JSON.parse(res.data.data.bindingConfig.content)
          this.baseForm.pushType = bindContent.pushType
          this.baseForm.pushTitle = bindContent.pushTitle
          this.baseForm.pageType = bindContent.pushExtraKeys.pageType
          this.baseForm.linkUrl = bindContent.pushExtraKeys.linkUrl
          this.baseForm.pushContent = bindContent.pushContent
          this.baseForm.msgUrl = bindContent.msgUrl
          this.baseForm.msgContent = bindContent.msgContent
          this.baseForm.msgTitle = bindContent.msgTitle
          if (bindContent.pushFlag === 'Y') {
            this.baseForm.flag.push('pushFlag')
          }
          if (bindContent.msgFlag === 'Y') {
            this.baseForm.flag.push('msgFlag')
          }
          this.getOutParamsList(res.data.data.fixedParams)
        }
      })
    },
    // 获取分群出参 指标列表
    getOutParamsList (fixedParams) {
      dataTransferManageOutParams({ channelCode: this.baseForm.channelCode, flag: this.baseForm.id ? '-1' : '1' }).then(({data}) => {
        if (data && data.status === '1') {
          if (fixedParams) {
            this.getOutParamsEditList(fixedParams, this.filterAllCata(data.data))
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
    getOutParamsEditList (fixedParams, outList) {
      if (fixedParams) {
        let out = []
        let fixedData = fixedParams.split(',')
        fixedData.forEach(item => {
          out.push(item.split('@')[0] + '-' + item.split('@')[1])
           this.fixedParams.push(item.split('@')[1])
        })
        this.baseForm.fixedParams = Array.from(new Set(out))
        this.fixedParamsvisible = true
      }
      this.outParamsList = this.updateOutParamsList(outList)
    },
    // 获取出参，默认展开列表
    updateOutParamsList (indexList) {
      let indexListArr = deepClone(indexList)
      this.baseForm.fixedParams.forEach(item => {
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
        channelCode: this.baseForm.channelCode,
        type: this.baseForm.type
      }
      getFixedParams(params).then(({data}) => {
        if (data && data.status === '1') {
          if (data.data) {
            let fixedData = data.data.split(',')
            fixedData.forEach(item => {
              out.push(item.split('@')[0] + '-' + item.split('@')[1])
              this.fixedParams.push(item.split('@')[1])
            })
            this.baseForm.fixedParams = Array.from(new Set(out))
            this.fixedParamsvisible = true
          } else {
            this.fixedParamsvisible = false
            this.baseForm.fixedParams = []
            this.fixedParams = []
          }
        }
      })
    },
    changeDistribution (checked, val) {
      if (!checked && val === 'pushFlag') {
        this.baseForm.pushType = ''
        this.baseForm.pushTitle = ''
        this.baseForm.pageType = ''
        this.baseForm.linkUrl = ''
        this.baseForm.pushContent = ''
      }
      if (!checked && val === 'msgFlag') {
        this.baseForm.msgUrl = ''
        this.baseForm.msgContent = ''
        this.baseForm.msgTitle = ''
      }
    },
    submitData () {
      this.$refs['baseForm'].validate((valid) => {
        if (valid) {
          let content = {
            pushFlag: this.baseForm.flag.includes('pushFlag') ? 'Y' : 'N',
            msgFlag: this.baseForm.flag.includes('msgFlag') ? 'Y' : 'N',
            pushType: this.baseForm.pushType,
            pushTitle: this.baseForm.pushTitle,
            pushContent: this.baseForm.pushContent,
            msgTitle: this.baseForm.msgTitle,
            msgUrl: this.baseForm.msgUrl,
            msgContent: this.baseForm.msgContent,
            pushExtraKeys: {
              pageType: this.baseForm.pageType,
              linkUrl: this.baseForm.linkUrl
            }
          }
          let params = {
            id: this.baseForm.id,
            type: this.baseForm.type,
            channelCode: this.baseForm.channelCode,
            resourceName: this.baseForm.resourceName,
            fixedParams: this.fixedParams.join(','),
            extraParams: '',
            content: JSON.stringify(content)
          }
          if (!this.baseForm.id) {
              addDataInfo(params).then(({data}) => {
                if (data && data.status === '1') {
                  this.$message({
                    message: '操作成功',
                    type: 'success',
                    duration: 1500,
                    onClose: () => {
                      this.visible = false
                      this.$emit('updateList', true, 'push')
                      this.$refs['baseForm'].resetFields()
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
                      this.$emit('updateList', true, 'push')
                      this.$refs['baseForm'].resetFields()
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