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
            <el-select v-model="item.func" class="itemIput" @change="data => selectOperateChange(data, item)">
              <el-option
                style="width:200px"
                v-for="(fitem, findex) in fileList"
                :value="fitem.value"
                :key="findex"
                :label="fitem.lable"
              />
            </el-select>
          </el-form-item>
          <!--条件内容区-->
          <div class="pane-rules-inline">
            <!--时间-->
            <div class="pane-rules-inline pane-rules-datetime">
              <!--绝对时间-->
              <div v-if=" !item.func || item.func === 'data'" class="pane-rules-inline">
                <el-form-item prop="params[0].datetimeStart" :ref="'datetimeStart' + item.ruleCode"  :rules="{required: isRequired, validator: (rule, value, callback) => judgeDataTwoISelect(rule, value, callback, item.params), trigger: 'blur'}">
                  <el-date-picker
                    style="width:200px"
                    v-model="item.params[0].datetimeStart"
                    type="datetime"
                    placeholder="选择日期时间"
                    format="yyyy-MM-dd HH:mm:ss"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    class="itemIput"
                  ></el-date-picker>
                </el-form-item>&nbsp; ~ &nbsp;
                <el-form-item prop="params[0].datetimeEnd" :ref="'datetimeStart' + item.ruleCode"  :rules="{required: isRequired, validator: (rule, value, callback) => judgeDataTwoISelect(rule, value, callback, item.params), trigger: 'blur'}"> 
                  <el-date-picker
                    style="width:200px"
                    v-model="item.params[0].datetimeEnd"
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
                  :rules="{required: isRequired, message: '请输入', trigger: 'blur'}"
                >
                  <el-input
                    style="width: 50px;"
                    v-model="item.params[0].value"
                    :maxlength="10"
                    @input="item.params[0].value = keyupDateNumberInput(item.params[0].value)"
                    @blur="item.params[0].value = blurDateNumberInput(item.params[0].value)"
                  ></el-input>
                </el-form-item>
                <el-form-item prop="dateDimension">
                  <el-select
                    v-model="item.dateDimension"
                    class="subSelect1"
                    @change="data => updateDateDimension(data, item)"
                  >
                    <el-option
                      v-for="(fitem, findex) in subTimeSelects"
                      :value="fitem.code"
                      :key="findex"
                      :label="fitem.title"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item prop="subFunc">
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
              <div v-if="item.func === 'relative_times'" class="pane-rules-inline">
                在&nbsp;过去&nbsp;
                <el-form-item prop = "params[0].value1" :ref="'paramsl' + item.ruleCode" :rules="{ required: isRequired, validator: (rule, value, callback) => judgeDateTwoInput(rule, value, callback, item.params), trigger: 'blur'}">
                 <el-input
                    style="width: 50px;"
                    v-model="item.params[0].value1"
                    :maxlength="10"
                    @input="item.params[0].value1 = keyupDateNumberInput(item.params[0].value1)"
                    @blur="item.params[0].value1 = pramasDateBlur(item, item.params[0].value1)"
                  ></el-input>
                </el-form-item>
                <el-form-item prop="dateDimension">
                  <el-select
                    v-model="item.dateDimension"
                    class="subSelect1"
                    @change="data => updateDateDimension(data, item)"
                  >
                    <el-option
                      v-for="(fitem, findex) in subTimeSelects"
                      :value="fitem.code"
                      :key="findex"
                      :label="fitem.title"
                    />
                  </el-select>
                </el-form-item>到&nbsp;过去&nbsp;
                <el-form-item prop = "params[0].value1" :ref="'paramsr' + item.ruleCode" :rules="{ required: isRequired,  validator: (rule, value, callback) => judgeDateTwoInput(rule, value, callback, item.params), trigger: 'blur'}">
                  <el-input
                    style="width: 50px;"
                    v-model="item.params[0].value2"
                    :maxlength="10"
                    @input="item.params[0].value2 = keyupDateNumberInput(item.params[0].value2)"
                    @blur="item.params[0].value2 = pramasDateBlur(item, item.params[0].value2)"
                  ></el-input>
                </el-form-item>
                <el-form-item prop="dateDimension"  :rules="{required: isRequired, message: '请输入', trigger: 'blur'}">
                  <el-select
                    v-model="item.dateDimension"
                    class="subSelect1"
                    @change="data => updateDateDimension(data, item)"
                  >
                    <el-option
                      v-for="(fitem, findex) in subTimeSelects"
                      :value="fitem.code"
                      :key="findex"
                      :label="fitem.title"
                    />
                  </el-select>
                </el-form-item>之内
              </div>
            </div>
          </div>
          <div class="pane-rules-inline">
            <el-form-item prop="havedo" :rules="{required: isRequired, message: '请选择', trigger: 'change'}">
              <el-select v-model="item.havedo" class="subSelect1" >
               <el-option
                      v-for="(fitem, findex) in havedoSelects"
                      :value="fitem.code"
                      :key="findex"
                      :label="fitem.title"
                    />
              </el-select>
            </el-form-item>
            <el-form-item style="width:120px" prop="eventType"  :rules="{required: isRequired, message: '请选择', trigger: 'change'}">
              <el-select v-model="item.eventType" >
                <el-option lable="1" value="点击事件"></el-option>
                <el-option lable="2" value="页面操作"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <i class="el-icon-circle-plus cursor-pointer" @click="addThirdChildrenRules(item, index)"></i>
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
					  <action-data-rules-set3 :data="item" ref="rulesSet" :is-require="isRequired" :from="from"></action-data-rules-set3>
          </div>
          <div v-if="item.havedo === 'yes'" style="margin-left: 40px;">
            <span style="line-height: 40px;">总次数 &nbsp;&nbsp;</span>
            <el-form-item prop="funcType" :rules="{required: isRequired, message: '请选择', trigger: 'change'}">
              <el-select v-model="item.funcType" class="subSelect1">
                <el-option lable="1" value="大于等于"></el-option>
                <el-option lable="2" value="大于"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item  prop="sumtimes" style="width:50px" :rules="{required: isRequired, message: '请输入', trigger: 'blur'}">
              <el-input v-model="item.sumtimes"></el-input>
            </el-form-item>&nbsp;次
          </div>
        </el-form>
        <div v-else>
          <rules-set
            :data="item"
            :is-child="true"
            ref="rulesSet"
            :is-require="isRequired"
            :from="from"
          ></rules-set>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import actionDataRulesSet3 from "./actionData-rules-set3";
