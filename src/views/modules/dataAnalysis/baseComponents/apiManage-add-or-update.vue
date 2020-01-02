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
    <div class="wrap">
      <div class="base-pane">
        <h3>基本信息</h3>
        <el-form label-width="80px" :model="baseForm" ref="baseForm" :rules="baseRule" class="base-form">
          <el-form-item label="API名称" prop="name">
            <el-input v-model="baseForm.name" placeholder="API名称" clearable  class="base-pane-item" />
          </el-form-item>
          <el-form-item label="API入参" prop="inParam">
            <el-radio v-model="baseForm.inParam" :label="fitem.value" v-for="(fitem, findex) in inParamsList" :key="findex">{{fitem.title}}</el-radio>
          </el-form-item>
          <el-form-item label="API出参" prop="outParams" style="height: 40px;">
            <Treeselect
              :options="outParamsIndexList"
              :disable-branch-nodes="true"
              :show-count="true"
              :multiple="true"
              :load-options="loadOptions"
              noChildrenText="暂无数据"
              v-model="baseForm.outParams"
              :clearable="false"
              search-nested
              placeholder="请选择"
              class="base-pane-item"
              @select="outParamsSelect"
              @deselect="outParamsDeselect"
            />
          </el-form-item>
          <el-form-item label="API描述">
            <el-input type="textarea"  class="base-pane-item" v-model="baseForm.desc" placeholder="最多输入100个字符" maxlength="100" :autosize="{ minRows: 3, maxRows: 5}" />
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
      <el-button type="primary" @click="saveHandle" size="small" v-if="tag !== 'view'">保存</el-button>
      <el-button type="default" @click="cancelHandle" size="small">取消</el-button>
    </div>
  </el-drawer>
