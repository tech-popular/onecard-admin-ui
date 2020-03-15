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
        <el-form label-width="90px" :model="baseForm" ref="baseForm" :rules="baseRule" class="base-form">
          <el-form-item label="API名称" prop="name">
            <el-input v-model.trim="baseForm.name" placeholder="API名称" clearable class="base-pane-item" />
          </el-form-item>
          <el-form-item label="接口编码" prop="department" class="item-inline">
            <el-select v-model="baseForm.department" placeholder="请选择一级事业群" :disabled="!!id">
              <el-option v-for="(item, index) in departmentList" :key="index" :label="item.childrenValue" :value="item.childrenNum"></el-option>
            </el-select>
          </el-form-item>
          &nbsp; _
          <el-form-item prop="apiName" class="item-inline item-code">
            <el-input v-model.trim="baseForm.apiName" placeholder="输入字母和数字的组合" clearable class="item-code-name" :disabled="!!id" />
          </el-form-item>
          <el-form-item label="您创建的接口编码是：" label-width="166px">
            {{code}}
            <el-button type="primary" @click="copyCode" size="small" class="copy-code" v-if="isCopyBtn">复制编码</el-button>
          </el-form-item>
          <el-form-item label="API入参" prop="inParam">
            <el-radio v-model="baseForm.inParam" :label="fitem.value" v-for="(fitem, findex) in inParamsList" :key="findex" @change="inParamChange">{{fitem.title}}</el-radio>
            <!-- <el-checkbox-group v-model="baseForm.inParam">
              <el-checkbox :label="fitem.value" v-for="(fitem, findex) in inParamsList" :key="findex">{{fitem.title}}</el-checkbox>
            </el-checkbox-group> -->
          </el-form-item>
          <el-form-item label="API模式" prop="outType">
            <el-radio-group v-model="baseForm.outType" @change="outTypeChange">
              <el-radio label="JUDGE">判断模式（返回值为是/否在此分群）</el-radio>
              <el-radio label="INDICATOR">选择模式（返回值为所选指标）</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="API出参" prop="outParams" v-if="baseForm.outType==='INDICATOR'">
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
            <el-input type="textarea" class="base-pane-item" v-model="baseForm.desc" placeholder="最多输入100个字符" maxlength="100" :autosize="{ minRows: 3, maxRows: 5}" />
            <p class="data-description-tips">最多输入100个字符，您还可以输入<span v-text="100 - baseForm.desc.length"></span>个字符</p>
          </el-form-item>
          <el-form-item label="分群名称" prop="templateIds">
            <el-select v-model="baseForm.templateIds" @change="custerNamesChange" filterable multiple placeholder="请选择分群名称" class="base-pane-item">
              <el-option
                v-for="item in newCusterNameList"
                :key="item.value"
                :label="item.text"
                :disabled="item.disabled"
                :value="item.value">
              </el-option>
            </el-select>
            <el-button type="primary" @click="previewCusterInfo" size="small">预览</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div v-loading="custerLoading">
        <div class="pane-rules" v-if="custerInfoList.length">
          <h3 class="pane-preview-title">分群预览</h3>
          <div class="pane-rules-item" v-for="(item, index) in custerInfoList" :key="index">
            <h3>{{item.name}}</h3>
            <div v-if="item.ruleConfig">
              <h3>满足如下条件的用户</h3>
              <el-form :inline="true">
                <el-form-item label="用户属性与用户交易满足：" >
                  <el-input v-model="item.expression" disabled style="width: 800px" />
                </el-form-item>
                <el-form-item style="float:right" v-if="false">
                  <i class="el-icon-circle-plus cursor-pointer" @click="addRules">添加</i>
                </el-form-item>
              </el-form>
              <div v-if="item.ruleConfig.rules && item.ruleConfig.rules.length > 0">
                <rules-set :data="item.ruleConfig" ref="rulesSet" :is-require="isRequired" :from="'api'"></rules-set>
              </div>
            </div>
            <div v-else>
              <p>{{item.tips}}</p>
            </div>
          </div>
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
import { selectOperate, selectAllCata, enumTypeList, savaApiInfo, updateApiInfo, viewApiInfo, getOutParams } from '@/api/dataAnalysis/apiManage'
import { viewDataInfo } from '@/api/dataAnalysis/dataInsightManage'
import { dataTransferManageCuster } from '@/api/dataAnalysis/dataTransferManage'
import { findRuleIndex, getAbc, findVueSelectItemIndex, deepClone } from '../dataAnalysisUtils/utils'
import Treeselect, { LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  data () {
    let validateApiName = (rule, value, callback) => {
      const reg = /^[0-9a-zA-Z]*$/ // 只允许输入字母和数字  /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]*$/ //只允许输入字母和数字的组合
      if (!value) {
        callback(new Error('请输入字母和数字的组合'))
      } else if (!reg.test(value)) {
        callback(new Error('请输入字母和数字的组合'))
      } else {
        callback()
      }
    }
    let validateApiOutParams = (rule, value, callback) => {
      if (!this.baseForm.outParams.length) {
        callback(new Error('请选择API出参'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      inParamsList: [
        {
          title: '账户编号（account_no）',
          value: 'account_no'
        },
        {
          title: '客户编号（cust_no）',
          value: 'cust_no'
        },
        {
          title: '身份证号（cert_id）',
          value: 'cert_id'
        },
        {
          title: '手机号（mobile_no）',
          value: 'mobile_no'
        },
        // {
        //   title: '用户中心统一编号（UUID）',
        //   value: 'UUID'
        // },
        {
          title: '新商城用户ID（mall_user_id）',
          value: 'mall_user_id'
        }
      ],
      id: '',
      flowId: '',
      tag: '',
      drawerTitle: '',
      isRequired: false,
      custerNameList: [],
      indexList: [],
      outParamsIndexList: [],
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
        inParam: '',
        desc: '',
        outType: 'JUDGE',
        outParams: [],
        department: '',
        apiName: '',
        templateIds: [],
        type: ''
      },
      departmentList: [],
      originDepartment: '', // 编辑时保留一份原始数据，以防不正当修改编码
      originApiName: '',
      outParams: [],
      baseRule: { // 基本信息校验规则
        name: [
          { required: true, message: '请输入API名称', trigger: 'blur' }
        ],
        inParam: [
          { required: true, message: '请选择API入参', trigger: 'change' }
        ],
        outType: [
          { required: true, message: '请选择API模式', trigger: 'change' }
        ],
        outParams: [
          { required: true, validator: validateApiOutParams, trigger: 'input' }
        ],
        department: [
          { required: true, message: '请选择一级事业群', trigger: 'change' }
        ],
        apiName: [
          { validator: validateApiName, trigger: 'blur' }
        ],
        templateIds: [
          { required: true, message: '请选择分群名称', trigger: 'change' }
        ]
      },
      ruleConfig: { // 规则数据
        'ruleCode': 'rule_all',
        'type': 'rules_function',
        'relation': 'and',
        'rules': []
      },
      custerInfoList: [],
      curCusterInfo: {},
      custerLoading: false,
      filterCursterList: [] // 选择一个分群后，过滤分群列表的数据，根据type加是否可选操作
    }
  },
  components: { rulesSet, Treeselect },
  computed: {
    code () {
      let department = this.baseForm.department || ''
      let apiName = this.baseForm.apiName || ''
      if (!department && !apiName) {
        return ''
      }
      return department + '_' + apiName
    },
    isCopyBtn () {
      if (this.baseForm.department && this.baseForm.apiName) {
        return true
      }
      return false
    },
    newCusterNameList () {
      if (!this.filterCursterList.length) {
        return this.custerNameList
      }
      return this.filterCursterList
    }
  },
  methods: {
    copyCode () { // 复制编码事件
      this.$copyText(this.code).then(e => {
        this.$message({
          type: 'success',
          message: '复制成功'
        })
      }, e => {
        this.$message({
          type: 'error',
          message: '复制失败，请再试一次'
        })
      })
    },
    getDepartmentList () { // 获取事业部下拉数据
      enumTypeList(17).then(res => {
        if (res.data.status !== '1') {
          this.departmentList = []
        } else {
          this.departmentList = res.data.data
        }
      })
    },
    // 获取分群名称
    getCusterList () {
      dataTransferManageCuster().then(({data}) => {
        if (data.status !== '1') {
          this.custerNameList = []
          return this.$message({
            type: 'error',
            message: data.message
          })
        }
        this.custerNameList = data.data.filter(item => item.type === 'dynamic') // 修改，只展示动态的分群
      })
    },
    custerNamesChange (value) { // 选中数据变化时
      if (value.length === 0) {
        this.filterCursterList = []
      }
      // 当选中数据为1时，更新下拉数据状态
      let filterFirstObj = []
      if (value.length === 1) {
        filterFirstObj = this.custerNameList.filter(item => item.value === value[0]) // 筛选出第一条数据，要获取第一条数据的type
        this.baseForm.type = filterFirstObj[0].type
        let newArr = this.custerNameList.map(item => {
          if (item.type !== filterFirstObj[0].type) { // 只可选与第一条数据type相同的数据，其他的置灰
            return {...item, disabled: true}
          }
          return item
        })
        this.filterCursterList = newArr
      }
    },
    previewCusterInfo () {
      if (!this.baseForm.templateIds.length) return
      this.custerLoading = true
      this.custerInfoList = []
      this.baseForm.templateIds.forEach((item, index) => {
        this.getCusterInfo(item, (curCusterInfo) => {
          this.custerInfoList[index] = curCusterInfo // 获取与templateIds顺序对应的数据，这步不会更新视图
          let newArr = this.custerInfoList.filter(item => item.id)
          if (newArr.length === this.baseForm.templateIds.length) { // 如果数据已经全部获取完
            this.custerInfoList.splice(0, 1, this.custerInfoList[0]) // 利用这个更新视图
            this.$nextTick(() => {
              this.custerLoading = false
            })
          }
        })
      })
    },
    init (row, tag) {
      this.id = ''
      this.tag = ''
      this.flowId = ''
      this.outParams = []
      this.outParamsIndexList = []
      this.expression = ''
      this.expressionTemplate = ''
      this.loading = true
      this.visible = true
      this.isRequired = false // 默认为false,不设置的话，保存后再进入会变
      this.getDepartmentList()
      this.getCusterList()
      this.$nextTick(() => { // 默认将基本信息的错误提示消除
        this.$refs.baseForm.clearValidate()
      })
      this.tag = tag
      if (!tag) {
        this.loading = false
        this.drawerTitle = '新增'
        this.getSelectAllCata((indexList) => {
          this.outParamsIndexList = deepClone(indexList)
        })
        this.initEmptyData()
      } else {
        this.id = row.id
        this.drawerTitle = tag === 'view' ? '查看' : '编辑'
        this.getOutParam(row.id)
      }
    },
    initEmptyData () { // 当数据异常时，初始化数据
      this.baseForm = {
        name: '',
        inParam: '',
        desc: '',
        outParams: [],
        outType: 'JUDGE',
        department: '',
        apiName: '',
        templateIds: []
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
    getCusterInfo (id, fn) { // 获取分群数据
      viewDataInfo(id).then(({data}) => {
        if (data.status * 1 !== 1) {
          this.curCusterInfo = {
            id: id,
            name: data.data.name,
            tips: data.message || '此分群预览信息加载异常'
          }
          fn(this.curCusterInfo)
          return
        }
        if (data.data.userType && data.data.userType === 'excel') {
          this.curCusterInfo = {
            id: id,
            name: data.data.name,
            tips: 'Excel导入分群无预览内容'
          }
          fn(this.curCusterInfo)
          return
        }
        if (!data.data.configJson) {
          this.curCusterInfo = {
            id: id,
            name: data.data.name,
            tips: '此分群预览信息加载异常'
          }
          fn(this.curCusterInfo)
          return
        }
        let configJson = JSON.parse(data.data.configJson)
        this.getSelectAllCata((indexList) => {
          let ruleConfig = this.updateInitRulesConfig(configJson.ruleConfig, indexList)
          this.curCusterInfo = {
            id: id,
            name: data.data.name,
            expression: configJson.expression,
            ruleConfig: ruleConfig
          }
          fn(this.curCusterInfo)
        })
      })
    },
    getApiInfo (id, outParams) { // 查看及编辑时请求数据
      viewApiInfo(id).then(({data}) => {
        if (data.status !== '1') {
          return this.$message({
            message: data.message,
            type: 'error'
          })
        } else {
          this.flowId = data.data.flowId
          this.baseForm = {
            name: data.data.name,
            inParam: data.data.inParam,
            // inParam: data.data.inParam.split(','),
            desc: data.data.desc,
            department: data.data.code.split('_')[0],
            apiName: data.data.code.split('_')[1],
            outType: data.data.outType,
            templateIds: data.data.templateIds,
            type: data.data.type
          }
          this.originDepartment = data.data.code.split('_')[0]
          this.originApiName = data.data.code.split('_')[1]
          // 出参
          this.outParams = outParams
          let out = []
          outParams.forEach(item => {
            out.push(item.onlyId)
          })
          this.baseForm.outParams = out
          // 分群包
          let filterFirstObj = this.custerNameList.filter(item => item.value === this.baseForm.templateIds[0]) // 筛选出第一条数据，要获取第一条数据的type
          if (filterFirstObj.length) {
            let newArr = this.custerNameList.map(item => {
              if (item.type !== filterFirstObj[0].type) { // 只可选与第一条数据type相同的数据，其他的置灰
                return { ...item, disabled: true }
              }
              return item
            })
            this.filterCursterList = newArr
          } else {
            this.filterCursterList = this.custerNameList
          }
          this.getSelectAllCata((indexList) => {
            // this.ruleConfig = this.updateInitRulesConfig(this.ruleConfig, indexList)
            this.outParamsIndexList = this.updateOutParamsList(indexList)
            this.$nextTick(() => {
              this.loading = false
            })
          })
        }
      })
    },
    getOutParam (id) { // 获取出参数据
      getOutParams(id).then(res => {
        if (res.data.status !== '1') {
          this.getApiInfo(id, [])
          return this.$message({
            type: 'error',
            message: res.data.message
          })
        }
        if (res.data.data && res.data.data.length) {
          let outParams = res.data.data
          this.getApiInfo(id, outParams)
        } else {
          this.getApiInfo(id, [])
        }
      })
    },
    inParamChange () { // 消除入参错误提示
      if (this.baseForm.inParam) {
        this.$refs.baseForm.clearValidate('inParam')
      }
    },
    outTypeChange (val) {
      if (val === 'JUDGE') {
        this.baseForm.outParams = []
        this.outParams = []
      }
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
            a = a[pitem].children
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
    outParamsSelect (node) { // 选中出参
      this.outParams.push({
        title: node.label,
        value: node.englishName, // node.id,
        onlyId: node.id,
        sourceTable: node.sourceTable,
        id: node.fieldId
      })
      if (this.outParams.length) {
        this.$refs.baseForm.clearValidate('outParams')
      }
    },
    outParamsDeselect (node) { // 删除出参
      this.outParams = this.outParams.filter(item => item.onlyId !== node.id)
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
    saveHandle () {
      let flag = true
      this.$refs.baseForm.validate((valid) => {
        if (!valid) {
          flag = false
        }
      })
      if (flag) {
        this.loading = true
        this.baseForm.code = this.code
        let params = { ...this.baseForm, outParams: Array.from(new Set(this.outParams)) }
        params.inParam = params.inParam
        // params.inParam = params.inParam.join(',')
        let url = savaApiInfo
        if (this.id) {
          url = updateApiInfo
          params.id = this.id
          params.flowId = this.flowId
          params.department = this.originDepartment
          params.apiName = this.originApiName
          params.code = this.originDepartment + '_' + this.originApiName
        }
        url(params).then(({data}) => {
          this.loading = false
          if (data.status !== '1') {
            return this.$message({
              type: 'error',
              message: data.message || '数据异常'
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
  .pane-preview-title {
    text-align: center;
    border-top: 1px dashed #ccc;
    padding-top: 20px;
  }
  .pane-rules-item {
    border-bottom: 1px dashed #ccc;
  }
  .pane-rules-item:last-child{
    border: 0
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
