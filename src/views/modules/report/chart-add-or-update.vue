<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="图表类型" prop="chartType">
      <el-input v-model="dataForm.chartType" placeholder="图表类型"></el-input>
    </el-form-item>
    <el-form-item label="图标作者" prop="chartAuthor">
      <el-input v-model="dataForm.chartAuthor" placeholder="图标作者"></el-input>
    </el-form-item>
    <el-form-item label="图标options" prop="chartOption">
      <el-input v-model="dataForm.chartOption" placeholder="图标options"></el-input>
    </el-form-item>
    <el-form-item label="副标题" prop="subtext">
      <el-input v-model="dataForm.subtext" placeholder="副标题"></el-input>
    </el-form-item>
    <el-form-item label="副标题样式" prop="subtextStyle">
      <el-input v-model="dataForm.subtextStyle" placeholder="副标题样式"></el-input>
    </el-form-item>
    <el-form-item label="图例外键" prop="legendId">
      <el-input v-model="dataForm.legendId" placeholder="图例外键"></el-input>
    </el-form-item>
    <el-form-item label="x轴外键" prop="xaxisId">
      <el-input v-model="dataForm.xaxisId" placeholder="x轴外键"></el-input>
    </el-form-item>
    <el-form-item label="y轴说明" prop="yaxis">
      <el-input v-model="dataForm.yaxis" placeholder="y轴说明"></el-input>
    </el-form-item>
    <el-form-item label="区域组件说明" prop="dataZoom">
      <el-input v-model="dataForm.dataZoom" placeholder="区域组件说明"></el-input>
    </el-form-item>
    <el-form-item label="提示框说明" prop="tooltip">
      <el-input v-model="dataForm.tooltip" placeholder="提示框说明"></el-input>
    </el-form-item>
    <el-form-item label="工具栏配置" prop="toolbox">
      <el-input v-model="dataForm.toolbox" placeholder="工具栏配置"></el-input>
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
          chartAuthor: '',
          chartOption: '',
          subtext: '',
          subtextStyle: '',
          legendId: '',
          xaxisId: '',
          yaxis: '',
          dataZoom: '',
          tooltip: '',
          toolbox: ''
        },
        dataRule: {
          chartType: [
            { required: true, message: '图表类型不能为空', trigger: 'blur' }
          ],
          chartAuthor: [
            { required: true, message: '图标作者不能为空', trigger: 'blur' }
          ],
          chartOption: [
            { required: true, message: '图标options不能为空', trigger: 'blur' }
          ],
          subtext: [
            { required: true, message: '副标题不能为空', trigger: 'blur' }
          ],
          subtextStyle: [
            { required: true, message: '副标题样式不能为空', trigger: 'blur' }
          ],
          legendId: [
            { required: true, message: '图例外键不能为空', trigger: 'blur' }
          ],
          xaxisId: [
            { required: true, message: 'x轴外键不能为空', trigger: 'blur' }
          ],
          yaxis: [
            { required: true, message: 'y轴说明不能为空', trigger: 'blur' }
          ],
          dataZoom: [
            { required: true, message: '区域组件说明不能为空', trigger: 'blur' }
          ],
          tooltip: [
            { required: true, message: '提示框说明不能为空', trigger: 'blur' }
          ],
          toolbox: [
            { required: true, message: '工具栏配置不能为空', trigger: 'blur' }
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
              url: this.$http.adornUrl(`/report/chart/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.chartType = data.chart.chartType
                this.dataForm.chartAuthor = data.chart.chartAuthor
                this.dataForm.chartOption = data.chart.chartOption
                this.dataForm.subtext = data.chart.subtext
                this.dataForm.subtextStyle = data.chart.subtextStyle
                this.dataForm.legendId = data.chart.legendId
                this.dataForm.xaxisId = data.chart.xaxisId
                this.dataForm.yaxis = data.chart.yaxis
                this.dataForm.dataZoom = data.chart.dataZoom
                this.dataForm.tooltip = data.chart.tooltip
                this.dataForm.toolbox = data.chart.toolbox
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
              url: this.$http.adornUrl(`/report/chart/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'chartType': this.dataForm.chartType,
                'chartAuthor': this.dataForm.chartAuthor,
                'chartOption': this.dataForm.chartOption,
                'subtext': this.dataForm.subtext,
                'subtextStyle': this.dataForm.subtextStyle,
                'legendId': this.dataForm.legendId,
                'xaxisId': this.dataForm.xaxisId,
                'yaxis': this.dataForm.yaxis,
                'dataZoom': this.dataForm.dataZoom,
                'tooltip': this.dataForm.tooltip,
                'toolbox': this.dataForm.toolbox
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