</template>
<script>
import rulesSet from './apiManage-rules-set'
import { selectOperate, selectAllCata, enumTypeList, savaApiInfo, updateApiInfo, viewApiInfo } from '@/api/dataAnalysis/apiManage'
import { findRuleIndex, getAbc, findVueSelectItemIndex, deepClone, nullandnumber } from '../dataAnalysisUtils/utils'
import Treeselect, { LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  data () {
    return {
      inParamsList: [
        {
          title: '账户编号',
          value: 'account_no'
        },
        {
          title: '客户编号',
          value: 'cust_no'
        },
        {
          title: '身份证号',
          value: 'cert_id'
        },
        {
          title: '手机号',
          value: 'mobile_no'
        }
      ],
      id: '',
      tag: '',
      drawerTitle: '',
      isRequired: false,
      indexList: [],
      outParamsIndexList: [],
      expression: '',
      initFieldType: '',
      initDataStandar: '',
      initFieldCode: '',
      initSourceTable: '',
      initFieldId: '',
      initEnumTypeNum: '',
      initSelectOperateList: [],
      isTreeRoot: true, // 父根节点
      visible: false,
      baseForm: {
        name: '',
        inParam: '',
        desc: '',
        outParams: []
      },
      outParams: [],
      baseRule: { // 基本信息校验规则
        name: [
          { required: true, validator: nullandnumber, trigger: 'blur' }
        ],
        inParam: [
          { required: true, message: '请选择API入参', trigger: 'change' }
        ],
        outParams: [
          { required: true, message: '请选择API出参', trigger: 'change' }
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
  mounted () {

  },
  components: { rulesSet, Treeselect },
  methods: {
    init (row, tag) {
      this.id = ''
      this.tag = ''
      this.outParams = []
      this.outParamsIndexList = []
      this.visible = true
      this.isRequired = false // 默认为false,不设置的话，保存后再进入会变
      this.tag = tag
      if (!tag) {
        this.drawerTitle = '新增'
        this.getSelectAllCata((indexList) => {
          this.outParamsIndexList = deepClone(indexList)
        })
        this.initEmptyData()
      } else {
        this.id = row.id
        this.drawerTitle = tag === 'view' ? '查看' : '编辑'
        this.getApiInfo(row.id)
      }
    },
    initEmptyData () { // 当数据异常时，初始化数据
      this.baseForm = {
        name: '',
        inParam: '',
        desc: '',
        outParams: []
      }
      this.ruleConfig = { // 规则数据
        'ruleCode': 'rule_all',
        'type': 'rules_function',
        'relation': 'and',
        'rules': []
      }
      this.expression = ''
    },
    getApiInfo (id) { // 查看及编辑时请求数据
      viewApiInfo(id).then(({data}) => {
        if (data.status !== '1') {
          this.initEmptyData()
          return this.$message({
            message: data.message,
            type: 'error'
          })
        } else {
          if (!data.data.configJson) {
            this.initEmptyData()
            return this.$message({
              message: '数据异常',
              type: 'error'
            })
          }
          let configJson = JSON.parse(data.data.configJson)
          this.baseForm = {
            name: configJson.name,
            inParam: configJson.inParam,
            desc: configJson.desc
          }
          this.outParams = configJson.outParams
          let out = []
          configJson.outParams.forEach(item => {
            out.push(item.value)
          })
          this.baseForm.outParams = out
          this.ruleConfig = configJson.ruleConfig
          this.expression = configJson.expression
          this.getSelectAllCata((indexList) => {
            this.ruleConfig = this.updateInitRulesConfig(this.ruleConfig, indexList)
            this.outParamsIndexList = this.updateOutParamsList(indexList)
          })
        }
      })
    },
    updateOutParamsList (indexList) { // 获取出参默认展开列表
      let indexListArr = deepClone(indexList)
      this.baseForm.outParams.forEach(item => {
        let indexPath = findVueSelectItemIndex(indexListArr, item) + ''
        let indexPathArr = indexPath.split(',')
        let a = indexListArr
        indexPathArr.forEach((pitem, index) => {
          if (index < indexPathArr.length - 1) {
            a[pitem].isDefaultExpanded = true
            a = indexListArr[pitem].children
          }
        })
      })
      return indexListArr
    },
    updateInitRulesConfig (arr, indexList) {  // 获取指标默认展开列表
      arr.rules.forEach(item => {
        if (!item.rules) {
          let indexListArr = deepClone(indexList)
          let indexPath = findVueSelectItemIndex(indexListArr, item.fieldCode) + ''
          let indexPathArr = indexPath.split(',')
          let a = indexListArr
          indexPathArr.forEach((item, index) => {
            if (index < indexPathArr.length - 1) {
              a[item].isDefaultExpanded = true
              a = indexListArr[item].children
            }
          })
          item.indexList = indexListArr
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
        tree.forEach(item => {
          let obj = {}
          if (item.fieldType) {
            obj.id = item.englishName
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
          } else {
            if (!item.fieldType) {
              obj.children = null
            }
          }
          arr.push(obj)
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
      function _find (arr, position) {
        var temp = ''
        var exp = []
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
              if (index === arr.rules.length - 1) {
                let str = `(${[...new Set(exp)].join(' ' + arr.relation + ' ')})`
                expArr.push(str)
                expStr = expArr.join(' ' + arr.relation + ' ')
              }
            } else {
              expArr.push(item.ruleCode)
              expStr = expArr.join(' ' + arr.relation + ' ')
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
      // let subSelectList = []
      // if (citem.func === 'relative_time') {
      //   subSelectList = citem.selectOperateList.filter(item => item.code === citem.func)[0].subSelects
      // }
      // this.updateRulesArr(data, citem, { subSelectList: subSelectList, params: params })
      this.updateRulesArr(data, citem, { params: params })
    },
    updateEnumsChange (data, citem) { // 多选数据变化时, 重组params
      let newArr = []
      citem.params[0].selectVal.forEach(item => {
        newArr.push({
          value: item,
          title: ''
        })
      })
      newArr.splice(0, 1, { ...newArr[0], selectVal: citem.params[0].selectVal })
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
      ruleArr = ruleSet.$refs.ruleForm
      ruleSet.$children.forEach(item => {
        if (item.$refs.ruleForm) {
          ruleArr = [...ruleArr, ...item.$refs.ruleForm]
        }
      })
      return ruleArr
    },
    outParamsSelect (node) { // 选中出参
      this.outParams.push({
        title: node.label,
        value: node.id,
        id: node.fieldId
      })
    },
    outParamsDeselect (node) { // 删除出参
      this.outParams = this.outParams.filter(item => item.value !== node.id)
    },
    drawerClose () { // 关闭抽屉弹窗
      this.visible = false
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
        ruleFormArr.forEach(item => {
          item.validate((valid) => {
            if (!valid) {
              flag = false
            }
          })
        })
        this.$refs.baseForm.validate((valid) => {
          if (!valid) {
            flag = false
          }
        })
        if (!flag) {
          this.isRequired = false
        } else { // 全部校验通过后，可保存数据
          this.ruleConfig = this.updateRulesConfig(this.ruleConfig) // 过滤数据
          let params = { ...this.baseForm, outParams: Array.from(new Set(this.outParams)), expression: this.expression, ruleConfig: this.ruleConfig }
          let url = savaApiInfo
          if (this.id) {
            url = updateApiInfo
            params.id = this.id
          }
          url(params).then(({data}) => {
            if (data.status !== '1') {
              return this.$message({
                message: data.message
              })
            } else {
              this.$message({
                message: data.message
              })
              this.visible = false
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
</style>
