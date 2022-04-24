<template>
  <el-dialog title="标签分组" :modal-append-to-body="false" :append-to-body="true" :visible.sync="visible" width="50%" :close-on-click-modal="false">
    <el-form :model="dataForm" ref="dataForm" :rules="dataRules" :inline="true">
      <div v-if="selectedFieldType !== '枚举'">
        <div style="display: flex;" v-for="(outdata, index) in dataForm.digitalRange" :key="index">
          <div class="content-range">区间{{index+1}}</div>
          <el-form-item prop="func" :rules="{required: isRequired, message: '请选择', trigger: 'change'}">
            <el-select v-model="outdata.func" class="itemOperateIput">
              <el-option style="width:200px" v-for="(fitem, findex) in fileList" :value="fitem.value" :key="findex" :label="fitem.lable" />
            </el-select>
          </el-form-item>
          <!-- 数字区间 -->
          <div class="pane-rules-inline" v-if="selectedFieldType === '数值'">
            <el-form-item>
              <el-select v-model="outdata.startRangeType" class="itemIput-small">
                <el-option value="open" label="("></el-option>
                <el-option value="close" label="["></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="smallerValue">
              <el-input
                v-model="outdata.smallerValue"
                class="itemIput-small"
                @input="outdata.smallerValue = keyupNumberInput(outdata.smallerValue)"
                @blur="outdata.smallerValue = pramasNumBlur(outdata, outdata.smallerValue, index)"
              ></el-input>
            </el-form-item>&nbsp;-&nbsp;
            <el-form-item prop="largerValue">
              <el-input
                v-model="outdata.largerValue"
                class="itemIput-small"
                @input="outdata.largerValue = keyupNumberInput(outdata.largerValue)"
                @blur="outdata.largerValue = pramasNumBlur(outdata, outdata.largerValue,index)"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-select v-model="outdata.endRangeType" class="itemIput-small">
                <el-option value="open" label=")"></el-option>
                <el-option value="close" label="]"></el-option>
              </el-select>
            </el-form-item>
          </div>
            <!--条件内容区-->
          <div class="pane-rules-inline" v-if="selectedFieldType === '时间'">
            <!--相对当前时间点-->
            <div v-if="item.func === 'relative_time'" class="pane-rules-inline">
              在&nbsp;过去&nbsp;
              <el-form-item
                prop="params[0].value"
                :ref="'paramst' + index"
                :rules="{required: isRequired, message: '请输入', trigger: 'blur'}"
              >
                <el-input
                  style="width: 150px;"
                  v-model="outdata.params[0].value"
                  :maxlength="10"
                  @input="outdata.params[0].value = keyupDateNumberInput(outdata.params[0].value)"
                  @blur="outdata.params[0].value = blurNumberInput(outdata.params[0].value)"
                ></el-input>
              </el-form-item>
              <el-form-item prop="dateDimension" :ref="'paramsi' + index" :rules="{required: isRequired, message: '请输入', trigger: 'blur'}">
                <el-select
                  v-model="outdata.dateDimension"
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
          <!-- 时间区间
          <el-form-item prop="dataRange" v-if="selectedFieldType === '时间'">
            <el-date-picker
              v-model="outdata.dataRange"
              type="datetimerange"
              :picker-options="pickerOptions"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              align="right"
            ></el-date-picker>
          </el-form-item> -->
          <el-form-item class="btn-group">
            <i class="el-icon-circle-plus cursor-pointer" @click="addDomain(outdata, index)" v-if="index === dataForm.digitalRange.length-1"></i>
          </el-form-item>
          <el-form-item style="float: right" v-if="closeIconVisible">
            <i class="el-icon-close cursor-pointer" @click="removeDomain(outdata, index)"></i>
          </el-form-item>
        </div>
      </div>
      <el-form-item v-if="(selectedFieldType === '时间' || selectedFieldType === '数值') && dataForm.digitalRange.length === 0">
        <el-button @click="addDomain">新增区间</el-button>
      </el-form-item>
      <!-- 枚举值 -->
      <el-form-item prop="selectVal" label="枚举" label-width="50px" v-if="selectedFieldType === '枚举'">
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
import { getDimension, setDimension, getchildrenList } from '@/api/dataAnalysis/indexManage'
export default {
  data () {
    return {
      visible: false,
      closeIconVisible: true,
      selectedFieldType: '数值',
      dataForm: {
        id: 0,
        isSetGroup: '',
        selectVal: [],
        digitalRange: []
      },
      fileList: [],
      selectEnumsList: [],
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
        ],
        isSetGroup: [
          { required: true, message: '请选择是否启用', trigger: 'biur' }
        ]
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
    init (val) {
      this.selectedFieldType = val.fieldType
      this.selectEnumsList = []
      this.dataForm = {
        id: val.id,
        selectVal: [],
        isSetGroup: '',
        digitalRange: []
      }
      let params = {
        indexId: val.id
      }
      getDimension(params).then(({ data }) => {
        if (data && data.status === '1' && data.data) {
          this.dataForm.isSetGroup = data.data.isSetGroup === '0' ? 0 : 1
          if (val.fieldType === '数值') {
            data.data.dimensions.forEach((item, index) => {
              this.dataForm.digitalRange.push({
                smallerValue: item.split(',')[0],
                largerValue: item.split(',')[1]
              })
            })
          } else if (val.fieldType === '时间') {
            data.data.dimensions.forEach((item, index) => {
              this.dataForm.digitalRange.push({
                dataRange: [item.split(',')[0], item.split(',')[1]]
              })
            })
          } else {
            this.dataForm.selectVal = data.data.dimensions
          }
        }
        // else {
        //   if (val.fieldType === '数值') {
        //     this.dataForm.digitalRange.push({
        //       smallerValue: '',
        //       largerValue: ''
        //     })
        //   } else if (val.fieldType === '时间') {
        //     this.dataForm.digitalRange.push({
        //       dataRange: []
        //     })
        //   } else if (val.fieldType === '枚举') {
        //     this.dataForm.selectVal = []
        //   } else {
        //     this.dataForm.classLabel = '0'
        //   }
        // }
      })
      if (val.fieldType === '枚举') {
        let params = {
          typeNum: val.enumTypeNum
        }
        getchildrenList(params).then(({ data }) => {
          if (data && data.status === '1' && data.data.length) {
            this.selectEnumsList = data.data
          } else {
            this.selectEnumsList = []
          }
        })
      }
      this.visible = true
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
    pramasNumBlur (outdata, val, index) { // 数值 介于的判断
      if (index > 0 && outdata.smallerValue && outdata.smallerValue * 1 < this.dataForm.digitalRange[index - 1].largerValue * 1) {
        this.$message({
          type: 'error',
          message: '此区间起始数值应大于上一区间终止数值'
        })
        return ''
      }
      if (outdata.smallerValue && outdata.largerValue && outdata.smallerValue * 1 > outdata.largerValue * 1) {
        this.$message({
          type: 'error',
          message: '起始数值应小于终止数值'
        })
        return ''
      }
      return this.blurNumberInput(val) // 返回一下处理过的值 用于赋值
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
    addDomain (outdata, index) {
      if (this.dataForm.digitalRange.length === 20) {
        this.$message({
          type: 'error',
          message: '最多设置20个区间'
        })
        return
      }
      if (this.selectedFieldType === '数值') {
        if (this.dataForm.digitalRange.length > 0 && (outdata.smallerValue === '' || outdata.largerValue === '')) {
          this.$message({
            type: 'error',
            message: '请先完成已有区间的设置'
          })
          return
        }
        this.dataForm.digitalRange.push({
          smallerValue: '',
          largerValue: ''
        })
      } else if (this.selectedFieldType === '时间') {
        if (this.dataForm.digitalRange.length > 0 && !outdata.dataRange) {
          this.$message({
            type: 'error',
            message: '请先完成已有区间的设置'
          })
          return
        }
        let startTimeArr = []
        let endTimeArr = []
        this.dataForm.digitalRange.forEach(item => {
          startTimeArr.push(item.dataRange[0])
          endTimeArr.push(item.dataRange[1])
        })
        let begin = startTimeArr.sort()
        let over = endTimeArr.sort()
        for (var k = 1; k < begin.length; k++) {
          if (begin[k] <= over[k - 1]) {
            this.$message({
              type: 'error',
              message: '时间区间存在重叠，请重新设置'
            })
            return
          }
        }
        this.dataForm.digitalRange.push({
          dataRange: []
        })
      }
      if (this.dataForm.digitalRange.length > 0) {
        this.closeIconVisible = true
      }
    },
    removeDomain (item, i) {
      if (this.dataForm.digitalRange.length === 0) {
        this.closeIconVisible = false
      }
      var index = this.dataForm.digitalRange.indexOf(item)
      this.dataForm.digitalRange.splice(index, 1)
    },
    saveHandle () {
      let indexGroups = []
      let params = {
        'indexId': this.dataForm.id,
        'isSetGroup': this.dataForm.isSetGroup.toString()
      }
      if (this.selectedFieldType === '数值' || this.selectedFieldType === '时间') {
        if (this.dataForm.digitalRange.length === 0) {
          return this.$message({
            type: 'error',
            message: '请先完成区间的设置'
          })
        }
      }
      if (this.selectedFieldType === '数值') {
        this.dataForm.digitalRange.forEach(item => {
          if (item.smallerValue === '' || item.largerValue === '') {
            return this.$message({
              type: 'error',
              message: '请先完成所有区间的设置'
            })
          } else {
            let arr = `${item.smallerValue},${item.largerValue}`
            indexGroups.push(arr)
          }
        })
        params.dimensions = indexGroups
      } else if (this.selectedFieldType === '时间') {
        this.dataForm.digitalRange.forEach(item => {
          if (!item.dataRange) {
            return this.$message({
              type: 'error',
              message: '请先完成所有区间的设置'
            })
          } else {
            let arr = `${item.dataRange[0]},${item.dataRange[1]}`
            indexGroups.push(arr)
          }
        })
        params.dimensions = indexGroups
      } else {
        params.dimensions = this.dataForm.selectVal
      }
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          setDimension(params).then(({ data }) => {
            if (data && data.status === '1') {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.visible = false
                  this.$emit('refreshDataList')
                  this.$refs['dataForm'].resetFields()
                }
              })
            } else {
              this.$message.error(data.message || '数据异常')
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
.itemOperateIput {
  width: 180px;
}
</style>
