<template>
  <div class="action-rule-pane">
    <el-form :inline="true" label-position="left">
      <el-form-item label="用户行为满足：">
        <el-tooltip placement="top"> 
          <div slot="content" class="tips-content">用户行为筛选范围为注册用户</div>
          <i class="el-icon-info cursor-pointer" style="color:#409eff; margin-right:60px;"></i>
        </el-tooltip> 
        <el-input v-model="actionExpression" disabled style="width: 800px" />
      </el-form-item>
      <el-form-item style="float:right">
        <i class="el-icon-circle-plus cursor-pointer" @click="addRules" v-if="from !== 'api'">添加</i>
      </el-form-item>
    </el-form>
    <div v-if="actionRuleConfig.rules && actionRuleConfig.rules.length > 0">
      <action-data-rules-set
        :data="actionRuleConfig"
        ref="actionRulesSet"
        :is-require="isRequired"
        :from="from"
      ></action-data-rules-set>
    </div>
  </div>
</template>
<script>
import actionDataRulesSet from './actionData-rule-set.vue'
import {
  selectOperate,
  selectEventAllCata,
  selectEventIndexAllCata,
  enumTypeList
  // dataIndexManagerCandidate
} from '@/api/dataAnalysis/dataInsightManage'
import {
  findRuleIndex,
  getAbc,
  deepClone
} from '../dataAnalysisUtils/utils'
import Treeselect, { LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  components: { actionDataRulesSet, Treeselect },
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
      actionExpression: '',
      actionExpressionTemplate: '',
      actionRuleConfig: {
        // 规则数据
        ruleCode: 'rule_all',
        type: 'rules_function',
        relation: 'and',
        rules: []
      },
      isRequired: true,
      eventDownList: [],
      countSelectOperateList: [],
      isSelectedUneffectIndex: [],
      lastSubmitRuleConfig: {},
      subTimeSelects: [
        {
          code: 'DAYS',
          title: '天'
        },
        {
          code: 'HOURS',
          title: '小时'
        }
        // {
        //   code: 'MINUTES', title: '分钟'
        // }
      ]
    }
  },
  watch: {
    'actionRuleConfig.rules': {
      handler (newVal, oldVal) {
        if (newVal.length > 0) {
          this.$emit('isShowRelation', true)
        } else {
          this.$emit('isShowRelation', false)
        }
      }
    }
  },
  methods: {
    init () {
      this.getEventSelectAllCata(this.channelId)
      this.getCountSelectOperateList()
      this.actionRuleConfig = {
        // 规则数据
        ruleCode: 'rule_all',
        type: 'rules_function',
        relation: 'and',
        rules: []
      }
      this.actionExpression = ''
      this.actionExpressionTemplate = ''
      this.isRequired = false // 默认为false,不设置的话，保存后再进入会变
    },
    getEventSelectAllCata (channelId, fn) { // 获取事件列表
      selectEventAllCata({
        channelCode: channelId = channelId.length > 0 ? channelId : ''
      }).then(({data}) => {
        if (data.status !== '1') {
          this.eventDownList = []
        } else {
          this.eventDownList = data.data
        }
        if (fn) {
          fn(this.eventDownList)
        }
      })
    },
    // 获取总次数下拉列表
    getCountSelectOperateList () {
      this.getSelectOperateList('number', countSelectOperateList => {
        this.countSelectOperateList = countSelectOperateList
      })
    },
    getSelectOperateList (type, fn) { // 获取运算符下拉列表
      if (!type) {
        fn([])
        return
      }
      selectOperate(type).then(({ data }) => {
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
    // 获取事件属性列表
    getEventIndexList (elementId, fn) {
      if (!elementId) {
        fn([])
        return
      }
      selectEventIndexAllCata({elementId: elementId}).then(({ data }) => {
        let eventIndexList = []
        if (data.status !== '1') {
          eventIndexList = []
        }
        if (!data.data || (data.data && !data.data.length)) {
          eventIndexList = []
        }
        eventIndexList = data.data
        fn(eventIndexList)
      })
    },
    renderData (data, channelId) {
      let configJson = JSON.parse(data)
      this.channelId = channelId
      this.actionRuleConfig = this.changeRules(configJson.actionRuleConfig)
      this.actionExpression = configJson.actionExpression
      this.actionExpressionTemplate = configJson.actionExpressionTemplate
      this.getEventSelectAllCata(channelId, (eventDownList) => {
        this.getSelectOperateList('number', countSelectOperateList => {
          this.countSelectOperateList = countSelectOperateList
          this.actionRuleConfig = this.updateInitActionRulesConfig(this.actionRuleConfig, eventDownList, countSelectOperateList)
          this.$nextTick(() => {
            this.$emit('renderEnd')
          })
        })
      })
      this.$nextTick(() => {
        // 默认将验证错误信息全部清除
        let ruleFormArr = this.getRuleForm()
        ruleFormArr.forEach(item => {
          item.clearValidate()
        })
      })
    },
    renderApiData (data) {
      this.actionRuleConfig = this.changeRules(data.actionRuleConfig)
      this.actionExpression = data.actionExpression
    },
    // 回显时修改rules为childrenRules
    changeRules (data) {
      data.rules.forEach(item => {
        if (item.type != 'rules_function') {
          if (item.rules) {
            item.childrenRules = deepClone(item.rules)
            delete item.rules
          } else {
            item.childrenRules = []
          }
        } else {
          this.changeRules(item)
        }
      })
      return data
    },
    updateInitActionRulesConfig (data, eventDownList, countSelectOperateList) {
      data.rules.forEach(item => {
        if (item.type != 'rules_function') {
          item.eventDownList = eventDownList
          item.totalCountParams.selectOperateList = countSelectOperateList
        } else {
          this.updateInitActionRulesConfig(item, eventDownList, countSelectOperateList)
        }
      })
      return data
    },
    channelIdChangeUpdate (channelId) {
      this.channelId = channelId
      // 用户所属渠道改变时，清空数据，初始
      this.getEventSelectAllCata(channelId, (eventDownList) => {
        this.eventDownList = eventDownList
        if (this.actionRuleConfig.rules.length) {
          this.actionRuleConfig.rules = []
          this.actionRuleConfig.rules.push(this.getRuleTemplateItem())
        }
        this.updateConditionId(this.actionRuleConfig)
      })
    },
    updateEventTypeList (arr, val, citem, index) { // 事件改变时，第三层数据需清空数据
      this.getEventIndexList(val[1], eventIndexList => {
        citem.eventIndexList = eventIndexList
         // 来源参数改变
        let dataEventDtos = citem.eventDownList.filter(sitem => sitem.eventId === val[0])[0].dataEventDtos
        citem.sourceTable = dataEventDtos.filter(sitem => sitem.eventId === val[1])[0].sourceTable
        if (citem.childrenRules.length > 0) {
          citem.childrenRules = []
          this.addThirdChildrenRules(arr, citem)
        }
      })
    },
    async loadOptions ({ action, parentNode, callback }) {
      if (action === LOAD_CHILDREN_OPTIONS) {
        callback()
      }
    },
    getRulesEnumsList (data, citem, index) { // 展开下拉选时，请求枚举类型的数据
      let selectEnumsList = []
      enumTypeList(citem.enumTypeNum).then(res => {
        if (res.data.status !== '1') {
          selectEnumsList = []
        } else {
          selectEnumsList = res.data.data
        }
        this.updateChildrenRulesArr(data, citem, { selectEnumsList: selectEnumsList }, index)
      })
    },
    fieldCodeChange (data, citem, obj, index) { // rxs更新数据
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
          this.updateChildrenRulesArr(data, citem, params, index)
          // let res = data
          // dataIndexManagerCandidate({ // 字符串提示输入示例
          //   sourceTable: obj.sourceTable,
          //   fieldName: obj.englishName,
          //   count: 10
          // }).then(({data}) => {
          //   if (data.status * 1 === 1 && data.data.length) {
          //     params.strTips = data.data
          //   }
            // this.updateChildrenRulesArr(res, citem, params, index)
          // })
        } else {
          this.updateChildrenRulesArr(data, citem, params, index)
        }
      })
    },
    updateEnumsChange (data, citem, index) { // 多选数据变化时, 重组params
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
      this.updateChildrenRulesArr(data, citem, { params: newArr }, index)
    },
    getRuleTemplateItem () {
      //  一级 二级条件模板
      return {
        'type': 'event',
        'func': 'between', //  选择的时间类型
        'fieldType': 'date',
        'fieldCode': 'click_time',
        'englishName': 'click_time',
        'subFunc': '',
        'dateDimension': '',
        'havedo': 'yes', //  是否做过
        'sourceTable': '', // 事件类型 来源
        'eventDownList': this.eventDownList, // 事件列表
        'eventIndexList': [], // 事件属性列表
        'eventList': [], // 事件
        'totalCountParams': {
          func: '',
          selectOperateList: this.countSelectOperateList,
          params: [
            {
              value: '',
              title: ''
            }
          ]
        },
        'childrenRules': [], // 第三层数组
        'params': [
          {
            value: '',
            title: ''
          },
          {
            value: '',
            title: ''
          }
        ]
      }
    },
    getThirdRuleTemplateItem (data) {
      // 三级条件模板
      return {
        'type': 'rule',
        'relation': 'and',
        'fieldType': '',
        'fieldCode': null,
        'format': '',
        'func': '',
        'sourceTable': data.sourceTable,
        'fieldId': '',
        'englishName': '',
        'chineseName': '',
        'eventIndexList': data.eventIndexList, // 事件属性下拉选
        'enumTypeNum': '',
        'selectOperateList': [], // 操作符下拉选
        'selectEnumsList': [], // 内容下拉选
        'subFunc': '',
        'dateDimension': '',
        'strTips': [],
        'params': [
          {
            value: '',
            title: ''
          }
        ]
      }
    },
    updateConditionId (arr, position, type) {
      // 一级 二级嵌套每次增删时，遍历一下actionRuleConfig,更改每个条件的ruleCode   type:增，删，切换且或
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
            if (!type || type !== 'switch') {
              // 切换且或时，不需要再重新赋值
              let tempArr = temp.split('_')
              let id =
                getAbc(tempArr[0]) +
                tempArr.join('').substring(tempArr[0].length)
              item.ruleCode = id
            }
            // 获取表达式
            if (position != undefined) {
              exp.push(item.ruleCode)
              expTemp.push(`{${item.ruleCode}}`)
              if (index === arr.rules.length - 1) {
                let str = `(${[...new Set(exp)].join(
                  ' ' + arr.relation + ' '
                )})` // 二级拼接
                let tempStr = `(${[...new Set(expTemp)].join(
                  ' ' + arr.relation + ' '
                )})` // 二级拼接
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
            let id =
              getAbc(tempArr[0]) +
              tempArr.join('').substring(tempArr[0].length)
            item.ruleCode = id
            temp = _find(item, temp)
          }
        })
      }
      _find(arr, position)
      this.actionExpression = expStr
      this.actionExpressionTemplate = expStrTemp
      if (type !== 'switch') {
        this.actionRuleConfig = arr
      }
    },
    updateRulesArr (arr, citem, obj) {
      // 更新一级 二级数组的数据
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
      this.actionRuleConfig = arr
    },
    updateOperateChange (data, citem) { // 一级 二级 时间区间改变时，更新数据
      let params = [{ value: '', title: '' }]
      if (citem.func === 'between' || citem.func === 'relative_time_in') {
        params.push({ value: '', title: '' })
      }
      let subSelects = []
      let subFunc = ''
      let subTimeSelects = []
      let dateDimension = ''
      let childrenRules = [] // 待确定 修改时间区间类型时，三级数据是否清空
      if (citem.func === 'relative_time') {
        // subSelects = citem.selectOperateList.filter(item => item.code === citem.func)[0].subSelects
        subFunc = 'relative_before'
        subTimeSelects = this.subTimeSelects
        dateDimension = 'DAYS'
      }
      if (citem.func === 'relative_time_in') {
        subTimeSelects = this.subTimeSelects
        dateDimension = 'DAYS'
      }
      this.updateRulesArr(data, citem, { params: params, subSelects: subSelects, subFunc: subFunc, subTimeSelects: subTimeSelects, dateDimension: dateDimension, childrenRules: childrenRules })
    },
    updateTotalOperateChange (data, citem) { // 总次数区间改变
      let totalCountParams = {
        func: citem.totalCountParams.func,
        selectOperateList: this.countSelectOperateList,
        params: [
          {
            value: '',
            title: ''
          }
        ]
      }
      if (citem.totalCountParams.func === 'between') {
        totalCountParams.func = citem.totalCountParams.func
        totalCountParams.params.push({ value: '', title: '' })
      }
      this.updateRulesArr(data, citem, {totalCountParams: totalCountParams})
    },
    updateChildrenOperateChange (data, citem, index) { //  三级数据：判断操作符是否为null之类的，若为，则将后面数据清空
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
      this.updateChildrenRulesArr(data, citem, { params: params, subSelects: subSelects, subFunc: subFunc, subTimeSelects: subTimeSelects, dateDimension: dateDimension }, index)
    },
    updateChildrenRulesArr (data, citem, obj, index) { // 强制更新三级数组
      Object.keys(obj).forEach(oitem => {
        citem[oitem] = obj[oitem]
      })
      data.childrenRules && data.childrenRules.splice(index, 1, citem)
    },
    updateDateTimeChange (data, citem, index) {
      // 处理一下三级数据：绝对时间内容，时间插件v-show后与其他输入框不能共用一个参数
      let newArr = []
      if (!citem.params[0].datetime) {
        newArr = [
          {
            value: '',
            title: '',
            datetime: ''
          }
        ]
      } else {
        newArr = [
          {
            value: citem.params[0].datetime,
            title: '',
            datetime: citem.params[0].datetime
          }
        ]
      }
      this.updateChildrenRulesArr(data, citem, { params: newArr }, index)
    },
    addChildreRules (data, citem) {
      // 添加子集
      let indexPath = findRuleIndex(data.rules, citem) + ''
      let indexPathArr = indexPath.split(',')
      if (indexPathArr.length === 1) {
        let newObj = {
          relation: 'and',
          type: 'rules_function',
          ruleCode: citem.ruleCode,
          rules: [data.rules[indexPathArr[0]], this.getRuleTemplateItem()]
        }
        data.rules.splice(indexPathArr[0], 1, newObj)
      } else {
        data.rules[indexPathArr[0]].rules.push(this.getRuleTemplateItem())
      }
      this.updateConditionId(this.actionRuleConfig)
    },
    addThirdChildrenRules (data, citem) {
      //  添加三级子条件
      let indexPath = findRuleIndex(data.rules, citem) + ''
      let indexPathArr = indexPath.split(',')
      if (indexPathArr.length === 1) {
        data.rules[indexPathArr[0]].childrenRules.push(
          this.getThirdRuleTemplateItem(data.rules[indexPathArr[0]])
        )
      } else {
        data.rules[indexPathArr[0]].rules[indexPathArr[1]].childrenRules.push(
          this.getThirdRuleTemplateItem(data.rules[indexPathArr[0]].rules[indexPathArr[1]])
        )
      }
    },
    deleteRules (data, citem) {
      // 删除规则
      let indexPath = findRuleIndex(data.rules, citem) + ''
      let indexPathArr = indexPath.split(',')
      if (indexPathArr.length === 1) {
        data.rules.splice(indexPathArr[0], 1)
      } else {
        data.rules[indexPathArr[0]].rules.splice(indexPathArr[1], 1)
        if (data.rules[indexPathArr[0]].rules.length === 1) {
          // 若二级内容只有一个时，提至一级位置
          let oldObj = data.rules[indexPathArr[0]].rules[0]
          data.rules.splice(indexPathArr[0], 1, oldObj)
        }
      }
      this.updateConditionId(this.actionRuleConfig)
    },
    deleteChildrenRules (data, rules, citem, cindex) {  //  删除三级数据
      let indexPath = findRuleIndex(data.rules, rules) + ''
      let indexPathArr = indexPath.split(',')
      if (indexPathArr.length === 1) {
        data.rules[indexPathArr[0]].childrenRules.splice(cindex, 1)
      } else {
        data.rules[indexPathArr[0]].rules[indexPathArr[1]].childrenRules.splice(
          cindex,
          1
        )
      }
    },
    switchSymbol (ruleCode, data) {
      // 切换且或
      if (data.ruleCode === ruleCode) {
        data.relation = this.actionRuleConfig.relation === 'and' ? 'or' : 'and'
      } else {
        data.rules.forEach((item, index) => {
          if (item.relation && item.ruleCode === ruleCode) {
            data.rules[index].relation =
              data.rules[index].relation === 'and' ? 'or' : 'and'
          }
        })
      }
      this.updateConditionId(this.actionRuleConfig, undefined, 'switch')
    },
    addRules () {
      // 添加一级条件
      this.actionRuleConfig.rules.push(this.getRuleTemplateItem())
      this.updateConditionId(this.actionRuleConfig)
    },
    getRuleForm () {
      // 获取所有的$refs.ruleForm,用于统一校验数据
      let ruleSet = this.$refs.actionRulesSet
      let ruleArr = []
      if (ruleSet) {
        ruleArr = ruleSet.$refs.ruleForm || [] // 如果只有一个两极的内容，则默认会为空
      }
      function _find (data) { // 为了获取第三层数据
        if (data && data.$children) {
          data.$children.forEach(item => {
            if (item.$refs.ruleForm) {
              ruleArr = [...ruleArr, ...item.$refs.ruleForm]
            }
            _find(item)
          })
        }
      }
      _find(ruleSet)
      return ruleArr
    },
    updateRulesConfig (arr) {
      // 提交数据时，删除配置数据中多余的内容selectOperateList,selectEnumsList,eventIndexList
      this.isSelectedUneffectIndex = []
      arr.rules.forEach(item => {
        if (item.type != 'rules_function') {
          delete item.eventDownList
          delete item.eventIndexList
          item.totalCountParams.selectOperateList = this.countSelectOperateList.filter(
            sitem => sitem.code === item.totalCountParams.func
          )
          if (item.childrenRules) {
            item.childrenRules.forEach(citem => {
              citem.selectOperateList = citem.selectOperateList.filter(
              sitem => sitem.code === citem.func
            )
              citem.eventIndexList = citem.eventIndexList.filter(sitem => sitem.englishName === citem.englishName)
              let selectEnumsArr = []
              citem.selectEnumsList.forEach(sitem => {
                citem.params.forEach(pitem => {
                  if (sitem.childrenNum === pitem.value) {
                    selectEnumsArr.push(sitem)
                  }
                })
              })
              citem.selectEnumsList = selectEnumsArr
              if (citem.chineseName && !citem.enable) {
                this.isSelectedUneffectIndex.push(citem.chineseName)
              }
            })
          }
        } else {
          this.updateRulesConfig(item)
        }
      })
      arr = this.changeChildrenRules(arr)
      return arr
    },
    // 将第三层数据的childrenRules修改为rules
    changeChildrenRules (data) {
      data.rules.forEach(item => {
        if (item.type != 'rules_function') {
          if (item.childrenRules != undefined) {
            item.rules = deepClone(item.childrenRules)
            delete item.childrenRules
          }
        } else {
          this.changeChildrenRules(item)
        }
      })
      return data
    },
    uneffectIndexValidate () { // 无效指标提示
      this.lastSubmitRuleConfig = { // 过滤数据
        actionRuleConfig: this.actionRuleConfig.rules.length > 0 ? this.updateRulesConfig(deepClone(this.actionRuleConfig)) : {},
        actionExpression: this.actionExpression,
        actionExpressionTemplate: this.actionExpressionTemplate
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
<style>
.action-rule-pane {
  margin-left: 15px;
  margin-top: 20px;
  border: 1px dashed #ccc;
  padding: 10px;
}
.action-rule-pane .el-form-item__label {
  padding-right: 0;
  width: 100px;
}
</style>
