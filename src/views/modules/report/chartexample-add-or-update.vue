<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="chart示例类型" prop="chartType">
      <el-input v-model="dataForm.chartType" placeholder="chart示例类型"></el-input>
    </el-form-item>
    <el-form-item label="静态部分" prop="chartContent">
      <el-input v-model="dataForm.chartContent" placeholder="静态部分"></el-input>
    </el-form-item>
    <el-form-item label="legend数据" prop="chartLegendData">
      <el-input v-model="dataForm.chartLegendData" placeholder="legend数据"></el-input>
    </el-form-item>
    <el-form-item label="xaxis数据" prop="chartAxisData">
      <el-input v-model="dataForm.chartAxisData" placeholder="xaxis数据"></el-input>
    </el-form-item>
    <el-form-item label="series数据" prop="chartSeriesData">
      <el-input v-model="dataForm.chartSeriesData" placeholder="series数据"></el-input>
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
          chartType: '',
          chartContent: '',
          chartLegendData: '',
          chartAxisData: '',
          chartSeriesData: ''
        },
        dataRule: {
          chartType: [
            { required: true, message: 'chart示例类型不能为空', trigger: 'blur' }
          ],
          chartContent: [
            { required: true, message: '静态部分不能为空', trigger: 'blur' }
          ],
          chartLegendData: [
            { required: true, message: 'legend数据不能为空', trigger: 'blur' }
          ],
          chartAxisData: [
            { required: true, message: 'xaxis数据不能为空', trigger: 'blur' }
          ],
          chartSeriesData: [
            { required: true, message: 'series数据不能为空', trigger: 'blur' }
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
              url: this.$http.adornUrl(`/report/chartexample/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.chartType = data.chartExample.chartType
                this.dataForm.chartContent = data.chartExample.chartContent
                this.dataForm.chartLegendData = data.chartExample.chartLegendData
                this.dataForm.chartAxisData = data.chartExample.chartAxisData
                this.dataForm.chartSeriesData = data.chartExample.chartSeriesData
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
              url: this.$http.adornUrl(`/report/chartexample/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'chartType': this.dataForm.chartType,
                'chartContent': this.dataForm.chartContent,
                'chartLegendData': this.dataForm.chartLegendData,
                'chartAxisData': this.dataForm.chartAxisData,
                'chartSeriesData': this.dataForm.chartSeriesData
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
