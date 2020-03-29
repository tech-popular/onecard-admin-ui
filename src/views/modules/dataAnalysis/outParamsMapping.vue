<template>
  <div>
    <el-form :model="baseForm" ref="baseForm" :rules="baseRule" inline>
    <el-row class="base-form">
      <el-col :span="2">
        下发数据源：
      </el-col>
      <el-col :span="7">
        <el-form-item prop="source" ref="source1">
          <el-radio v-model="baseForm.source" label="kafka" @change="dataSourceChange" class="data-radio">kafka</el-radio>
        </el-form-item>
        <el-form-item prop="kafka">
          <el-select
            v-model= "baseForm.kafka"
            placeholder="请选择"
            class="data-select"
            filterable
          >
            <el-option
              v-for="item in kafkaServerList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item prop="source" ref="source2">
          <el-radio v-model="baseForm.source" label="database" @change="dataSourceChange" class="data-radio">业务数据库</el-radio>
        </el-form-item>
        <el-form-item prop="database">
          <el-select
            v-model= "baseForm.database"
            placeholder="请选择"
            class="data-select"
            filterable
          >
            <el-option
              v-for="item in mysqlServerList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-button type="primary" @click="editOutParams">编辑出参名称</el-button>
        <el-button type="primary" @click="customizedOutParams">定制化出参</el-button>
      </el-col>
    </el-row>
    </el-form>
    <div class="edit-content">
      <edit-outparams v-if="editOutParamsFlag" ref="editOutParams" :transfer-id="transferDataId" @cancel="editOutParamsFlag = false"></edit-outparams>
      <customized-outparams v-if="customizedOutParamsFlag" ref="customizedOutParams" :transfer-id="transferDataId" @cancel="customizedOutParamsFlag = false"></customized-outparams>
    </div>
  </div>
</template>
<script>
import { dataTransferManageKafka, dataTransferManageMysql } from '@/api/dataAnalysis/dataTransferManage'
import editOutparams from './baseComponents/outParamsMapping-edit-outparams'
import customizedOutparams from './baseComponents/outParamsMapping-customized-outparams'
export default {
  data () {
    // 验证枚举类型的函数
    let validateSourceServer = (rule, value, callback) => {
      if (this.baseForm.source === '') {
        callback(new Error('请选择下发数据源'))
      } else {
        callback()
      }
    }

    let validateKafkaServer = (rule, value, callback) => {
      if (this.baseForm.source === 'kafka' && this.baseForm.kafka === '') {
        callback(new Error('请选择'))
      } else {
        callback()
      }
    }

    let validateDataBaseServer = (rule, value, callback) => {
      if (this.baseForm.source === 'database' && this.baseForm.database === '') {
        callback(new Error('请选择'))
      } else {
        callback()
      }
    }
    return {
      baseForm: {
        source: '',
        kafka: '',
        database: ''
      },
      baseRule: {
        source: [
          { validator: validateSourceServer }
        ],
        kafka: [
          { validator: validateKafkaServer }
        ],
        database: [
          { validator: validateDataBaseServer }
        ]
      },
      kafkaServerList: [],
      mysqlServerList: [],
      editOutParamsFlag: false,
      customizedOutParamsFlag: false,
      transferDataId: '',
      prevData: {}
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
      this.$refs.baseForm.validate((valid) => {
        if (valid) {
          this.transferDataId = this.baseForm.kafka ? this.baseForm.kafka : this.baseForm.database
          if (this.prevData.source && this.judgeObjParams()) { // 下发数据源一样的情况下
            if (this.editOutParamsFlag === true) return // 如果是编辑出参状态下，再次点击编辑出参按钮无效
            if (this.customizedOutParamsFlag === true) { // 如果是定制化出参状态下，可进行切换
              this.confirmDialog('确定放弃定制化出参，进行编辑出参名称？', 1)
            } else {
              this.editOutParamsFlag = true
            }
          } else { // 改变下发数据源的情况下
            if (this.editOutParamsFlag === true) { // 再次点击编辑化出参
              this.confirmDialog('数据尚未保存，确定重新编辑出参？', 2)
            } else if (this.customizedOutParamsFlag === true) { // 定制化出参状态下，切换为编辑出参
              this.confirmDialog('确定放弃定制化出参，进行编辑出参名称？', 1)
            } else {
              this.editOutParamsFlag = true
              this.prevData = { ...this.baseForm }
            }
          }
        }
      })
    },
    // 定制化出参
    customizedOutParams () {
      this.$refs.baseForm.validate((valid) => {
        if (valid) {
          this.transferDataId = this.baseForm.kafka ? this.baseForm.kafka : this.baseForm.database
          if (this.prevData.source && this.judgeObjParams()) { // 下发数据源一样的情况下
            if (this.customizedOutParamsFlag === true) return // 如果是定制化出参状态下，再次点击定制化出参按钮无效
            if (this.editOutParamsFlag === true) { // 如果是编辑出参状态下，可进行切换
              this.confirmDialog('确定放弃编辑出参名称，进行定制化出参？', 3)
            } else {
              this.customizedOutParamsFlag = true
            }
          } else {
            if (this.customizedOutParamsFlag === true) { // 再次点击定制化出参
              this.confirmDialog('数据尚未保存，确定重新定制化出参？', 4)
            } else if (this.editOutParamsFlag === true) { // 如果是编辑出参状态下，可进行切换
              this.confirmDialog('确定放弃编辑出参名称，进行定制化出参？', 3)
            } else {
              this.customizedOutParamsFlag = true
              this.prevData = { ...this.baseForm }
            }
          }
        }
      })
    },
    confirmDialog (content, type) { // 弹窗内容
      this.$confirm(content, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (type === 1) { // 正在定制化时，切换到编辑出参
          this.customizedOutParamsFlag = false
          this.$refs.customizedOutParams.formData.tableData = []
          this.editOutParamsFlag = true
        } else if (type === 2) { // 在编辑出参时。改变了下发数据源的选择
          this.editOutParamsFlag = false
          this.$refs.editOutParams.modifyDataList = []
          this.$nextTick(() => {
            this.editOutParamsFlag = true
          })
        } else if (type === 3) { // 正在编辑出参状态下，切换到定制化出参
          this.editOutParamsFlag = false
          this.$refs.editOutParams.modifyDataList = []
          this.customizedOutParamsFlag = true
        } else if (type === 4) { // 在定制化出参时。改变了下发数据源的选择
          this.customizedOutParamsFlag = false
          this.$refs.customizedOutParams.formData.tableData = []
          this.$nextTick(() => {
            this.customizedOutParamsFlag = true
          })
        }
        this.prevData = { ...this.baseForm } // 保留一份数据
      }).catch((e) => {
        console.log(e)
      })
    },
    judgeObjParams () { // 判断prevdata 和 baseform 数据是否一致，一致时再次点击相同按钮无效
      if (this.prevData.source === this.baseForm.source &&
        this.prevData.kafka === this.baseForm.kafka &&
        this.prevData.database === this.baseForm.database
      ) {
        return true
      } else {
        return false
      }
    },
    // 下发数据源变化时，把对应的下拉选清空
    dataSourceChange (val) {
      if (val) {
        this.$refs.source1.clearValidate()
        this.$refs.source2.clearValidate()
      }
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