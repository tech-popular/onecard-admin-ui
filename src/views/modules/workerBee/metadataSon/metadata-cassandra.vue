<template>
    <div class="aviator">
      <el-form :model="fatherData" ref="fatherData" label-width="30%">
        <el-form-item label="cql" prop="cql" :rules="dataRule.cql">
        <el-input type="textarea" autosize v-model="fatherData.cql" placeholder="请输入cql"/>
        </el-form-item>
        <el-form-item label="is_query" prop="isQuery" :rules="dataRule.isQuery">
        <el-input v-model="fatherData.isQuery" placeholder="is_query"/>
        </el-form-item>
        <el-form-item label="请求参数的fieldId数组" prop="requestFields" :rules="dataRule.requestFields">
        <el-input v-model="fatherData.requestFields" placeholder="请输入请求参数的fieldId数组"/>
        </el-form-item>
        <el-form-item label="响应参数的fieldId数组" prop="responseFields" :rules="dataRule.responseFields">
        <el-input v-model="fatherData.responseFields" placeholder="请输入响应参数的fieldId数组"/>
        </el-form-item>
        <el-form-item label="数据源id" prop="datasourceId">
        <el-input v-model="fatherData.datasourceId" placeholder="请输入数据源id"/>
        </el-form-item>
        <el-form-item label="响应参数的数据类型" prop="responseType" :rules="dataRule.responseType">
        <el-input v-model="fatherData.responseType" placeholder="请输入响应参数的数据类型"/>
        </el-form-item>
        <el-form-item label="数据源id" prop="datasourceId">
        <el-input v-model="fatherData.datasourceId" placeholder="请输入数据源id"/>
        </el-form-item>
        <el-form-item label="是否使用缓存">
          <el-radio-group v-model="fatherData.enableCache">
            <el-radio :label="0">不启用</el-radio>
            <el-radio :label="1">启用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="缓存生成的key需要的字段" prop="cacheKeyFields" :rules="dataRule.noKongGe">
        <el-input v-model="fatherData.cacheKeyFields" placeholder="请输入缓存生成的key需要的字段"/>
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
  import Filter from '../filter'
  export default {
    props: [
      'hideVisibleClick',
      'fatherData'
    ],
    data () {
      return {
        dataRule: {
          cql: [
            { required: true, message: '请输入cql', trigger: 'blur' }
          ],
          isQuery: [
            { required: false, validator: Filter.NullKongGeRule, trigger: 'change' }
          ],
          requestFields: [
            { required: false, validator: Filter.NullKongGeRule, trigger: 'change' }
          ],
          responseFields: [
            { required: false, validator: Filter.NullKongGeRule, trigger: 'change' }
          ],
          responseType: [
            { required: false, validator: Filter.NullKongGeRule, trigger: 'change' }
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