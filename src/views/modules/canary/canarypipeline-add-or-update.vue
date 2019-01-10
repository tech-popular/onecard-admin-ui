<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="方式" prop="channel">
      <!--<el-input v-model="dataForm.channel" placeholder="方式"></el-input>-->
      <el-select v-model="dataForm.channel" placeholder="请选择">
          <el-option v-for="item in channelOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
    </el-form-item>
    <el-form-item label="名称" prop="name">
      <el-input v-model="dataForm.name" placeholder="名称"></el-input>
    </el-form-item>
    <el-form-item label="pipe值" prop="value">
      <el-input v-model="dataForm.value" placeholder="pipe值"></el-input>
    </el-form-item>
    <el-form-item label="模板Id" prop="templateId">
      <!--<el-input v-model="dataForm.templateId" placeholder="模板Id"></el-input>-->
      <el-select v-model="dataForm.templateId" placeholder="请选择">
    <el-option
      v-for="item in options"
      :key="item.id"
      :label="item.name"
      :value="item.id">
       </el-option>
     </el-select>
    </el-form-item>
    <el-form-item label="是否启用" prop="enable">
    <el-radio-group v-model="dataForm.enable">
          <el-radio :label="0">禁用</el-radio>
          <el-radio :label="1">正常</el-radio>
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
          channel: '',
          name: '',
          value: '',
          templateId: '',
          enable: 1
        },
        dataRule: {
          channel: [
            { required: true, message: '渠道不能为空', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '名称不能为空', trigger: 'blur' }
          ],
          enable: [
            { required: true, message: '是否启用不能为空', trigger: 'blur' }
          ]
        },
        options: [],
        channelOptions: [{
          value: 1,
          label: '钉钉'
        },
        {
          value: 2,
          label: '邮箱'
        },
        {
          value: 3,
          label: '电话'
        }]
      }
    },
    methods: {
      init (id) {
        this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          this.$http({
            url: this.$http.adornUrl(`/canary/canarytemplate/select`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.options = data.canaryTemplateEntities
            }
          })
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/canary/canarypipeline/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.channel = data.canaryPipeline.channel
                this.dataForm.name = data.canaryPipeline.name
                this.dataForm.value = data.canaryPipeline.value
                this.dataForm.templateId = data.canaryPipeline.templateId
                this.dataForm.enable = data.canaryPipeline.enable
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
              url: this.$http.adornUrl(`/canary/canarypipeline/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'channel': this.dataForm.channel,
                'name': this.dataForm.name,
                'value': this.dataForm.value,
                'templateId': this.dataForm.templateId,
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
