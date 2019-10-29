<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    append-to-body>
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
    <el-form-item label="sql语句"   prop="sql">
      <el-input v-model="dataForm.sql" type="textarea"  :rows="5" placeholder="sql语句"></el-input>
    </el-form-item>
    <el-form-item label="类型" prop="type">
      <el-select v-model="dataForm.type" placeholder="请选择">
        <el-option v-for="item in sqlTypes" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
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
          chartId: '',
          sql: '',
          type: ''
        },
        sqlTypes: [],
        // chartoptions: [],
        dataRule: {
          sql: [
            { required: true, message: 'sql语句不能为空', trigger: 'blur' }
          ],
          type: [
            { required: true, message: '标识sql对应的chart组件类型 legend、series不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (chartId, id) {
       /* this.$http({
          url: this.$http.adornUrl(`/phoenix/phoenixchart/select`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.chartoptions = data.phoenixChartEntities
          }
        }) */
        this.dataForm.id = id || 0
        this.dataForm.chartId = chartId || 0
        this.visible = true
          // 下拉框选型
        this.$http({
          url: this.$http.adornUrl(`/sys/sysdictitem/selectbydictypes`),
          method: 'post',
          data: this.$http.adornData(['sql_type'], false)
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.sqlTypes = data.dicMap.sql_type
          }
        })
        this.$nextTick(() => {
          if (this.dataForm.id <= 0) {
            this.$refs['dataForm'].resetFields()
          }
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/phoenix/phoenixchartsql/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.chartId = data.phoenixChartSql.chartId
                this.dataForm.sql = data.phoenixChartSql.sql
                this.dataForm.type = data.phoenixChartSql.type
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
              url: this.$http.adornUrl(`/phoenix/phoenixchartsql/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'chartId': this.dataForm.chartId,
                'sql': this.dataForm.sql,
                'type': this.dataForm.type
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshDataList1')
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
