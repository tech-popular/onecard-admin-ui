<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="150px">
    <el-form-item label="任务名称" prop="name">
      <el-input v-model="dataForm.name" placeholder="任务名称"></el-input>
    </el-form-item>
    <el-form-item label="输入数据源" prop="inDatasource">
      <el-select v-model="dataForm.inDatasource" placeholder="请选择">
        <el-option
          v-for="item in datasourceoptions"
          :key="item.id"
          :label="item.datasourceName"
          :value="item.id">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="计算类型" prop="computeType">
      <el-select v-model="dataForm.computeType" placeholder="请选择">
        <el-option v-for="item in computeTypeoptions" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
      <el-form-item
        v-for="(outdata, index) in dataForm.honeycombOutDatasourceEntitys"
        :label="'输出数据源'+index"
        :key="outdata.key"
        :prop="dataForm.honeycombOutDatasourceEntitys.outTableName"
        :rules="{
      required: true, message: '表名不能为空', trigger: 'blur'}">
        <el-row :gutter="24">
          <el-col :span="9"><div class="grid-content bg-purple">
            <el-select v-model="outdata.outDatasource" placeholder="请选择">
              <el-option
                v-for="item in datasourceoptions"
                :key="item.id"
                :label="item.datasourceName"
                :value="item.id">
              </el-option>
            </el-select>
          </div></el-col>
          <el-col :span="9"><div class="grid-content bg-purple">

            <el-input v-model="outdata.outTableName"></el-input>
          </div></el-col>
          <el-col :span="4"><div class="grid-content bg-purple">

            <el-button @click.prevent="removeDomain(outdata)">删除</el-button>
          </div></el-col>
        </el-row>

      </el-form-item>
      <el-form-item>
        <el-button @click="addDomain">新增输出数据源</el-button>
      </el-form-item>
    <el-form-item label="SQL" prop="sql">
      <el-input type="textarea" v-model="dataForm.sql" placeholder="SQL" :rows="10"></el-input>
    </el-form-item>
    <el-form-item label="周期" prop="period">
      <el-input v-model="dataForm.period" placeholder="周期"></el-input>
    </el-form-item>
    <!--<el-form-item label="转换配置" prop="transformerConfig">-->
      <!--<el-input v-model="dataForm.transformerConfig" placeholder="转换配置"></el-input>-->
    <!--</el-form-item>-->
    <el-form-item label="cron表达式" prop="cron">
      <el-input v-model="dataForm.cron" placeholder="cron表达式"></el-input>
    </el-form-item>
      <el-collapse  v-model="activeNames">
        <el-collapse-item title="高级选项" name="1" >
      <el-form-item label="id规则" prop="idRule">
        <el-select v-model="dataForm.idRule" placeholder="请选择">
          <el-option v-for="item in idRuleoptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="增加task字段" prop="addFieldTask">
        <el-select v-model="dataForm.addFieldTask" placeholder="请选择">
          <el-option
            v-for="item in tureOrFalseoptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="增加timestamp字段" prop="addFieldTimestamp">
        <el-select v-model="dataForm.addFieldTimestamp" placeholder="请选择">
          <el-option
            v-for="item in tureOrFalseoptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="重写规则" prop="overwriteKey">
        <el-input v-model="dataForm.overwriteKey" placeholder="overwriteKey"></el-input>
      </el-form-item>
      <el-form-item label="服务名称字段" prop="serviceNameFiled">
        <el-input v-model="dataForm.serviceNameFiled" placeholder="serviceNameFiled"></el-input>
      </el-form-item>
      <el-form-item label="健康检查任务" prop="isHealthcheck">
        <el-select v-model="dataForm.isHealthcheck" placeholder="请选择">
          <el-option
            v-for="item in tureOrFalseoptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
    <el-form-item label="版本号" prop="version">
      <el-input v-model="dataForm.version" placeholder="版本号" disabled></el-input>
    </el-form-item>
    <el-form-item label="标签" prop="tags">
      <el-input v-model="dataForm.tags" placeholder="标签"></el-input>
    </el-form-item>
      <el-form-item label="是否启用" prop="enable">
        <el-radio-group v-model="dataForm.enable">
          <el-radio :label="0">禁用</el-radio>
          <el-radio :label="1">正常</el-radio>
        </el-radio-group>
      </el-form-item>
        </el-collapse-item>
      </el-collapse>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button style="margin-top: 12px;" v-show="dataForm.id" @click="startTask()">启动任务</el-button>
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
        activeNames: '1',
        dataForm: {
          id: 0,
          name: '',
          inDatasource: '',
          computeType: '',
          sql: '',
          period: 0,
          transformerConfig: '',
          outDatasource: '',
          cron: '',
          version: 1,
          tenantId: 1,
          tags: '',
          enable: 1,
          idRule: 'none',
          addFieldTask: 'false',
          addFieldTimestamp: 'false',
          overwriteKey: '',
          serviceNameFiled: '',
          isHealthcheck: 'false',
          honeycombOutDatasourceEntitys: [{
            outTableName: '',
            outDatasource: 1,
            enable: 1,
            taskId: 0
          }]
        },
        datasourceoptions: [],
        computeTypeoptions: [],
        idRuleoptions: [],
        tureOrFalseoptions: [{
          value: true,
          label: 'true'
        }, {
          value: false,
          label: 'false'
        }],
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
          period: [
            { required: true, message: '周期不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      addDomain () {
        this.dataForm.honeycombOutDatasourceEntitys.push({
          outTableName: '',
          key: Date.now()
        })
        console.log(this.dataForm)
      },
      removeDomain (item) {
        var index = this.dataForm.honeycombOutDatasourceEntitys.indexOf(item)
        if (index !== -1) {
          this.dataForm.honeycombOutDatasourceEntitys.splice(index, 1)
        }
      },
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
          url: this.$http.adornUrl(`/sys/sysdictitem/selectalltaskpage`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.computeTypeoptions = data.taskDicts.task_compute_type
            this.idRuleoptions = data.taskDicts.task_id_rule
          }
        })
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
                this.dataForm.name = data.honeycombTask.name
                this.dataForm.inDatasource = data.honeycombTask.inDatasource
                this.dataForm.computeType = data.honeycombTask.computeType
                this.dataForm.sql = data.honeycombTask.sql
                this.dataForm.period = data.honeycombTask.period
                this.dataForm.transformerConfig = data.honeycombTask.transformerConfig
                this.dataForm.cron = data.honeycombTask.cron
                this.dataForm.version = data.honeycombTask.version
                this.dataForm.tenantId = data.honeycombTask.tenantId
                this.dataForm.tags = data.honeycombTask.tags
                this.dataForm.enable = data.honeycombTask.enable
                this.dataForm.idRule = data.honeycombTask.idRule
                this.dataForm.addFieldTask = data.honeycombTask.addFieldTask
                this.dataForm.addFieldTimestamp = data.honeycombTask.addFieldTimestamp
                this.dataForm.overwriteKey = data.honeycombTask.overwriteKey
                this.dataForm.serviceNameFiled = data.honeycombTask.serviceNameFiled
                this.dataForm.isHealthcheck = data.honeycombTask.isHealthcheck
                this.dataForm.honeycombOutDatasourceEntitys = data.honeycombTask.honeycombOutDatasourceEntitys
              }
            })
          }
        })
      },
      /**
       * 启动任务
       */
      startTask () {
        return this.$http({
          url: this.$http.adornUrl(`/honeycomb/honeycombtask/starttask/${this.dataForm.id}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({
                   data
                 }) => {
          if (data && data.code === 0) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.visible = false
                this.$emit('closeUpdateBox')
                this.$emit('refreshDataList')
              }
            })
          } else {
            this.$message.error(data.msg)
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
                'sql': this.dataForm.sql,
                'period': this.dataForm.period,
                'transformerConfig': this.dataForm.transformerConfig,
                'outDatasource': this.dataForm.outDatasource,
                'cron': this.dataForm.cron,
                'version': this.dataForm.version,
                'tenantId': this.dataForm.tenantId,
                'tags': this.dataForm.tags,
                'enable': this.dataForm.enable,
                'idRule': this.dataForm.idRule,
                'addFieldTimestamp': this.dataForm.addFieldTimestamp,
                'addFieldTask': this.dataForm.addFieldTask,
                'overwriteKey': this.dataForm.overwriteKey,
                'serviceNameFiled': this.dataForm.serviceNameFiled,
                'isHealthcheck': this.dataForm.isHealthcheck,
                'honeycombOutDatasourceEntitys': this.dataForm.honeycombOutDatasourceEntitys
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
