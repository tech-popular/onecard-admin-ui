<template>
  <div class="action-pane-rules-content">
    <div class="rules-index-relation" v-if="data.rules.length > 1">
      <span @click="switchSymbol(data.ruleCode)">{{data.relation === 'and' ? '且' : '或'}}</span>
    </div>
    <div style="flex: 1">
      <div v-for="(item, index) in data.rules" :key="index">
        <el-form
          :model="item"
          ref="ruleForm"
          :inline="true"
          v-if="!item.rules || !item.rules.length"
          :disabled="from === 'api'"
        >
          <div class="pane-rules-inline pane-rule-sign">{{item.ruleCode}}</div>
          <el-form-item
            prop="func"
            :rules="{required: isRequired, message: '请选择', trigger: 'change'}"
          >
            <el-select v-model="item.func"  class="itemOperateIput"  @change="data => selectOperateChange(data, item)">
              <el-option
                style="width:200px"
                v-for="(fitem, findex) in fileList"
                :value="fitem.value"
                :key="findex"
                :label="fitem.lable"
              /></el-select>
          </el-form-item>
            <!--条件内容区-->
          <div class="pane-rules-inline">
              <!--绝对时间-->
            <div v-if="item.func === 'between'" class="pane-rules-inline">
              <el-form-item prop="params[0].value" :ref="'paramsr' + item.ruleCode"  :rules="{required: isRequired, validator: (rule, value, callback) => judgeDataTwoISelect(rule, value, callback, item.params), trigger: 'blur'}">
                <el-date-picker
                  style="width:200px"
                  v-model="item.params[0].value"
                  type="datetime"
                  placeholder="选择日期时间"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  class="itemIput"
                ></el-date-picker>
              </el-form-item>&nbsp; ~ &nbsp;
              <el-form-item prop="params[1].value" :ref="'paramsl' + item.ruleCode"  :rules="{required: isRequired, validator: (rule, value, callback) => judgeDataTwoISelect(rule, value, callback, item.params), trigger: 'blur'}"> 
                <el-date-picker
                  style="width:200px"
                  v-model="item.params[1].value"
                  type="datetime"
                  placeholder="选择日期时间"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  class="itemIput"
                ></el-date-picker>
              </el-form-item>
            </div>
            <!--相对当前时间点-->
            <div v-if="item.func === 'relative_time'" class="pane-rules-inline">
              在&nbsp;过去&nbsp;
              <el-form-item
                prop="params[0].value"
                :ref="'paramst' + item.ruleCode"
                :rules="{required: isRequired, message: '请输入', trigger: 'blur'}"
              >
                <el-input
                  style="width: 150px;"
                  v-model="item.params[0].value"
                  :maxlength="10"
                  @input="item.params[0].value = keyupDateNumberInput(item.params[0].value)"
                  @blur="item.params[0].value = blurNumberInput(item.params[0].value)"
                ></el-input>
              </el-form-item>
              <el-form-item prop="dateDimension" :ref="'paramsi' + item.ruleCode" :rules="{required: isRequired, message: '请输入', trigger: 'blur'}">
                <el-select
                  v-model="item.dateDimension"
                  class="subSelect1"
                  @change="data => updateDateDimension(data, item)"
                >
                  <el-option
                    v-for="(fitem, findex) in item.subTimeSelects"
                    :value="fitem.code"
                    :key="findex"
                    :label="fitem.title"
                  />
                </el-select>
              </el-form-item>
              <el-form-item prop="subFunc" :ref="'paramsm' + item.ruleCode" :rules="{required: isRequired, message: '请输入', trigger: 'blur'}">
                <el-select v-model="item.subFunc" class="subSelect" style="width:90px">
                  <el-option
                    v-for="(fitem, findex) in subSelects"
                    :value="fitem.code"
                    :key="findex"
                    :label="fitem.title"
                  />
                </el-select>
              </el-form-item>
            </div>
            <!--相对当前时间点区间-->
            <div v-if="item.func === 'relative_time_in'" class="pane-rules-inline">
              在&nbsp;过去&nbsp;
              <el-form-item prop = "params[0].value" :ref="'paramse' + item.ruleCode" :rules="{ required: isRequired, validator: (rule, value, callback) => judgeDateTwoInput(rule, value, callback, item.params), trigger: 'blur'}">
                <el-input
                  style="width:90px;"
                  v-model="item.params[0].value"
                  :maxlength="10"
                  @input="item.params[0].value = keyupDateNumberInput(item.params[0].value)"
                  @blur="item.params[0].value = pramasDateBlur(item, item.params[0].value)"
                ></el-input>
              </el-form-item>
              <el-form-item prop="dateDimension" :ref="'paramso' + item.ruleCode" :rules="{required: isRequired, message: '请选择', trigger: 'change'}">
                <el-select
                  v-model="item.dateDimension"
                  class="subSelect1"
                  @change="data => updateDateDimension(data, item)"
                >
                  <el-option
                    v-for="(fitem, findex) in item.subTimeSelects"
                    :value="fitem.code"
                    :key="findex"
                    :label="fitem.title"
                  />
                </el-select>
              </el-form-item>到&nbsp;过去&nbsp;
              <el-form-item prop = "params[1].value" :ref="'paramsn' + item.ruleCode" :rules="{ required: isRequired,  validator: (rule, value, callback) => judgeDateTwoInput(rule, value, callback, item.params), trigger: 'blur'}">
                <el-input
                  style="width:90px;"
                  v-model="item.params[1].value"
                  :maxlength="10"
                  @input="item.params[1].value = keyupDateNumberInput(item.params[1].value)"
                  @blur="item.params[1].value = pramasDateBlur(item, item.params[1].value)"
                ></el-input>
              </el-form-item>
              <el-form-item prop="dateDimension" :ref="'paramsp' + item.ruleCode" :rules="{required: isRequired, message: '请选择', trigger: 'change'}">
                <el-select
                  v-model="item.dateDimension"
                  class="subSelect1"
                  @change="data => updateDateDimension(data, item)"
                >
                  <el-option
                    v-for="(fitem, findex) in item.subTimeSelects"
                    :value="fitem.code"
                    :key="findex"
                    :label="fitem.title"
                  />
                </el-select>
              </el-form-item>之内
            </div>
          </div>
          <div class="pane-rules-inline">
            <el-form-item prop="havedo" :rules="{required: isRequired, message: '请选择', trigger: 'change'}">
              <el-select v-model="item.havedo" class="subSelect1"  @change="data => havedoChange(data, item, index)">
                <el-option
                  v-for="(fitem, findex) in havedoSelects"
                  :value="fitem.code"
                  :key="findex"
                  :label="fitem.title"
                />
              </el-select>
            </el-form-item>
            <el-form-item style="width:120px" prop="eventList"  :rules="{required: isRequired, message: '请选择', trigger: 'change'}">         
              <el-cascader
                v-model="item.eventList"
                :options="item.eventDownList"
                :props="eyentTypeListTreeProps"
                @change="data => eventTypeChange(data, item, index)"
              ></el-cascader>        
            </el-form-item>
            <el-form-item>
              <i class="el-icon-plus cursor-pointer" @click="addThirdChildrenRules(item, index)"></i>
              <span>添加属性筛选</span>
            </el-form-item>
          </div>
          <el-form-item style="float: right" v-if="from !== 'api'">
            <span v-if="from !== 'api'">
              <i
                class="el-icon-circle-plus cursor-pointer"
                @click="addChildrenRules(item, index)"
                v-if="!isChild || isChild && index === data.rules.length-1"
              ></i>
            </span>
            <i class="el-icon-close cursor-pointer" @click="deleteRules(item, index)"></i>
          </el-form-item>
          <div>
            <action-children-data-rules-set :data="item" ref="thirdRulesSet" :is-require="isRequired" :from="from"></action-children-data-rules-set>
          </div>
          <div v-show="item.havedo === 'yes'" style="margin-left: 40px;">
            <span style="line-height: 40px;">总次数 &nbsp;&nbsp;</span>
            <el-form-item prop="totalCountParams.func" :rules="{required: isRequired, message: '请选择', trigger: 'change'}">
              <el-select v-model="item.totalCountParams.func"   @change="data => totalSelectOperateChange(data, item)">
                <el-option v-for="(fitem,findex) in item.totalCountParams.selectOperateList"                 
                  :value="fitem.code"
                  :key="findex"
                  :label="fitem.title">
                </el-option>
              </el-select>
            </el-form-item>
            <div v-if="isEmpty(item)" class="pane-rules-inline">
              <div v-if="item.totalCountParams.func != 'between'" class="pane-rules-inline">
                <el-form-item  prop="totalCountParams.params[0].value" :rules="{required: isRequired, message: '请输入', trigger: 'blur'}">
                  <el-input 
                    v-model="item.totalCountParams.params[0].value" 
                    :maxlength="10" class="itemIput-number" 
                    @input="item.totalCountParams.params[0].value = keyupNumberInput(item.totalCountParams.params[0].value)"
                    @blur="item.totalCountParams.params[0].value = blurNumberInput(item.totalCountParams.params[0].value)"
                    ></el-input>
                </el-form-item>&nbsp;次
              </div>
              <div v-if="item.totalCountParams.func === 'between'" class="pane-rules-inline">
                <el-form-item 
                  prop="totalCountParams.params[0].value"
                  :ref="'totalparamsl' + item.ruleCode"
                  :rules="{ required: isRequired, validator: (rule, value, callback) => judgeNumberTwoInput(rule, value, callback, item.totalCountParams.params), trigger: 'blur' }">
                <!--输入时实时更新当前数据，失去焦点时也要处理，所有的number输入都一样，不能用el-input-number会出现大值转十六进制的情况-->
                  <el-input
                    v-model="item.totalCountParams.params[0].value"
                    :maxlength="10"
                    class="itemIput-number"
                    @input="item.totalCountParams.params[0].value = keyupNumberInput(item.totalCountParams.params[0].value)"
                    @blur="item.totalCountParams.params[0].value = pramasNumBlur(item, item.totalCountParams.params[0].value)"
                  ></el-input>次&nbsp;&nbsp;于&nbsp;&nbsp;
                </el-form-item>
                <el-form-item 
                  prop="totalCountParams.params[1].value"
                  :ref="'totalparamsr' + item.ruleCode"
                  :rules="{ required: isRequired, validator: (rule, value, callback) => judgeNumberTwoInput(rule, value, callback, item.totalCountParams.params), trigger: 'blur' }">
                  <el-input
                    v-model="item.totalCountParams.params[1].value"
                    class="itemIput-number"
                    :maxlength="10"
                    @input="item.totalCountParams.params[1].value = keyupNumberInput(item.totalCountParams.params[1].value)"
                    @blur="item.totalCountParams.params[1].value = pramasNumBlur(item, item.totalCountParams.params[1].value)"
                  ></el-input>次&nbsp;&nbsp;之间
                </el-form-item>
              </div>
            </div>  
          </div>
        </el-form>
        <div v-else>
          <action-rules-set
            :data="item"
            :is-child="true"
            ref="actionRulesSet"
            :is-require="isRequired"
            :from="from"
          ></action-rules-set>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import actionChildrenDataRulesSet from './actionChildrenData-rules-set'
