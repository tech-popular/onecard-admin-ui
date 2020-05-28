<template>
    <div class="aviator">
      <el-form :model="fatherData" :rules="dataRule" ref="fatherData" label-width="30%">
         <el-form-item label="topic">
          <span>{{fatherData.topic}}</span>
        </el-form-item>
        <el-form-item label="请求参数的fieldId数组">
          <span>{{fatherData.requestFields}}</span>
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