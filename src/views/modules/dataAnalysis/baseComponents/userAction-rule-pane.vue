<template>
  <div class="action-rule-pane">
    <el-form :inline="true" label-position="left">
      <el-form-item label="用户行为满足：">
        <el-tooltip placement="top">
          <!-- <div slot="content"  class="tips-content"></div> -->
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
  selectAllCata,
  // enumTypeList,
  dataIndexManagerCandidate
} from '@/api/dataAnalysis/dataInsightManage'
import {
  findRuleIndex,
  getAbc,
  findVueSelectItemIndex,
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
      indexList: [],
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
  methods: {
    init () {
      this.getSelectAllCata()
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
    getSelectAllCata (fn) {
      // 获取所有指标
      selectAllCata({
        channelCode: this.channelId,
        flag: this.id ? '-1' : '1'
      }).then(({ data }) => {
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
    channelIdChangeUpdate () { // 用户所属渠道改变时，清空数据，初始化
      this.getSelectAllCata(indexList => {
        if (indexList.length === 0) {
          this.setInitRulesConfig(this.indexList)
        } else {
          this.actionRuleConfig = this.updateInitRulesConfig(
            this.actionRuleConfig,
            indexList
          )
          this.setInitRulesConfig(this.indexList)
        }
      })
    },
    filterAllCata (tree) {
      // 清洗数据，按selectVue的格式重新组织指标数据
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
          if (this.filterAllCata(item.dataCata).length) {
            // 指标层 ，无children
            obj.children = this.filterAllCata(item.dataCata) // 指标集合
            arr.push(obj)
          } else if (this.filterAllCata(item.dataIndex).length) {
            obj.children = this.filterAllCata(item.dataIndex) // 指标集合
            arr.push(obj)
          } else {
            // 指标父级层
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
    setInitRulesConfig (indexList) {
      // 将规则初始化
      this.indexList = indexList
      if (this.actionRuleConfig.rules.length) {
        this.actionRuleConfig.rules = []
        this.actionRuleConfig.rules.push(this.getRuleTemplateItem())
      }
      this.updateConditionId(this.actionRuleConfig)
    },
    updateInitRulesConfig (arr, indexList) {
      // 获取指标默认展开列表
      arr.rules.forEach(item => {
        if (item.childrenRules) { // 目前只针对第三层数据进行了处理，第二层数据根据具体字段进行处理
          item.childrenRules.forEach(citem => {
            let indexListArr = deepClone(indexList)
            let indexPath = findVueSelectItemIndex(indexListArr, citem.fieldCode) + ''
            let indexPathArr = indexPath.split(',')
            let a = indexListArr
            if (indexPath) {
              indexPathArr.forEach((fitem, findex) => {
                if (findex < indexPathArr.length - 1) {
                  a[fitem].isDefaultExpanded = true
                  a = a[fitem].children
                } else {
                  citem.enable = a[fitem].enable
                }
              })
              citem.indexList = indexListArr // 给每一行规则都加上一个指标列表，同时展示选中项
              if (
                citem.func === 'relative_within' ||
                citem.func === 'relative_before'
              ) {
              // 兼容老数据
                citem.subFunc = citem.func
                citem.func = 'relative_time'
                citem.subTimeSelects = this.subTimeSelects
                if (!citem.dateDimension) {
                  citem.dateDimension = 'DAYS'
                }
                this.getSelectOperateList(citem.fieldType, selectOperateList => {
                  citem.selectOperateList = selectOperateList
                  citem.subSelects = citem.selectOperateList.filter(
                    sitem => sitem.code === citem.func
                  )[0].subSelects
                })
              }
              if (
                citem.func === 'relative_time_in' ||
                citem.func === 'relative_time'
              ) {
                citem.subTimeSelects = this.subTimeSelects
                if (!citem.dateDimension) {
                  citem.dateDimension = 'DAYS'
                }
              }
            // 兼容老数据,可多输入时，为数据类型，旧数据为字符串类型，需改为数组类型，否则回显出错
              if (
                (citem.fieldType === 'string' || citem.fieldType === 'number') &&
                (citem.func === 'eq' || citem.func === 'neq')
              ) {
                if (!citem.params[0].selectVal) {
                  citem.params[0].selectVal = [citem.params[0].value]
                }
              }
            }
          })
        }
      })
      return arr
    },
    renderData (data, channelId) {
      this.channelId = channelId
      let configJson = JSON.parse(data)
      this.actionRuleConfig = configJson.actionRuleConfig
      this.actionExpression = configJson.actionExpression
      this.actionExpressionTemplate = configJson.actionExpressionTemplate
      this.getSelectAllCata((indexList) => {
        this.actionRuleConfig = this.updateInitRulesConfig(this.actionRuleConfig, indexList)
        this.$nextTick(() => {
          this.$emit('renderEnd')
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
      this.actionRuleConfig = data.actionRuleConfig
      this.actionExpression = data.actionExpression
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
          let res = data
          dataIndexManagerCandidate({ // 字符串提示输入示例
            sourceTable: obj.sourceTable,
            fieldName: obj.englishName,
            count: 10
          }).then(({data}) => {
            if (data.status * 1 === 1 && data.data.length) {
              params.strTips = data.data
            }
            this.updateChildrenRulesArr(res, citem, params, index)
          })
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
        type: 'rule',
        func: '', //  选择的时间类型
        subFunc: '',
        dateDimension: '',
        havedo: '', //  是否做过
        eventType: '', // 事件类型
        funcType: '', //  总次数比较类型
        sumtimes: '', //  总次数
        childrenRules: [], // 第三层数组
        params: [
          {
            value: '',
            title: ''
          }
        ]
      }
    },
    getThirdRuleTemplateItem () {
      // 三级条件模板
      return {
        type: 'children_rule',
        fieldType: '',
        fieldCode: null,
        format: '',
        func: '',
        sourceTable: '',
        fieldId: '',
        englishName: '',
        indexList: this.indexList, // 指标下拉选
        enumTypeNum: '',
        selectOperateList: [], // 操作符下拉选
        selectEnumsList: [], // 内容下拉选
        subFunc: '',
        dateDimension: '',
        strTips: [],
        params: [
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
    updateOperateChange (data, citem) { // 时间区间改变时，更新数据
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
          this.getThirdRuleTemplateItem()
        )
      } else {
        data.rules[indexPathArr[0]].rules[indexPathArr[1]].childrenRules.push(
          this.getThirdRuleTemplateItem()
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
    deleteChildrenRules (data, childrenRules, citem, cindex) {  //  删除三级数据
      let indexPath = findRuleIndex(data.rules, childrenRules) + ''
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
    getSelectOperateList (type, fn) {
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
      // 提交数据时，删除配置数据中多余的内容selectOperateList,selectEnumsList
      this.isSelectedUneffectIndex = []
      arr.rules.forEach(item => {
        if (item.childrenRules) {
          item.childrenRules.forEach(citem => {
            citem.selectOperateList = citem.selectOperateList.filter(
            sitem => sitem.code === citem.func
          )
            let selectEnumsArr = []
            citem.selectEnumsList.forEach(sitem => {
              citem.params.forEach(pitem => {
                if (sitem.childrenNum === pitem.value) {
                  selectEnumsArr.push(sitem)
                }
              })
            })
            citem.selectEnumsList = selectEnumsArr
            citem.indexList = []
            if (citem.label && !citem.enable) {
              this.isSelectedUneffectIndex.push(citem.label)
            }
          })
        }
        // if (!item.rules) {
        //   item.selectOperateList = item.selectOperateList.filter(
        //     sitem => sitem.code === item.func
        //   )
        //   let selectEnumsArr = []
        //   item.selectEnumsList.forEach(sitem => {
        //     item.params.forEach(pitem => {
        //       if (sitem.childrenNum === pitem.value) {
        //         selectEnumsArr.push(sitem)
        //       }
        //     })
        //   })
        //   item.selectEnumsList = selectEnumsArr
        //   item.indexList = []
        //   if (item.label && !item.enable) {
        //     this.isSelectedUneffectIndex.push(item.label)
        //   }
        // } else {
        //   if (item.rules) {
        //     this.updateRulesConfig(item)
        //   }
        // }
      })
      return arr
    },
    ruleValidate () {
      if (!this.actionRuleConfig.rules.length) {
        return this.$message({
          message: '请配置用户行为规则信息',
          type: 'error',
          center: true
        })
      }
    },
    uneffectIndexValidate () { // 无效指标提示
      this.lastSubmitRuleConfig = { // 过滤数据
        actionRuleConfig: this.updateRulesConfig(deepClone(this.actionRuleConfig)),
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
  margin-left: 15px
}
.action-rule-pane .el-form-item__label {
  padding-right: 0;
  width: 100px;
}
</style>
