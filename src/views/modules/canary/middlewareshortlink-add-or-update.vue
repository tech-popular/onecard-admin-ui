<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="url" prop="url">
      <el-input v-model="dataForm.url" placeholder="url"></el-input>
    </el-form-item>
    <el-form-item label="短链code" prop="shortLinkCode">
      <el-input v-model="dataForm.shortLinkCode" placeholder="短链code"></el-input>
    </el-form-item>
    <el-form-item label="短链url" prop="shortLinkUrl">
      <el-input v-model="dataForm.shortLinkUrl" placeholder="短链url"></el-input>
    </el-form-item>
    <!--<el-form-item label="创建时间" prop="createTime">
      <el-input v-model="dataForm.createTime" placeholder="创建时间"></el-input>
    </el-form-item>-->
    <el-form-item label="是否可用" prop="enable">
      <el-radio-group v-model="dataForm.enable">
        <el-radio :label="0">禁用</el-radio>
        <el-radio :label="1">可用</el-radio>
      </el-radio-group>
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
          url: '',
          shortLinkCode: '',
          shortLinkUrl: '',
          createTime: '',
          enable: 1
        },
        dataRule: {
          url: [
            { required: true, message: 'url不能为空', trigger: 'blur' }
          ],
          shortLinkCode: [
            { required: true, message: '短链code不能为空', trigger: 'blur' }
          ],
          shortLinkUrl: [
            { required: true, message: '短链url不能为空', trigger: 'blur' }
          ],
          enable: [
            { required: true, message: '是否可用(1:true 0:false)不能为空', trigger: 'blur' }
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
              url: this.$http.adornUrl(`/canary/middlewareshortlink/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.url = data.middlewareShortlink.url
                this.dataForm.shortLinkCode = data.middlewareShortlink.shortLinkCode
                this.dataForm.shortLinkUrl = data.middlewareShortlink.shortLinkUrl
                this.dataForm.createTime = data.middlewareShortlink.createTime
                this.dataForm.enable = data.middlewareShortlink.enable
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
              url: this.$http.adornUrl(`/canary/middlewareshortlink/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'url': this.dataForm.url,
                'shortLinkCode': this.dataForm.shortLinkCode,
                'shortLinkUrl': this.dataForm.shortLinkUrl,
                'createTime': this.dataForm.createTime,
                'enable': this.dataForm.enable
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
