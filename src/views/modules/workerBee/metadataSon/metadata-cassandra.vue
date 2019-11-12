<template>
    <div class="aviator">
      <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="30%">
        <el-form-item label="主键" prop="id">
        <el-input v-model="dataForm.id" placeholder="主键"/>
        </el-form-item>
        <el-form-item label="cql" prop="cql">
        <el-input v-model="dataForm.cql" placeholder="cql"/>
        </el-form-item>
        <el-form-item label="请求参数的fieldId数组" prop="requestFields">
          <el-select filterable v-model="dataForm.requestFields" placeholder="请选择">
          <el-option v-for="item in requestFieldsList" :value="item.value" :key="item.value" :label="item.label"/>
          </el-select>
        </el-form-item>
        <el-form-item label="响应参数的fieldId数组" prop="responseFields">
          <el-select filterable v-model="dataForm.responseFields" placeholder="请选择">
          <el-option v-for="item in responseFieldsList" :value="item.value" :key="item.value" :label="item.label"/>
          </el-select>
        </el-form-item>
        <el-form-item label="响应参数的数据类型" prop="responseType">
          <el-select filterable v-model="dataForm.responseType" placeholder="请选择">
          <el-option v-for="item in responseTypeList" :value="item.value" :key="item.value" :label="item.label"/>
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
          id: 0, // 主键id
          cql: '', // cql
          requestFields: '', // 请求参数的fieldId数组
          responseFields: '', // 响应参数的fieldId数组
          responseType: '', // 响应参数的数据类型
          enable: 1
        },
        requestFieldsList: [],
        responseFieldsList: [],
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
          id: [
            { required: true, message: '主键id不能为空', trigger: 'blur' }
          ],
          cql: [
            { required: true, message: 'cql不能为空', trigger: 'blur' }
          ],
          responseType: [
            { required: true, message: '请选择数据类型', trigger: 'blur' }
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
        let res = this.$emit('fatherCheck')
        if (res === false) { // 如果父组件没有检查成功, 就停止
          return false
        }
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
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