<template>
    <div class="aviator">
      <el-form :model="fatherData" ref="fatherData" label-width="30%">
        <el-form-item label="cql" prop="cql" :rules="dataRule.cql">
        <el-input type="textarea" autosize v-model="fatherData.cql" placeholder="请输入cql"/>
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
            <el-radio :label="0">是</el-radio>
            <el-radio :label="1">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="请求参数的field数组" prop="requestFields" :rules="dataRule.requestFields">
        <el-input v-model="fatherData.requestFields" placeholder="param1,param2(多个参数逗号隔开)"/>
        </el-form-item>
        <el-form-item label="请求参数的类型数组" :rules="dataRule.requestFieldTypes">
          <el-select v-model="fatherData.requestFieldTypes" multiple placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="响应参数的fieldId数组" prop="responseFields" :rules="dataRule.responseFields">
        <el-input v-model="fatherData.responseFields" placeholder="result1,result2(多个结果逗号隔开)"/>
        </el-form-item>
        <el-form-item label="响应参数的数据类型" prop="responseType" :rules="dataRule.responseType">
          <el-select v-model="fatherData.responseType" placeholder="请选择响应参数的数据类型">
            <el-option
              v-for="item in statyoptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
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
  import { getAllDataSourceByType } from '@/api/workerBee/metadata'
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
          datasourceId: [
            { required: true, message: '请选择数据源ID', trigger: 'blur' }
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
          ]
        },
        dataidlist: [],
        intlist: {},
        options: [{
          value: 'string',
          label: 'string'
        }, {
          value: 'int',
          label: 'int'
        }, {
          value: 'long',
          label: 'long'
        }],
        fatherData: {},
        statyoptions: [{
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
        type: this.intlist.type,
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
            this.fatherData = {
              cql: this.fatherData.cql,
              enable: this.fatherData.enable,
              enableCache: this.fatherData.enableCache,
              isQuery: this.fatherData.isQuery,
              requestFields: this.fatherData.requestFields,
              requestFieldTypes: this.fatherData.requestFieldTypes.join(),
              type: this.fatherData.type,
              datasourceId: this.fatherData.datasourceId
            }
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