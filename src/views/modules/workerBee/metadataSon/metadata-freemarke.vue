<template>
    <div class="aviator">
      <el-form :model="fatherData" :rules="dataRule" ref="fatherData" label-width="30%">
        <el-form-item label="模板名称" prop="name">
          <el-input v-model="fatherData.name" placeholder="请输入模板名称'"/>
        </el-form-item>
        <el-form-item label="模板中需要赋值的字段" prop="requestFields">
          <el-input v-model="fatherData.requestFields" placeholder="请输入模板中需要赋值的字段"/>
        </el-form-item>
        <el-form-item label="返回字段值" prop="responseFields">
          <el-input v-model="fatherData.responseFields" placeholder="请输入请返回字段值"/>
        </el-form-item>
        <el-form-item label="未解析的模板" prop="template">
          <el-input v-model="fatherData.template" placeholder="请输入请未解析的模板"/>
        </el-form-item>
        <el-form-item label="是否启用">
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
          name: [
            { required: true, message: '请输入模板名称', trigger: 'blur' }
          ],
          requestFields: [
            { required: true, message: '请输入模板中需要赋值的字段', trigger: 'blur' }
          ],
          responseFields: [
            { required: true, message: '请输入请返回字段值', trigger: 'blur' }
          ],
          template: [
            { required: true, message: '请输入请未解析的模板', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      cancel () {
        this.$nextTick(() => {
          this.$refs['fatherData'].resetFields()
        })
        this.$emit('hideVisibleClick', this.hideVisible)
      },
      // 表单提交
      dataFormSubmit () {
        let res = this.$parent.$parent.$parent.fatherCheck()
        this.$refs['fatherData'].validate((valid) => {
          if (valid && res) {
            this.$emit('dataFormSubmit', this.fatherData)
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