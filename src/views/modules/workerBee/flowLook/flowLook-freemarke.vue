<template>
    <div class="aviator">
      <el-form :model="fatherData" :rules="dataRule" ref="fatherData" label-width="30%">
        <el-form-item label="模板名称">
          <span>{{fatherData.name}}</span>
        </el-form-item>
        <el-form-item label="模板中需要赋值的字段">
          <span>{{fatherData.requestFields}}</span>
        </el-form-item>
        <el-form-item label="返回字段值">
          <span>{{fatherData.responseFields}}</span>
        </el-form-item>
        <el-form-item label="未解析的模板">
          <span>{{fatherData.template}}</span>
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