<template>
  <div class="pane-rules-content">
    <div class="rules-index-relation" v-if="data.rules.length > 1"><span @click="switchSymbol(data.ruleCode)">{{data.relation === 'and' ? '且' : '或'}}</span></div>
    <div style="flex: 1">
      <div v-for="(item, index) in data.rules" :key="index">
        <el-form :model="item" ref="ruleForm" :inline="true" v-if="!item.rules || !item.rules.length">
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
              placeholder="请选择"
              @select="node => fieldCodeChange(node, item)"
              class="tree-select"
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
            <el-form-item prop="params[0].value" :rules="{ required: isRequired, message: '请输入', trigger: 'blur' }" v-if="item.fieldType === 'string' || item.fieldType === ''">
              <el-input v-model.trim="item.params[0].value" class="itemIput" />
            </el-form-item>
            <!--number-->
            <div v-if="item.fieldType === 'number'"  class="pane-rules-inline">
              <div v-if="item.func === 'between'"  class="pane-rules-inline">
                <el-form-item prop="params[0].value" :ref="'paramsl' + item.ruleCode" :rules="{ required: isRequired, validator: (rule, value, callback) => judgeNumberTwoInput(rule, value, callback, item.params), trigger: 'blur' }">
                  <!--输入时实时更新当前数据，失去焦点时也要处理，所有的number输入都一样，不能用el-input-number会出现大值转十六进制的情况-->
                  <el-input v-model="item.params[0].value" class="itemIput-number" @input="item.params[0].value = keyupNumberInput(item.params[0].value)" @blur="item.params[0].value = pramasNumBlur(item, item.params[0].value)"></el-input>
                </el-form-item>
                于
                <el-form-item prop="params[1].value" :ref="'paramsr' + item.ruleCode" :rules="{required: isRequired, validator: (rule, value, callback) => judgeNumberTwoInput(rule, value, callback, item.params), trigger: 'blur'}">
                  <el-input v-model="item.params[1].value" controls-position="right" class="itemIput-number" @input="item.params[1].value = keyupNumberInput(item.params[1].value)" @blur="item.params[1].value = pramasNumBlur(item, item.params[1].value)"></el-input> 之间
                </el-form-item>
              </div>
              <el-form-item prop="params[0].value" :rules="{required: isRequired, message: '请输入', trigger: 'blur'}" v-else>
                <!-- <el-input-number v-model="item.params[0].value" controls-position="right" class="itemIput"></el-input-number> -->
                <el-input v-model="item.params[0].value" @input="item.params[0].value = keyupNumberInput(item.params[0].value)" @blur="item.params[0].value = blurNumberInput(item.params[0].value)" class="itemIput"></el-input>
              </el-form-item>
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
              <!--相对时间-->
              <div v-if="item.func === 'relative_before' || item.func === 'relative_within'" class="pane-rules-inline">
                <!-- 在&nbsp; -->
                <el-form-item prop="params[0].value" :rules="{required: isRequired, message: '请输入', trigger: 'blur'}">
                  <!-- <el-input-number v-model="item.params[0].value" controls-position="right" class="itemIput-small"></el-input-number> -->
                  <el-input v-model="item.params[0].value" @input="item.params[0].value = keyupNumberInput(item.params[0].value)" @blur="item.params[0].value = blurNumberInput(item.params[0].value)" class="itemIput-small"></el-input>
                </el-form-item>
                天&nbsp;
              </div>
              <!--相对时间点-->
              <div v-if="item.func === 'relative_time_in'" class="pane-rules-inline">
                在&nbsp;过去&nbsp;
                <el-form-item prop="params[0].value" :ref="'paramsl' + item.ruleCode" :rules="{ required: isRequired, validator: (rule, value, callback) => judgeDateTwoInput(rule, value, callback, item.params), trigger: 'blur'}">
                  <el-input v-model="item.params[0].value" class="itemIput-small" @input="item.params[0].value = keyupNumberInput(item.params[0].value)" @blur="item.params[0].value = pramasDateBlur(item, item.params[0].value)" :min="1"></el-input>
                </el-form-item>
                天&nbsp;到&nbsp;过去&nbsp;
                <el-form-item prop="params[1].value" :ref="'paramsr' + item.ruleCode" :rules="{ required: isRequired,  validator: (rule, value, callback) => judgeDateTwoInput(rule, value, callback, item.params), trigger: 'blur'}">
                  <el-input v-model="item.params[1].value" class="itemIput-small" @input="item.params[1].value = keyupNumberInput(item.params[1].value)" @blur="item.params[1].value = pramasDateBlur(item, item.params[1].value)" :min="1"></el-input>
                </el-form-item>
                天&nbsp;之内
              </div>
            </div>
          </div>
          <el-form-item class="btn-group">
            <!-- <i class="el-icon-edit cursor-pointer"></i> -->
            <el-tooltip v-if="item.func === 'relative_time_in'" placement="top">
              <div slot="content" v-html="toolTipContent(item)"></div>
              <i class="el-icon-info cursor-pointer" style="color:#409eff"></i>
            </el-tooltip>
            <i class="el-icon-circle-plus cursor-pointer" @click="addChildrenRules(item, index)" v-if="!isChild || isChild && index === data.rules.length-1"></i>
          </el-form-item>
          <el-form-item style="float: right">
            <i class="el-icon-close cursor-pointer" @click="deleteRules(item, index)"></i>
          </el-form-item>
        </el-form>
        <div v-else>
          <rules-set :data="item" :is-child="true" ref="rulesSet" :is-require="isRequired"></rules-set>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Treeselect, { LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect'
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
    }
  },
  data () {
    return {
      parent: null,
      selectOperateList: []
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
  components: { Treeselect },
  methods: {
    judgeDateTwoInput (rule, value, callback, params) { // 数值介于判断
      if (value === '') {
        callback(new Error('请输入'))
      } else if (params[0].value * 1 <= params[1].value * 1) {
        callback(new Error('起始数值应大于终止数值'))
      } else {
        callback()
      }
    },
    judgeNumberTwoInput (rule, value, callback, params) { // 数值时间区间判断
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
      val = val.replace(/[^(-.\d]/g, '') // 清除“数字”和“.”以外的字符
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
      if (params[0].value * 1 > params[1].value * 1) {
        this.$refs['paramsl' + item.ruleCode][0].clearValidate()
        this.$refs['paramsr' + item.ruleCode][0].clearValidate()
      }
      return this.blurNumberInput(val) // 返回一下处理过的值 用于赋值
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
      this.parent.fieldCodeChange(this.parent.ruleConfig, ruleItem, { englishName: node.englishName, fieldType: node.fieldType, enumTypeNum: node.enumTypeNum, sourceTable: node.sourceTable, fieldId: node.fieldId, format: node.dataStandar })
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
        // if (ruleItem.fieldType === 'enums'){
        //   this.parent.getRulesEnumsList(this.parent.ruleConfig, ruleItem)
        // }
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
    isDateSingleShow (item) { // 单时间日期是否显示
      let showSingleArr = ['eq', 'neq', 'gt', 'lt', 'ge', 'le']
      if (item.fieldType === 'date' && showSingleArr.includes(item.func)) {
        return true
      } else {
        return false
      }
    },
    toolTipContent (citem) {
      if (citem.func === 'relative_time_in') {
        return '起始数值应大于终止数值'
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
    margin-bottom: 10px;
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
    display: inline-block;
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
  .itemIput-big {
    width: 372px;
  }
  .itemIput-small {
    width: 140px;
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
</style>
