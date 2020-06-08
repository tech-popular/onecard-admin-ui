<template>
    <div class="aviator">
      <el-form :model="fatherData" :rules="dataRule" ref="fatherData" label-width="30%">
        <el-form-item label="表达式">
          <span>{{fatherData.script}}</span>
        </el-form-item>
        <el-form-item label="请求参数的fieldId数组">
          <span>{{fatherData.requestFields}}</span>
        </el-form-item>
        <el-form-item label="请求参数类型">
          <el-radio-group v-model="fatherData.requestFieldType" disabled>
            <el-radio :label="0">普通类型</el-radio>
            <el-radio :label="1">集合类型</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="响应参数的fieldId数组">
          <span>{{fatherData.responseFields}}</span>
        </el-form-item>
        <el-form-item label="响应参数的数据类型"> 
          <span>{{fatherData.responseType}}</span>
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