import Treeselect from '@riophae/vue-treeselect'
import InputTag from '../components/InputTag'
export default {
  name: 'actionRulesSet',
  props: {
    data: {
      type: Object
    },
    isChild: {
      // 是否是当前级别中最后一行，用来显示添加按钮
      type: Boolean
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
      eyentTypeList: [], // 事件类型列表
      eyentTypeListTreeProps: {
        label: 'eventName',
        value: 'eventId',
        children: 'dataEventDtos'
      },
      fileList: [
        {
          value: 'between',
          lable: '绝对时间'
        },
        {
          value: 'relative_time',
          lable: '相对当前时间点'
        },
        {
          value: 'relative_time_in',
          lable: '相对当前时间区间'
        }
      ],
      havedoSelects: [
        {
          code: 'yes',
          title: '做过'
        },
        {
          code: 'no',
          title: '没做过'
        }
      ],
      subSelects: [
        {
          code: 'relative_before',
          title: '之前'
        },
        {
          code: 'relative_within',
          title: '之内'
        }
      ]
    }
  },
  computed: {
    isRequired () {
      // 校验规则初始为false,只有在提交时统一校验
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
  components: { actionChildrenDataRulesSet, Treeselect, InputTag },
  methods: {
    updateDateDimension (val, ruleItem) {
      this.parent.updateRulesArr(this.parent.actionRuleConfig, ruleItem, {
        dateDimension: val
      })
    },

    // 事件变化
    eventTypeChange (data, item, index) {
      this.parent.updateEventTypeList(this.parent.actionRuleConfig, data, item, index)
    },
    // 是否做过
    havedoChange (val, citem, index) {
      let totalCountParams = []
      if (val === 'no') {
        totalCountParams = {
          func: 'eq',
          selectOperateList: citem.totalCountParams.selectOperateList,
          params: [
            {
              value: 0,
              title: ''
            }
          ]
        }
      } else {
        totalCountParams = {
          func: citem.totalCountParams.selectOperateList[4].code,
          selectOperateList: citem.totalCountParams.selectOperateList,
          params: [
            {
              value: '1',
              title: ''
            }
          ]
        }
      }
      this.parent.updateChildrenRulesArr(this.data, citem, {totalCountParams: totalCountParams}, index)
    },
    keyupDateNumberInput (val) {
      // 输入框，输入内容 要求 只能输入 正整数
      val = val.replace(/^0(0+)|[^\d]+/g, '')
      return val
    },
    blurNumberInput (val) {
      // 输入框，失去焦点时判断输入内容是否符合要求
      let reg = /^([0]|[1-9][0-9]*)$/
      if (!reg.test(val)) {
        val = ''
      }
      return val
    },
    pramasDateBlur (item, val) {
      // 时间 区间的判断
      let params = item.params
      if (params[0].value && params[1].value && params[0].value * 1 >= params[1].value * 1) {
        this.$nextTick(() => {
          this.$refs['paramse' + item.ruleCode][0].clearValidate()
          this.$refs['paramsn' + item.ruleCode][0].clearValidate()
        })
      }
      return this.blurNumberInput(val) // 返回一下处理过的值 用于赋值
    },
    selectOperateChange (val, ruleItem) { // 时间区间改变时，数据清空，重新输入
      this.parent.updateOperateChange(this.parent.actionRuleConfig, ruleItem)
      this.$nextTick(() => { // 切换时间区间时，手动清除校验信息
        if (ruleItem.func === 'between') {
          this.$refs['paramsl' + ruleItem.ruleCode][0].clearValidate()
          this.$refs['paramsr' + ruleItem.ruleCode][0].clearValidate()
        }
        if (ruleItem.func === 'relative_time') {
          this.$refs['paramst' + ruleItem.ruleCode][0].clearValidate()
          this.$refs['paramsi' + ruleItem.ruleCode][0].clearValidate()
          this.$refs['paramsm' + ruleItem.ruleCode][0].clearValidate()
        }
        if (ruleItem.func === 'relative_time_in') {
          this.$refs['paramse' + ruleItem.ruleCode][0].clearValidate()
          this.$refs['paramsn' + ruleItem.ruleCode][0].clearValidate()
          this.$refs['paramso' + ruleItem.ruleCode][0].clearValidate()
          this.$refs['paramsp' + ruleItem.ruleCode][0].clearValidate()
        }
      })
    },
    totalSelectOperateChange (val, ruleItem) { // 总次数改变时，数据清空，重新输入
      this.parent.updateTotalOperateChange(this.parent.actionRuleConfig, ruleItem)
      if (val === 'between') {
        this.$nextTick(() => {
          this.$refs['totalparamsl' + ruleItem.ruleCode][0].clearValidate()
          this.$refs['totalparamsr' + ruleItem.ruleCode][0].clearValidate()
        })
      }
    },
    judgeDataTwoISelect (rule, value, callback, params) { // 日期介于判断
      if (!value) {
        callback(new Error('请输入'))
      } else if (params[0].value && params[1].value && params[0].value >= params[1].value) {
        callback(new Error('起始日期应小于终止日期'))
      } else {
        callback()
      }
    },
    judgeDateTwoInput (rule, value, callback, params) { // 数值时间区间判断
      if (!value) {
        callback(new Error('请输入'))
      } else if (params[0].value && params[1].value && params[0].value * 1 < params[1].value * 1) {
        callback(new Error('起始数值应大于等于终止数值'))
      } else {
        callback()
      }
    },
    addChildrenRules (item) {
      // 添加子条件
      this.parent.addChildreRules(this.parent.actionRuleConfig, item)
    },
    deleteRules (item) {
      // 删除条件
      this.parent.deleteRules(this.parent.actionRuleConfig, item)
    },
    addThirdChildrenRules (item) {
      //  添加三级子条件
      this.parent.addThirdChildrenRules(this.parent.actionRuleConfig, item)
    },
    switchSymbol (ruleCode) {
      // 切换且或
      this.parent.switchSymbol(ruleCode, this.parent.actionRuleConfig)
    },
    keyupNumberInput (val) {
      // 输入框，输入内容 要求 只能输入 非负整数
      val = val.replace(/^0(0+)|[^\d]+/g, '')
      return val
    },
    judgeNumberTwoInput (rule, value, callback, params) {
      // 数值介于判断
      if (value === '') {
        callback(new Error('请输入'))
      } else if (params[0].value && params[1].value && params[0].value * 1 >= params[1].value * 1) {
        callback(new Error('起始数值应小于终止数值'))
      } else {
        callback()
      }
    },
    pramasNumBlur (item, val) {
      // 数值 介于的判断
      let params = item.totalCountParams.params
      if (params[0].value && params[1].value && params[0].value * 1 < params[1].value * 1) {
        this.$refs['totalparamsl' + item.ruleCode][0].clearValidate()
        this.$refs['totalparamsr' + item.ruleCode][0].clearValidate()
      }
      return this.blurNumberInput(val) // 返回一下处理过的值 用于赋值
    },
    isEmpty (item) {
      // 是否选择了空
      let emptyArr = ['null', 'not_null', 'not_empty', 'empty']
      if (!emptyArr.includes(item.totalCountParams.func)) {
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
.action-pane-rules-content {
  position: relative;
  display: flex;
}
.action-pane-rules-content .el-form-item {
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
  color: #409eff;
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
  width: 160px;
}
.subSelect {
  width: 140px;
}
.subSelect1 {
  width: 90px;
}
.itemIput-big {
  width: 372px;
}
.itemIput-small {
  width: 50px;
}
.itemIput-number {
  width: 200px;
}
.itemOperateIput {
  width: 180px;
}
.pane-rule-sign {
  width: 40px;
  height: 40px;
  text-align: center;
  line-height: 40px;
  color: #dcdfe6;
  background: #23991f;
  margin-right: 5px;
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
  border: 1px solid #dcdfe6;
}
.input-tag-tips {
  display: inline-block;
  vertical-align: top;
}
</style>
