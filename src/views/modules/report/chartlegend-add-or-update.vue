<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="类型" prop="legendType">
      <el-input v-model="dataForm.legendType" placeholder="类型"></el-input>
    </el-form-item>
    <el-form-item label="是否显示" prop="legendShow">
      <el-input v-model="dataForm.legendShow" placeholder="是否显示"></el-input>
    </el-form-item>
    <el-form-item label="左间距" prop="legendLeft">
      <el-input v-model="dataForm.legendLeft" placeholder="左间距"></el-input>
    </el-form-item>
    <el-form-item label="上间距" prop="legendTop">
      <el-input v-model="dataForm.legendTop" placeholder="上间距"></el-input>
    </el-form-item>
    <el-form-item label="右间距" prop="legendRight">
      <el-input v-model="dataForm.legendRight" placeholder="右间距"></el-input>
    </el-form-item>
    <el-form-item label="底部间距" prop="legendBottom">
      <el-input v-model="dataForm.legendBottom" placeholder="底部间距"></el-input>
    </el-form-item>
    <el-form-item label="布局朝向" prop="orient">
      <el-input v-model="dataForm.orient" placeholder="布局朝向"></el-input>
    </el-form-item>
    <el-form-item label="对齐方式" prop="align">
      <el-input v-model="dataForm.align" placeholder="对齐方式"></el-input>
    </el-form-item>
    <el-form-item label="间距" prop="itemGap">
      <el-input v-model="dataForm.itemGap" placeholder="间距"></el-input>
    </el-form-item>
    <el-form-item label="文本样式" prop="textStyle">
      <el-input v-model="dataForm.textStyle" placeholder="文本样式"></el-input>
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
          legendType: '',
          legendShow: '',
          legendLeft: '',
          legendTop: '',
          legendRight: '',
          legendBottom: '',
          orient: '',
          align: '',
          itemGap: '',
          textStyle: ''
        },
        dataRule: {
          legendType: [
            { required: true, message: '类型不能为空', trigger: 'blur' }
          ],
          legendShow: [
            { required: true, message: '是否显示不能为空', trigger: 'blur' }
          ],
          legendLeft: [
            { required: true, message: '左间距不能为空', trigger: 'blur' }
          ],
          legendTop: [
            { required: true, message: '上间距不能为空', trigger: 'blur' }
          ],
          legendRight: [
            { required: true, message: '右间距不能为空', trigger: 'blur' }
          ],
          legendBottom: [
            { required: true, message: '底部间距不能为空', trigger: 'blur' }
          ],
          orient: [
            { required: true, message: '布局朝向不能为空', trigger: 'blur' }
          ],
          align: [
            { required: true, message: '对齐方式不能为空', trigger: 'blur' }
          ],
          itemGap: [
            { required: true, message: '间距不能为空', trigger: 'blur' }
          ],
          textStyle: [
            { required: true, message: '文本样式不能为空', trigger: 'blur' }
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
              url: this.$http.adornUrl(`/report/chartlegend/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.legendType = data.chartlegend.legendType
                this.dataForm.legendShow = data.chartlegend.legendShow
                this.dataForm.legendLeft = data.chartlegend.legendLeft
                this.dataForm.legendTop = data.chartlegend.legendTop
                this.dataForm.legendRight = data.chartlegend.legendRight
                this.dataForm.legendBottom = data.chartlegend.legendBottom
                this.dataForm.orient = data.chartlegend.orient
                this.dataForm.align = data.chartlegend.align
                this.dataForm.itemGap = data.chartlegend.itemGap
                this.dataForm.textStyle = data.chartlegend.textStyle
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
              url: this.$http.adornUrl(`/report/chartlegend/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'legendType': this.dataForm.legendType,
                'legendShow': this.dataForm.legendShow,
                'legendLeft': this.dataForm.legendLeft,
                'legendTop': this.dataForm.legendTop,
                'legendRight': this.dataForm.legendRight,
                'legendBottom': this.dataForm.legendBottom,
                'orient': this.dataForm.orient,
                'align': this.dataForm.align,
                'itemGap': this.dataForm.itemGap,
                'textStyle': this.dataForm.textStyle
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
