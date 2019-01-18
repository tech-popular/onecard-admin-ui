<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="横坐标是否显示" prop="xaxisShow">
      <el-input v-model="dataForm.xaxisShow" placeholder="横坐标是否显示"></el-input>
    </el-form-item>
    <el-form-item label="坐标类型" prop="xaxisType">
      <el-input v-model="dataForm.xaxisType" placeholder="坐标类型"></el-input>
    </el-form-item>
    <el-form-item label="两侧是否留白" prop="boundaryGap">
      <el-input v-model="dataForm.boundaryGap" placeholder="两侧是否留白"></el-input>
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
          xaxisShow: '',
          xaxisType: '',
          boundaryGap: ''
        },
        dataRule: {
          xaxisShow: [
            { required: true, message: '横坐标是否显示不能为空', trigger: 'blur' }
          ],
          xaxisType: [
            { required: true, message: '坐标类型不能为空', trigger: 'blur' }
          ],
          boundaryGap: [
            { required: true, message: '两侧是否留白不能为空', trigger: 'blur' }
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
              url: this.$http.adornUrl(`/report/chartxaxis/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.xaxisShow = data.chartxaxis.xaxisShow
                this.dataForm.xaxisType = data.chartxaxis.xaxisType
                this.dataForm.boundaryGap = data.chartxaxis.boundaryGap
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
              url: this.$http.adornUrl(`/report/chartxaxis/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'xaxisShow': this.dataForm.xaxisShow,
                'xaxisType': this.dataForm.xaxisType,
                'boundaryGap': this.dataForm.boundaryGap
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
