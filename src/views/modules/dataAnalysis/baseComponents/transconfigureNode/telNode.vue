<template>
	<el-dialog title="配置" :append-to-body="true" :close-on-click-modal="false" :visible.sync="visible">
		<el-form v-loading="dataLoading" label-width="120px" :model="dataForm" :disabled="!canUpdate"  ref="dataForm">
			<el-form-item label="名称" prop="resourceName" :rules="{ required: true, message: '请输入名称', trigger: 'blur' }">
				<el-input v-model="dataForm.resourceName" placeholder="请输入名称" style="width: 400px"></el-input>
			</el-form-item>
      <el-form-item prop="resourceId" label="电销模板" :rules="{ required: true, message: '请选择模板', trigger: 'blur' }">
          <el-select v-model="dataForm.resourceId" filterable  @change="changeTelTemplate" placeholder="请选择模板" style="width: 400px;margin-right:15px;">
            <el-option v-for="(item, index) in telOrAiList" :key="index" :value="item.id" :label="item.name"></el-option>
          </el-select>
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
		</el-form>
		<div slot="footer" class="foot">
      <el-button type="primary" v-if="canUpdate" @click="submitData" >提交</el-button>
      <el-button @click="visible = false">取消</el-button>
    </div>
	</el-dialog>
</template>
<script>
import { dataTransferManageOutParams } from '@/api/dataAnalysis/dataTransferManage'
import { addDataInfo, editDataInfo, lookDataList, getFixedParams, getResourceInfoFromType } from '@/api/dataAnalysis/sourceBinding'
import { deepClone, findVueSelectItemIndex } from '../../dataAnalysisUtils/utils'
import Treeselect, { LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  data () {
    return {
      visible: false,
      fixedParamsvisible: false,
      dataLoading: false,
      canUpdate: true,
      target: '',
      dataForm: {
        id: '',
        type: 'tel',
        resourceId: '',
        resourceName: '',
        resourceCode: '',
        fixedParams: [], // 固定出参
        channelCode: '' // 用户渠道
        // outParams: [] // 绑定的出参
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
    init (channelCode, id, canUpdate) {
      this.dataLoading = true
      this.canUpdate = canUpdate
      this.dataForm = {
        id: id,
        channelCode: channelCode,
        type: 'tel',
        resourceId: '',
        resourceName: '',
        resourceCode: '',
        fixedParams: []
      }
      this.outParamsList = []
      this.target = ''
      this.fixedParams = []
      this.fixedParamsvisible = false
      this.getTelList()
      this.telOrAiList = []
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
          this.dataForm.resourceName = res.data.data.bindingConfig.resourceName
          this.dataForm.resourceCode = res.data.data.bindingConfig.resourceCode
          this.dataForm.type = res.data.data.bindingConfig.type
          this.dataForm.resourceId = parseInt(res.data.data.bindingConfig.resourceId)
          getResourceInfoFromType(res.data.data.bindingConfig.type).then(({data}) => {
            if (data && data.status === '1') {
              this.telOrAiList = data.data
            }
          })
          this.getOutParamsList(res.data.data.fixedParams)
        }
        // this.$nextTick(() => {
        //   this.target = this.telOrAiList.filter(item => item.id == this.dataForm.resourceId)[0].target
        // })
      })
    },
    // 获取分群出参 指标列表
    getOutParamsList (fixedParams) {
      dataTransferManageOutParams({ channelCode: this.dataForm.channelCode, flag: this.dataForm.id ? '-1' : '1' }).then(({data}) => {
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
        this.dataForm.fixedParams = Array.from(new Set(out))
        this.fixedParamsvisible = true
      }
      this.outParamsList = this.updateOutParamsList(outList)
    },
    // 获取出参，默认展开列表
    updateOutParamsList (indexList) {
      let indexListArr = deepClone(indexList)
      this.dataForm.fixedParams.forEach(item => {
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
    getTelList () {
      getResourceInfoFromType('tel').then(({data}) => {
        if (data && data.status === '1') {
          this.telOrAiList = data.data
        } else {
          this.telOrAiList = []
        }
      })
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
     // 电销或AI模板
    changeTelTemplate () {
      this.dataForm.resourceCode = this.telOrAiList.filter(item => item.id === this.dataForm.resourceId)[0].code
    },
    submitData () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.fixedParams.length === 0) {
            return this.$message.error(`请联系管理员配置固定流程参数`)
          }
          let params = {
            id: this.dataForm.id,
            type: this.dataForm.type,
            resourceName: this.dataForm.resourceName,
            resourceCode: this.dataForm.resourceCode,
            channelCode: this.dataForm.channelCode,
            resourceId: this.dataForm.resourceId.toString(),
            fixedParams: this.fixedParams.join(','),
            extraParams: ''
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
                      this.$emit('updateList', true, 'tel')
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
                      this.$emit('updateList', true, 'tel')
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