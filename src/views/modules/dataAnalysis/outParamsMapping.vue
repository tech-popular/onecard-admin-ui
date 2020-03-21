<template>
  <div>
    <el-row class="base-form">
      <el-col :span="2">
        下发数据源：
      </el-col>
      <el-col :span="7">
        <el-radio v-model="baseForm.origin">kafka</el-radio>
        <el-select
          v-model= "baseForm.kafka"
          placeholder="请选择"
          class="data-select"
        >
          <el-option
            v-for="item in kafkaList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="7">
        <el-radio v-model="baseForm.origin">业务数据库</el-radio>
        <el-select
          v-model= "baseForm.database"
          placeholder="请选择"
          class="data-select"
        >
          <el-option
            v-for="item in databaseList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="6">
        <el-button type="primary">编辑出参名称</el-button>
      </el-col>
    </el-row>
    <div class="edit-content"></div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      baseForm: {
        origin: '',
        kafka: '',
        database: ''
      },
      kafkaList: [
        {
          lable: '1',
          value: '1'
        }
      ],
      databaseList: [
        {
          lable: '1',
          value: '1'
        }
      ]
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
</style>