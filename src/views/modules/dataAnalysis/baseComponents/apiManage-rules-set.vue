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
                <el-form-item prop="params[0].value" :rules="{ required: isRequired, message: '请输入', trigger: 'blur' }">
                  <el-input-number v-model="item.params[0].value" controls-position="right" class="itemIput-small"></el-input-number>
                </el-form-item>
                于
                <el-form-item prop="params[1].value" :rules="{required: isRequired, message: '请输入', trigger: 'blur'}">
                  <el-input-number v-model="item.params[1].value" controls-position="right" class="itemIput-small"></el-input-number> 之间
                </el-form-item>
              </div>
              <el-form-item prop="params[0].value" :rules="{required: isRequired, message: '请输入', trigger: 'blur'}" v-else>
                <el-input-number v-model="item.params[0].value" controls-position="right" class="itemIput"></el-input-number>
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
            <div v-if="item.fieldType === 'date'" class="pane-rules-inline">
              <!--绝对时间-->
              <el-form-item v-if="isDateSingleShow(item)" prop="params[0].value" :rules="{required: isRequired, message: '请选择', trigger: 'change'}">
                <el-date-picker
                  v-model="item.params[0].value"
                  type="datetime"
                  placeholder="选择日期时间"
                  value-format="yyyy-MM-dd hh:mm:ss"
                >
                </el-date-picker>
              </el-form-item>
              <!--区间-->
              <el-form-item v-if="item.func === 'between'" prop="params[0].selectVal" :rules="{required: isRequired, message: '请选择', trigger: 'change'}">
                <el-date-picker
                  v-model="item.params[0].selectVal"
                  type="datetimerange"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :default-time="['00:00:00']"
                  value-format="yyyy-MM-dd hh:mm:ss"
                  @change="data => selectEnumsChange(data, item)"
                  class="itemIput-big"
                >
                </el-date-picker>
              </el-form-item>
              <!--相对时间-->
              <div v-if="item.func === 'relative_before' || item.func === 'relative_within'" class="pane-rules-inline">
                <!-- 在&nbsp; -->
                <el-form-item prop="params[0].value" :rules="{required: isRequired, message: '请输入', trigger: 'blur'}">
                  <el-input-number v-model="item.params[0].value" controls-position="right" class="itemIput-small"></el-input-number>
                </el-form-item>
                天&nbsp;
              </div>
              <!--相对时间点-->
              <div v-if="item.func === 'relative_time_in'" class="pane-rules-inline">
                在&nbsp;过去&nbsp;
                <el-form-item prop="params[0].value" :rules="{required: isRequired, message: '请输入', trigger: 'blur'}">
                  <el-input-number v-model="item.params[0].value" controls-position="right" class="itemIput-small"></el-input-number>
                </el-form-item>
                天&nbsp;到&nbsp;过去&nbsp;
                <el-form-item prop="params[1].value" :rules="{required: isRequired, message: '请输入', trigger: 'blur'}">
                  <el-input-number v-model="item.params[1].value" controls-position="right" class="itemIput-small"></el-input-number>
                </el-form-item>
                天&nbsp;之内
              </div>
            </div>
            <el-form-item class="btn-group">
              <!-- <i class="el-icon-edit cursor-pointer"></i> -->
              <!-- <i class="el-icon-info cursor-pointer" style="color:#409eff"></i> -->
              <el-tooltip v-if="item.func === 'relative_time_in'" placement="top">
                <div slot="content" v-html="toolTipContent(item)"></div>
                <i class="el-icon-info cursor-pointer" style="color:#409eff"></i>
              </el-tooltip>
              <i class="el-icon-circle-plus cursor-pointer" @click="addChildrenRules(item, index)" v-if="!isChild || isChild && index === data.rules.length-1"></i>
            </el-form-item>
          </div>
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
      this.parent.fieldCodeChange(this.parent.ruleConfig, ruleItem, { fieldType: node.fieldType, enumTypeNum: node.enumTypeNum, sourceTable: node.sourceTable, fieldId: node.fieldId })
    },
    selectOperateChange (val, ruleItem) { // 操作符改变时，数据清空，重新输入
      this.parent.updateOperateChange(this.parent.ruleConfig, ruleItem)
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
    selectEnumsChange (val, ruleItem) {
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
    width: 200px;
    height: 40px;
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
    width: 220px;
  }
  .itemIput-big {
    width: 366px;
  }
  .itemIput-small {
    width: 100px;
  }
  .itemOperateIput {
    width: 180px;
  }
</style>
