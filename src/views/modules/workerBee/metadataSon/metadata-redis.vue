<template>
    <div class="aviator">
      <el-form :model="fatherData" :rules="dataRule" ref="fatherData" label-width="30%">
        <el-form-item label="数据源ID" prop="redisDatasourceId">
          <el-select v-model="fatherData.redisDatasourceId" filterable placeholder="请输入host">
            <el-option
              v-for="item in dataidlist"
              :key="item.id"
              :label="item.host"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="redis数据类型" prop="dataType">
          <el-select v-model="fatherData.dataType" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="redisKey的前缀" prop="dataPrefix">
        <el-input v-model="fatherData.dataPrefix" placeholder="请输入redisKey的前缀"/>
        </el-form-item>
        <el-form-item label="数据返回字段名称" prop="outField">
        <el-input v-model="fatherData.outField" placeholder="请输入数据返回字段名称"/>
        </el-form-item>
        <el-form-item label="是否查询">
          <el-radio-group v-model="fatherData.isQuery">
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- <el-form-item label="是否启用">
          <el-radio-group v-model="fatherData.enable">
            <el-radio :label="false">否</el-radio>
            <el-radio :label="true">是</el-radio>
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
  import { getAllDataSourceByType } from '@/api/workerBee/metadata'

  export default {
    props: [
      'hideVisibleClick',
      'fatherData',
      'dataformType'
    ],
    data () {
      return {
        options: [{
          value: 'string',
          label: 'string'
        }, {
          value: 'map',
          label: 'map'
        }, {
          value: 'list',
          label: 'list'
        }, {
          value: 'zset',
          label: 'zset'
        }],
        dataidlist: [],
        intlist: {},
        name: '',
        dataRule: {
          redisDatasourceId: [
            { required: true, message: '请选择数据源ID', trigger: 'blur' }
          ],
          dataType: [
            { required: true, message: '请选择redis数据类型', trigger: 'blur' }
          ],
          dataPrefix: [
            { required: true, message: '请输入redisKey的前缀', trigger: 'blur' }
          ],
          outField: [
            { required: true, message: '请输入数据返回字段名称', trigger: 'blur' }
          ]
        }
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