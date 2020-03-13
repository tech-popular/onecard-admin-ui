<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
    <el-form-item label="数据库名字" prop="datasourceName">
      <el-input v-model="dataForm.datasourceName" placeholder="数据库名字"></el-input>
    </el-form-item>
    <el-form-item label="数据源类型" prop="datasourceType">
      <el-select v-model="dataForm.datasourceType" placeholder="请选择" @change='chageDataSourceType'>
        <el-option
          v-for="item in datasourceTypeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="数据源所属部门" prop="datasourceDepartment" >
      <el-input v-model="dataForm.datasourceDepartment" placeholder="数据源所属部门"></el-input>
    </el-form-item>
    <el-form-item label="区域" prop="driver" v-if="dataFieldList.includes('driverArea')">
      <el-select v-model="dataForm.driver" placeholder="请选择">
        <el-option label="中国地区" value=''>中国地区</el-option>
        <el-option label="海外地区" value='overseas'>海外地区</el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="数据库驱动" prop="driver" v-if="dataFieldList.includes('driver')">
      <el-input v-model="dataForm.driver" placeholder="数据库驱动"></el-input>
    </el-form-item>
    <el-form-item label="数据库用户名" prop="user" v-if="dataFieldList.includes('user')">
      <el-input v-model="dataForm.user" placeholder="数据库用户名"></el-input>
    </el-form-item>
    <el-form-item label="数据库密码" prop="passwd" v-if="dataFieldList.includes('passwd')">
      <el-input v-model="dataForm.passwd" placeholder="数据库密码" show-password></el-input>
    </el-form-item>
    <el-form-item label="url" prop="url" v-if="dataFieldList.includes('url')">
      <el-input v-model="dataForm.url" placeholder="url"></el-input>
    </el-form-item>
    <el-form-item label="版本号" prop="version" v-if="dataFieldList.includes('version')">
      <el-input v-model="dataForm.version" placeholder="版本号"></el-input>
    </el-form-item>
    <el-form-item label="创建时间" prop="createTime" v-if="dataFieldList.includes('createTime')">
      <el-input v-model="dataForm.createTime" placeholder="创建时间"></el-input>
    </el-form-item>
    <el-form-item label="更新时间" prop="updateTime" v-if="dataFieldList.includes('updateTime')">
      <el-input v-model="dataForm.updateTime" placeholder="更新时间"></el-input>
    </el-form-item>
    <el-form-item label="备注信息" prop="remark" v-if="dataFieldList.includes('remark')">
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
          datasourceDepartment: '',
          driver: '',
          user: '',
          passwd: '',
          url: '',
          version: 1,
          createTime: '',
          updateTime: '',
          remark: ''
        },
        datasourceTypeOptions: [],
        dataRule: {
          datasourceName: [
            { required: false, message: '数据库名字不能为空', trigger: 'blur' }
          ],
          datasourceType: [
            { required: false, message: '数据源类型必须是mysql,postgre,maxCompute,kafka,ftp,es ', trigger: 'blur' }
          ],
          datasourceDepartment: [
            { required: false, message: '数据源部门驱动不能为空', trigger: 'blur' }
          ],
          driver: [
            { required: false, message: '数据库驱动不能为空', trigger: 'blur' }
          ],
          user: [
            { required: false, message: '数据库用户名不能为空', trigger: 'blur' }
          ],
          passwd: [
            { required: false, message: '数据库密码不能为空', trigger: 'blur' }
          ],
          url: [
            { required: false, message: '数据库url不能为空', trigger: 'blur' }
          ],
          version: [
            { required: false, message: '版本号不能为空', trigger: 'blur' }
          ]
        },
        dataFieldList: ['driver', 'user', 'passwd', 'url', 'version', 'createTime', 'updateTime', 'remark']
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
          data: this.$http.adornData(['datasource_config_type'], false)
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.datasourceTypeOptions = data.dicMap.datasource_config_type
          }
        })
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/honeycomb/honeycombdatasourceconfig/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.datasourceName = data.honeycombDatasourceConfig.datasourceName
                this.dataForm.datasourceDepartment = data.honeycombDatasourceConfig.datasourceDepartment
                this.dataForm.datasourceType = data.honeycombDatasourceConfig.datasourceType
                this.chageDataSourceType()
                this.dataForm.driver = data.honeycombDatasourceConfig.driver
                this.dataForm.user = data.honeycombDatasourceConfig.user
                this.dataForm.passwd = data.honeycombDatasourceConfig.passwd
                this.dataForm.url = data.honeycombDatasourceConfig.url
                this.dataForm.version = data.honeycombDatasourceConfig.version
                this.dataForm.createTime = data.honeycombDatasourceConfig.createTime
                this.dataForm.updateTime = data.honeycombDatasourceConfig.updateTime
                this.dataForm.remark = data.honeycombDatasourceConfig.remark
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
              url: this.$http.adornUrl(`/honeycomb/honeycombdatasourceconfig/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'datasourceName': this.dataForm.datasourceName,
                'datasourceDepartment': this.dataForm.datasourceDepartment,
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
      },
      chageDataSourceType () {
        const type = this.dataForm.datasourceType
        if (type == 'kafka' || type == 'localFile' || type == 'canary') {
          this.dataFieldList = []
        } else if (type == 'maxCompute') {
          this.dataFieldList = ['url', 'driverArea']
        } else if (type == 'redis' || type == 'singleRedis') {
          this.dataFieldList = ['url', 'passwd']
        } else {
          this.dataFieldList = ['driver', 'user', 'passwd', 'url', 'version', 'createTime', 'updateTime', 'remark']
        }
        this.dataForm.driver = ''
        this.dataForm.user = ''
        this.dataForm.passwd = ''
        this.dataForm.url = ''
        this.dataForm.version = ''
        this.dataForm.createTime = ''
        this.dataForm.updateTime = ''
        this.dataForm.remark = ''
      }
    }
  }
</script>
