<template>
  <!-- <ele-form-dialog
    v-model="formData"
    :formDesc="formDesc"
    :request-fn="handleSubmit"
    :visible.sync="visible"
    @request-success="handleSuccess"
    :title="id ? '编辑' : '新增'"
  ></ele-form-dialog> -->
  <el-dialog
    :title="!!id ? '编辑' : '新增'"
    :close-on-click-modal="false"
    width="800px"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="180px">
      <el-form-item label="数据源名称" prop="dataSourceName">
        <el-input v-model="dataForm.dataSourceName" placeholder="数据源名称" disabled />
      </el-form-item>
      <el-form-item label="数据源类型" prop="dataSourceType">
        <el-input v-model="dataForm.dataSourceType" placeholder="数据源类型" disabled />
      </el-form-item>
      <el-form-item label="数据源描述" prop="dataSourceDescribe">
        <el-input type="textarea" v-model="dataForm.dataSourceDescribe" placeholder="数据源描述" disabled />
      </el-form-item>
      <el-form-item label="服务器地址" prop="dataSourceIp">
        <el-input v-model="dataForm.dataSourceIp" placeholder="服务器地址" disabled />
      </el-form-item>
      <el-form-item label="数据库名称" prop="dataSourceDatabase">
        <el-input v-model="dataForm.dataSourceDatabase" placeholder="数据库名称" disabled />
      </el-form-item>
      <el-form-item label="账户类型" prop="datasourceAccountType">
        <el-radio-group v-model="dataForm.datasourceAccountType" @change="accountChange">
          <el-radio :label="0">公共账户</el-radio>
          <el-radio :label="1">个人帐户</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="用户名 / Access Key ID" prop="datasourceUser">
        <el-input autocomplete="off" v-model="dataForm.datasourceUser" placeholder="用户名 / Access Key ID" />
      </el-form-item>
      <el-form-item label="密码 / Access Key Secret" prop="datasourcePasswd" v-if="!!dataForm.datasourcePasswd">
        <el-input type="password" autocomplete="off" v-model="dataForm.datasourcePasswd" placeholder="密码 / Access Key Secret" />
      </el-form-item>
      <el-form-item label="密码 / Access Key Secret" prop="datasourcePasswd" v-else>
        <el-input v-model="dataForm.datasourcePasswd" placeholder="密码 / Access Key Secret" />
      </el-form-item>
      <el-form-item label="状态" prop="accountDisable">
        <el-radio-group v-model="dataForm.accountDisable">
          <el-radio :label="0">有效</el-radio>
          <el-radio :label="1">无效</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="handleSubmit()">确定</el-button>
      <el-button type="success" @click="handleTest()">连接测试</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  saveAccount,
  info,
  accountConnect
} from '@/api/dispatch/dataSource'
export default {
  data () {
    return {
      visible: false,
      id: '',
      accountList: [],
      dataForm: {
        dataSourceName: '',
        dataSourceType: '',
        dataSourceDescribe: '',
        dataSourceIp: '',
        dataSourceDatabase: '',
        datasourceAccountType: 0,
        datasourceUser: '',
        datasourcePasswd: '',
        accountDisable: 0
      },
      dataRule: {
        datasourceAccountType: [
          { type: 'number', required: true, message: '请选择账户类型', trigger: 'change' }
        ],
        datasourceUser: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        datasourcePasswd: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        accountDisable: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    userName: {
      get () { return this.$store.state.user.name }
    }
  },
  methods: {
    init (id) {
      if (id) {
        this.id = id
      }
      this.visible = true
      this.$nextTick(() => {
        if (id) {
          this.dataForm.datasourceAccountType = ''
          this.dataForm.datasourceUser = ''
          this.dataForm.datasourcePasswd = ''
          this.dataForm.accountDisable = ''
          info(id).then(({
            data
          }) => {
            // this.dataForm = data.data
            // this.dataForm.datasourceAccountType = 0
            this.dataForm.dataSourceName = data.data.dataSourceName
            this.dataForm.dataSourceType = data.data.dataSourceType
            this.dataForm.dataSourceDescribe = data.data.dataSourceDescribe
            this.dataForm.dataSourceIp = data.data.dataSourceIp
            this.dataForm.dataSourceDatabase = data.data.dataSourceDatabase
            // 初始化一下账户信息，默认取数组第一条
            this.accountList = data.data.accountList
            if (data.data.accountList.length) {
              this.dataForm.datasourceAccountType = data.data.accountList[0].datasourceAccountType
              this.dataForm.datasourceUser = data.data.accountList[0].datasourceUser || ''
              this.dataForm.datasourcePasswd = data.data.accountList[0].datasourcePasswd || ''
              this.dataForm.accountDisable = data.data.accountList[0].accountDisable
              this.dataForm.id = data.data.accountList[0].id
            }
          })
          this.$refs['dataForm'].resetFields()
        }
      })
    },
    accountChange (val) {
      if (this.accountList.length) {
        let filterArr = this.accountList.filter(item => item.datasourceAccountType === val)
        if (filterArr.length) {
          console.log(filterArr[0])
          this.dataForm.datasourceUser = filterArr[0].datasourceUser
          this.dataForm.datasourcePasswd = filterArr[0].datasourcePasswd
          this.dataForm.accountDisable = filterArr[0].accountDisable
          this.dataForm.id = filterArr[0].id
        } else {
          this.dataForm.datasourceUser = ''
          this.dataForm.datasourcePasswd = ''
          this.dataForm.accountDisable = ''
          this.dataForm.id = ''
        }
      }
    },
    handleTest () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          accountConnect({
            'datasourceId': this.id,
            'datasourceUser': this.dataForm.datasourceUser,
            'datasourcePasswd': this.dataForm.datasourcePasswd
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: data.msg,
                type: 'success'
              })
            } else {
              this.$message({
                message: data.msg,
                type: 'error'
              })
            }
          })
        }
      })
    },
    handleCancel () {
      this.visible = false
    },
    handleSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          let params = {
            'datasourceId': this.id,
            'id': this.dataForm.id,
            'datasourceAccountType': this.dataForm.datasourceAccountType,
            'datasourceUser': this.dataForm.datasourceUser,
            'datasourcePasswd': this.dataForm.datasourcePasswd,
            'accountDisable': this.dataForm.accountDisable,
            'createUser': this.userName
          }
          saveAccount(params).then(({
            data
          }) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.visible = false
                  this.$emit('refreshDataList')
                  this.formData = {}
                }
              })
            } else {
              this.$message.error(data.msg)
              this.visible = false
            }
          })
        }
      })
    }
  }
}
</script>
