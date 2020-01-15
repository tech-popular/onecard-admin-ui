<template>
  <el-drawer
    :append-to-body="false"
    :visible.sync="visible"
    :show-close="false"
    :wrapperClosable="false"
    size="1200px"
    class="api-manage-drawer"
  >
    <div slot="title" class="drawer-title">{{drawerTitle}}<i class="el-icon-close drawer-close" @click="drawerClose"></i></div>
    <div class="wrap" v-loading="loading">
      <div class="base-pane">
        <h3>基本信息</h3>
        <el-form label-width="80px" :model="baseForm" ref="baseForm" :rules="baseRule" class="base-form">
          <el-form-item label="分群名称" prop="name">
            <el-input v-model.trim="baseForm.name" placeholder="分群名称" clearable class="base-pane-item" />
          </el-form-item>
          <el-form-item label="分群描述">
            <el-input type="textarea"  class="base-pane-item" v-model="baseForm.desc" placeholder="最多输入100个字符" maxlength="100" :autosize="{ minRows: 3, maxRows: 5}" />
            <p class="data-description-tips">最多输入100个字符，您还可以输入<span v-text="100 - baseForm.desc.length"></span>个字符</p>
          </el-form-item>
        </el-form>
      </div>
      <div class="pane-rules">
        <h3>满足如下条件的用户</h3>
        <el-form :inline="true">
          <el-form-item label="用户属性与用户交易满足：" >
            <el-input v-model="expression" disabled style="width: 800px" />
          </el-form-item>
          <el-form-item style="float:right">
            <i class="el-icon-circle-plus cursor-pointer" @click="addRules">添加</i>
          </el-form-item>
        </el-form>
        <div v-if="ruleConfig.rules && ruleConfig.rules.length > 0">
          <rules-set :data="ruleConfig" ref="rulesSet" :is-require="isRequired"></rules-set>
        </div>
      </div>
    </div>
    <div class="footer">
      <!-- <el-button type="success" @click="previewHandle" size="small">数据预览</el-button> -->
      <el-button type="primary" @click="saveHandle" size="small" v-if="tag !== 'view'">保存</el-button>
      <el-button type="default" @click="cancelHandle" size="small">取消</el-button>
    </div>
    <!-- <data-preview-info v-if="isPreviewShow" ref="dataPreview"></data-preview-info> -->
  </el-drawer>
