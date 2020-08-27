<template>
  <div class="action-rule-pane">
    <el-form :inline="true" label-position="left">
      <el-form-item label="用户行为满足：">
        <el-tooltip placement="top">
          <!-- <div slot="content"  class="tips-content"></div> -->
          <i class="el-icon-info cursor-pointer" style="color:#409eff; margin-right:60px;"></i>
        </el-tooltip>
        <el-input v-model="expression" disabled style="width: 800px" />
      </el-form-item>
      <el-form-item style="float:right">
        <i class="el-icon-circle-plus cursor-pointer" @click="addRules" v-if="from !== 'api'">添加</i>
      </el-form-item>
    </el-form>
    <div v-if="ruleConfig.rules && ruleConfig.rules.length > 0">
      <action-data-rules-set
        :data="ruleConfig"
        ref="rulesSet"
        :is-require="isRequired"
        :from="from"
      ></action-data-rules-set>
    </div>
  </div>
</template>
<script>
import actionDataRulesSet from "./actionData-rule-set.vue";
import {
  selectOperate,
  selectAllCata,
  enumTypeList,
  dataIndexManagerCandidate
} from "@/api/dataAnalysis/dataInsightManage";
import {
  findRuleIndex,
  getAbc,
  findVueSelectItemIndex,
  deepClone
} from "../dataAnalysisUtils/utils";
import Treeselect, { LOAD_CHILDREN_OPTIONS } from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
  components: { actionDataRulesSet, Treeselect },
  props: {
    id: Number,
    from: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      isTreeRoot: true, // 父根节点
      channelId: "",
      expression: "",
      expressionTemplate: "",
      ruleConfig: {
        // 规则数据
        ruleCode: "rule_all",
        type: "rules_function",
        relation: "and",
        rules: []
      },
      isRequired: true,
      indexList: [],
      isSelectedUneffectIndex: [],
      lastSubmitRuleConfig: {}
      // subTimeSelects: [
      //   {
      //     code: "DAYS",
      //     title: "天"
      //   },
      //   {
      //     code: "HOURS",
      //     title: "小时"
      //   }
      //   // {
      //   //   code: 'MINUTES', title: '分钟'
      //   // }
      // ]
    };
  },
  methods: {
    init() {
      this.ruleConfig = {
        // 规则数据
        ruleCode: "rule_all",
        type: "rules_function",
        relation: "and",
        rules: []
      };
      this.expression = "";
      this.expressionTemplate = "";
      this.isRequired = false; // 默认为false,不设置的话，保存后再进入会变
    },
    renderData(data, channelId) {
      this.channelId = channelId;
      let configJson = JSON.parse(data);
      this.ruleConfig = configJson.ruleConfig;
      this.expression = configJson.expression;
      this.expressionTemplate = configJson.expressionTemplate;
      this.$nextTick(() => {
        // 默认将验证错误信息全部清除
        let ruleFormArr = this.getRuleForm();
        ruleFormArr.forEach(item => {
          item.clearValidate();
        });
      });
    },
    renderApiData(data) {
      this.ruleConfig = data.ruleConfig;
      this.expression = data.expression;
    },
    async loadOptions({ action, parentNode, callback }) {
      if (action === LOAD_CHILDREN_OPTIONS) {
        callback();
      }
    },
    setInitRulesConfig() {
      // 将规则初始化
      if (this.ruleConfig.rules.length) {
        this.ruleConfig.rules = [];
        this.ruleConfig.rules.push(this.getRuleTemplateItem());
      }
      this.updateConditionId(this.ruleConfig);
    },
    getRuleTemplateItem() {
      // 条件模板
      return {
        type: "rule",
        func: "", //选择的时间类型
        subFunc: "",
        dateDimension: "",
        havedo: "", //是否做过
        eventType: "", //事件类型
        funcType: "", //总次数比较类型
        sumtimes: "", //总次数
        params: [
          {
            value: "",
            title: ""
          }
        ]
      };
    },
    updateConditionId(arr, position, type) {
      // 每次增删时，遍历一下ruleConfig,更改每个条件的ruleCode   type:增，删，切换且或
      var expArr = [];
      var expStr = "";
      var expArrTemp = [];
      var expStrTemp = "";
      let relation = arr.relation;
      function _find(arr, position) {
        var exp = [];
        var expTemp = [];
        var temp = "";
        var extArr = [];
        arr.rules.forEach((item, index) => {
          if (position != undefined) {
            temp = position + "_" + index;
          } else {
            temp = index + "";
          }
          item.temp = temp;
          if (!item.rules) {
            extArr = extArr.concat(item);
            if (!type || type !== "switch") {
              // 切换且或时，不需要再重新赋值
              let id = "";
              extArr.forEach((extitem, extindex) => {
                if (item.temp === extitem.temp) {
                  id = getAbc(extindex);
                  item.ruleCode = id;
                }
              });
            }
            // 获取表达式
            if (position != undefined) {
              exp.push(item.ruleCode);
              expTemp.push(`{${item.ruleCode}}`);
              if (index === arr.rules.length - 1) {
                let str = `(${[...new Set(exp)].join(
                  " " + arr.relation + " "
                )})`; // 二级拼接
                let tempStr = `(${[...new Set(expTemp)].join(
                  " " + arr.relation + " "
                )})`; // 二级拼接
                expArr.push(str);
                expStr = expArr.join(" " + relation + " "); // 所有一级拼接
                expArrTemp.push(tempStr);
                expStrTemp = expArrTemp.join(" " + relation + " ");
              }
            } else {
              expArr.push(item.ruleCode);
              expStr = expArr.join(" " + arr.relation + " ");
              expArrTemp.push(`{${item.ruleCode}}`);
              expStrTemp = expArrTemp.join(" " + arr.relation + " ");
            }
            // 获取表达式end
          } else {
						extArr = extArr.concat(item.rules);
            let id = "";
            extArr.forEach((extitem, extindex) => {
              item.rules.forEach((itemRules, indexRules) => {
                if (itemRules.temp === extitem.temp) {
                  id = getAbc(extindex);
									itemRules.ruleCode = id;
                }
              });
						});
						temp = _find(item, temp);
          }
        });
      }
			_find(arr, position);
			console.log('arr: ', arr);
      this.expression = expStr;
      this.expressionTemplate = expStrTemp;
      if (type !== "switch") {
        this.ruleConfig = arr;
      }
    },
    updateRulesArr(arr, citem, obj) {
      // 更新数组的数据
      arr.rules.forEach(item => {
        if (item.ruleCode === citem.ruleCode) {
          Object.keys(obj).forEach(oitem => {
            item[oitem] = obj[oitem];
          });
        } else {
          if (item.rules) {
            this.updateRulesArr(item, citem, obj);
          }
        }
      });
      let rules1 = arr.rules[0];
      arr.rules.splice(0, 1, rules1); // 强制更新一下数组
      this.ruleConfig = arr;
    },
    updateDateTimeChange(data, citem) {
      // 处理一下时间内容，时间插件v-show后与其他输入框不能共用一个参数
      let newArr = [];
      if (!citem.params[0].datetime) {
        newArr = [
          {
            value: "",
            title: "",
            datetime: ""
          }
        ];
      } else {
        newArr = [
          {
            value: citem.params[0].datetime,
            title: "",
            datetime: citem.params[0].datetime
          }
        ];
      }
      this.updateRulesArr(data, citem, { params: newArr });
    },
    addChildreRules(data, citem) {
      // 添加子集
      let indexPath = findRuleIndex(data.rules, citem) + "";
      let indexPathArr = indexPath.split(",");
      if (indexPathArr.length === 1) {
        let newObj = {
          relation: "and",
          type: "rules_function",
          ruleCode: citem.ruleCode,
          rules: [data.rules[indexPathArr[0]], this.getRuleTemplateItem()]
        };
        data.rules.splice(indexPathArr[0], 1, newObj);
      } else {
        data.rules[indexPathArr[0]].rules.push(this.getRuleTemplateItem());
      }
      this.updateConditionId(this.ruleConfig);
    },
    deleteRules(data, citem) {
      // 删除规则
      let indexPath = findRuleIndex(data.rules, citem) + "";
      let indexPathArr = indexPath.split(",");
      if (indexPathArr.length === 1) {
        data.rules.splice(indexPathArr[0], 1);
      } else {
        data.rules[indexPathArr[0]].rules.splice(indexPathArr[1], 1);
        if (data.rules[indexPathArr[0]].rules.length === 1) {
          // 若二级内容只有一个时，提至一级位置
          let oldObj = data.rules[indexPathArr[0]].rules[0];
          data.rules.splice(indexPathArr[0], 1, oldObj);
        }
      }
      this.updateConditionId(this.ruleConfig);
    },
    switchSymbol(ruleCode, data) {
      // 切换且或
      if (data.ruleCode === ruleCode) {
        data.relation = this.ruleConfig.relation === "and" ? "or" : "and";
      } else {
        data.rules.forEach((item, index) => {
          if (item.relation && item.ruleCode === ruleCode) {
            data.rules[index].relation =
              data.rules[index].relation === "and" ? "or" : "and";
          }
        });
      }
      this.updateConditionId(this.ruleConfig, undefined, "switch");
    },
    addRules() {
      // 添加一级条件
      this.ruleConfig.rules.push(this.getRuleTemplateItem());
      this.updateConditionId(this.ruleConfig);
    },
    getSelectOperateList(type, fn) {
      if (!type) {
        fn([]);
        return;
      }
      selectOperate(type).then(({ data }) => {
        let selectOperateList = [];
        if (data.status !== "1") {
          selectOperateList = [];
        }
        if (!data.data || (data.data && !data.data.length)) {
          selectOperateList = [];
        }
        selectOperateList = data.data;
        fn(selectOperateList);
      });
    },
    getRuleForm() {
      // 获取所有的$refs.ruleForm,用于统一校验数据
      let ruleSet = this.$refs.rulesSet;
      let ruleArr = [];
      ruleArr = ruleSet.$refs.ruleForm || []; // 如果只有一个两极的内容，则默认会为空
      ruleSet.$children.forEach(item => {
        if (item.$refs.ruleForm) {
          ruleArr = [...ruleArr, ...item.$refs.ruleForm];
        }
      });
      return ruleArr;
    },
    updateRulesConfig(arr) {
      // 提交数据时，删除配置数据中多余的内容selectOperateList,selectEnumsList
      this.isSelectedUneffectIndex = [];
      arr.rules.forEach(item => {
        if (!item.rules) {
          item.selectOperateList = item.selectOperateList.filter(
            sitem => sitem.code === item.func
          );
          let selectEnumsArr = [];
          item.selectEnumsList.forEach(sitem => {
            item.params.forEach(pitem => {
              if (sitem.childrenNum === pitem.value) {
                selectEnumsArr.push(sitem);
              }
            });
          });
          item.selectEnumsList = selectEnumsArr;
          item.indexList = [];
          if (item.label && !item.enable) {
            this.isSelectedUneffectIndex.push(item.label);
          }
        } else {
          if (item.rules) {
            this.updateRulesConfig(item);
          }
        }
      });
      return arr;
    },
    ruleValidate() {
      if (!this.ruleConfig.rules.length) {
        return this.$message({
          message: "请配置用户规则信息",
          type: "error",
          center: true
        });
      }
    }
  }
};
</script>
<style>
.action-rule-pane {
  margin-left: 15px;
}
.action-rule-pane .el-form-item__label {
  padding-right: 0;
  width: 100px;
}
</style>
