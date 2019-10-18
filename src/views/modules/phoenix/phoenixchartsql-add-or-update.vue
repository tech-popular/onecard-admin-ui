<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
  <!--  <el-form-item label="chart_id号" prop="chartId">
      &lt;!&ndash;<el-input v-model="dataForm.chartId" disabled placeholder="chart_id号"></el-input>&ndash;&gt;
      <el-select v-model="dataForm.chartId" placeholder="请选择">
        <el-option v-for="item in chartoptions" :key="item.id" :label="item.text" :value="item.id">
        </el-option>
      </el-select>
    </el-form-item>-->
    <el-form-item label="sql语句"   prop="sql">
      <el-input v-model="dataForm.sql" type="textarea"  :rows="5" placeholder="sql语句"></el-input>
    </el-form-item>
    <el-form-item label="标识sql对应的chart组件类型 legend、series" prop="type">
      <el-input v-model="dataForm.type" placeholder="组件类型"></el-input>
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
        // chartoptions: [],
        dataRule: {
/*          chartId: [
            { required: true, message: 'chart_id号不能为空', trigger: 'blur' }
          ], */
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
      init (id) {
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
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
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
