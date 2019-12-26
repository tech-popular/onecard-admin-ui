<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="应用名称" prop="serviceName">
      <el-select v-model="dataForm.serviceName" placeholder="请选择">
        <el-option v-for="item in serviceNameoptions" :key="item.id" :label="item.project +'--'+ item.serviceName" :value="item.serviceName">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="标题" prop="title">
      <el-input v-model="dataForm.title" placeholder="标题"></el-input>
    </el-form-item>
    <el-form-item label="输入数据源'" prop="inDatasource">
      <el-select v-model="dataForm.inDatasource" placeholder="请选择">
        <el-option
          v-for="item in datasourceoptions"
          :key="item.id"
          :label="item.datasourceName"
          :value="item.id">
        </el-option>
      </el-select>
    </el-form-item>
      <el-form-item label="报警比例" prop="alarmRatio">
        <el-input  v-model="dataForm.alarmRatio" type="number" placeholder="报警比例"></el-input>
      </el-form-item>
    <el-form-item label="执行sql" prop="sql">
      <el-input type="textarea" v-model="dataForm.sql" placeholder="执行sql"></el-input>
    </el-form-item>
    <el-form-item label="执行周期分钟，默认10分钟" prop="period">
      <el-input v-model="dataForm.period" placeholder="执行周期分钟，默认10分钟"></el-input>
    </el-form-item>
    <el-form-item label="时间类型" prop="timeType">
      <el-select v-model="dataForm.timeType" placeholder="请选择">
        <el-option v-for="item in typeoptions" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="是否启用" prop="enable">
      <el-radio-group v-model="dataForm.enable">
        <el-radio :label="0">禁用</el-radio>
        <el-radio :label="1">正常</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="创建时间" prop="createdTime">
      <el-input v-model="dataForm.createdTime" placeholder="创建时间"></el-input>
    </el-form-item>
    <el-form-item label="更新时间" prop="updatedTime">
      <el-input v-model="dataForm.updatedTime" placeholder="更新时间"></el-input>
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
      const validateNull = (rule, value, callback) => {
        value = value.trim()
        if (!value) {
          callback(new Error(rule.message))
        } else {
          callback()
        }
      }
      return {
        visible: false,
        dataForm: {
          id: 0,
          serviceName: '',
          title: '',
          inDatasource: '',
          sql: '',
          alarmRatio: '',
          period: '10',
          timeType: '',
          enable: 1,
          createdTime: '',
          updatedTime: ''
        },
        typeoptions: [],
        serviceNameoptions: [],
        datasourceoptions: [],
        dataRule: {
          serviceName: [
            { required: true, message: '应用名称不能为空', trigger: 'change' }
          ],
          title: [
            { required: true, message: '标题不能为空', trigger: 'blur', validator: validateNull }
          ],
          inDatasource: [
            { required: true, message: '输入数据源不能为空', trigger: 'blur' }
          ],
          sql: [
            { required: true, message: '执行sql不能为空', trigger: 'blur', validator: validateNull }
          ],
          period: [
            { required: true, message: '执行周期分钟，默认10分钟不能为空', trigger: 'blur', validator: validateNull }
          ],
          timeType: [
            { required: true, message: '时间类型不能为空', trigger: 'blur' }
          ],
          enable: [
            { required: true, message: '是否启用不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id) {
        // 数据源下拉框
        this.$http({
          url: this.$http.adornUrl(`/honeycomb/honeycombdatasourceconfig/select`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.datasourceoptions = data.honeycombDatasourceConfigEntities
          }
        })
        this.$http({
          url: this.$http.adornUrl(`/sys/sysdictitem/selectbydictypes`),
          method: 'post',
          data: this.$http.adornData(['honeycomb_business_data_check_time_type'], false)
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.typeoptions = data.dicMap.honeycomb_business_data_check_time_type
          }
        })
        this.$http({
          url: this.$http.adornUrl(`/canary/canaryproject/select`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.serviceNameoptions = data.allProjects
          }
        })
        this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/honeycomb/honeycombbusinessdatacheck/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.serviceName = data.honeycombBusinessDataCheck.serviceName
                this.dataForm.title = data.honeycombBusinessDataCheck.title
                this.dataForm.inDatasource = data.honeycombBusinessDataCheck.inDatasource
                this.dataForm.sql = data.honeycombBusinessDataCheck.sql
                this.dataForm.period = data.honeycombBusinessDataCheck.period
                this.dataForm.timeType = data.honeycombBusinessDataCheck.timeType
                this.dataForm.enable = data.honeycombBusinessDataCheck.enable
                this.dataForm.alarmRatio = data.honeycombBusinessDataCheck.alarmRatio
                this.dataForm.createdTime = data.honeycombBusinessDataCheck.createdTime
                this.dataForm.updatedTime = data.honeycombBusinessDataCheck.updatedTime
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
              url: this.$http.adornUrl(`/honeycomb/honeycombbusinessdatacheck/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'serviceName': this.dataForm.serviceName,
                'title': this.dataForm.title,
                'inDatasource': this.dataForm.inDatasource,
                'sql': this.dataForm.sql,
                'period': this.dataForm.period,
                'alarmRatio': this.dataForm.alarmRatio,
                'timeType': this.dataForm.timeType,
                'enable': this.dataForm.enable,
                'createdTime': this.dataForm.createdTime,
                'updatedTime': this.dataForm.updatedTime
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
