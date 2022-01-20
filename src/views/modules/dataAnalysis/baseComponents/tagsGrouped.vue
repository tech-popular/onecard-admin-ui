<template>
  <el-dialog 
    title="标签分组"
    :modal-append-to-body='false'
    :append-to-body="true"
    :visible.sync="visible"
    width="50%"
    :close-on-click-modal="false">
    <el-form :model="dataForm" ref="dataForm" :rules="dataRules" :inline="true">
     <div v-if="selectedFieldType !== 'enums'">
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
          <el-form-item prop="smallerValue">
            <el-input v-model="outdata.smallerValue" class="itemIput-small" @input="outdata.smallerValue = keyupNumberInput(outdata.smallerValue)" @blur="outdata.smallerValue = pramasNumBlur(outdata, outdata.smallerValue, index)"></el-input>
          </el-form-item>
          &nbsp;,&nbsp;
          <el-form-item prop="largerValue">
            <el-input v-model="outdata.largerValue" class="itemIput-small" @input="outdata.largerValue = keyupNumberInput(outdata.largerValue)" @blur="outdata.largerValue = pramasNumBlur(outdata, outdata.largerValue,index)" ></el-input>
          </el-form-item>
          <span class="parentheses">&nbsp;)</span>
        </div>
        <!-- 时间区间 -->
        <el-form-item prop="dataRange" v-if="selectedFieldType === 'date'">
           <el-date-picker
              v-model="outdata.dataRange"
              type="datetimerange"
              :picker-options="pickerOptions"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              align="right">
         </el-date-picker>
        </el-form-item>
          <el-form-item class="btn-group">
              <i class="el-icon-circle-plus cursor-pointer" @click="addDomain(outdata, index)" v-if="index === dataForm.digitalRange.length-1"></i>
          </el-form-item>
          <el-form-item style="float: right" v-if="closeIconVisible">
            <i class="el-icon-close cursor-pointer" @click="removeDomain(outdata, index)"></i>
          </el-form-item>
      </div>
     </div>
         <el-form-item>
          <el-button v-if="dataForm.digitalRange.length === 0" @click="addDomain">新增区间</el-button>
        </el-form-item>
        <!-- 枚举值 -->
        <el-form-item prop="selectVal" label="枚举" label-width="50px" v-if="selectedFieldType === 'enums'">
          <el-select v-model="dataForm.selectVal" multiple class="itemIput">
              <el-option v-for="(fitem, findex) in selectEnumsList" :value="fitem.childrenNum" :key="findex" :label="fitem.childrenValue"/>
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
import { getchildrenList } from '@/api/dataAnalysis/dataInsightManage'
export default {
  data () {
    return {
      visible: false,
      closeIconVisible: false,
      selectedFieldType: 'number',
      dataForm: {
        id: 0,
        selectVal: [],
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
      this.selectEnumsList = []
       this.dataForm = {
        id: val.id,
        selectVal: [],
        digitalRange: []
      }
      if (this.selectedFieldType === 'enums') {
        let params = {
          typeNum: selected.enumTypeNum
        }
        getchildrenList(params).then(({ data }) => {
          if (data.status === '1') {
            this.selectEnumsList = data.data
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
    // judgeNumberTwoInput (rule, value, callback, outdata, index) { // 数值介于判断
    // console.log('value: ', value)
    // console.log('rule: ', rule)
    //   if (value === '') {
    //     callback(new Error('请输入'))
    //   } else if (index === 0 && outdata.smallerValue && outdata.largerValue * 1 < outdata.smallerValue * 1) {
    //     callback(new Error('起始数值应小于终止数值'))
    //   } else if (index !== 0 && outdata.largerValue && outdata.largerValue * 1 < outdata.smallerValue * 1) {
    //     callback(new Error('起始数值应小于终止数值'))
    //   } else {
    //     callback()
    //   }
    // },
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
      // if (outdata.smallerValue * 1 < outdata.largerValue * 1) {
      //   this.$refs['paramss' + outdata.key][0].clearValidate()
      //   this.$refs['paramsl' + outdata.key][0].clearValidate()
      // }
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
      if (this.selectedFieldType === 'number') {
        if (this.dataForm.digitalRange.length > 0 && (outdata.smallerValue === '' || outdata.largerValue === '')) {
          this.$message({
            type: 'error',
            message: '请先完成已有区间的设置'
          })
          return
        }
      } else if (this.selectedFieldType === 'date') {
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
      }
      this.dataForm.digitalRange.push({
        smallerValue: '',
        largerValue: '',
        dataRange: '',
        key: Date.now()
      })
      if (this.dataForm.digitalRange.length > 1) {
        this.closeIconVisible = true
      }
    },
    removeDomain (item, i) {
      if (this.dataForm.digitalRange.length === 1) {
        this.closeIconVisible = false
      }
      var index = this.dataForm.digitalRange.indexOf(item)
      this.dataForm.digitalRange.splice(index, 1)
    },
    saveHandle () {
      let indexGroups = []
      if (this.selectedFieldType === 'number' || this.selectedFieldType === 'date') {
        if (this.dataForm.digitalRange.length === 0) {
          return this.$message({
            type: 'error',
            message: '请先完成区间的设置'
          })
        }
      }
      if (this.selectedFieldType === 'number') {
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
        this.$emit('refreshDataList', indexGroups, this.dataForm.id)
        this.visible = false
        this.$refs['dataForm'].resetFields()
      } else if (this.selectedFieldType === 'date') {
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
        this.$emit('refreshDataList', indexGroups, this.dataForm.id)
        this.visible = false
        this.$refs['dataForm'].resetFields()
      }
      if (this.selectedFieldType === 'enums') {
        this.$refs.dataForm.validate((valid) => {
          if (valid) {
            indexGroups = this.dataForm.selectVal
            this.$emit('refreshDataList', indexGroups, this.dataForm.id)
            this.visible = false
            this.$refs['dataForm'].resetFields()
          }
        })
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
