<template>
    <div class="aviator">
      <el-form :model="fatherData" :rules="dataRule" ref="fatherData" label-width="30%">
        <el-form-item label="数据源地址编号" prop="zookeeperQuorumId">
        <el-input autosize v-model="fatherData.zookeeperQuorumId" placeholder="请输入数据源地址编号"/>
        </el-form-item>
        <el-form-item label="HBASE表名" prop="tableName">
        <el-input v-model="fatherData.tableName" placeholder="请输入HBASE表名"/>
        </el-form-item>
        <el-form-item label="列簇名" prop="familyName">
        <el-input v-model="fatherData.familyName" placeholder="请输入列簇名"/>
        </el-form-item>
        <el-form-item label="列名" prop="columnName">
        <el-input v-model="fatherData.columnName" placeholder="请输入列名"/>
        </el-form-item>
        <el-form-item label="查询类型(GET,SCAN)" prop="queryType">
        <el-input v-model="fatherData.queryType" placeholder="目前只支持GET查询"/>
        </el-form-item>
        <el-form-item label="是否有效">
          <el-radio-group v-model="fatherData.enable">
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否缓存">
          <el-radio-group v-model="fatherData.enableCache">
            <el-radio :label="false">否</el-radio>
            <el-radio :label="true">是</el-radio>
          </el-radio-group>
        </el-form-item>
    </el-form>
    <div slot="footer" class="foot">
      <el-button @click="cancel()">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </div>
    </div>
</template>

<script>
  export default {
    props: [
      'hideVisibleClick',
      'fatherData'
    ],
    data () {
      return {
        dataRule: {
          zookeeperQuorumId: [
            { required: true, message: '请输入数据源地址编号', trigger: 'blur' }
          ],
          tableName: [
            { required: true, message: '请输入hbase表名', trigger: 'blur' }
          ]
        }
      }
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