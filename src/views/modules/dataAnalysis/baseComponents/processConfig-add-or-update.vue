<template>
	<el-dialog  :title="tag === 'view' ? '查看' : dataForm.id ? '修改' : '新增'" :append-to-body="true" :close-on-click-modal="false" :visible.sync="visible">
		<el-form v-loading="dataLoading" label-width="100px" :model="dataForm"  :rules="baseRule" ref="dataForm" :disabled="viewVisible">
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
			<el-form-item label="类型" prop="type"> 
				<el-select v-model="dataForm.type"  style="width: 400px">
					<el-option label="短信" value="sms"></el-option>
          <el-option label="电销" value="tel"></el-option>
          <el-option label="AI" value="ai"></el-option>
					<el-option label="push" value="push"></el-option>
          <!-- <el-option label="红包/卡券" value="card"></el-option> -->
				</el-select>
			</el-form-item>
			<el-form-item  prop="params"  label="出参">
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
						v-model="dataForm.params"
						placeholder="请选择"
						class="base-pane-item"
					/>
			</el-form-item>
			<div style="display:flex;">
				<el-form-item label="通道" prop="datasourceType">
					<el-select v-model="dataForm.datasourceType" @change="changeType"  style="width:270px;">
						<el-option label="kafka" value="kafka">kafka</el-option>
					</el-select>
				</el-form-item>
				<el-form-item prop="datasourceId" label-width="10px" >
					<el-select v-model="dataForm.datasourceId"  style="width:270px;">
							<el-option
								v-for="(item, index) in datasourceList" 
								:key="index"
								:label="item.name"
								:value="item.id"
						></el-option>
					</el-select>
				</el-form-item>
			</div>
		</el-form>
		<div slot="footer" class="foot">
      <el-button type="primary" @click="submitData" v-if="!viewVisible">提交</el-button>
      <el-button @click="visible = false">取消</el-button>
    </div>
	</el-dialog>
</template>
<script>
import { dataTransferManageOutParams, dataTransferManageKafka } from '@/api/dataAnalysis/dataTransferManage'
import { getChannelist, addFlowInfo, editFlowInfo, lookFlowList } from '@/api/dataAnalysis/sourceBinding'
import { deepClone, findVueSelectItemIndex } from '../dataAnalysisUtils/utils'
import Treeselect, { LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  data () {
    return {
      visible: false,
      viewVisible: false,
      dataLoading: false,
      tag: '',
      createTime: '', // 创建时间
      createUser: '', // 创建人
      target: '',
      dataForm: {
        id: '',
        type: '',
        channelCode: '', // 用户渠道
        params: [], // 绑定的出参
        datasourceType: '', // 通道
        datasourceId: ''
      },
      datasourceList: [],
      outParamsList: [],
      params: [], // 分群出参提交格式
      channelList: [],
      baseRule: { // 基本信息校验规则
        type: [
          { required: true, message: '请选择下发类型', trigger: 'blur' }
        ],
        params: [
          { required: true, message: '请选择分群出参', trigger: 'input' }
        ],
        datasourceType: [
          { required: true, message: '请选择通道', trigger: 'blur' }
        ],
        datasourceId: [
          { required: true, message: '请选择', trigger: 'blur' }
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
      this.getChannelsList()
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
        type: '',
        params: [],
        datasourceType: '',
        datasourceId: ''
      }
      this.params = []
      this.datasourceList = []
      this.visible = true
      if (row) {
        this.dataLoading = true
        this.getLookData(row)
      }
    },
    // 回显
    getLookData (row) {
      lookFlowList(row.id).then(res => {
        if (res.data.status === '1') {
          this.dataForm.id = res.data.data.id
          this.dataForm.channelCode = res.data.data.channelCode
          this.dataForm.type = res.data.data.type
          this.dataForm.datasourceType = res.data.data.datasourceType
          this.dataForm.datasourceId = res.data.data.datasourceId
          this.changeType()
          this.getOutParamsList(row, res.data.data.params.split(','))
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
    // 获取分群出参 指标列表
    getOutParamsList (row, value) {
      dataTransferManageOutParams({ channelCode: this.dataForm.channelCode, flag: this.dataForm.id ? '-1' : '1' }).then(({data}) => {
        if (data && data.status === '1') {
          if (row) {
            this.getOutParamsEditList(value, this.filterAllCata(data.data))
            this.dataLoading = false
          } else {
            this.outParamsList = this.filterAllCata(data.data)
          }
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
      this.params = []
      data.forEach(item => {
        out.push(item.split('@')[0] + '-' + item.split('@')[1])
        this.params.push(item.split('@')[1])
      })
      this.dataForm.params = Array.from(new Set(out))
      this.outParamsList = this.updateOutParamsList(outList)
    },
    // 获取出参，默认展开列表
    updateOutParamsList (indexList) {
      let indexListArr = deepClone(indexList)
      this.dataForm.params.forEach(item => {
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
    changeType () {
      let params = {
        type: this.dataForm.datasourceType
      }
      dataTransferManageKafka(params).then(({data}) => {
        if (data && data.status === '1') {
          this.datasourceList = data.data
        }
      })
    },
    changeOption () {
      // 出参选择
      this.$refs.dataForm.clearValidate('params')
    },
    // 选中出参
    outParamsSelect (node) {
      this.params.push(node.fieldId)
      if (this.params.length) {
        this.$refs.dataForm.clearValidate('params')
      }
    },
    // 删除出参
    outParamsDeselect (node) {
      this.params = this.params.filter(item => item != node.fieldId)
    },
    // 打开出参菜单
    openParamsSelect () {
      if (!this.dataForm.channelCode) return this.$message.error('请先选择所属渠道')
    },
    submitData () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          let params = {
            id: this.dataForm.id,
            type: this.dataForm.type,
            channelCode: this.dataForm.channelCode,
            params: this.params.join(','),
            datasourceType: this.dataForm.datasourceType,
            datasourceId: this.dataForm.datasourceId
          }
          if (!this.dataForm.id) {
              addFlowInfo(params).then(({data}) => {
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
              editFlowInfo(params).then(({data}) => {
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
                  this.$message.error(data.msg)
                }
              })
            }
          }
        })
    }
  }
}
</script>