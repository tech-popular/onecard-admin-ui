<template>
  <div style="margin-left:15px">
    <el-form :inline="true" label-position="left">
      <el-form-item label="用户属性与用户交易满足："  label-width="180px">
        <el-input v-model="expression" disabled style="width: 800px" />
      </el-form-item>
      <el-form-item style="float:right">
        <i class="el-icon-circle-plus cursor-pointer" @click="addRules" v-if="from !== 'api'">添加</i>
      </el-form-item>
    </el-form>
    <div v-if="ruleConfig.rules && ruleConfig.rules.length > 0">
      <data-rules-set :data="ruleConfig" ref="rulesSet" :is-require="isRequired" :from="from"></data-rules-set>
    </div>
  </div>
</template>
<script>
import dataRulesSet from './data-rules-set'
import { selectOperate, selectAllCata, enumTypeList, dataIndexManagerCandidate } from '@/api/dataAnalysis/dataInsightManage'
import { findRuleIndex, getAbc, findVueSelectItemIndex, deepClone } from '../dataAnalysisUtils/utils'
import Treeselect, { LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  components: { dataRulesSet, Treeselect },
  props: {
    id: Number,
    from: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      isTreeRoot: true, // 父根节点
      channelId: '',
      expression: '',
      expressionTemplate: '',
      ruleConfig: { // 规则数据
        'ruleCode': 'rule_all',
        'type': 'rules_function',
        'relation': 'and',
        'rules': []
      },
      isRequired: true,
      indexList: [],
      isSelectedUneffectIndex: [],
      lastSubmitRuleConfig: {},
      subTimeSelects: [
        {
          code: 'DAYS', title: '天'
        },
        {
          code: 'HOURS', title: '小时'
        }
        // {
        //   code: 'MINUTES', title: '分钟'
        // }
      ]
    }
  },
  methods: {
    init () {
      this.getSelectAllCata()
      this.ruleConfig = { // 规则数据
        'ruleCode': 'rule_all',
        'type': 'rules_function',
        'relation': 'and',
        'rules': []
      }
      this.expression = ''
      this.expressionTemplate = ''
      this.isRequired = false // 默认为false,不设置的话，保存后再进入会变
    },
    getSelectAllCata (fn) { // 获取所有指标
      selectAllCata({
        channelCode: this.channelId,
        flag: this.id ? '-1' : '1'
      }).then(({data}) => {
        if (data.status !== '1') {
          this.indexList = []
        } else {
          this.indexList = this.filterAllCata(data.data)
        }
        if (fn) {
          fn(this.indexList)
        }
      })
    },
    channelIdChangeUpdate () {
      this.getSelectAllCata((indexList) => {
        if (indexList.length === 0) {
          this.setInitRulesConfig(this.indexList)
        } else {
          this.ruleConfig = this.updateInitRulesConfig(this.ruleConfig, indexList)
          this.setInitRulesConfig(this.indexList)
        }
      })
    },
    renderData (data, channelId) {
      this.channelId = channelId
      let configJson = JSON.parse(data)
      this.ruleConfig = configJson.ruleConfig
      this.expression = configJson.expression
      this.expressionTemplate = configJson.expressionTemplate
      this.getSelectAllCata((indexList) => {
        this.ruleConfig = this.updateInitRulesConfig(this.ruleConfig, indexList)
        this.$nextTick(() => {
          this.$emit('renderEnd')
        })
      })
      this.$nextTick(() => { // 默认将验证错误信息全部清除
        let ruleFormArr = this.getRuleForm()
        ruleFormArr.forEach(item => {
          item.clearValidate()
        })
      })
    },
    renderApiData (data) {
      this.ruleConfig = data.ruleConfig
      this.expression = data.expression
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
            obj.channelCode = item.channelCode
            obj.enable = item.enable
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
          } else { // 指标父级层
            if (!item.fieldType) {
              obj.children = null
            } else {
              arr.push(obj) // 每个指标都放在集合中
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
    setInitRulesConfig (indexList) {  // 将规则初始化
      this.indexList = indexList
      if (this.ruleConfig.rules.length) {
        this.ruleConfig.rules = []
        this.ruleConfig.rules.push(this.getRuleTemplateItem())
      }
      this.updateConditionId(this.ruleConfig)
    },
    updateInitRulesConfig (arr, indexList) {  // 获取指标默认展开列表
      arr.rules.forEach(item => {
        if (!item.rules) {
          let indexListArr = deepClone(indexList)
          let indexPath = findVueSelectItemIndex(indexListArr, item.fieldCode) + ''
          let indexPathArr = indexPath.split(',')
          let a = indexListArr
          if (indexPath) {
            indexPathArr.forEach((fitem, findex) => {
              if (findex < indexPathArr.length - 1) {
                a[fitem].isDefaultExpanded = true
                a = a[fitem].children
              } else {
                item.enable = a[fitem].enable
              }
            })
            item.indexList = indexListArr // 给每一行规则都加上一个指标列表，同时展示选中项
            if (item.func === 'relative_within' || item.func === 'relative_before') { // 兼容老数据
              item.subFunc = item.func
              item.func = 'relative_time'
              item.subTimeSelects = this.subTimeSelects
              if (!item.dateDimension) {
                item.dateDimension = 'DAYS'
              }
              this.getSelectOperateList(item.fieldType, (selectOperateList) => {
                item.selectOperateList = selectOperateList
                item.subSelects = item.selectOperateList.filter(sitem => sitem.code === item.func)[0].subSelects
              })
            }
            if (item.func === 'relative_time_in' || item.func === 'relative_time') {
              item.subTimeSelects = this.subTimeSelects
              if (!item.dateDimension) {
                item.dateDimension = 'DAYS'
              }
            }
            // 兼容老数据,可多输入时，为数据类型，旧数据为字符串类型，需改为数组类型，否则回显出错
            if ((item.fieldType === 'string' || item.fieldType === 'number') && (item.func === 'eq' || item.func === 'neq')) {
              if (!item.params[0].selectVal) {
                item.params[0].selectVal = [ item.params[0].value ]
              }
            }
          }
        } else {
          this.updateInitRulesConfig(item, indexList)
        }
      })
      return arr
    },
    getRuleTemplateItem () { // 条件模板
      return {
        'type': 'rule',
        'fieldType': '',
        'fieldCode': null,
        'format': '',
        'func': '',
        'sourceTable': '',
        'fieldId': '',
        'englishName': '',
        'indexList': this.indexList, // 指标下拉选
        'enumTypeNum': '',
        'selectOperateList': [], // 操作符下拉选
        'selectEnumsList': [], // 内容下拉选
        'subFunc': '',
        'dateDimension': '',
        'strTips': [],
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
      let rules1 = arr.rules[0]
      arr.rules.splice(0, 1, rules1) // 强制更新一下数组
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
      if (citem.func === 'between' || citem.func === 'relative_time_in') {
        params.push({ value: '', title: '' })
      }
      let subSelects = []
      let subFunc = ''
      let subTimeSelects = []
      let dateDimension = ''
      if (citem.func === 'relative_time') {
        subSelects = citem.selectOperateList.filter(item => item.code === citem.func)[0].subSelects
        subFunc = 'relative_before'
        subTimeSelects = this.subTimeSelects
        dateDimension = 'DAYS'
      }
      if (citem.func === 'relative_time_in') {
        subTimeSelects = this.subTimeSelects
        dateDimension = 'DAYS'
      }
      this.updateRulesArr(data, citem, { params: params, subSelects: subSelects, subFunc: subFunc, subTimeSelects: subTimeSelects, dateDimension: dateDimension })
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
          subFunc: '',
          dateDimension: '',
          strTips: [],
          params: [{ value: '', title: '' }]
        }
        if (params.func === 'relative_time') {
          params.subFunc = 'relative_before'
          params.dateDimension = 'DAYS'
        }
        if (params.func === 'relative_time_in') {
          params.dateDimension = 'DAYS'
        }
        Object.keys(obj).forEach(oitem => {
          params[oitem] = obj[oitem]
        })
        if (obj.fieldType === 'number' && (params.func === 'eq' || params.func === 'neq')) {
          params.params = [{ value: [], title: '' }]
        }
        if (obj.fieldType === 'string' && (params.func === 'eq' || params.func === 'neq')) {
          params.params = [{ value: [], title: '' }]
          let res = data
          dataIndexManagerCandidate({ // 字符串提示输入示例
            sourceTable: obj.sourceTable,
            fieldName: obj.englishName,
            count: 10
          }).then(({data}) => {
            if (data.status * 1 === 1 && data.data.length) {
              params.strTips = data.data
            }
            this.updateRulesArr(res, citem, params)
          })
        } else {
          this.updateRulesArr(data, citem, params)
        }
      })
    },
    addChildreRules (data, citem) { // 添加子集
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
      if (!type) {
        fn([])
        return
      }
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
    updateRulesConfig (arr) { // 提交数据时，删除配置数据中多余的内容selectOperateList,selectEnumsList
      this.isSelectedUneffectIndex = []
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
          if (item.label && !item.enable) {
            this.isSelectedUneffectIndex.push(item.label)
          }
        } else {
          if (item.rules) {
            this.updateRulesConfig(item)
          }
        }
      })
      return arr
    },
    ruleValidate () {
      if (!this.ruleConfig.rules.length) {
        return this.$message({
          message: '请配置用户规则信息',
          type: 'error',
          center: true
        })
      }
    },
    uneffectIndexValidate () { // 无效指标提示
      this.lastSubmitRuleConfig = { // 过滤数据
        ruleConfig: this.updateRulesConfig(deepClone(this.ruleConfig)),
        expression: this.expression,
        expressionTemplate: this.expressionTemplate
      }
      this.isSelectedUneffectIndex = Array.from(new Set(this.isSelectedUneffectIndex))
      if (this.isSelectedUneffectIndex.length) {
        return this.$message({
          message: `【${this.isSelectedUneffectIndex.join('，')}】为无效指标，请重新选择`,
          type: 'error',
          center: true
        })
      }
    }
  }
}
</script>
