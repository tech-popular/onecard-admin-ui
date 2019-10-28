<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
     append-to-body>
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit(this.dataForm.chartId)" label-width="80px">
      <el-form-item label="" prop="chartId">
        <el-input v-model="dataForm.chartId" style="display: none;" placeholder=""></el-input>
      </el-form-item>
    <el-form-item label="名称" prop="name">
      <el-input v-model="dataForm.name" placeholder="名称"></el-input>
    </el-form-item>
    <el-form-item label="类型" prop="type">
      <el-input v-model="dataForm.type" placeholder="类型"></el-input>
    </el-form-item>
    <el-form-item label="排序" prop="sort">
      <el-input v-model="dataForm.sort" placeholder="排序"></el-input>
    </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit(dataForm.chartId)">确定</el-button>
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
          name: '',
          type: '',
          sort: ''
        },
        dataRule: {
          name: [
            { required: true, message: '名称不能为空', trigger: 'blur' }
          ],
          type: [
            { required: true, message: '类型不能为空', trigger: 'blur' }
          ],
          sort: [
              { required: true, message: '排序不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (key, id) {
        this.dataForm.id = id || 0
        this.dataForm.key = key || 0
        this.dataForm.chartId = key
        this.visible = true
        this.$nextTick(() => {
          if (this.dataForm.id <= 0) {
            this.$refs['dataForm'].resetFields()
          }
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/phoenix/phoenixchartlegend/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.chartId = data.phoenixChartLegend.chartId
                this.dataForm.name = data.phoenixChartLegend.name
                this.dataForm.type = data.phoenixChartLegend.type
                this.dataForm.sort = data.phoenixChartLegend.sort
              }
            })
          }
        })
      },
      // 表单提交！
      dataFormSubmit (chartId) {
        this.$refs['dataForm'].validate((valid) => {
          this.dataForm.chartId = chartId
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/phoenix/phoenixchartlegend/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'chartId': this.dataForm.chartId,
                'name': this.dataForm.name,
                'type': this.dataForm.type,
                'sort': this.dataForm.sort
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
