<template>
  <el-dialog title="标签分组" :modal-append-to-body="false" :append-to-body="true" :visible.sync="visible" width="70%" :close-on-click-modal="false">
    <div v-if="selectedFieldType === 'number'" v-for="(outdata, index) in baseForm.numberDigitalRange" :key="index">
      <el-form :model="outdata" ref="baseForm" :inline="true">
        <div style="display:flex">
          <div class="content-range">区间{{index+1}}</div>
          <el-form-item prop="func" :rules="{required: isRequired, message: '请选择', trigger: 'change'}">
            <el-select v-model="outdata.func" class="itemOperateIput" @change="data => selectOperateChange(data, outdata,index)">
              <el-option style="width:200px" v-for="(fitem, findex) in fileList" :value="fitem.code" :key="findex" :label="fitem.title" />
            </el-select>
          </el-form-item>
          <!-- 数字区间 -->
          <div class="pane-rules-inline" v-if="outdata.func === 'between'">
            <el-form-item prop="startRangeType" :rules="{required: isRequired, message: '请选择', trigger: 'change'}">
              <el-select v-model="outdata.startRangeType" class="itemIput-small">
                <el-option value="open" label="("></el-option>
                <el-option value="close" label="["></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="params[0].value" :rules="{required: isRequired, message: '请输入', trigger: 'blur'}">
              <el-input v-model="outdata.params[0].value" class="itemIput-small" @input="outdata.params[0].value = keyupNumberInput(outdata.params[0].value)"></el-input>
            </el-form-item>&nbsp;,&nbsp;
            <el-form-item prop="params[1].value" :rules="{required: isRequired, message: '请输入', trigger: 'blur'}">
              <el-input v-model="outdata.params[1].value" class="itemIput-small" @input="outdata.params[1].value = keyupNumberInput(outdata.params[1].value)"></el-input>
            </el-form-item>
            <el-form-item prop="endRangeType" :rules="{required: isRequired, message: '请选择', trigger: 'change'}">
              <el-select v-model="outdata.endRangeType" class="itemIput-small">
                <el-option value="open" label=")"></el-option>
                <el-option value="close" label="]"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="pane-rules-inline" v-if="outdata.func !== 'between'">
            <el-form-item prop="singleValue" :rules="{required: isRequired, message: '请输入', trigger: 'blur'}">
              <el-input v-model="outdata.singleValue" class="itemIput-small" @input="outdata.singleValue = keyupNumberInput(outdata.singleValue)"></el-input>
            </el-form-item>
          </div>
          <el-form-item class="btn-group">
            <i class="el-icon-circle-plus cursor-pointer" @click="addDomain(outdata, index)" v-if="index === baseForm.numberDigitalRange.length-1"></i>
          </el-form-item>
          <el-form-item style="float: right" v-if="closeIconVisible">
            <i class="el-icon-close cursor-pointer" @click="removeDomain(outdata, index)"></i>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div style="display: flex;" v-if="selectedFieldType === 'date'" v-for="(outdata, index) in baseForm.dateDigitalRange" :key="index">
      <el-form :model="outdata" ref="baseForm" :inline="true">
        <!--条件内容区-->
        <div style="display: flex">
          <div class="content-range">区间{{index+1}}</div>
          <el-form-item prop="func" :rules="{required: true, message: '请选择', trigger: 'change'}">
            <el-select v-model="outdata.func" class="itemOperateIput" @change="data => selectOperateChange(data, outdata,index)">
              <el-option style="width:200px" v-for="(fitem, findex) in fileList" :value="fitem.code" :key="findex" :label="fitem.title" />
            </el-select>
          </el-form-item>
          <!--绝对时间-->
          <el-form-item v-show="isDateSingleShow(outdata)" :ref="'datetime' + index" prop="datetime" :rules="{required: true && isDateSingleShow(outdata), message: '请选择', trigger: 'change'}">
            <el-date-picker v-model="outdata.datetime" type="datetime" placeholder="选择日期时间" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" class="itemIput"></el-date-picker>
          </el-form-item>
          <!--区间-->
          <div v-if="outdata.func === 'between'" class="pane-rules-inline">
            <el-form-item prop="startRangeType" :rules="{required: isRequired, message: '请选择', trigger: 'change'}">
              <el-select v-model="outdata.startRangeType" class="itemIput-small">
                <el-option value="open" label="("></el-option>
                <el-option value="close" label="["></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :ref="'datetimerange' + index" prop="datetimeRange" :rules="{required: true && outdata.func === 'between', message: '请选择', trigger: 'change'}">
              <el-date-picker
                v-model="outdata.datetimeRange"
                type="datetimerange"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :default-time="['00:00:00']"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                class="itemIput-big"
              ></el-date-picker>
            </el-form-item>
            <el-form-item prop="endRangeType" :rules="{required: isRequired, message: '请选择', trigger: 'change'}">
              <el-select v-model="outdata.endRangeType" class="itemIput-small">
                <el-option value="open" label=")"></el-option>
                <el-option value="close" label="]"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <!--相对当前时间点-->
          <div v-if="outdata.func === 'relative_time'" class="pane-rules-inline">
            在&nbsp;过去&nbsp;
            <el-form-item prop="params[0].value" :rules="{required: true, message: '请输入', trigger: 'blur'}">
              <el-input
                v-model="outdata.params[0].value"
                :maxlength="10"
                @input="outdata.params[0].value = keyupDateNumberInput(outdata.params[0].value)"
                @blur="outdata.params[0].value = blurDateNumberInput(outdata.params[0].value)"
                class="itemIput-small"
              ></el-input>
            </el-form-item>&nbsp;天&nbsp;
            <!-- <el-form-item prop="rangeRelative" :rules="{required: true, message: '请选择', trigger: 'change'}">
              <el-select v-model="outdata.rangeRelative" class="subSelect1">
                <el-option v-for="(fitem, findex) in subTimeSelects" :value="fitem.code" :key="findex" :label="fitem.title" />
              </el-select>
            </el-form-item>-->
            <el-form-item prop="rangeRelative" :rules="{required: true, message: '请选择', trigger: 'change'}">
              <el-select v-model="outdata.rangeRelative" class="subSelect">
                <el-option v-for="(fitem, findex) in subSelects" :value="fitem.code" :key="findex" :label="fitem.title" />
              </el-select>
            </el-form-item>
          </div>
          <!-- 相对时间点-->
          <div v-if="outdata.func === 'relative_time_in'" class="pane-rules-inline">
            在&nbsp;过去&nbsp;
            <el-form-item
              prop="params[0].value"
              :ref="'paramsl' + index"
              :rules="{ required: true, validator: (rule, value, callback) => judgeDateTwoInput(rule, value, callback, outdata.params), trigger: 'blur'}"
            >
              <el-input
                v-model="outdata.params[0].value"
                :maxlength="10"
                class="itemIput-small"
                @input="outdata.params[0].value = keyupDateNumberInput(outdata.params[0].value)"
                @blur="outdata.params[0].value = pramasDateBlur(outdata, outdata.params[0].value, index)"
                :min="1"
              ></el-input>
            </el-form-item>
            <!-- <el-form-item prop="rangeRelative">
              <el-select v-model="outdata.rangeRelative" class="subSelect1">
                <el-option v-for="(fitem, findex) in subTimeSelects" :value="fitem.code" :key="findex" :label="fitem.title" />
              </el-select>
            </el-form-item>-->
            天&nbsp;到&nbsp;过去&nbsp;
            <el-form-item
              prop="params[1].value"
              :ref="'paramsr' + index"
              :rules="{ required: true, validator: (rule, value, callback) => judgeDateTwoInput(rule, value, callback, outdata.params), trigger: 'blur'}"
            >
              <el-input
                v-model="outdata.params[1].value"
                :maxlength="10"
                class="itemIput-small"
                @input="outdata.params[1].value = keyupDateNumberInput(outdata.params[1].value)"
                @blur="outdata.params[1].value = pramasDateBlur(outdata, outdata.params[1].value, index)"
                :min="1"
              ></el-input>
            </el-form-item>天&nbsp;之内
            <!-- <el-form-item prop="rangeRelative">
              <el-select v-model="outdata.rangeRelative" class="subSelect1" @change="data => updateDateDimension(data, item)">
                <el-option v-for="(fitem, findex) in subTimeSelects" :value="fitem.code" :key="findex" :label="fitem.title" />
              </el-select>
            </el-form-item>-->
          </div>
          <el-form-item class="btn-group">
            <i class="el-icon-circle-plus cursor-pointer" @click="addDomain(outdata, index)" v-if="index === baseForm.dateDigitalRange.length-1"></i>
          </el-form-item>
          <el-form-item style="float: right" v-if="closeIconVisible">
            <i class="el-icon-close cursor-pointer" @click="removeDomain(outdata, index)"></i>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <!-- 枚举值 -->
    <el-form :model="dataForm" ref="dataForm" :rules="dataRules" :inline="true">
      <el-form-item v-if="(baseForm.numberDigitalRange.length === 0 && selectedFieldType === 'number' ) ||  (baseForm.dateDigitalRange.length === 0 && selectedFieldType === 'date')">
        <el-button @click="addDomain">新增区间</el-button>
      </el-form-item>
      <el-form-item prop="selectVal" label="枚举" label-width="50px" v-if="enumsVisible">
        <el-select v-model="dataForm.selectVal" multiple clearable class="itemIput">
          <el-option v-for="(fitem, findex) in selectEnumsList" :value="fitem.childrenNum" :key="findex" :label="fitem.childrenValue" />
        </el-select>
      </el-form-item>
      <div>
        <el-form-item prop="isSetGroup" label="是否启用：">
          <el-radio v-model="dataForm.isSetGroup" :label="1">是</el-radio>
          <el-radio v-model="dataForm.isSetGroup" :label="0">否</el-radio>
        </el-form-item>
      </div>
    </el-form>

    <div slot="footer">
      <el-button type="primary" @click="saveHandle" size="small">确定</el-button>
      <el-button type="default" @click="cancelHandle" size="small">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { getchildrenList } from '@/api/dataAnalysis/dataInsightManage'
