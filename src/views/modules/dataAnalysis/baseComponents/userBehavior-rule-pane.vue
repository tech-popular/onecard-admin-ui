<template>
  <div class="pane-rules-content">
    <div class="rules-index-relation" v-if="data.rules.length > 1"><span @click="switchSymbol(data.ruleCode)">{{data.relation === 'and' ? '且' : '或'}}</span></div>
    <div style="flex: 1">
      <div v-for="(item, index) in data.rules" :key="index">
        <el-form :model="item" ref="ruleForm" :inline="true" v-if="!item.rules || !item.rules.length" :disabled="from === 'api'">
          <el-form-item prop="fieldCode" :rules="{required: isRequired, message: '请选择', trigger: 'change'}">
            <Treeselect
              :options="item.indexList"
              :disable-branch-nodes="true"
              :show-count="true"
              v-model="item.fieldCode"
              :clearable="false"
              search-nested
              :load-options="loadOptions"
              noChildrenText="暂无数据"
              placeholder="请选择指标"
              @select="node => fieldCodeChange(node, item)"
              class="tree-select"
              :disabled="from === 'api'"
          />
          </el-form-item>
          <el-form-item prop="func" :rules="{required: isRequired, message: '请选择', trigger: 'change'}">
            <el-select v-model="item.func" class="itemOperateIput" @change="data => selectOperateChange(data, item)" @visible-change="data => selectOperateVisible(data, item)">
              <el-option v-for="(fitem, findex) in item.selectOperateList" :value="fitem.code" :key="findex" :label="fitem.title"/>
            </el-select>
          </el-form-item>
          <!--条件内容区-->
          <div v-if="isEmpty(item)" class="pane-rules-inline">
            <!--string-->
            <div v-if="item.fieldType === 'string' || item.fieldType === ''" class="pane-rules-inline">
              <!--string型等于或不等于可以输入多个-->
              <el-form-item prop="params[0].selectVal" :ref="'stringMultiVal' + item.ruleCode" :rules="{ required: isRequired, message: '请输入', trigger: 'blur' }" v-if="item.func === 'eq' || item.func === 'neq'">
                <input-tag v-model="item.params[0].selectVal" @change="inputTagChange(item, 'string')" :tag-tips="item.strTips" :valueType="'string'" :add-tag-on-blur="true" :readOnly="from === 'api'" :allow-duplicates="true" class="itemIput inputTag" placeholder="可用回车输入多条"></input-tag>
                <!-- <div class="input-tag-tips" v-if="item.strTips">
                  <el-tooltip placement="top">
                    <div slot="content" v-html="strTipCont(item)" class="tips-content"></div>
                    <i class="el-icon-info cursor-pointer" style="color:#409eff"></i>
                  </el-tooltip>
                </div> -->
              </el-form-item>
              <el-form-item prop="params[0].value" :rules="{ required: isRequired, message: '请输入', trigger: 'blur' }" v-else>
                <el-input v-model.trim="item.params[0].value" class="itemIput" placeholder="请输入" />
              </el-form-item>
            </div>
            <!--number-->
            <div v-if="item.fieldType === 'number'"  class="pane-rules-inline">
              <div v-if="item.func === 'between'"  class="pane-rules-inline">
                <el-form-item prop="params[0].value" :ref="'paramsl' + item.ruleCode" :rules="{ required: isRequired, validator: (rule, value, callback) => judgeNumberTwoInput(rule, value, callback, item.params), trigger: 'blur' }">
                  <!--输入时实时更新当前数据，失去焦点时也要处理，所有的number输入都一样，不能用el-input-number会出现大值转十六进制的情况-->
                  <el-input v-model="item.params[0].value" :maxlength="10" @input="item.params[0].value = keyupNumberInput(item.params[0].value)" @blur="item.params[0].value = pramasNumBlur(item, item.params[0].value)"></el-input>
                </el-form-item>
                于
                <el-form-item prop="params[1].value" :ref="'paramsr' + item.ruleCode" :rules="{required: isRequired, validator: (rule, value, callback) => judgeNumberTwoInput(rule, value, callback, item.params), trigger: 'blur'}">
                  <el-input v-model="item.params[1].value" :maxlength="10" class="itemIput-number" @input="item.params[1].value = keyupNumberInput(item.params[1].value)" @blur="item.params[1].value = pramasNumBlur(item, item.params[1].value)"></el-input> 之间
                </el-form-item>
              </div>
              <div v-else>
                <!--数值型等于或不等于可以输入多个-->
                <el-form-item prop="params[0].selectVal" :ref="'numberMultiVal' + item.ruleCode" :rules="{required: isRequired, message: '请输入', trigger: 'blur'}" v-if="item.func === 'eq' || item.func === 'neq'">
                  <input-tag v-model="item.params[0].selectVal" @change="inputTagChange(item, 'number')" :valueType="'number'" :tag-tips="[]" :maxlength="10" :add-tag-on-blur="true" :readOnly="from === 'api'" :allow-duplicates="true" class="itemIput inputTag" placeholder="可用回车输入多条"></input-tag>
                </el-form-item>
                <el-form-item prop="params[0].value" :rules="{required: isRequired, message: '请输入', trigger: 'blur'}" v-else>
                  <el-input v-model="item.params[0].value" :maxlength="10" @input="item.params[0].value = keyupNumberInput(item.params[0].value)" @blur="item.params[0].value = blurNumberInput(item.params[0].value)" class="itemIput"></el-input>
                </el-form-item>
              </div>
            </div>
            <!--enums-->
            <div v-if="item.fieldType === 'enums'"  class="pane-rules-inline">
              <el-form-item prop="params[0].selectVal" :rules="{required: isRequired, message: '请选择', trigger: 'change'}">
                <el-select v-model="item.params[0].selectVal" multiple class="itemIput" @change="data => selectEnumsChange(data, item)" @visible-change="data => selectEnumsVisible(data, item)">
                  <el-option v-for="(fitem, findex) in item.selectEnumsList" :value="fitem.childrenNum" :key="findex" :label="fitem.childrenValue"/>
                </el-select>
              </el-form-item>
            </div>
            <!--时间-->
            <div v-if="item.fieldType === 'date'" class="pane-rules-inline pane-rules-datetime">
              <!--绝对时间-->
              <el-form-item v-show="isDateSingleShow(item)" :ref="'datetime' + item.ruleCode" prop="params[0].datetime" :rules="{required: isRequired && isDateSingleShow(item), message: '请选择', trigger: 'change'}">
                <el-date-picker
                  v-model="item.params[0].datetime"
                  type="datetime"
                  placeholder="选择日期时间"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  @change="data => selectDateTimeChange(data, item)"
                  class="itemIput"
                >
                </el-date-picker>
              </el-form-item>
              <!--区间-->
              <el-form-item v-show="item.func === 'between'" :ref="'datetimerange' + item.ruleCode" prop="params[0].selectVal" :rules="{required: isRequired && item.func === 'between', message: '请选择', trigger: 'change'}">
                <el-date-picker
                  v-model="item.params[0].selectVal"
                  type="datetimerange"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :default-time="['00:00:00']"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  @change="data => selectEnumsChange(data, item)"
                  class="itemIput-big"
                >
                </el-date-picker>
              </el-form-item>
              <!--相对当前时间点-->
              <div v-if="item.func === 'relative_time'" class="pane-rules-inline">
                在&nbsp;过去&nbsp;
                <el-form-item prop="params[0].value" :rules="{required: isRequired, message: '请输入', trigger: 'blur'}">
                  <el-input v-model="item.params[0].value" :maxlength="10" @input="item.params[0].value = keyupDateNumberInput(item.params[0].value)" @blur="item.params[0].value = blurDateNumberInput(item.params[0].value)" class="itemIput-small"></el-input>
                </el-form-item>
                <el-form-item prop="dateDimension">
                  <el-select v-model="item.dateDimension" class="subSelect1" @change="data => updateDateDimension(data, item)">
                    <el-option v-for="(fitem, findex) in item.subTimeSelects" :value="fitem.code" :key="findex" :label="fitem.title" />
                  </el-select>
                </el-form-item>
                <el-form-item prop="subFunc">
                  <el-select v-model="item.subFunc" class="subSelect">
                    <el-option v-for="(fitem, findex) in item.subSelects" :value="fitem.code" :key="findex" :label="fitem.title" />
                  </el-select>
                </el-form-item>
              </div>
              <!--相对时间点-->
              <div v-if="item.func === 'relative_time_in'" class="pane-rules-inline">
                在&nbsp;过去&nbsp;
                <el-form-item prop="params[0].value" :ref="'paramsl' + item.ruleCode" :rules="{ required: isRequired, validator: (rule, value, callback) => judgeDateTwoInput(rule, value, callback, item.params), trigger: 'blur'}">
                  <el-input v-model="item.params[0].value" :maxlength="10" class="itemIput-small" @input="item.params[0].value = keyupDateNumberInput(item.params[0].value)" @blur="item.params[0].value = pramasDateBlur(item, item.params[0].value)" :min="1"></el-input>
                </el-form-item>
                <el-form-item prop="dateDimension">
                  <el-select v-model="item.dateDimension" class="subSelect1" @change="data => updateDateDimension(data, item)">
                    <el-option v-for="(fitem, findex) in item.subTimeSelects" :value="fitem.code" :key="findex" :label="fitem.title" />
                  </el-select>
                </el-form-item>
                到&nbsp;过去&nbsp;
                <el-form-item prop="params[1].value" :ref="'paramsr' + item.ruleCode" :rules="{ required: isRequired,  validator: (rule, value, callback) => judgeDateTwoInput(rule, value, callback, item.params), trigger: 'blur'}">
                  <el-input v-model="item.params[1].value" :maxlength="10" class="itemIput-small" @input="item.params[1].value = keyupDateNumberInput(item.params[1].value)" @blur="item.params[1].value = pramasDateBlur(item, item.params[1].value)" :min="1"></el-input>
                </el-form-item>
                <el-form-item prop="dateDimension">
                  <el-select v-model="item.dateDimension" class="subSelect1" @change="data => updateDateDimension(data, item)">
                    <el-option v-for="(fitem, findex) in item.subTimeSelects" :value="fitem.code" :key="findex" :label="fitem.title" />
                  </el-select>
                </el-form-item>
                之内
              </div>
            </div>
          </div>
          <el-form-item class="btn-group">
            <el-tooltip v-if="item.func === 'relative_time_in' || item.func === 'relative_time'" placement="top">
              <div slot="content" v-html="tipsHtmlCont(item)" class="tips-content"></div>
              <i class="el-icon-info cursor-pointer" style="color:#409eff"></i>
            </el-tooltip>
            <span  v-if="from !== 'api'">
              <i class="el-icon-circle-plus cursor-pointer" @click="addChildrenRules(item, index)" v-if="!isChild || isChild && index === data.rules.length-1"></i>
            </span>
          </el-form-item>
          <el-form-item style="float: right" v-if="from !== 'api'">
            <i class="el-icon-close cursor-pointer" @click="deleteRules(item, index)"></i>
          </el-form-item>
        </el-form>
        <div v-else>
          <rules-set :data="item" :is-child="true" ref="rulesSet" :is-require="isRequired" :from="from"></rules-set>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Treeselect, { LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect'
import InputTag from '../components/InputTag'
export default {
  name: 'rulesSet',
  props: {
    data: {
      type: Object
    },
    isChild: { // 是否是当前级别中最后一行，用来显示添加按钮
      type: Boolean
    },
    indexList: {
      type: Array
    },
    isRequire: {
      type: Boolean,
      default: false
    },
    from: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      ttt: [],
      multipleList: [],
      parent: null,
      selectOperateList: [],
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
  computed: {
    isRequired () { // 校验规则初始为false,只有在提交时统一校验
      return this.isRequire
    }
  },
  mounted () {
    // 获取父节点
    let parent = this.$parent
    while (parent && !parent.isTreeRoot) {
      parent = parent.$parent
    }
    this.parent = parent
  },
  components: { Treeselect, InputTag },
  methods: {
    updateDateDimension (val, ruleItem) {
      this.parent.updateRulesArr(this.parent.ruleConfig, ruleItem, { dateDimension: val })
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
    judgeNumberTwoInput (rule, value, callback, params) { // 数值介于判断
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
      console.log(999444, val)
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
    pramasNumBlur (item, val) { // 数值 介于的判断
      let params = item.params
      if (params[0].value * 1 < params[1].value * 1) {
        this.$refs['paramsl' + item.ruleCode][0].clearValidate()
        this.$refs['paramsr' + item.ruleCode][0].clearValidate()
      }
      return this.blurNumberInput(val) // 返回一下处理过的值 用于赋值
    },
    pramasDateBlur (item, val) { // 时间 区间的判断
      let params = item.params
      if (params[0].value * 1 >= params[1].value * 1) {
        this.$refs['paramsl' + item.ruleCode][0].clearValidate()
        this.$refs['paramsr' + item.ruleCode][0].clearValidate()
      }
      return this.blurDateNumberInput(val) // 返回一下处理过的值 用于赋值
    },
    async loadOptions ({ action, parentNode, callback }) {
      if (action === LOAD_CHILDREN_OPTIONS) {
        callback()
      }
    },
    addChildrenRules (item) { // 添加子条件
      this.parent.addChildreRules(this.parent.ruleConfig, item)
    },
    deleteRules (item) { // 删除条件
      this.parent.deleteRules(this.parent.ruleConfig, item)
    },
    switchSymbol (ruleCode) { // 切换且或
      this.parent.switchSymbol(ruleCode, this.parent.ruleConfig)
    },
    fieldCodeChange (node, ruleItem) { // 指标改变时，对应的操作符也更新
      this.parent.fieldCodeChange(this.parent.ruleConfig, ruleItem, { label: node.label, englishName: node.englishName, fieldType: node.fieldType, enumTypeNum: node.enumTypeNum, sourceTable: node.sourceTable, fieldId: node.fieldId, format: node.dataStandar, enable: node.enable })
    },
    selectOperateChange (val, ruleItem) { // 操作符改变时，数据清空，重新输入
      this.parent.updateOperateChange(this.parent.ruleConfig, ruleItem)
      if (ruleItem.fieldType === 'date') { // v-show 状态下， 有验证无法去除，所以手动清除一下错误提示
        this.$refs['datetime' + ruleItem.ruleCode][0].clearValidate()
        this.$refs['datetimerange' + ruleItem.ruleCode][0].clearValidate()
      }
    },
    selectOperateVisible (val, ruleItem) { // 当操作符下拉框打开时，重新下拉请求数据
      if (val) { // 打开下拉框时
        this.parent.getSelectOperateList(ruleItem.fieldType, (selectOperateList) => {
          this.parent.updateRulesArr(this.parent.ruleConfig, ruleItem, { selectOperateList: selectOperateList })
        })
      }
    },
    selectEnumsVisible (val, ruleItem) { // 当下拉框打开时，重新请求数据
      if (val) { // 打开下拉框时
        this.parent.getRulesEnumsList(this.parent.ruleConfig, ruleItem)
      }
    },
    selectEnumsChange (val, ruleItem) { // 处理一下多选的数据
      this.parent.updateEnumsChange(this.parent.ruleConfig, ruleItem)
    },
    selectDateTimeChange (val, ruleItem) { // 处理一下时间数据
      this.parent.updateDateTimeChange(this.parent.ruleConfig, ruleItem)
    },
    inputTagChange (ruleItem, type) {
      if (ruleItem.params[0].selectVal.length) { // 如果已经有输入的值则清空报错提示
        this.$refs[type + 'MultiVal' + ruleItem.ruleCode][0].clearValidate()
      }
      this.parent.updateEnumsChange(this.parent.ruleConfig, ruleItem)
    },
    isDateSingleShow (item) { // 单时间日期是否显示
      let showSingleArr = ['eq', 'neq', 'gt', 'lt', 'ge', 'le']
      if (item.fieldType === 'date' && showSingleArr.includes(item.func)) {
        return true
      } else {
        return false
      }
    },
    // strTipCont (item) {
    //   console.log(item)
    //   return '输入示例：' + item.strTips
    // },
    tipsHtmlCont (item) {
      if (item.func === 'relative_time_in') {
        return this.tips[item.func + '_' + item.dateDimension]
      }
      if (item.func === 'relative_time') {
        return this.tips[item.subFunc + '_' + item.dateDimension]
      }
    },
    isEmpty (item) { // 是否选择了空
      let emptyArr = ['null', 'not_null', 'not_empty', 'empty']
      if (!emptyArr.includes(item.func)) {
        return true
      } else {
        return false
      }
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
