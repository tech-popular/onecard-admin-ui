<template>
    <div class="aviator">
      <el-form :model="fatherData" :rules="dataRule" ref="fatherData" label-width="30%">
        <el-form-item label="cql" prop="cql">
        <el-input v-model="fatherData.cql" placeholder="cql"/>
        </el-form-item>
        <el-form-item label="请求参数的fieldId数组" prop="requestFields">
        <el-input v-model="fatherData.requestFields" placeholder="请求参数的fieldId数组"/>
        </el-form-item>
        <el-form-item label="响应参数的fieldId数组" prop="responseFields">
        <el-input v-model="fatherData.responseFields" placeholder="响应参数的fieldId数组"/>
        </el-form-item>
        <el-form-item label="响应参数的数据类型" prop="responseType">
          <el-select filterable v-model="fatherData.responseType" placeholder="请选择">
          <el-option v-for="item in responseTypeList" :value="item.value" :key="item.value" :label="item.label"/>
          </el-select>
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
        responseTypeList: [
          {
            value: '0',
            label: '数据类型1'
          },
          {
            value: '1',
            label: '数据类型2'
          }
        ],
        dataRule: {
          responseType: [
            { required: true, message: '请选择数据类型', trigger: 'blur' }
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