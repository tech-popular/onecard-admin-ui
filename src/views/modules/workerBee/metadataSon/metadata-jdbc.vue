<template>
    <div class="aviator">
      <el-form :model="fatherData" :rules="dataRule" ref="fatherData" label-width="30%">
        <el-form-item label="sql" prop="sql" :rules="dataRule.sql">
        <el-input type="textarea" autosize v-model="fatherData.sql" placeholder="请输入sql"/>
        </el-form-item>
        <el-form-item label="数据源ID" prop="datasourceId" :rules="dataRule.datasourceId">
          <el-select v-model="fatherData.datasourceId" filterable placeholder="请输入datasourceName">
            <el-option
              v-for="item in dataidlist"
              :key="item.id"
              :label="item.datasourceName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="is_query" prop="isQuery">
          <el-radio-group v-model="fatherData.isQuery">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="请求参数的fieldId数组" prop="requestFields">
        <el-input v-model="fatherData.requestFields" placeholder="param1,param2(多个参数逗号隔开)"/>
        </el-form-item>
        <el-form-item label="响应参数的fieldId数组" prop="responseFields">
        <el-input v-model="fatherData.responseFields" placeholder="result1,result2(多个结果逗号隔开)"/>
        </el-form-item>
        <el-form-item label="响应参数的数据类型" prop="responseType">
          <el-select v-model="fatherData.responseType" placeholder="请选择响应参数的数据类型">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        <!-- <el-input v-model="fatherData.responseType" placeholder="请输入响应参数的数据类型"/> -->
        </el-form-item>
        <el-form-item label="是否使用缓存">
          <el-radio-group v-model="fatherData.enableCache">
            <el-radio :label="0">不启用</el-radio>
            <el-radio :label="1">启用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否启用解析模板">
          <el-radio-group v-model="fatherData.parsTemplate">
            <el-radio :label="false">不启用</el-radio>
            <el-radio :label="true">启用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="缓存生成的key需要的字段" prop="cacheKeyFields">
        <el-input v-model="fatherData.cacheKeyFields" placeholder="请输入缓存生成的key需要的字段"/>
        </el-form-item>
        <!-- <el-form-item label="是否启用">
          <el-radio-group v-model="fatherData.enable">
            <el-radio :label="false">禁用</el-radio>
            <el-radio :label="true">正常</el-radio>
          </el-radio-group>
        </el-form-item> -->
    </el-form>
    <div slot="footer" class="foot">
      <el-button @click="cancel()">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </div>
    </div>
</template>

<script>
  import Filter from '../filter'
  import { getAllDataSourceByType } from '@/api/workerBee/metadata'

  export default {
    props: [
      'hideVisibleClick',
      'fatherData',
      'dataformType'
    ],
    data () {
      return {
        dataRule: {
          sql: [
            { required: true, message: '请输入sql', trigger: 'blur' }
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
            { required: true, message: '请选择响应参数的数据类型', trigger: 'blur' },
            { required: false, validator: Filter.NullKongGeRule, trigger: 'change' }
          ],
          datasourceId: [
            { required: true, message: '请选择数据源ID', trigger: 'blur' }
          ],
          cacheKeyFields: [
            { required: false, validator: Filter.NullKongGeRule, trigger: 'change' }
          ]
        },
        dataidlist: [],
        intlist: {},
        options: [{
          value: 'map',
          label: 'map'
        }, {
          value: 'list',
          label: 'list'
        }]
      }
    },
    mounted () {
      this.intlist = this.$parent.$parent.$parent.fatherData
      const dataBody = {
        type: this.dataformType ? this.dataformType : this.intlist.type,
        name: this.fatherData.redisDataSourceId
      }
      getAllDataSourceByType(dataBody).then(({data}) => {
        if (data && data.status === 0) {
          this.dataidlist = data.data
        }
      })
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