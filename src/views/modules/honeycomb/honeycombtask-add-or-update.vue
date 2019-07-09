<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="任务名称" prop="name">
      <el-input v-model="dataForm.name" placeholder="任务名称"></el-input>
    </el-form-item>
    <el-form-item label="输入数据源" prop="inDatasource">
      <el-input v-model="dataForm.inDatasource" placeholder="输入数据源"></el-input>
    </el-form-item>
    <el-form-item label="计算类型:1 简单 2 复杂" prop="computeType">
      <el-input v-model="dataForm.computeType" placeholder="计算类型:1 简单 2 复杂"></el-input>
    </el-form-item>
    <el-form-item label="历史数据生成SQL" prop="cacheSql">
      <el-input v-model="dataForm.cacheSql" placeholder="历史数据生成SQL"></el-input>
    </el-form-item>
    <el-form-item label="SQL" prop="sql">
      <el-input v-model="dataForm.sql" placeholder="SQL"></el-input>
    </el-form-item>
    <el-form-item label="周期(分钟)" prop="period">
      <el-input v-model="dataForm.period" placeholder="周期(分钟)"></el-input>
    </el-form-item>
    <el-form-item label="转换配置" prop="transformerConfig">
      <el-input v-model="dataForm.transformerConfig" placeholder="转换配置"></el-input>
    </el-form-item>
    <el-form-item label="输出数据源" prop="outDatasource">
      <el-input v-model="dataForm.outDatasource" placeholder="输出数据源"></el-input>
    </el-form-item>
    <el-form-item label="依赖于某个任务(暂不支持)" prop="dependTask">
      <el-input v-model="dataForm.dependTask" placeholder="依赖于某个任务(暂不支持)"></el-input>
    </el-form-item>
    <el-form-item label="cron表达式" prop="cron">
      <el-input v-model="dataForm.cron" placeholder="cron表达式"></el-input>
    </el-form-item>
    <el-form-item label="版本号" prop="version">
      <el-input v-model="dataForm.version" placeholder="版本号"></el-input>
    </el-form-item>
    <el-form-item label="租户id" prop="tenantId">
      <el-input v-model="dataForm.tenantId" placeholder="租户id"></el-input>
    </el-form-item>
    <el-form-item label="标签" prop="tags">
      <el-input v-model="dataForm.tags" placeholder="标签"></el-input>
    </el-form-item>
    <el-form-item label="是否启用" prop="enable">
      <el-input v-model="dataForm.enable" placeholder="是否启用"></el-input>
    </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          id: 0,
          name: '',
          inDatasource: '',
          computeType: '',
          cacheSql: '',
          sql: '',
          period: '',
          transformerConfig: '',
          outDatasource: '',
          dependTask: '',
          cron: '',
          version: '',
          tenantId: '',
          tags: '',
          enable: ''
        },
        dataRule: {
          name: [
            { required: true, message: '任务名称不能为空', trigger: 'blur' }
          ],
          inDatasource: [
            { required: true, message: '输入数据源不能为空', trigger: 'blur' }
          ],
          computeType: [
            { required: true, message: '计算类型:1 简单 2 复杂不能为空', trigger: 'blur' }
          ],
          cacheSql: [
            { required: true, message: '历史数据生成SQL不能为空', trigger: 'blur' }
          ],
          sql: [
            { required: true, message: 'SQL不能为空', trigger: 'blur' }
          ],
          period: [
            { required: true, message: '周期(分钟)不能为空', trigger: 'blur' }
          ],
          transformerConfig: [
            { required: true, message: '转换配置不能为空', trigger: 'blur' }
          ],
          outDatasource: [
            { required: true, message: '输出数据源不能为空', trigger: 'blur' }
          ],
          dependTask: [
            { required: true, message: '依赖于某个任务(暂不支持)不能为空', trigger: 'blur' }
          ],
          cron: [
            { required: true, message: 'cron表达式不能为空', trigger: 'blur' }
          ],
          version: [
            { required: true, message: '版本号不能为空', trigger: 'blur' }
          ],
          tenantId: [
            { required: true, message: '租户id不能为空', trigger: 'blur' }
          ],
          tags: [
            { required: true, message: '标签不能为空', trigger: 'blur' }
          ],
          enable: [
            { required: true, message: '是否启用不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/honeycomb/honeycombtask/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.name = data.honeycombtask.name
                this.dataForm.inDatasource = data.honeycombtask.inDatasource
                this.dataForm.computeType = data.honeycombtask.computeType
                this.dataForm.cacheSql = data.honeycombtask.cacheSql
                this.dataForm.sql = data.honeycombtask.sql
                this.dataForm.period = data.honeycombtask.period
                this.dataForm.transformerConfig = data.honeycombtask.transformerConfig
                this.dataForm.outDatasource = data.honeycombtask.outDatasource
                this.dataForm.dependTask = data.honeycombtask.dependTask
                this.dataForm.cron = data.honeycombtask.cron
                this.dataForm.version = data.honeycombtask.version
                this.dataForm.tenantId = data.honeycombtask.tenantId
                this.dataForm.tags = data.honeycombtask.tags
                this.dataForm.enable = data.honeycombtask.enable
              }
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/honeycomb/honeycombtask/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'name': this.dataForm.name,
                'inDatasource': this.dataForm.inDatasource,
                'computeType': this.dataForm.computeType,
                'cacheSql': this.dataForm.cacheSql,
                'sql': this.dataForm.sql,
                'period': this.dataForm.period,
                'transformerConfig': this.dataForm.transformerConfig,
                'outDatasource': this.dataForm.outDatasource,
                'dependTask': this.dataForm.dependTask,
                'cron': this.dataForm.cron,
                'version': this.dataForm.version,
                'tenantId': this.dataForm.tenantId,
                'tags': this.dataForm.tags,
                'enable': this.dataForm.enable
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshDataList')
                  }
                })
              } else {
                this.$message.error(data.msg)
              }
            })
          }
        })
      }
    }
  }
</script>
