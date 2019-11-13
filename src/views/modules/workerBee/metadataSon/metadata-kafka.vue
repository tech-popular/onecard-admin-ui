<template>
    <div class="aviator">
      <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="30%">
        <el-form-item label="topic" prop="topic">
        <el-input v-model="dataForm.topic" placeholder="topic"/>
        </el-form-item>
        <el-form-item label="请求参数的fieldId数组" prop="requestFields">
          <el-select filterable v-model="dataForm.requestFields" placeholder="请选择">
          <el-option v-for="item in requestFieldsList" :value="item.value" :key="item.value" :label="item.label"/>
          </el-select>
        </el-form-item>
        <el-form-item label="是否启用" prop="enable">
        <el-radio-group v-model="dataForm.enable">
          <el-radio :label="0">禁用</el-radio>
          <el-radio :label="1">正常</el-radio>
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
        dataForm: {
          topic: '', // topic
          requestFields: '', // 请求参数的fieldId数组
          enable: 1
        },
        requestFieldsList: [],
        dataRule: {
          topic: [
            { required: true, message: 'topic不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init () {
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
        })
      },
      // 取消
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
            alert('submit!')
          } else {
            console.log('error submit!!')
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