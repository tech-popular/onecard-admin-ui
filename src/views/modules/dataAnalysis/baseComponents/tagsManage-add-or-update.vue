<template>
  <el-dialog width="800px" :title="tag === 'view' ? '查看' : dataForm.id ? '修改' : '新增'" :append-to-body="true" :close-on-click-modal="false" :visible.sync="visible">
    <el-form v-loading="dataLoading" label-width="160px" :model="dataForm" :rules="baseRule" ref="dataForm" :disabled="viewVisible">
      <el-form-item label="分类名称" prop="name" :rules="{ required: true, message: '请输入名称', trigger: 'blur' }">
        <el-input v-model="dataForm.name" placeholder="请输入名称" style="width: 400px"></el-input>
      </el-form-item>
      <!-- <el-form-item prop="extraParams" label="额外出参">
          <Treeselect
            :options="outParamsList"
            :disable-branch-nodes="true"
            :show-count="true"
            :multiple="true"
            :load-options="loadOptions"
            :searchable="true"
            :clearable="true"
            @open="openParamsSelect"
            @input="changeOption"
            @select="outParamsSelect"
            @deselect="outParamsDeselect"
            noChildrenText="暂无数据"
            v-model="dataForm.extraParams"
            placeholder="请选择"
            class="base-pane-item"
          />
      </el-form-item>-->
    </el-form>
    <div slot="footer" class="foot">
      <el-button type="primary" @click="submitData" v-if="!viewVisible">提交</el-button>
      <el-button @click="visible = false">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { deepClone, findVueSelectItemIndex } from '../dataAnalysisUtils/utils'
import Treeselect, { LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  data () {
    return {
      visible: false,
      tag: '',
      dataForm: {
        id: '',
        resourceId: '',
        name: ''
      },

      baseRule: { // 基本信息校验规则
        templateContent: [
          { required: true, message: '请输入模板内容', trigger: 'blur' }
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
      this.fixedParamsvisible = false
      this.extraParamsVisible = false
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
        resourceId: '',
        name: ''
      }

      this.visible = true
      if (row) {
        this.dataLoading = true
        this.getLookData(row)
      }
    },
    // 回显
    getLookData (row) {

    },

    // 获取分群出参 指标列表
    getOutParamsList (row, extraParams) {

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
    getOutParamsEditList (extraParams, outList) {
      if (extraParams) {
        let out = []
        let fixedData = extraParams.split(',')
        fixedData.forEach(item => {
          out.push(item.split('@')[0] + '-' + item.split('@')[1])
          this.extraParams.push(item.split('@')[1])
        })
        this.dataForm.extraParams = Array.from(new Set(out))
        this.outParamsList = this.updateOutParamsList(this.dataForm.extraParams, outList)
        if (this.dataForm.type === 'sms' && this.dataForm.editType === '0') {
          this.extraParamsVisible = true
        } else {
          this.extraParamsVisible = false
        }
        if (this.dataForm.type === 'kafka') {
          this.extraParamsVisible = true
        }
      } else {
        this.dataForm.extraParams = []
        this.extraParamsVisible = false
      }
    },
    // 获取出参，默认展开列表
    updateOutParamsList (data, indexList) {
      let indexListArr = deepClone(indexList)
      data.forEach(item => {
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
    // 打开出参菜单
    openParamsSelect () {
      if (!this.dataForm.channelCode) return this.$message.error('请先选择所属渠道')
    },
    submitData () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {

        }
      })
    }
  }
}
</script>