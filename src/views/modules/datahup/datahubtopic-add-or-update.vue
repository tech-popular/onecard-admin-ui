<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="工程id" prop="projectId">
      <el-input v-model="dataForm.projectId" placeholder="工程id"></el-input>
    </el-form-item>
    <el-form-item label="工程名称" prop="projectName">
      <el-input v-model="dataForm.projectName" placeholder="工程名称"></el-input>
    </el-form-item>
    <el-form-item label="名称" prop="name">
      <el-input v-model="dataForm.name" placeholder="名称"></el-input>
    </el-form-item>
    <el-form-item label="maxcompute连接状态" prop="odpsConnectorStatus">
      <el-input v-model="dataForm.odpsConnectorStatus" placeholder="maxcompute连接状态"></el-input>
    </el-form-item>
    <el-form-item label="版本号" prop="version">
      <el-input v-model="dataForm.version" placeholder="版本号"></el-input>
    </el-form-item>
    <el-form-item label="是否启用" prop="enable">
      <el-input v-model="dataForm.enable" placeholder="是否启用"></el-input>
    </el-form-item>
    <el-form-item label="" prop="remark">
      <el-input v-model="dataForm.remark" placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="" prop="createTime">
      <el-input v-model="dataForm.createTime" placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="" prop="updateTime">
      <el-input v-model="dataForm.updateTime" placeholder=""></el-input>
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
          projectId: '',
          projectName: '',
          name: '',
          odpsConnectorStatus: '',
          version: '',
          enable: '',
          remark: '',
          createTime: '',
          updateTime: ''
        },
        dataRule: {
          projectId: [
            { required: true, message: '工程id不能为空', trigger: 'blur' }
          ],
          projectName: [
            { required: true, message: '工程名称不能为空', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '名称不能为空', trigger: 'blur' }
          ],
          odpsConnectorStatus: [
            { required: true, message: 'maxcompute连接状态不能为空', trigger: 'blur' }
          ],
          version: [
            { required: true, message: '版本号不能为空', trigger: 'blur' }
          ],
          enable: [
            { required: true, message: '是否启用不能为空', trigger: 'blur' }
          ],
          remark: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          createTime: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          updateTime: [
            { required: true, message: '不能为空', trigger: 'blur' }
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
              url: this.$http.adornUrl(`/datahup/datahubtopic/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.projectId = data.datahubTopic.projectId
                this.dataForm.projectName = data.datahubTopic.projectName
                this.dataForm.name = data.datahubTopic.name
                this.dataForm.odpsConnectorStatus = data.datahubTopic.odpsConnectorStatus
                this.dataForm.version = data.datahubTopic.version
                this.dataForm.enable = data.datahubTopic.enable
                this.dataForm.remark = data.datahubTopic.remark
                this.dataForm.createTime = data.datahubTopic.createTime
                this.dataForm.updateTime = data.datahubTopic.updateTime
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
              url: this.$http.adornUrl(`/datahup/datahubtopic/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'projectId': this.dataForm.projectId,
                'projectName': this.dataForm.projectName,
                'name': this.dataForm.name,
                'odpsConnectorStatus': this.dataForm.odpsConnectorStatus,
                'version': this.dataForm.version,
                'enable': this.dataForm.enable,
                'remark': this.dataForm.remark,
                'createTime': this.dataForm.createTime,
                'updateTime': this.dataForm.updateTime
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
