<template>
    <div class="aviator">
      <el-form :model="fatherData" ref="fatherData" label-width="30%">
        <el-form-item label="URL">
          <span>{{fatherData.url}}</span>
        </el-form-item>
        <el-form-item label="请求参数的fieldId数组">
          <span>{{fatherData.requestFields}}</span>
        </el-form-item>
        <el-form-item label="请求head入参">
          <span>{{fatherData.requestHeadFields}}</span>
        </el-form-item>
        <el-form-item label="入参生成方式">
          <el-radio-group v-model="fatherData.requestParamTemplateStatus" disabled>
            <el-radio :label="0">普通生成</el-radio>
            <el-radio :label="1">模板生成</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="响应参数的fieldId数组">
          <span>{{fatherData.responseFields}}</span>
        </el-form-item>
        <el-form-item label="响应参数的数据类型"> 
          <span>{{fatherData.responseType}}</span>
         </el-form-item>
        <el-form-item label="是否使用缓存">
          <el-radio-group v-model="fatherData.enableCache" disabled>
            <el-radio :label="0">不启用</el-radio>
            <el-radio :label="1">启用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="缓存生成的key需要的字段">
          <span>{{fatherData.cacheKeyFields}}</span>
        </el-form-item>
    </el-form>
    </div>
</template>

<script>
  export default {
    props: [
      'fatherData'
    ],
    data () {
      return {
      }
    },
    methods: {}
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