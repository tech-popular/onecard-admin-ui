<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="用户名" prop="userName">
        <el-input v-model="dataForm.userName" placeholder="登录帐号"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password" :class="{ 'is-required': !dataForm.id }">
        <el-input v-model="dataForm.password" type="password" placeholder="密码" @focus="cleanData()" @blur="midifyflag()"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="comfirmPassword" :class="{ 'is-required': !dataForm.id }">
        <el-input v-model="dataForm.comfirmPassword" type="password" placeholder="确认密码"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="dataForm.email" placeholder="邮箱"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="dataForm.mobile" placeholder="手机号"></el-input>
      </el-form-item>
      <el-form-item label="角色" prop="roleIdList">
        <el-select v-model="dataForm.roleIdList" filterable placeholder="请选择">
          <el-option v-for="item in roleList" :key="item.roleId" :label="item.roleName" :value="item.roleId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="数据权限" size="mini" prop="systenandIdList">
        <el-checkbox-group v-model="dataForm.systenandIdList">
          <el-checkbox v-for="tenant in systenantList" :key="tenant.tenantId" :label="tenant.tenantId">{{ tenant.name }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="状态" size="mini" prop="status">
        <el-radio-group v-model="dataForm.status">
          <el-radio :label="0">禁用</el-radio>
          <el-radio :label="1">正常</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="dataForm.mobile" placeholder="备注"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { isEmail, isMobile } from '@/utils/validate'
  import { checkUserName, checkMobile } from '@/api/account'
  export default {
    data () {
      var validatePassword = (rule, value, callback) => {
        if (!this.dataForm.id && !/\S/.test(value)) {
          callback(new Error('密码不能为空'))
        } else {
          callback()
        }
      }
      var validateComfirmPassword = (rule, value, callback) => {
        if (this.dataForm.ismodifyPasswd === 'modify') {
          if (!this.dataForm.id && !/\S/.test(value)) {
            callback(new Error('确认密码不能为空'))
          } else if (this.dataForm.password !== value) {
            callback(new Error('确认密码与密码输入不一致'))
          } else {
            callback()
          }
        } else {
          callback()
        }
      }
      var validateEmail = (rule, value, callback) => {
        const reg = new RegExp(/9fbank|ithro/)
        if (!isEmail(value)) {
          callback(new Error('邮箱格式错误'))
        } else if (!reg.test(value)) {
          callback(new Error('账号格式有误'))
        } else {
          callback()
        }
      }
      var validateMobile = async (rule, value, callback) => {
        if (!isMobile(value)) {
          callback(new Error('手机号格式错误'))
        } else if (!await this.checkIfMobile()) {
          callback(new Error('该手机号已被注册'))
        } else {
          callback()
        }
      }
      var validateUserName = async (rule, value, callback) => {
        if (!value) {
          callback(new Error('用户名不能为空'))
        } else if (!await this.checkIfMobile()) {
          callback(new Error('用户名已经存在'))
        } else {
          callback()
        }
      }
      return {
        visible: false,
        roleList: [],
        dataForm: {
          id: 0,
          userName: '',
          password: '',
          comfirmPassword: '',
          ismodifyPasswd: '',
          salt: '',
          email: '',
          mobile: '',
          roleIdList: [],
          systenandIdList: [],
          status: 1
        },
        systenantList: [],
        dataRule: {
          userName: [
            { required: true, validator: validateUserName, trigger: 'blur' }
          ],
          password: [
            { validator: validatePassword, trigger: 'blur' }
          ],
          comfirmPassword: [
            { validator: validateComfirmPassword, trigger: 'blur' }
          ],
          email: [
            { required: true, message: '邮箱不能为空', trigger: 'blur' },
            { validator: validateEmail, trigger: 'blur' }
          ],
          mobile: [
            { required: true, message: '手机号不能为空', trigger: 'blur' },
            { validator: validateMobile, trigger: 'blur' }
          ],
          roleIdList: [
            { required: true, message: '角色不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id) {
        // 数据权限列表
        this.$http({
          url: this.$http.adornUrl(`/sys/systenant/nonullselect`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.systenantList = data.sysTenantEntities
          }
        })
        this.dataForm.id = id || 0
        this.$http({
          url: this.$http.adornUrl('/sys/role/select'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          this.roleList = data && data.code === 0 ? data.list : []
        }).then(() => {
          this.visible = true
          this.$nextTick(() => {
            this.$refs['dataForm'].resetFields()
          })
        }).then(() => {
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/sys/user/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.userName = data.user.username
                this.dataForm.salt = data.user.salt
                this.dataForm.email = data.user.email
                this.dataForm.mobile = data.user.mobile
                this.dataForm.password = data.user.password
                this.dataForm.roleIdList = data.user.roleIdList
                this.dataForm.status = data.user.status
                this.dataForm.systenandIdList = data.user.systenandIdList
              }
            })
          }
        })
      },
      cleanData () {
        this.dataForm.password = ''
      },
      midifyflag () {
        this.dataForm.ismodifyPasswd = 'modify'
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/sys/user/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'userId': this.dataForm.id || undefined,
                'username': this.dataForm.userName,
                'password': this.dataForm.password,
                'salt': this.dataForm.salt,
                'email': this.dataForm.email,
                'mobile': this.dataForm.mobile,
                'status': this.dataForm.status,
                'roleIdList': this.dataForm.roleIdList,
                'ismodifyPasswd': this.dataForm.ismodifyPasswd,
                'systenandIdList': this.dataForm.systenandIdList
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
            this.dataForm.ismodifyPasswd = ''
          }
        })
      },
      async checkIfUsername () {
        const data = {
          userName: this.dataForm.userName
        }
        let res = await new Promise(resolve => {
          checkUserName(data).then(() => {

          })
        })
        return res
      },
      async checkIfMobile () {
        let res = await new Promise(resolve => {
          const data = {
            mobile: this.dataForm.mobile
          }
          checkMobile(data).then(() => {

          })
        })
        return res
      }
    }
  }
</script>