import { getOperators } from '@/api/dataAnalysis/indexManage'
import { deepClone } from '../dataAnalysisUtils/utils'
export default {
  data () {
    return {
      visible: false,
      closeIconVisible: true,
      isRequired: true,
      enumsVisible: false,
      selectedFieldType: 'number',
      dataForm: {
        id: 0,
        isSetGroup: '',
        selectVal: []
      },
      baseForm: {
        numberDigitalRange: [],
        dateDigitalRange: []
      },
      fileList: [],
      selectEnumsList: [],
      subSelects: [
        {
          code: 'before', title: '之前'
        },
        {
          code: 'within', title: '之内'
        }
      ],
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        },
        {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        },
        {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      dataRules: {
        selectVal: [
          { required: true, message: '请选择', trigger: 'biur' }
        ]
        // dataRange: [
        //   { required: true,  message: '请选择时间区间', trigger: 'biur' }
        // ],
        // smallerValue: [
        //   { required: true,  message: '请输入', trigger: 'biur' }
        // ],
        // largerValue: [
        //   { required: true,  message: '请输入', trigger: 'biur' }
        // ],
      }
    }
  },
  methods: {
    init (val, selected) {
      this.selectedFieldType = selected.fieldType
      // this.dataForm.id = val.id
      this.enumsVisible = selected.enumTypeNum ? true : false
      this.selectEnumsList = []
      this.dataForm = {
        id: val.id,
        selectVal: [],
        isSetGroup: ''
      }
      this.baseForm.numberDigitalRange = []
      this.baseForm.dateDigitalRange = []
      if (this.enumsVisible) {
        let params = {
          typeNum: selected.enumTypeNum
        }
        getchildrenList(params).then(({ data }) => {
          if (data.status === '1') {
            this.selectEnumsList = data.data
          }
        })
      } else {
        this.getOperatorsList(this.selectedFieldType)
      }
      this.visible = true
    },
    getOperatorsList (type) {
      let params = {
        type: type
      }
      getOperators(params).then(({ data }) => {
        if (data && data.status === '1' && data.data.length) {
          this.fileList = data.data
        } else {
          this.fileList = []
        }
      })
    },
    selectOperateChange (data, outdata, index) {
      let arr = deepClone(this.baseForm)
      if (this.selectedFieldType === 'number') {
        arr.numberDigitalRange[index] = {
          'params': [
            {
              value: '',
              title: ''
            },
            {
              value: '',
              title: ''
            }
          ],
          func: data,
          startRangeType: '',
          endRangeType: '',
          singleValue: ''
        }
      } else if (this.selectedFieldType === 'date') {
        arr.dateDigitalRange[index] = {
          'params': [
            {
              value: '',
              title: ''
            },
            {
              value: '',
              title: ''
            }
          ],
          func: data,
          datetime: '',
          datetimeRange: [],
          startRangeType: '',
          endRangeType: '',
          rangeRelative: ''
        }
      }
      this.baseForm = arr
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
    judgeDateTwoInput (rule, value, callback, params) { // 数值时间区间判断
      if (value === '') {
        callback(new Error('请输入'))
      } else if (params[0].value * 1 < params[1].value * 1) {
        callback(new Error('起始数值应大于等于终止数值'))
      } else {
        callback()
      }
    },
    pramasDateBlur (item, val, index) { // date 区间的判断
      let params = item.params
      if (params[0].value * 1 >= params[1].value * 1) {
        this.$refs['paramsl' + index][0].clearValidate()
        this.$refs['paramsr' + index][0].clearValidate()
      }
      return this.blurDateNumberInput(val) // 返回一下处理过的值 用于赋值
    },
    isDateSingleShow (item) { // 单时间日期是否显示
      let showSingleArr = ['eq', 'neq', 'gt', 'lt', 'ge', 'le']
      if (showSingleArr.includes(item.func)) {
        return true
      } else {
        return false
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
    addDomain (outdata, index) {
      if (this.baseForm.numberDigitalRange.length === 20 || this.baseForm.dateDigitalRange.length === 20) {
        this.$message({
          type: 'error',
          message: '最多设置20个区间'
        })
        return
      }
      if (this.selectedFieldType === 'number') {
        this.baseForm.numberDigitalRange.push({
          'params': [
            {
              value: '',
              title: ''
            },
            {
              value: '',
              title: ''
            }
          ],
          startRangeType: '',
          endRangeType: '',
          singleValue: '',
          func: ''
        })
        if (this.baseForm.numberDigitalRange.length > 0) {
          this.closeIconVisible = true
        }
      } else if (this.selectedFieldType === 'date') {
        this.baseForm.dateDigitalRange.push({
          'params': [
            {
              value: '',
              title: ''
            },
            {
              value: '',
              title: ''
            }
          ],
          datetime: '',
          datetimeRange: [],
          func: '',
          startRangeType: '',
          endRangeType: '',
          rangeRelative: ''
        })

        if (this.baseForm.dateDigitalRange.length > 0) {
          this.closeIconVisible = true
        }
      }
    },
    removeDomain (item, i) {
      if (this.baseForm.numberDigitalRange.length === 0 && this.baseForm.dateDigitalRange.length === 0) {
        this.closeIconVisible = false
      }
      if (this.selectedFieldType === 'number') {
        var index = this.baseForm.numberDigitalRange.indexOf(item)
        this.baseForm.numberDigitalRange.splice(index, 1)
      }
      if (this.selectedFieldType === 'date') {
        let index = this.baseForm.dateDigitalRange.indexOf(item)
        this.baseForm.dateDigitalRange.splice(index, 1)
      }
    },
    saveHandle () {
      let indexGroupConfigs = []
      let ruleArr = []
      if (this.enumsVisible) {
        ruleArr = [...this.$refs['dataForm']]
      } else {
        ruleArr = [...this.$refs['baseForm'], ...this.$refs['dataForm']]
      }
      let flag = true
      ruleArr.forEach(item => {
        item.validate(valid => {
          if (!valid) {
            flag = false
          }
        })
      })
      if (this.selectedFieldType === 'number') {
        this.baseForm.numberDigitalRange.forEach(item => {
          let arr = {
            'dimension': item.func === 'between' ? `${item.params[0].value},${item.params[1].value}` : item.singleValue,
            'func': item.func,
            'startRangeType': item.startRangeType,
            'endRangeType': item.endRangeType,
            'rangeRelative': ''
          }
          indexGroupConfigs.push(arr)
        })
      } else if (this.selectedFieldType === 'date') {
        this.baseForm.dateDigitalRange.forEach(item => {
          let arr = {
            'func': item.func,
            'startRangeType': item.startRangeType,
            'endRangeType': item.endRangeType,
            'rangeRelative': item.rangeRelative
          }
          if (item.func === 'between') {
            arr.dimension = `${item.datetimeRange[0]},${item.datetimeRange[1]}`
          } else if (item.func === 'relative_time' || item.func === 'relative_time_in') {
            arr.dimension = `${item.params[0].value},${item.params[1].value}`
          } else {
            arr.dimension = item.datetime
          }
          indexGroupConfigs.push(arr)
        })
      } else if (this.enumsVisible) {
        this.dataForm.selectVal.forEach(item => {
          let arr = {
            'func': 'eq',
            'dimension': item
          }
          indexGroupConfigs.push(arr)
        })
      }
      if (flag) {
        this.$emit('refreshDataList', indexGroupConfigs, this.dataForm.id)
        this.visible = false
        this.$refs['dataForm'].resetFields()
      }
    },
    cancelHandle () {
      this.visible = false
    }
  }
}
</script>
<style scoped>
.content-range {
  width: 100px;
  height: 36px;
  border: solid 1px #dcdfe6;
  text-align: center;
  line-height: 36px;
  margin-right: 10px;
}
.pane-rules-inline {
  margin-left: 20px;
  display: inline-block;
  line-height: 36px;
}
.parentheses {
  font-size: 32px;
}
.itemIput-small {
  width: 100px;
}
.btn-group i {
  margin-left: 20px;
}
</style>
