<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="cron表达式" prop="cron">
      <el-input v-model="dataForm.cron" placeholder="cron表达式"></el-input>
    </el-form-item>
      <el-form-item
        v-for="(outdata, index) in dataForm.canaryBaseTaskDatasourceEntities"
        :label="'sql数据源'+index"
        :key="outdata.key"
        :rules="{
      required: true, message: '表名不能为空', trigger: 'blur'}">
        <el-row :gutter="24">
          <el-col :span="9"><div class="grid-content bg-purple">
            <el-select v-model="outdata.datasourceId" placeholder="请选择">
              <el-option
                v-for="item in datasourceoptions"
                :key="item.id"
                :label="item.datasourceName"
                :value="item.id">
              </el-option>
            </el-select>
          </div></el-col>
          <el-col :span="9"><div class="grid-content bg-purple">
            <el-input v-model="outdata.sql"></el-input>
          </div></el-col>
          <el-col :span="4"><div class="grid-content bg-purple">

            <el-button @click.prevent="removeDomain(outdata)">删除</el-button>
          </div></el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
        <el-button @click="addDomain">新增sql数据源</el-button>
      </el-form-item>
    <el-form-item label="是否启用" prop="enable">
      <el-radio-group v-model="dataForm.enable">
        <el-radio :label="0">禁用</el-radio>
        <el-radio :label="1">正常</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="租户" prop="tenantId">
      <el-input v-model="dataForm.tenantId" placeholder="租户"></el-input>
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
        datasourceoptions: [],
        dataForm: {
          id: 0,
          cron: '',
          enable: 1,
          tenantId: 1,
          createdTime: '',
          updatedTime: '',
          canaryBaseTaskDatasourceEntities: [{
            datasourceId: 0,
            sql: ''
          }]
        },
        dataRule: {
          cron: [
            { required: true, message: 'cron表达式不能为空', trigger: 'blur' }
          ],
          enable: [
            { required: true, message: '是否启用不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      addDomain () {
        this.dataForm.canaryBaseTaskDatasourceEntities.push({
          sql: '',
          key: Date.now()
        })
      },
      removeDomain (item) {
        const index = this.dataForm.canaryBaseTaskDatasourceEntities.indexOf(item)
        if (index !== -1) {
          this.dataForm.canaryBaseTaskDatasourceEntities.splice(index, 1)
        }
      },
      init (id) {
        this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/canary/canarybasetask/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.cron = data.canaryBaseTask.cron
                this.dataForm.enable = data.canaryBaseTask.enable
                this.dataForm.tenantId = data.canaryBaseTask.tenantId
                this.dataForm.createdTime = data.canaryBaseTask.createdTime
                this.dataForm.updatedTime = data.canaryBaseTask.updatedTime
                this.dataForm.canaryBaseTaskDatasourceEntities = data.canaryBaseTask.canaryBaseTaskDatasourceEntities
              }
            })
          }
        })
        this.$http({
          url: this.$http.adornUrl(`/honeycomb/honeycombdatasourceconfig/select`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.datasourceoptions = data.honeycombDatasourceConfigEntities
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/canary/canarybasetask/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'cron': this.dataForm.cron,
                'enable': this.dataForm.enable,
                'tenantId': this.dataForm.tenantId,
                'createdTime': this.dataForm.createdTime,
                'updatedTime': this.dataForm.updatedTime,
                'canaryBaseTaskDatasourceEntities': this.dataForm.canaryBaseTaskDatasourceEntities
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
