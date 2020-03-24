<template>
  <div>
    <el-row class="base-form">
      <el-col :span="2">
        下发数据源：
      </el-col>
      <el-col :span="7">
        <el-radio v-model="baseForm.source" label="kafka" @change="dataSourceChange" class="data-radio">kafka</el-radio>
        <el-select
          v-model= "baseForm.kafka"
          placeholder="请选择"
          class="data-select"
        >
          <el-option
            v-for="item in kafkaServerList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="7">
        <el-radio v-model="baseForm.source" label="mysql" @change="dataSourceChange" class="data-radio">业务数据库</el-radio>
        <el-select
          v-model= "baseForm.database"
          placeholder="请选择"
          class="data-select"
        >
          <el-option
            v-for="item in mysqlServerList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="6">
        <el-button type="primary" @click="editOutParams">编辑出参名称</el-button>
        <el-button type="primary" @click="customizedOutParams">定制化出参</el-button>
      </el-col>
    </el-row>
    <div class="edit-content">
      <edit-outparams v-if="editOutParamsFlag" @cancel="editOutParamsFlag = false"></edit-outparams>
      <customized-outparams v-if="customizedOutParamsFlag" @cancel="customizedOutParamsFlag = false"></customized-outparams>
    </div>
  </div>
</template>
<script>
import { dataTransferManageKafka, dataTransferManageMysql } from '@/api/dataAnalysis/dataTransferManage'
import editOutparams from './baseComponents/outParamsMapping-edit-outparams'
import customizedOutparams from './baseComponents/outParamsMapping-customized-outparams'
export default {
  data () {
    return {
      baseForm: {
        source: '',
        kafka: '',
        database: ''
      },
      kafkaServerList: [],
      mysqlServerList: [],
      editOutParamsFlag: false,
      customizedOutParamsFlag: false
    }
  },
  components: {
    editOutparams,
    customizedOutparams
  },
  mounted () {
    this.getKafkaServerList()
    this.getMysqlServerList()
  },
  methods: {
    // 点击编辑出参名称
    editOutParams () {
      if (!this.baseForm.source) return
      this.editOutParamsFlag = true
    },
    // 定制化出参
    customizedOutParams () {
      if (!this.baseForm.source) return
      this.customizedOutParamsFlag = true
    },
    // 下发数据源变化时，把对应的下拉选清空
    dataSourceChange (val) {
      console.log(this.baseForm.source)
      if (val === 'kafka') {
        this.baseForm.database = ''
      } else {
        this.baseForm.kafka = ''
      }
    },
    // kafka 数据源
    getKafkaServerList () {
      let params = {
        type: 'kafka'
      }
      dataTransferManageKafka(params).then(({data}) => {
        if (data && data.status === '1') {
          this.kafkaServerList = data.data
        }
      })
    },
    // mysql 数据源
    getMysqlServerList () {
      let params = {
        type: 'mysql'
      }
      dataTransferManageMysql(params).then(({data}) => {
        if (data && data.status === '1') {
          this.mysqlServerList = data.data
        }
      })
    }
  }
}
</script>
<style scoped>
  .base-form {
    line-height: 40px;
  }
  .data-select {
    margin-left: 10px;
  }
  .edit-content {
    border-top: 1px dashed #ccc;
    margin-top: 20px;
    padding-top: 20px;
  }
  .data-radio {
    margin: 0;
  }
</style>