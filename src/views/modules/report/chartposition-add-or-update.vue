<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="报表ID" prop="reportId">
      <el-input v-model="dataForm.reportId" placeholder="报表ID"></el-input>
    </el-form-item>
    <el-form-item label="chartID" prop="chartId">
      <el-input v-model="dataForm.chartId" placeholder="chartID"></el-input>
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
    <el-form-item label="是否可修改" prop="isModify">
      <el-input v-model="dataForm.isModify" placeholder="是否可修改"></el-input>
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
          positionId: 0,
          reportId: '',
          chartId: '',
          posWidth: '',
          posHeight: '',
          posLeft: '',
          posTop: '',
          isModify: ''
        },
        dataRule: {
          reportId: [
            { required: true, message: '报表ID不能为空', trigger: 'blur' }
          ],
          chartId: [
            { required: true, message: 'chartID不能为空', trigger: 'blur' }
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
          isModify: [
            { required: true, message: '是否可修改不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.positionId = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.positionId) {
            this.$http({
              url: this.$http.adornUrl(`/report/chartposition/info/${this.dataForm.positionId}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.reportId = data.chartPosition.reportId
                this.dataForm.chartId = data.chartPosition.chartId
                this.dataForm.posWidth = data.chartPosition.posWidth
                this.dataForm.posHeight = data.chartPosition.posHeight
                this.dataForm.posLeft = data.chartPosition.posLeft
                this.dataForm.posTop = data.chartPosition.posTop
                this.dataForm.isModify = data.chartPosition.isModify
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
              url: this.$http.adornUrl(`/report/chartposition/${!this.dataForm.positionId ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'positionId': this.dataForm.positionId || undefined,
                'reportId': this.dataForm.reportId,
                'chartId': this.dataForm.chartId,
                'posWidth': this.dataForm.posWidth,
                'posHeight': this.dataForm.posHeight,
                'posLeft': this.dataForm.posLeft,
                'posTop': this.dataForm.posTop,
                'isModify': this.dataForm.isModify
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
