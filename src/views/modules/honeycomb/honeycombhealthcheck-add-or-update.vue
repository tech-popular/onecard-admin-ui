<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="应用名称" prop="serviceName">
      <el-input v-model="dataForm.serviceName" placeholder="应用名称"></el-input>
    </el-form-item>
    <el-form-item label="协议" prop="protocol">
      <el-select v-model="dataForm.protocol" placeholder="请选择">
        <el-option v-for="item in protocoloptions" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="资源" prop="uri">
      <el-input v-model="dataForm.uri" placeholder="资源"></el-input>
    </el-form-item>
    <el-form-item label="应用类型" prop="serviceType">
      <el-select v-model="dataForm.serviceType" placeholder="请选择">
        <el-option v-for="item in serviceTypeoptions" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
      <el-form-item label="是否登录" prop="isAuth">
        <el-select v-model="dataForm.isAuth" placeholder="请选择">
          <el-option v-for="item in zerooneoptions" :key="Number(item.value)" :label="item.label" :value="Number(item.value)">
          </el-option>
        </el-select>
      </el-form-item>
    <el-form-item label="用户" prop="user">
      <el-input v-model="dataForm.user" placeholder="用户"></el-input>
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input v-model="dataForm.password" placeholder="密码"></el-input>
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
          serviceName: '',
          protocol: '',
          uri: '',
          serviceType: '',
          enable: 1,
          isAuth: 0,
          user: '',
          password: ''
        },
        serviceTypeoptions: [],
        protocoloptions: [],
        zerooneoptions: [],
        dataRule: {
          serviceName: [
            { required: true, message: '应用名称不能为空', trigger: 'blur' }
          ],
          protocol: [
            { required: true, message: '协议不能为空', trigger: 'blur' }
          ],
          uri: [
            { required: true, message: '资源不能为空', trigger: 'blur' }
          ],
          serviceType: [
            { required: true, message: '应用类型不能为空', trigger: 'blur' }
          ],
          enable: [
            { required: true, message: '是否启用不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.id = id || 0
        this.visible = true
        // 下拉框选型
        this.$http({
          url: this.$http.adornUrl(`/sys/sysdictitem/selectbydictypes`),
          method: 'post',
          data: this.$http.adornData(['healthcheck_servicetype', 'healthcheck_protocol', 'zero_one'], false)
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.serviceTypeoptions = data.dicMap.healthcheck_servicetype
            this.protocoloptions = data.dicMap.healthcheck_protocol
            this.zerooneoptions = data.dicMap.zero_one
          }
        })
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/honeycomb/honeycombhealthcheck/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.serviceName = data.honeycombHealthcheck.serviceName
                this.dataForm.protocol = data.honeycombHealthcheck.protocol
                this.dataForm.uri = data.honeycombHealthcheck.uri
                this.dataForm.serviceType = data.honeycombHealthcheck.serviceType
                this.dataForm.enable = data.honeycombHealthcheck.enable
                this.dataForm.isAuth = data.honeycombHealthcheck.isAuth
                this.dataForm.user = data.honeycombHealthcheck.user
                this.dataForm.password = data.honeycombHealthcheck.password
                this.dataForm.createdTime = data.honeycombHealthcheck.createdTime
                this.dataForm.updatedTime = data.honeycombHealthcheck.updatedTime
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
              url: this.$http.adornUrl(`/honeycomb/honeycombhealthcheck/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'serviceName': this.dataForm.serviceName,
                'protocol': this.dataForm.protocol,
                'uri': this.dataForm.uri,
                'serviceType': this.dataForm.serviceType,
                'enable': this.dataForm.enable,
                'isAuth': this.dataForm.isAuth,
                'user': this.dataForm.user,
                'password': this.dataForm.password,
                'createdTime': this.dataForm.createdTime,
                'updatedTime': this.dataForm.updatedTime
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
