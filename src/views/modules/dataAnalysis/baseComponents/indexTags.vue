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
        :key="index"
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
         <!-- <el-form-item>
          <el-button @click="addDomain">新增区间</el-button>
        </el-form-item> -->
        <!-- 枚举值 -->
        <el-form-item prop="selectVal"  v-if="selectedFieldType === 'enums'">
          <el-select v-model="dataForm.selectVal" multiple class="itemIput">
              <el-option v-for="(fitem, findex) in selectEnumsList" :value="fitem.childrenNum" :key="findex" :label="fitem.childrenValue"/>
            </el-select>
        </el-form-item>
        <el-form-item prop="classLabel"  v-if="selectedFieldType === 'string'">
          <el-radio v-model="dataForm.classLabel" label="1">是否类标签</el-radio>
        </el-form-item>
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
      closeIconVisible: false,
      selectedFieldType: 'number',
      dataForm: {
        id: 0,
        selectVal: '',
        classLabel: '0',
        digitalRange: []
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
    init (val) {
      this.selectedFieldType = val.fieldType
      this.selectEnumsList = []
      this.dataForm = {
        id: val.id,
        selectVal: '',
        classLabel: '0',
        digitalRange: []
      }
      let params = {
        indexId: val.id
      }
      getDimension(params).then(({ data }) => {
        console.log('data: ', data)
        if (data && data.status === '1' && data.data.length) {
          if (val.fieldType === 'number') {
            data.data.forEach((item, index) => {
              this.dataForm.digitalRange.push({
                smallerValue: item.split(',')[0],
                largerValue: item.split(',')[1]
              })
            })
          } else if (val.fieldType === 'string') {
            this.dataForm.classLabel = data.data[0]
          } else if (val.fieldType === 'date') {
            data.data.forEach((item, index) => {
              this.dataForm.digitalRange.push({
                dataRange: [item.split(',')[0], item.split(',')[1]]
              })
            })
          }
        }
        // else {
        //   if (val.fieldType === 'number') {
        //     this.dataForm.digitalRange.push({
        //       smallerValue: '',
        //       largerValue: '',
        //       key: Date.now()
        //     })
        //   } else if (val.fieldType === 'date') {
        //     this.dataForm.digitalRange.push({
        //       dataRange: [],
        //       key: Date.now()
        //     })
        //   } else if (val.fieldType === 'enums') {
        //     this.dataForm.selectVal = ''
        //   } else {
        //     this.dataForm.classLabel = '0'
        //   }
        // }
      })
      if (val.fieldType === 'enums') {
        let params = {
        typeNum: val.typeNum
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
      if (this.selectedFieldType === 'number') {
        if (outdata.smallerValue === '' || outdata.largerValue === '') {
          this.$message({
            type: 'error',
            message: '请先完成已有区间的设置'
          })
          return
        }
      } else if (this.selectedFieldType === 'date') {
        if (!outdata.dataRange) {
          this.$message({
            type: 'error',
            message: '请先完成已有区间的设置'
          })
          return
        }
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
        smallerValue: '',
        largerValue: '',
        dataRange: []
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
      let params = {
        'indexId': this.dataForm.id
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
        params.dimensions = indexGroups
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
        params.dimensions = indexGroups
      } else if (this.selectedFieldType === 'string') {
        params.dimensions = [this.dataForm.classLabel]
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
  margin-left:20px;
}
</style>
