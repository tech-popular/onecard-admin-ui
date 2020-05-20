<template>
    <div class="aviator">
      <el-form :model="fatherData" :rules="dataRule" ref="fatherData" label-width="30%">
        <el-form-item label="数据源ID">
          <span>{{fatherData.zookeeperQuorumId}}</span>
        </el-form-item>
        <el-form-item label="HBASE表名">
          <span>{{fatherData.tableName}}</span>
        </el-form-item>
        <el-form-item label="列簇名">
          <span>{{fatherData.familyName}}</span>
        </el-form-item>
        <el-form-item label="列名">
          <span>{{fatherData.columnName}}</span>
        </el-form-item>
        <el-form-item label="查询类型(GET,SCAN)">
          <span>{{fatherData.queryType}}</span>
        </el-form-item>
        <el-form-item label="是否有效">
          <el-radio-group v-model="fatherData.enable" disabled>
            <el-radio :label="false">否</el-radio>
            <el-radio :label="true">是</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </div>
</template>

<script>
  export default {
    props: [
      'fatherData'
    ],
    mounted () {
    },
    data () {
      return {
  
      }
    },
    methods: {
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