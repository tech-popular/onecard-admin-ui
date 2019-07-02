<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="数据库名字" prop="datasourceName">
      <el-input v-model="dataForm.datasourceName" placeholder="数据库名字"></el-input>
    </el-form-item>
    <el-form-item label="数据源类型" prop="datasourceType">
      <el-input v-model="dataForm.datasourceType" placeholder="数据源类型"></el-input>
    </el-form-item>
    <el-form-item label="数据库驱动" prop="driver">
      <el-input v-model="dataForm.driver" placeholder="数据库驱动"></el-input>
    </el-form-item>
    <el-form-item label="数据库用户名" prop="user">
      <el-input v-model="dataForm.user" placeholder="数据库用户名"></el-input>
    </el-form-item>
    <el-form-item label="数据库密码" prop="passwd">
      <el-input v-model="dataForm.passwd" placeholder="数据库密码"></el-input>
    </el-form-item>
    <el-form-item label="数据库url" prop="url">
      <el-input v-model="dataForm.url" placeholder="数据库url"></el-input>
    </el-form-item>
    <el-form-item label="版本号" prop="version">
      <el-input v-model="dataForm.version" placeholder="版本号"></el-input>
    </el-form-item>
    <el-form-item label="创建时间" prop="createTime">
      <el-input v-model="dataForm.createTime" placeholder="创建时间"></el-input>
    </el-form-item>
    <el-form-item label="更新时间" prop="updateTime">
      <el-input v-model="dataForm.updateTime" placeholder="更新时间"></el-input>
    </el-form-item>
    <el-form-item label="备注信息" prop="remark">
      <el-input v-model="dataForm.remark" placeholder="备注信息"></el-input>
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
          datasourceName: '',
          datasourceType: '',
          driver: '',
          user: '',
          passwd: '',
          url: '',
          version: '',
          createTime: '',
          updateTime: '',
          remark: ''
        },
        dataRule: {
          datasourceName: [
            { required: true, message: '数据库名字不能为空', trigger: 'blur' }
          ],
          datasourceType: [
            { required: true, message: '数据源类型不能为空', trigger: 'blur' }
          ],
          driver: [
            { required: true, message: '数据库驱动不能为空', trigger: 'blur' }
          ],
          user: [
            { required: true, message: '数据库用户名不能为空', trigger: 'blur' }
          ],
          passwd: [
            { required: true, message: '数据库密码不能为空', trigger: 'blur' }
          ],
          url: [
            { required: true, message: '数据库url不能为空', trigger: 'blur' }
          ]
          // version: [
          //   { required: true, message: '版本号不能为空', trigger: 'blur' }
          // ],
          // createTime: [
          //   { required: true, message: '创建时间不能为空', trigger: 'blur' }
          // ],
          // updateTime: [
          //   { required: true, message: '更新时间不能为空', trigger: 'blur' }
          // ],
          // remark: [
          //   { required: true, message: '备注信息不能为空', trigger: 'blur' }
          // ]
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
              url: this.$http.adornUrl(`/canary/canarydatasourceconfig/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.datasourceName = data.canaryDatasourceConfig.datasourceName
                this.dataForm.datasourceType = data.canaryDatasourceConfig.datasourceType
                this.dataForm.driver = data.canaryDatasourceConfig.driver
                this.dataForm.user = data.canaryDatasourceConfig.user
                this.dataForm.passwd = data.canaryDatasourceConfig.passwd
                this.dataForm.url = data.canaryDatasourceConfig.url
                this.dataForm.version = data.canaryDatasourceConfig.version
                this.dataForm.createTime = data.canaryDatasourceConfig.createTime
                this.dataForm.updateTime = data.canaryDatasourceConfig.updateTime
                this.dataForm.remark = data.canaryDatasourceConfig.remark
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
              url: this.$http.adornUrl(`/canary/canarydatasourceconfig/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'datasourceName': this.dataForm.datasourceName,
                'datasourceType': this.dataForm.datasourceType,
                'driver': this.dataForm.driver,
                'user': this.dataForm.user,
                'passwd': this.dataForm.passwd,
                'url': this.dataForm.url,
                'version': this.dataForm.version,
                'createTime': this.dataForm.createTime,
                'updateTime': this.dataForm.updateTime,
                'remark': this.dataForm.remark
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
