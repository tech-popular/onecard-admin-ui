<template>
    <div class="aviator">
      <el-form :model="fatherData" :rules="dataRule" ref="fatherData" label-width="30%">
        <el-form-item label="判断case参数" prop="caseValueParam">
        <el-input v-model="fatherData.caseValueParam" placeholder="判断case参数"/>
        </el-form-item>
        <el-form-item label="判断表达式" prop="caseExpression">
        <el-input v-model="fatherData.caseExpression" placeholder="判断表达式"/>
        </el-form-item>
        <el-form-item label="switch判断项集合" prop="caseSwitchList">
        <el-input v-model="fatherData.caseSwitchList" placeholder="switch判断项集合"/>
        </el-form-item>
        <el-form-item label="是否启用" prop="form.enable">
        <el-radio-group v-model="fatherData.enable">
          <el-radio :label="false">禁用</el-radio>
          <el-radio :label="true">正常</el-radio>
          </el-radio-group>
        </el-form-item>
    </el-form>
    <div slot="footer" class="foot">
      <el-button @click="cancel()">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </div>
    </div>
</template>

<script>
  export default {
    props: [
      'hideVisibleClick',
      'fatherData'
    ],
    data () {
      return {
        dataRule: {
          caseValueParam: [
            { required: true, message: '请输入判断case参数', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      cancel () {
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
        })
        this.$emit('hideVisibleClick', this.hideVisible)
      },
      // 表单提交
      dataFormSubmit () {
        let res = this.$parent.$parent.$parent.fatherCheck()
        this.$refs['dataForm'].validate((valid) => {
          if (valid && res) {
            this.$emit('dataFormSumbit', this.fatherData)
          } else {
            return false
          }
        })
      }
    }
  }
</script>
<style>
  .aviator {
    border-top: 1px solid #eee;
    padding-top: 3%;
  }
  .foot {
    width: 100%;
    text-align: right;
  }
</style>