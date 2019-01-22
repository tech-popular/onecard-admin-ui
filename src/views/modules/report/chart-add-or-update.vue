<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <!--<el-form-item label="创建者" prop="userId">-->
      <!--<el-input v-model="dataForm.userId" placeholder="创建者"></el-input>-->
    <!--</el-form-item>-->
    <el-form-item label="模板类型" prop="chartType">
      <el-input v-model="dataForm.chartType" placeholder="模板类型"></el-input>
    </el-form-item>
    <el-form-item label="模板内容" prop="chartContent">
      <el-input v-model="dataForm.chartContent" placeholder="模板内容"></el-input>
    </el-form-item>
    <el-form-item label="宽度" prop="posWidth">
      <el-input v-model="dataForm.posWidth" placeholder="宽度"></el-input>
    </el-form-item>
    <el-form-item label="高度" prop="posHeight">
      <el-input v-model="dataForm.posHeight" placeholder="高度"></el-input>
    </el-form-item>
    <el-form-item label="左边距" prop="posLeft">
      <el-input v-model="dataForm.posLeft" placeholder="左边距"></el-input>
    </el-form-item>
    <el-form-item label="上边距" prop="posTop">
      <el-input v-model="dataForm.posTop" placeholder="上边距"></el-input>
    </el-form-item>
    <el-form-item label="属于哪个报表" prop="belongReport">
      <el-input v-model="dataForm.belongReport" placeholder="属于哪个报表"></el-input>
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
          userId: '',
          chartType: '',
          chartContent: '',
          posWidth: '',
          posHeight: '',
          posLeft: '',
          posTop: '',
          belongReport: ''
        },
        dataRule: {
          // userId: [
          //   { required: true, message: '创建者不能为空', trigger: 'blur' }
          // ],
          chartType: [
            { required: true, message: '模板类型不能为空', trigger: 'blur' }
          ],
          chartContent: [
            { required: true, message: '模板内容不能为空', trigger: 'blur' }
          ],
          posWidth: [
            { required: true, message: '宽度不能为空', trigger: 'blur' }
          ],
          posHeight: [
            { required: true, message: '高度不能为空', trigger: 'blur' }
          ],
          posLeft: [
            { required: true, message: '左边距不能为空', trigger: 'blur' }
          ],
          posTop: [
            { required: true, message: '上边距不能为空', trigger: 'blur' }
          ],
          belongReport: [
            { required: true, message: '属于哪个报表不能为空', trigger: 'blur' }
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
                this.dataForm.userId = data.chart.userId
                this.dataForm.chartType = data.chart.chartType
                this.dataForm.chartContent = data.chart.chartContent
                this.dataForm.posWidth = data.chart.posWidth
                this.dataForm.posHeight = data.chart.posHeight
                this.dataForm.posLeft = data.chart.posLeft
                this.dataForm.posTop = data.chart.posTop
                this.dataForm.belongReport = data.chart.belongReport
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
                'userId': this.dataForm.userId,
                'chartType': this.dataForm.chartType,
                'chartContent': this.dataForm.chartContent,
                'posWidth': this.dataForm.posWidth,
                'posHeight': this.dataForm.posHeight,
                'posLeft': this.dataForm.posLeft,
                'posTop': this.dataForm.posTop,
                'belongReport': this.dataForm.belongReport
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