</template>
<script>
import rulesSet from './apiManage-rules-set'
// import dataPreview from './data-preview-info'
import { selectOperate, selectAllCata, enumTypeList, savaDataInfo, updateDataInfo, viewDataInfo } from '@/api/dataAnalysis/dataInsightManage'
import { findRuleIndex, getAbc, findVueSelectItemIndex, deepClone } from '../dataAnalysisUtils/utils'
import Treeselect, { LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  data () {
    return {
      // isPreviewShow: false,
      loading: false,
      id: '',
      flowId: '',
      tag: '',
      drawerTitle: '',
      isRequired: false,
      indexList: [],
      expression: '',
      expressionTemplate: '',
      initFieldType: '',
      initDataStandar: '',
      initFieldCode: '',
      initSourceTable: '',
      initFieldId: '',
      initEnumTypeNum: '',
      initSelectOperateList: [],
      initEnglishName: '',
      isTreeRoot: true, // 父根节点
      visible: false,
      baseForm: {
        name: '',
        desc: ''
      },
      baseRule: { // 基本信息校验规则
        name: [
          { required: true, message: '请输入分群名称', trigger: 'blur' }
        ]
      },
      ruleConfig: { // 规则数据
        'ruleCode': 'rule_all',
        'type': 'rules_function',
        'relation': 'and',
        'rules': []
      }
    }
  },
  components: { rulesSet, Treeselect },
  methods: {
    init (row, tag) {
      this.id = ''
      this.tag = ''
      this.flowId = ''
      this.expression = ''
      this.expressionTemplate = ''
      this.loading = true
      this.visible = true
      this.isRequired = false // 默认为false,不设置的话，保存后再进入会变
      this.$nextTick(() => { // 默认将基本信息的错误提示消除
        this.$refs.baseForm.clearValidate()
      })
      this.tag = tag
      if (!tag) {
        this.loading = false
        this.drawerTitle = '新增'
        this.getSelectAllCata()
        this.initEmptyData()
      } else {
        this.id = row.id
        this.drawerTitle = tag === 'view' ? '查看' : '编辑'
        this.getDataInfo(row.id)
      }
    },
    initEmptyData () { // 当数据异常时，初始化数据
      this.baseForm = {
        name: '',
        desc: ''
      }
      this.ruleConfig = { // 规则数据
        'ruleCode': 'rule_all',
        'type': 'rules_function',
        'relation': 'and',
        'rules': []
      }
      this.expression = ''
      this.expressionTemplate = ''
    },
    getDataInfo (id) { // 查看及编辑时请求数据
      viewDataInfo(id).then(({data}) => {
        if (data.status !== '1') {
          this.initEmptyData()
          this.loading = false
          return this.$message({
            message: data.message,
            type: 'error'
          })
        } else {
          if (!data.data.configJson) {
            this.initEmptyData()
            this.loading = false
            return this.$message({
              message: '数据异常',
              type: 'error'
            })
          }
          this.flowId = data.data.flowId
          let configJson = JSON.parse(data.data.configJson)
          this.baseForm = {
            name: configJson.name,
            desc: configJson.desc
          }
          this.ruleConfig = configJson.ruleConfig
          this.expression = configJson.expression
          this.expressionTemplate = configJson.expressionTemplate
          this.getSelectAllCata((indexList) => {
            this.ruleConfig = this.updateInitRulesConfig(this.ruleConfig, indexList)
            this.$nextTick(() => {
              this.loading = false
            })
          })
          this.$nextTick(() => { // 默认将验证错误信息全部清除
            let ruleFormArr = this.getRuleForm()
            ruleFormArr.forEach(item => {
              item.clearValidate()
            })
          })
        }
      })
    },
    updateInitRulesConfig (arr, indexList) {  // 获取指标默认展开列表
      arr.rules.forEach(item => {
        if (!item.rules) {
          let indexListArr = deepClone(indexList)
          let indexPath = findVueSelectItemIndex(indexListArr, item.fieldCode) + ''
          let indexPathArr = indexPath.split(',')
          let a = indexListArr
          indexPathArr.forEach((fitem, findex) => {
            if (findex < indexPathArr.length - 1) {
              a[fitem].isDefaultExpanded = true
              a = a[fitem].children
            }
          })
          item.indexList = indexListArr // 给每一行规则都加上一个指标列表，同时展示选中项
        } else {
          this.updateInitRulesConfig(item, indexList)
        }
      })
      return arr
    },
    getInitTypeCode (arr) { // 获取初始选项及id, 为初始化数据做准备
      arr.forEach((item, index) => {
        if (index === 0) {
          if (item.fieldType) {
            this.initFieldType = item.fieldType // item.fieldType
            this.initFieldCode = item.id // item.englishName
            this.initDataStandar = item.dataStandar
            this.initEnumTypeNum = item.enumTypeNum
            this.initSourceTable = item.sourceTable
            this.initFieldId = item.fieldId
            this.initEnglishName = item.englishName
          } else {
            this.getInitTypeCode(item.children)
          }
        }
      })
    },
    getSelectAllCata (fn) { // 获取所有指标
      selectAllCata().then(({data}) => {
        if (data.status !== '1') {
          this.indexList = []
        } else {
          this.indexList = this.filterAllCata(data.data)
        }
        this.getInitTypeCode(this.indexList)
        this.getSelectOperateList(this.initFieldType, (selectOperateList) => {
          this.initSelectOperateList = selectOperateList
        })
        if (fn) {
          fn(this.indexList)
        }
      })
    },
    filterAllCata (tree) { // 清洗数据，按selectVue的格式重新组织指标数据
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
          } else {
            obj.id = item.id
            obj.label = item.name
          }
          if (this.filterAllCata(item.dataCataLogList).length) { // 指标层 ，无children
            obj.children = this.filterAllCata(item.dataCataLogList)
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
    async loadOptions ({ action, parentNode, callback }) {
      if (action === LOAD_CHILDREN_OPTIONS) {
        callback()
      }
    },
    getRuleTemplateItem (index) { // 条件模板
      return {
        'type': 'rule',
        'fieldType': this.initFieldType,
        'fieldCode': this.initFieldCode,
        'format': this.initDataStandar,
        'func': this.initSelectOperateList[0].code,
        'sourceTable': this.initSourceTable,
        'fieldId': this.initFieldId,
        'englishName': this.initEnglishName,
        'indexList': this.indexList, // 指标下拉选
        'enumTypeNum': '',
        'selectOperateList': this.initSelectOperateList, // 操作符下拉选
        'selectEnumsList': [], // 内容下拉选
        'params': [{
          value: '',
          title: ''
        }]
      }
    },
    updateConditionId (arr, position, type) { // 每次增删时，遍历一下ruleConfig,更改每个条件的ruleCode   type:增，删，切换且或
      var expArr = []
      var expStr = ''
      var expArrTemp = []
      var expStrTemp = ''
      let relation = arr.relation
      function _find (arr, position) {
        var temp = ''
        var exp = []
        var expTemp = []
        arr.rules.forEach((item, index) => {
          if (position != undefined) {
            temp = position + '_' + index
          } else {
            temp = index + ''
          }
          if (!item.rules) {
            if (!type || type !== 'switch') { // 切换且或时，不需要再重新赋值
              let tempArr = temp.split('_')
              let id = getAbc(tempArr[0]) + tempArr.join('').substring(tempArr[0].length)
              item.ruleCode = id
            }
            // 获取表达式
            if (position != undefined) {
              exp.push(item.ruleCode)
              expTemp.push(`{${item.ruleCode}}`)
              if (index === arr.rules.length - 1) {
                let str = `(${[...new Set(exp)].join(' ' + arr.relation + ' ')})` // 二级拼接
                let tempStr = `(${[...new Set(expTemp)].join(' ' + arr.relation + ' ')})` // 二级拼接
                expArr.push(str)
                expStr = expArr.join(' ' + relation + ' ') // 所有一级拼接
                expArrTemp.push(tempStr)
                expStrTemp = expArrTemp.join(' ' + relation + ' ')
              }
            } else {
              expArr.push(item.ruleCode)
              expStr = expArr.join(' ' + arr.relation + ' ')
              expArrTemp.push(`{${item.ruleCode}}`)
              expStrTemp = expArrTemp.join(' ' + arr.relation + ' ')
            }
            // 获取表达式end
          } else {
            let tempArr = temp.split('_')
            let id = getAbc(tempArr[0]) + tempArr.join('').substring(tempArr[0].length)
            item.ruleCode = id
            temp = _find(item, temp)
          }
        })
      }
      _find(arr, position)
      this.expression = expStr
      this.expressionTemplate = expStrTemp
      if (type !== 'switch') {
        this.ruleConfig = arr
      }
    },
    updateRulesArr (arr, citem, obj) { // 更新数组的数据
      arr.rules.forEach(item => {
        if (item.ruleCode === citem.ruleCode) {
          Object.keys(obj).forEach(oitem => {
            item[oitem] = obj[oitem]
          })
        } else {
          if (item.rules) {
            this.updateRulesArr(item, citem, obj)
          }
        }
      })
      this.ruleConfig = arr
    },
    getRulesEnumsList (data, citem) { // 展开下拉选时，请求枚举类型的数据
      let selectEnumsList = []
      enumTypeList(citem.enumTypeNum).then(res => {
        if (res.data.status !== '1') {
          selectEnumsList = []
        } else {
          selectEnumsList = res.data.data
        }
        this.updateRulesArr(data, citem, { selectEnumsList: selectEnumsList })
      })
    },
    updateOperateChange (data, citem) { // 判断操作符是否为null之类的，若为，则将后面数据清空
      let params = [{ value: '', title: '' }]
      if (citem.func === 'between' || citem.func === 'relative_time' || citem.func === 'relative_time_in') {
        params.push({ value: '', title: '' })
      }
      this.updateRulesArr(data, citem, { params: params })
    },
    updateEnumsChange (data, citem) { // 多选数据变化时, 重组params
      let newArr = []
      if (citem.params[0].selectVal === null || !citem.params[0].selectVal.length) {
        newArr = [{
          value: '',
          title: '',
          selectVal: []
        }]
      } else {
        citem.params[0].selectVal.forEach(item => {
          newArr.push({
            value: item,
            title: ''
          })
        })
        newArr.splice(0, 1, { ...newArr[0], selectVal: citem.params[0].selectVal })
      }
      this.updateRulesArr(data, citem, { params: newArr })
    },
    updateDateTimeChange (data, citem) { // 处理一下时间内容，时间插件v-show后与其他输入框不能共用一个参数
      let newArr = []
      if (!citem.params[0].datetime) {
        newArr = [{
          value: '',
          title: '',
          datetime: ''
        }]
      } else {
        newArr = [{
          value: citem.params[0].datetime,
          title: '',
          datetime: citem.params[0].datetime
        }]
      }
      this.updateRulesArr(data, citem, { params: newArr })
    },
    fieldCodeChange (data, citem, obj) { // rxs更新数据
      this.getSelectOperateList(obj.fieldType, (selectOperateList) => {
        let params = {
          selectOperateList: selectOperateList,
          func: selectOperateList[0].code,
          params: [{ value: '', title: '' }]
        }
        Object.keys(obj).forEach(oitem => {
          params[oitem] = obj[oitem]
        })
        this.updateRulesArr(data, citem, params)
      })
    },
    addChildreRules (data, citem) {
      let indexPath = findRuleIndex(data.rules, citem) + ''
      let indexPathArr = indexPath.split(',')
      if (indexPathArr.length === 1) {
        let newObj = {
          'relation': 'and',
          'type': 'rules_function',
          'ruleCode': citem.ruleCode,
          'rules': [
            data.rules[indexPathArr[0]],
            this.getRuleTemplateItem()
          ]
        }
        data.rules.splice(indexPathArr[0], 1, newObj)
      } else {
        data.rules[indexPathArr[0]].rules.push(this.getRuleTemplateItem())
      }
      this.updateConditionId(this.ruleConfig)
    },
    deleteRules (data, citem) { // 删除规则
      let indexPath = findRuleIndex(data.rules, citem) + ''
      let indexPathArr = indexPath.split(',')
      if (indexPathArr.length === 1) {
        data.rules.splice(indexPathArr[0], 1)
      } else {
        data.rules[indexPathArr[0]].rules.splice(indexPathArr[1], 1)
        if (data.rules[indexPathArr[0]].rules.length === 1) { // 若二级内容只有一个时，提至一级位置
          let oldObj = data.rules[indexPathArr[0]].rules[0]
          data.rules.splice(indexPathArr[0], 1, oldObj)
        }
      }
      this.updateConditionId(this.ruleConfig)
    },
    switchSymbol (ruleCode, data) { // 切换且或
      if (data.ruleCode === ruleCode) {
        data.relation = this.ruleConfig.relation === 'and' ? 'or' : 'and'
      } else {
        data.rules.forEach((item, index) => {
          if (item.relation && item.ruleCode === ruleCode) {
            data.rules[index].relation = data.rules[index].relation === 'and' ? 'or' : 'and'
          }
        })
      }
      this.updateConditionId(this.ruleConfig, undefined, 'switch')
    },
    addRules () { // 添加一级条件
      this.ruleConfig.rules.push(this.getRuleTemplateItem())
      this.updateConditionId(this.ruleConfig)
    },
    getSelectOperateList (type, fn) {
      selectOperate(type).then(({data}) => {
        let selectOperateList = []
        if (data.status !== '1') {
          selectOperateList = []
        }
        if (!data.data || (data.data && !data.data.length)) {
          selectOperateList = []
        }
        selectOperateList = data.data
        fn(selectOperateList)
      })
    },
    getRuleForm () { // 获取所有的$refs.ruleForm,用于统一校验数据
      let ruleSet = this.$refs.rulesSet
      let ruleArr = []
      ruleArr = ruleSet.$refs.ruleForm || [] // 如果只有一个两极的内容，则默认会为空
      ruleSet.$children.forEach(item => {
        if (item.$refs.ruleForm) {
          ruleArr = [...ruleArr, ...item.$refs.ruleForm]
        }
      })
      return ruleArr
    },
    drawerClose () { // 关闭抽屉弹窗
      this.visible = false
      this.$parent.addOrUpdateVisible = false
    },
    updateRulesConfig (arr) { // 提交数据时，删除配置数据中多余的内容selectOperateList,selectEnumsList
      arr.rules.forEach(item => {
        if (!item.rules) {
          item.selectOperateList = item.selectOperateList.filter(sitem => sitem.code === item.func)
          let selectEnumsArr = []
          item.selectEnumsList.forEach(sitem => {
            item.params.forEach(pitem => {
              if (sitem.childrenNum === pitem.value) {
                selectEnumsArr.push(sitem)
              }
            })
          })
          item.selectEnumsList = selectEnumsArr
          item.indexList = []
        } else {
          if (item.rules) {
            this.updateRulesConfig(item)
          }
        }
      })
      return arr
    },
    // previewHandle () {
    //   this.isPreviewShow = true
    //   this.$nextTick(() => {
    //     console.log(this.$refs)
    //     // this.$refs.dataPreviewInfo.init()
    //   })
    // },
    saveHandle () {
      if (!this.ruleConfig.rules.length) {
        this.$message({
          message: '请配置用户规则信息',
          type: 'error',
          center: true
        })
        return
      }
      this.isRequired = true
      let ruleFormArr = this.getRuleForm()
      this.$nextTick(() => { // 待页面中的isRequired = true后再执行校验
        let flag = true
        this.$refs.baseForm.validate((valid) => {
          if (!valid) {
            flag = false
          }
        })
        ruleFormArr.forEach(item => {
          item.validate((valid) => {
            if (!valid) {
              flag = false
            }
          })
        })
        if (!flag) {
          this.isRequired = false
        } else { // 全部校验通过后，可保存数据
          this.ruleConfig = this.updateRulesConfig(this.ruleConfig) // 过滤数据
          let params = { ...this.baseForm, expression: this.expression, expressionTemplate: this.expressionTemplate, ruleConfig: this.ruleConfig }
          let url = savaDataInfo
          if (this.id) {
            url = updateDataInfo
            params.id = this.id
            params.flowId = this.flowId
          }
          console.log(params)
          url(params).then(({data}) => {
            if (data.status !== '1') {
              return this.$message({
                type: 'error',
                message: data.message
              })
            } else {
              this.$message({
                type: 'success',
                message: data.message
              })
              this.visible = false
              this.$parent.addOrUpdateVisible = false
              this.$nextTick(() => {
                this.$parent.getDataList()
              })
            }
          })
        }
      })
    },
    cancelHandle () {
      this.visible = false
      this.$parent.addOrUpdateVisible = false
    }
  }
}
</script>
<style scoped>
  .api-manage-drawer .wrap {
    padding: 0 20px 20px;
    margin-top: -12px;
    width: 100%;
    overflow-y: auto;
    position: absolute;
    top: 75px;
    bottom: 55px;
  }
  .drawer-title {
    padding: 15px;
    background: #333;
    color: #fff;
    font-size: 15px;
    margin: -20px -20px 0 -20px;
    position: relative;
  }
  .drawer-close {
    position: absolute;
    right: 20px;
  }
  .item-inline {
    display: inline-block;
  }
  .item-code {
    margin-left: -70px;
  }
  .item-code-name {
    width: 300px;
  }
  .item-button {
    margin-left: -60px;
  }
  .copy-code {
    margin-left: 15px;
  }
  .base-pane {
    border-bottom: 1px dashed #ccc;
  }
  .footer {
    position: absolute;
    bottom: 0;
    background: #fff;
    padding: 10px 22px 10px 10px;
    width: 100%;
    height: 55px;
    text-align: right;
    box-shadow: 0 -2px 9px 0 rgba(153,169,191,.17);
    z-index: 500;
  }
  .cursor-pointer {
    cursor: pointer;
  }
  .base-pane-item {
    width: 80%;
  }
  .vue-treeselect {
    line-height: 24px;
  }
  .data-description-tips {
    color: #999;
    margin-top: 0
  }
  .data-description-tips span {
    color: red
  }
</style>
