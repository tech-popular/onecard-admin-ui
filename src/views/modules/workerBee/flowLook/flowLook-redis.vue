<template>
    <div class="aviator">
      <el-form :model="fatherData" :rules="dataRule" ref="fatherData" label-width="30%">
        <el-form-item label="数据源ID">
          <span>{{fatherData.redisDatasourceId}}</span>
        </el-form-item>
        <el-form-item label="redis数据类型">
          <span>{{fatherData.dataType}}</span>
        </el-form-item>
        <el-form-item label="redisKey的前缀">
          <span>{{fatherData.dataPrefix}}</span>
        </el-form-item>
        <el-form-item label="数据返回字段名称">
          <span>{{fatherData.outField}}</span>
        </el-form-item>
        <el-form-item label="是否查询">
          <el-radio-group v-model="fatherData.isQuery" disabled>
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1">是</el-radio>
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