<template>
  <el-dialog 
    title="标签分组"
    :modal-append-to-body='false'
    :append-to-body="true"
    :visible.sync="visible"
    width="1000px;"
    :close-on-click-modal="false">
    <el-form :model="dataForm" ref="dataForm" :rules="dataRules" :inline="true">
      <div
        style="display: flex;"
        v-for="(outdata, index) in dataForm.digitalRange"
        :key="outdata.key"
      >
        <div class="content-range">
               区间{{index+1}}
        </div>
        <!-- 数字区间 -->
        <div class="pane-rules-inline" v-if="selectedFieldType === 'number'">
          <span class="parentheses">( &nbsp;</span>
          <el-form-item prop="smallerValue"  :ref="'paramss' + outdata.key" :rules="{ required: true, validator: (rule, value, callback) => judgeNumberTwoInput(rule, value, callback, outdata, index), trigger: 'blur' }" >
            <el-input v-model="outdata.smallerValue" class="itemIput-small" @input="outdata.smallerValue = keyupNumberInput(outdata.smallerValue)" @blur="outdata.smallerValue = pramasNumBlur(outdata, outdata.smallerValue, index)"></el-input>
          </el-form-item>
          &nbsp;,&nbsp;
          <el-form-item prop="largerValue" :ref="'paramsl' + outdata.key" :rules="{ required: true, validator: (rule, value, callback) => judgeNumberTwoInput(rule, value, callback, outdata, index), trigger: 'blur' }">
            <el-input v-model="outdata.largerValue" class="itemIput-small" @input="outdata.largerValue = keyupNumberInput(outdata.largerValue)" @blur="outdata.largerValue = pramasNumBlur(outdata, outdata.largerValue,index)" ></el-input>
          </el-form-item>
          <span class="parentheses">&nbsp;)</span>
        </div>
        <!-- 时间区间 -->
        <el-form-item prop="dataRange" :ref="'datetime' + outdata.key" v-if="selectedFieldType === 'date'" :rules="{required: true, message: '请选择', trigger: 'change'}">
           <el-date-picker
              v-model="outdata.dataRange"
              type="datetimerange"
              :picker-options="pickerOptions"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              align="right">
         </el-date-picker>
        </el-form-item>
          <el-form-item class="btn-group">
              <i class="el-icon-circle-plus cursor-pointer" @click="addDomain" v-if="index === dataForm.digitalRange.length-1"></i>
          </el-form-item>
          <el-form-item style="float: right">
            <i class="el-icon-close cursor-pointer" @click="removeDomain(outdata, index)"></i>
          </el-form-item>
      </div>
         <!-- <el-form-item>
          <el-button @click="addDomain">新增区间</el-button>
        </el-form-item> -->
        <!-- 枚举值 -->
        <el-form-item prop="selectVal"  v-if="selectedFieldType === 'enums'" :rules="{required: true, message: '请选择', trigger: 'change'}">
          <el-select v-model="dataForm.selectVal" multiple class="itemIput">
              <el-option v-for="(fitem, findex) in item.selectEnumsList" :value="fitem.childrenNum" :key="findex" :label="fitem.childrenValue"/>
            </el-select>
        </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button type="primary" @click="saveHandle" size="small">确定</el-button>
      <el-button type="default" @click="cancelHandle" size="small">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  data () {
    return {
      visible: false,
      selectedFieldType: 'number',
      dataForm: {
        id: '',
        selectVal: '',
        digitalRange: [
          {
            smallerValue: '',
            largerValue: '',
            dataRange: '',
            key: Date.now()
          }
        ]
      },
      selectEnumsList: [],
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        },
        {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        },
        {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      dataRules: {
        name: [
          { required: true, pattern: /^([a-zA-z_]{1})([\w]*)$/g, message: '只可输入字母、数字、下划线，且不能以数字开头', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init (val, selectedFieldType) {
      this.selectedFieldType = selectedFieldType
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
    judgeNumberTwoInput (rule, value, callback, outdata, index) { // 数值介于判断
      if (value === '') {
        callback(new Error('请输入'))
      } else if (index === 0 && outdata.smallerValue && outdata.largerValue * 1 > outdata.smallerValue * 1) {
        callback(new Error('起始数值应小于终止数值'))
      } else if (index !== 0 && outdata.largerValue && outdata.largerValue * 1 > outdata.smallerValue * 1) {
        callback(new Error('起始数值应小于终止数值'))
      } else {
        callback()
      }
    },
    pramasNumBlur (outdata, val, index) { // 数值 介于的判断
      if (index > 0 && outdata.smallerValue && outdata.smallerValue < this.dataForm.digitalRange[index - 1].largerValue) {
        this.$message({
          type: 'error',
          message: '输入值需大于上一区间'
        })
        return ''
      }
      if (outdata.smallerValue * 1 < outdata.largerValue * 1) {
        this.$refs['paramss' + outdata.key][0].clearValidate()
        this.$refs['paramsl' + outdata.key][0].clearValidate()
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
    addDomain () {
      this.dataForm.digitalRange.push({
        smallerValue: '',
        largerValue: '',
        key: Date.now()
      })
    },
    removeDomain (item, i) {
      var index = this.dataForm.digitalRange.indexOf(item)
      this.dataForm.digitalRange.splice(index, 1)
    },
    saveHandle () {
      if (this.selectedFieldType === 'enums') {
        this.$refs.dataForm.validate((valid) => {
          if (valid) {}
        })
      } else {
        let flag = true
        let ruleSet = this.$refs
        let ruleArr = []
        for (let key in ruleSet) {
          if (key !== 'dataForm') {
            ruleSet[key][0].validate(valid => {
              console.log('valid: ', valid);

            })
            ruleArr.push(ruleSet[key][0])
          }
        }
        // ruleArr.forEach(item => {
        //   console.log('item: ', item)
        //     console.log('item.validate: ', item.validate);
        //   item.validator(valid => {
        //     console.log('valid: ', valid)
        //     if (!valid) {
        //       flag = false
        //       console.log('flag: ', flag)
        //     }
        //   })
        // })
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
  margin-left:20px;
}
</style>
