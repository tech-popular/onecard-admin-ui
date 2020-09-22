<template>
  <el-dialog title="分流"
    :modal-append-to-body='false'
    :append-to-body="true"
    :visible.sync="visible"
    width="950px"
    :close-on-click-modal="false">
    <el-form :model="dataForm" ref="dataForm" :inline="true" v-loading="loading">
      <div>
        <el-form-item label="条件名称：" prop="name" :rules="{required: true, message: '请选择', trigger: 'blur'}">
          <el-input v-model="dataForm.name" placeholder="请输入条件名称" style="width:400px"></el-input>
        </el-form-item>
      </div>
      <el-form-item label="分流条件：" prop="fieldCode" ref="code" :rules="{required: isRequired, message: '请选择', trigger: 'change'}">
        <Treeselect
          :options="indexList"
          :disable-branch-nodes="true"
          :show-count="true"
          v-model="dataForm.fieldCode"
          :clearable="false"
          search-nested
          :load-options="loadOptions"
          noChildrenText="暂无数据"
          placeholder="请选择指标"
          @select="fieldCodeChange"
          class="tree-select"
      />
      </el-form-item>
      <el-form-item prop="func" :rules="{required: isRequired, message: '请选择', trigger: 'change'}">
        <el-select v-model="dataForm.func" class="itemOperateIput" @change="selectOperateChange">
          <el-option v-for="(fitem, findex) in selectOperateList" :value="fitem.code" :key="findex" :label="fitem.title" />
        </el-select>
      </el-form-item>
      <!--条件内容区-->
      <div v-if="isEmpty()" class="pane-rules-inline">
        <!--string-->
        <div v-if="dataForm.fieldType === 'string' || dataForm.fieldType === ''" class="pane-rules-inline">
          <!--string型等于或不等于可以输入多个-->
          <el-form-item prop="params[0].selectVal" ref="stringMultiVal" :rules="{ required: isRequired, message: '请输入', trigger: 'blur' }" v-if="dataForm.func === 'eq' || dataForm.func === 'neq'">
            <input-tag v-model="dataForm.params[0].selectVal" @change="inputTagChange('string')" :tag-tips="dataForm.strTips" :valueType="'string'" :add-tag-on-blur="true" :allow-duplicates="true" class="itemIput inputTag" placeholder="可用回车输入多条"></input-tag>
          </el-form-item>
          <el-form-item prop="params[0].value" :rules="{ required: isRequired, message: '请输入', trigger: 'blur' }" v-else>
            <el-input v-model.trim="dataForm.params[0].value" class="itemIput" placeholder="请输入" />
          </el-form-item>
        </div>
        <!--number-->
        <div v-if="dataForm.fieldType === 'number'"  class="pane-rules-inline">
          <div v-if="dataForm.func === 'between'"  class="pane-rules-inline">
            <el-form-item prop="params[0].value" ref="paramsl'" :rules="{ required: isRequired, validator: (value, callback) => judgeNumberTwoInput(value, callback, dataForm.params), trigger: 'blur' }">
              <!--输入时实时更新当前数据，失去焦点时也要处理，所有的number输入都一样，不能用el-input-number会出现大值转十六进制的情况-->
              <el-input v-model="dataForm.params[0].value" :maxlength="10" @input="dataForm.params[0].value = keyupNumberInput(dataForm.params[0].value)" @blur="dataForm.params[0].value = pramasNumBlur(dataForm, dataForm.params[0].value)"></el-input>
            </el-form-item>
            于
            <el-form-item prop="params[1].value" ref="paramsr" :rules="{required: isRequired, validator: (value, callback) => judgeNumberTwoInput(value, callback, dataForm.params), trigger: 'blur'}">
              <el-input v-model="dataForm.params[1].value" :maxlength="10" class="itemIput-number" @input="item.params[1].value = keyupNumberInput(dataForm.params[1].value)" @blur="dataForm.params[1].value = pramasNumBlur(dataForm.params[1].value)"></el-input> 之间
            </el-form-item>
          </div>
          <div v-else>
            <!--数值型等于或不等于可以输入多个-->
            <el-form-item prop="params[0].selectVal" ref="numberMultiVal" :rules="{required: isRequired, message: '请输入', trigger: 'blur'}" v-if="dataForm.func === 'eq' || dataForm.func === 'neq'">
              <input-tag v-model="dataForm.params[0].selectVal" @change="inputTagChange('number')" :valueType="'number'" :tag-tips="[]" :maxlength="10" :add-tag-on-blur="true" :allow-duplicates="true" class="itemIput inputTag" placeholder="可用回车输入多条"></input-tag>
            </el-form-item>
            <el-form-item prop="params[0].value" :rules="{required: isRequired, message: '请输入', trigger: 'blur'}" v-else>
              <el-input v-model="dataForm.params[0].value" :maxlength="10" @input="dataForm.params[0].value = keyupNumberInput(dataForm.params[0].value)" @blur="dataForm.params[0].value = blurNumberInput(dataForm.params[0].value)" class="itemIput"></el-input>
            </el-form-item>
          </div>
        </div>
        <!--enums-->
        <div v-if="dataForm.fieldType === 'enums'"  class="pane-rules-inline">
          <el-form-item prop="params[0].selectVal" :rules="{required: isRequired, message: '请选择', trigger: 'change'}">
            <el-select v-model="dataForm.params[0].selectVal" multiple class="itemIput" @change="selectEnumsChange" @visible-change="selectEnumsVisible">
              <el-option v-for="(fitem, findex) in selectEnumsList" :value="fitem.childrenNum" :key="findex" :label="fitem.childrenValue"/>
            </el-select>
          </el-form-item>
        </div>
        <!--时间-->
        <div v-if="dataForm.fieldType === 'date'" class="pane-rules-inline pane-rules-datetime">
          <!--绝对时间-->
          <el-form-item v-show="isDateSingleShow()" ref="datetime" prop="params[0].datetime" :rules="{required: isRequired && isDateSingleShow(), message: '请选择', trigger: 'change'}">
            <el-date-picker
              v-model="dataForm.params[0].datetime"
              type="datetime"
              placeholder="选择日期时间"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              @change="selectDateTimeChange"
              class="itemIput"
            >
            </el-date-picker>
          </el-form-item>
          <!--区间-->
          <el-form-item v-show="dataForm.func === 'between'" ref="datetimerange" prop="params[0].selectVal" :rules="{required: isRequired && dataForm.func === 'between', message: '请选择', trigger: 'change'}">
            <el-date-picker
              v-model="dataForm.params[0].selectVal"
              type="datetimerange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="['00:00:00']"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              @change="selectEnumsChange"
              class="itemIput-big"
            >
            </el-date-picker>
          </el-form-item>
          <!--相对当前时间点-->
          <div v-if="dataForm.func === 'relative_time'" class="pane-rules-inline">
            在&nbsp;过去&nbsp;
            <el-form-item prop="params[0].value" :rules="{required: isRequired, message: '请输入', trigger: 'blur'}">
              <el-input v-model="dataForm.params[0].value" :maxlength="10" @input="dataForm.params[0].value = keyupDateNumberInput(dataForm.params[0].value)" @blur="dataForm.params[0].value = blurDateNumberInput(dataForm.params[0].value)" class="itemIput-small"></el-input>
            </el-form-item>
            <el-form-item prop="dateDimension">
              <el-select v-model="dataForm.dateDimension" class="subSelect1" @change="updateDateDimension">
                <el-option v-for="(fitem, findex) in dataForm.subTimeSelects" :value="fitem.code" :key="findex" :label="fitem.title" />
              </el-select>
            </el-form-item>
            <el-form-item prop="subFunc">
              <el-select v-model="dataForm.subFunc" class="subSelect">
                <el-option v-for="(fitem, findex) in dataForm.subSelects" :value="fitem.code" :key="findex" :label="fitem.title" />
              </el-select>
            </el-form-item>
          </div>
          <!--相对时间点-->
          <div v-if="dataForm.func === 'relative_time_in'" class="pane-rules-inline">
            在&nbsp;过去&nbsp;
            <el-form-item prop="params[0].value" ref="paramsl" :rules="{ required: isRequired, validator: (rule, value, callback) => judgeDateTwoInput(rule, value, callback, dataForm.params), trigger: 'blur'}">
              <el-input v-model="dataForm.params[0].value" :maxlength="10" class="itemIput-small" @input="dataForm.params[0].value = keyupDateNumberInput(dataForm.params[0].value)" @blur="dataForm.params[0].value = pramasDateBlur(dataForm.params[0].value)" :min="1"></el-input>
            </el-form-item>
            <el-form-item prop="dateDimension">
              <el-select v-model="dataForm.dateDimension" class="subSelect1" @change="updateDateDimension">
                <el-option v-for="(fitem, findex) in dataForm.subTimeSelects" :value="fitem.code" :key="findex" :label="fitem.title" />
              </el-select>
            </el-form-item>
            到&nbsp;过去&nbsp;
            <el-form-item prop="params[1].value" ref="paramsr" :rules="{ required: isRequired,  validator: (rule, value, callback) => judgeDateTwoInput(rule, value, callback, dataForm.params), trigger: 'blur'}">
              <el-input v-model="dataForm.params[1].value" :maxlength="10" class="itemIput-small" @input="dataForm.params[1].value = keyupDateNumberInput(dataForm.params[1].value)" @blur="dataForm.params[1].value = pramasDateBlur(dataForm.params[1].value)" :min="1"></el-input>
            </el-form-item>
            <el-form-item prop="dateDimension">
              <el-select v-model="dataForm.dateDimension" class="subSelect1" @change="updateDateDimension">
                <el-option v-for="(fitem, findex) in dataForm.subTimeSelects" :value="fitem.code" :key="findex" :label="fitem.title" />
              </el-select>
            </el-form-item>
            之内
          </div>
        </div>
      </div>
      <el-form-item class="btn-group">
        <el-tooltip v-if="dataForm.func === 'relative_time_in' || dataForm.func === 'relative_time'" placement="top">
          <div slot="content" v-html="tipsHtmlCont()" class="tips-content"></div>
          <i class="el-icon-info cursor-pointer" style="color:#409eff"></i>
        </el-tooltip>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button type="primary" @click="saveHandle" size="small">确定</el-button>
      <el-button type="default" @click="cancelHandle" size="small">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import {
  selectOperate,
  selectAllCata,
  enumTypeList,
  dataIndexManagerCandidate
} from '@/api/dataAnalysis/dataDecisionManage'
import Treeselect, { LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect'
import InputTag from '../components/InputTag'
export default {
  data () {
    return {
      id: '',
      from: '',
      to: '',
      visible: false,
      isRequired: true,
      loading: false,
      channelCode: '',
      indexList: [],
      selectOperateList: [],
      flowData: [
        {
          value: 'condition',
          text: '按条件分流'
        },
        {
          value: 'hash',
          text: '按HASH分流'
        },
        {
          value: 'rate',
          text: '按比率分流'
        }
      ],
      selectEnumsList: [], // 内容下拉选
      dataForm: {},
      dataFormTemp: {
        name: '',
        'fieldType': '',
        'fieldCode': null,
        'format': '',
        'func': '',
        'sourceTable': '',
        'fieldId': '',
        'englishName': '',
        'indexList': this.indexList, // 指标下拉选
        'enumTypeNum': '',
        'subFunc': '',
        'dateDimension': '',
        'strTips': [],
        'params': [{
          value: '',
          title: ''
        }]
      },
      dataRules: {
        flowType: [
          { required: true, message: '请选择分流方式', trigger: 'change' }
        ]
      },
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
      ],
      tips: {
        'relative_within_DAYS': '举例：若当前时间为02-26 12:10，则过去1天内为 [02-25 00:00, 02-25 23:59]，过去0天内为 [02-26 00:00, 02-26 12:10]',
        'relative_before_DAYS': '举例：若当前时间为02-26 12:10，则过去1天前为 ( 无穷小时间，02-24 23:59]，过去0天前为 ( 无穷小时间，02-25 23:59]',
        'relative_within_HOURS': '举例：若当前时间为02-26 12:10，则过去1小时内为 [02-26 11:10, 02-26 12:10]，过去0小时内为 [02-26 12:10，02-26 12:10]',
        'relative_before_HOURS': '举例：若当前时间为02-26 12:10，则过去1小时前为 ( 无穷小时间，02-26 11:10]，过去0小时前为 ( 无穷小时间，02-26 12:10]',
        'relative_time_in_DAYS': '举例：若当前时间为02-26 12:10，则过去5天到过去1天之内为 [02-21 00:00, 02-25 23:59]，过去5天到过去0天内为 [02-21 00:00, 02-26 12:10]',
        'relative_time_in_HOURS': '举例：若当前时间为02-26 12:10，则过去5小时到过去1小时之内为 [02-26 07:10, 02-26 11:10]”，过去5小时到过去0小时内为 [02-26 07:10, 02-26 12:10]'
      }
    }
  },
  components: { Treeselect, InputTag },
  methods: {
    init (link, channelCode) {
      this.visible = true
      this.from = link.data.from
      this.to = link.data.to
      this.dataForm = this.dataFormTemp
      this.channelCode = channelCode
      if (link.data.data) {
        this.loading = true
        this.dataForm = link.data.data.configItems
        this.getSelectAllCata(() => {
          this.getSelectOperateList(this.dataForm.fieldType)
          this.loading = false
        })
      } else {
        this.getSelectAllCata()
      }
    },
    getSelectAllCata (fn) { // 获取所有指标
      selectAllCata({
        channelCode: this.channelCode,
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
    judgeDateTwoInput (rule, value, callback, params) { // 数值时间区间判断
      if (value === '') {
        callback(new Error('请输入'))
      } else if (params[0].value * 1 < params[1].value * 1) {
        callback(new Error('起始数值应大于等于终止数值'))
      } else {
        callback()
      }
    },
    judgeNumberTwoInput (value, callback, params) { // 数值介于判断
      if (value === '') {
        callback(new Error('请输入'))
      } else if (params[0].value * 1 >= params[1].value * 1) {
        callback(new Error('起始数值应小于终止数值'))
      } else {
        callback()
      }
    },
    keyupNumberInput (val) { // 输入内容 要求 只能输入 整数 小数 最多一位小数点 开头和结尾都不能有小数点
      if (val === '.') { // 开头不能是小数点
        val = val.replace('.', '')
      }
      if (val.split('.').length > 2) { // 不可输入第二个小数点
        val = val.substring(0, val.length - 1)
      }
      if (val.length > 1 && val[val.length - 1] === '-') { // 只能有一个’-‘
        val = val.substring(0, val.length - 1)
      }
      val = val.replace(/[^-.\d]/g, '') // 清除“数字”和“.”以外的字符  [^.\d]
      return val
    },
    keyupDateNumberInput (val) { // 日期输入框，输入内容 要求 只能输入 正整数
      val = val.replace(/^0(0+)|[^\d]+/g, '')
      return val
    },
    blurDateNumberInput (val) { // 日期输入框，失去焦点时判断输入内容是否符合要求
      let reg = /^([0]|[1-9][0-9]*)$/
      if (!reg.test(val)) {
        val = ''
      }
      return val
    },
    blurNumberInput (val) { // 失去焦点时判断输入内容是否符合要求
      val = val + '' // 数据转为字符串
      if (val[val.length - 1] === '.') { // 最后一位为小数点时，则删除小数点
        val = val.substring(0, val.length - 1)
      }
      let reg = /^(-)?\d+(\.\d+)?$/g // 只能输入 -. 及数字 不符合要求则置空
      if (!reg.test(val)) {
        val = ''
      }
      val = val.replace(/^0+\./, '0.') // 000.8999  -> 0.889
      val = val.replace(/^(-0+)\./, '-0.') // -000.899  -> -0.889
      val = val.replace(/^0+([0-9])/, '$1') // 009.9 00099999  -> 9.9  999999
      val = val.replace(/^-0+([0-9])/, '-$1') // -009.9 -00099999 -> -9.9  -999999
      return val
    },
    pramasNumBlur (val) { // 数值 介于的判断
      let params = this.dataForm.params
      if (params[0].value * 1 < params[1].value * 1) {
        this.$refs['paramsl'].clearValidate()
        this.$refs['paramsr'].clearValidate()
      }
      return this.blurNumberInput(val) // 返回一下处理过的值 用于赋值
    },
    pramasDateBlur (val) { // 时间 区间的判断
      let params = this.dataForm.params
      if (params[0].value * 1 >= params[1].value * 1) {
        this.$refs['paramsl'].clearValidate()
        this.$refs['paramsr'].clearValidate()
      }
      return this.blurDateNumberInput(val) // 返回一下处理过的值 用于赋值
    },
    async loadOptions ({ action, parentNode, callback }) {
      if (action === LOAD_CHILDREN_OPTIONS) {
        callback()
      }
    },
    fieldCodeChange (node) { // rxs更新数据
      let obj = node
      this.getSelectOperateList(obj.fieldType, () => {
        let params = {
          func: this.selectOperateList[0].code,
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
          dataIndexManagerCandidate({ // 字符串提示输入示例
            sourceTable: obj.sourceTable,
            fieldName: obj.englishName,
            count: 10
          }).then(({data}) => {
            if (data.status * 1 === 1 && data.data.length) {
              params.strTips = data.data
            }
            this.updateRulesArr(this.dataForm, params)
          })
        } else {
          this.updateRulesArr(this.dataForm, params)
        }
        this.$refs.code.clearValidate()
      })
    },
    selectOperateChange (val) { // 操作符改变时，数据清空，重新输入
      let params = [{ value: '', title: '' }]
      if (this.dataForm.func === 'between' || this.dataForm.func === 'relative_time_in') {
        params.push({ value: '', title: '' })
      }
      let subSelects = []
      let subFunc = ''
      let subTimeSelects = []
      let dateDimension = ''
      if (this.dataForm.func === 'relative_time') {
        subSelects = this.selectOperateList.filter(item => item.code === this.dataForm.func)[0].subSelects
        subFunc = 'relative_before'
        subTimeSelects = this.subTimeSelects
        dateDimension = 'DAYS'
      }
      if (this.dataForm.func === 'relative_time_in') {
        subTimeSelects = this.subTimeSelects
        dateDimension = 'DAYS'
      }
      this.updateRulesArr(this.dataForm, { params: params, subSelects: subSelects, subFunc: subFunc, subTimeSelects: subTimeSelects, dateDimension: dateDimension })
      if (this.dataForm.fieldType === 'date') { // v-show 状态下， 有验证无法去除，所以手动清除一下错误提示
        this.$refs['datetime'].clearValidate()
        this.$refs['datetimerange'].clearValidate()
      }
    },
    inputTagChange (type) {
      if (this.dataForm.params[0].selectVal.length) { // 如果已经有输入的值则清空报错提示
        this.$refs[type + 'MultiVal'].clearValidate()
      }
      this.updateEnumsChange()
    },
    selectEnumsVisible (val) { // 当下拉框打开时，重新请求数据
      if (val) { // 打开下拉框时
        enumTypeList(this.dataForm.enumTypeNum).then(res => {
          if (res.data.status !== '1') {
            this.selectEnumsList = []
          } else {
            this.selectEnumsList = res.data.data
          }
          // this.updateRulesArr(this.dataForm, { selectEnumsList: selectEnumsList })
        })
      }
    },
    isDateSingleShow () { // 单时间日期是否显示
      let showSingleArr = ['eq', 'neq', 'gt', 'lt', 'ge', 'le']
      if (this.dataForm.fieldType === 'date' && showSingleArr.includes(this.dataForm.func)) {
        return true
      } else {
        return false
      }
    },
    selectDateTimeChange (val) { // 处理一下时间数据
      let newArr = []
      if (!this.dataForm.params[0].datetime) {
        newArr = [{
          value: '',
          title: '',
          datetime: ''
        }]
      } else {
        newArr = [{
          value: this.dataForm.params[0].datetime,
          title: '',
          datetime: this.dataForm.params[0].datetime
        }]
      }
      this.updateRulesArr(this.dataForm, { params: newArr })
    },
    selectEnumsChange (val) { // 处理一下多选的数据
      this.updateEnumsChange()
    },
    updateDateDimension (val) {
      this.parent.updateRulesArr(this.dataForm, { dateDimension: val })
    },
    updateEnumsChange () {
      let newArr = []
      if (this.dataForm.params[0].selectVal === null || !this.dataForm.params[0].selectVal.length) {
        newArr = [{
          value: '',
          title: '',
          selectVal: []
        }]
      } else {
        this.dataForm.params[0].selectVal.forEach(item => {
          newArr.push({
            value: item,
            title: ''
          })
        })
        newArr.splice(0, 1, { ...newArr[0], selectVal: this.dataForm.params[0].selectVal })
      }
      this.updateRulesArr(this.dataForm, { params: newArr })
    },
    updateRulesArr (dataForm, obj) { // 更新数组的数据
      this.dataForm = { ...this.dataForm, ...obj }
      console.log(this.dataForm, this.selectOperateList)
    },
    getSelectOperateList (type, fn) {
      selectOperate(type).then(({data}) => {
        if (data.status !== '1') {
          this.selectOperateList = []
        }
        if (!data.data || (data.data && !data.data.length)) {
          this.selectOperateList = []
        }
        this.selectOperateList = data.data
        if (fn) fn()
      })
    },
    tipsHtmlCont () {
      if (this.dataForm.func === 'relative_time_in') {
        return this.tips[this.dataForm.func + '_' + this.dataForm.dateDimension]
      }
      if (this.dataForm.func === 'relative_time') {
        return this.tips[this.dataForm.subFunc + '_' + this.dataForm.dateDimension]
      }
    },
    isEmpty () { // 是否选择了空
      let emptyArr = ['null', 'not_null', 'not_empty', 'empty']
      if (!emptyArr.includes(this.dataForm.func)) {
        return true
      } else {
        return false
      }
    },
    saveHandle () {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          console.log(this.dataForm)
          let config = {
            configItems: this.dataForm
          }
          this.$emit('close', { tag: 'save', data: { config: config, from: this.from, to: this.to } })
          this.$parent.multiBranchConditionVisible = false
        }
      })
    },
    cancelHandle () {
      this.visible = false
      this.$parent.multiBranchConditionVisible = false
    }
  }
}
</script>
<style scoped>
  .cursor-pointer {
    cursor: pointer;
  }
  .pane-rules-content {
    position: relative;
    display: flex;
  }
  .pane-rules-content .el-form-item {
    margin-bottom: 25px;
  }
  .rules-index-relation {
    left: 0;
    top: -8px;
    bottom: 0;
    position: relative;
    margin-right: 8px;
    margin-bottom: 20px;
  }
  .rules-index-relation:before {
    content: " ";
    position: absolute;
    top: 0;
    left: 50%;
    width: 2px;
    height: 100%;
    overflow: hidden;
    background: #d0e2f5;
  }
  .rules-index-relation span {
    position: relative;
    display: block;
    top: 50%;
    left: 0;
    right: 0;
    width: 25px;
    height: 25px;
    transform: translateY(-50%);
    border-radius: 3px;
    background: #d0e2f5;
    color: #409EFF;
    font-size: 14px;
    font-weight: 700;
    line-height: 25px;
    text-align: center;
    cursor: pointer;
    user-select: none;
  }
  .tree-select {
    width: 290px;
    line-height: 38px;
  }
  /* .vue-treeselect__menu {
    overflow: auto;
  }
  .vue-treeselect__label {
    overflow: initial;
  } */
  .pane-rules-inline {
    display: inline-block;
    line-height: 40px;
  }
  .btn-group i {
    margin-right: 5px;
  }
  .itemIput {
    width: 300px;
  }
  .subSelect {
    width: 140px;
  }
   .subSelect1 {
    width: 80px;
  }
  .itemIput-big {
    width: 372px;
  }
  .itemIput-small {
    width: 110px;
  }
  .itemIput-number {
    width: 200px;
  }
  .itemOperateIput {
    width: 180px;
  }
  .pane-rules-datetime {
    position: relative;
  }
  .tips-content {
    width: 200px;
    word-break: break-all;
    line-height: 1.6;
  }
  .inputTag {
    border-radius: 4px;
    /* min-height: 40px; */
    line-height: 22px;
    display: inline-block;
    border: 1px solid #dcdfe6
  }
  .input-tag-tips {
    display: inline-block;
    vertical-align: top;
  }
</style>