import Treeselect, { LOAD_CHILDREN_OPTIONS } from "@riophae/vue-treeselect";
import InputTag from "../components/InputTag";
export default {
  name: "rulesSet",
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
      default: ""
    }
  },
  data() {
    return {
      ttt: [],
      multipleList: [],
      parent: null,
      selectOperateList: [],
      fileList: [
        {
          value: "data",
          lable: "绝对时间"
        },
        {
          value: "relative_time",
          lable: "相对当前时间点"
        },
        {
          value: "relative_times",
          lable: "相对当前时间区间"
        }
			],
			havedoSelects: [
				{
          code: "yes",
          title: "做过"
        },
        {
          code: "no",
          title: "没做过"
        }
			],
      subTimeSelects: [
        {
          code: "DAYS",
          title: "天"
        },
        {
          code: "HOURS",
          title: "小时"
        }
      ],
      subSelects: [
        {
          code: "relative_before",
          title: "之内"
        },
        {
          code: "relative_after",
          title: "之外"
        }
      ]
    };
  },
  computed: {
    isRequired() {
      // 校验规则初始为false,只有在提交时统一校验
      return this.isRequire;
    }
  },
  mounted() {
    // 获取父节点
    let parent = this.$parent;
    while (parent && !parent.isTreeRoot) {
      parent = parent.$parent;
    }
    this.parent = parent;
  },
  components: { actionDataRulesSet3, Treeselect, InputTag },
  methods: {
    updateDateDimension(val, ruleItem) {
      this.parent.updateRulesArr(this.parent.ruleConfig, ruleItem, {
        dateDimension: val
      });
    },

    keyupDateNumberInput(val) {
      // 日期输入框，输入内容 要求 只能输入 正整数
      val = val.replace(/^0(0+)|[^\d]+/g, "");
      return val;
    },
    blurDateNumberInput(val) {
      // 日期输入框，失去焦点时判断输入内容是否符合要求
      let reg = /^([0]|[1-9][0-9]*)$/;
      if (!reg.test(val)) {
        val = "";
      }
      return val;
    },
    pramasDateBlur(item, val) {
      // 时间 区间的判断
      let params = item.params;
      if (params[0].value1 && params[0].value2 && params[0].value1 * 1 <= params[0].value2 * 1) {
        this.$refs["paramsl" + item.ruleCode][0].clearValidate();
        this.$refs["paramsr" + item.ruleCode][0].clearValidate();
      }
      return this.blurDateNumberInput(val); // 返回一下处理过的值 用于赋值
    },
    selectOperateChange (val, ruleItem) { //时间区间改变时，数据清空，重新输入
    this.parent.updateOperateChange(this.parent.ruleConfig, ruleItem)
        // this.$refs['datetime' + ruleItem.ruleCode][0].clearValidate()
				// this.$refs['datetimerange' + ruleItem.ruleCode][0].clearValidate()
    },
     judgeDataTwoISelect (rule, value, callback, params) { // 日期介于判断
      if (!value) {
        callback(new Error('请输入'))
      }
      else if ( params[0].datetimeStart && params[0].datetimeEnd && params[0].datetimeStart  >=  params[0].datetimeEnd ) {
        callback(new Error('起始日期应小于终止日期'))
      } else {
        callback()
      }
    },
    judgeDateTwoInput (rule, value, callback, params) { // 数值时间区间判断
      if (!value ) {
        callback(new Error('请输入'))
      } else if (params[0].value1 && params[0].value2 && params[0].value1 * 1 >= params[0].value2 * 1) {
        callback(new Error('起始数值应小于等于终止数值'))
      } else {
        callback()
      }
    },
    addChildrenRules(item) {
      // 添加子条件
      this.parent.addChildreRules(this.parent.ruleConfig, item);
    },
    deleteRules(item) {
      // 删除条件
      this.parent.deleteRules(this.parent.ruleConfig, item);
    },
    
    addThirdChildrenRules(item) {
      //添加三级子条件
      this.parent.addThirdChildrenRules(this.parent.ruleConfig, item);
    },
    switchSymbol(ruleCode) {
      // 切换且或
      this.parent.switchSymbol(ruleCode, this.parent.ruleConfig);
    },

    selectDateTimeChange(val, ruleItem) {
      // 处理一下时间数据
      this.parent.updateDateTimeChange(this.parent.ruleConfig, ruleItem);
    },
	}
};
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
