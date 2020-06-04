<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
      <el-form-item label="姓名" prop="name">
        <el-input v-model="dataForm.name" placeholder="姓名" readonly disabled></el-input>
      </el-form-item>
      <el-form-item label="用户名" prop="userName">
        <el-input v-model="dataForm.userName" placeholder="用户名" readonly disabled></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="dataForm.email" placeholder="邮箱" style="width:100%;margin-right: 2%;" disabled></el-input>
        <el-input v-model="dataForm.emailList" placeholder="输入多个邮箱','隔开" style="margin-top: 2%;" @change='inputblur'/>
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="dataForm.mobile" placeholder="手机号" disabled></el-input>
      </el-form-item>
       <el-form-item label="员工工号" prop="jobnumber">
        <el-input v-model="dataForm.jobnumber" placeholder="员工工号" disabled></el-input>
      </el-form-item>
      <el-form-item label="部门" prop="department">
        <el-input v-model="dataForm.department" placeholder="部门" disabled></el-input>
      </el-form-item>
      <el-form-item label="阿里云账号" prop="mcAccount">
        <el-input v-model="dataForm.mcAccount" @input="change($event)" placeholder="阿里云账号"/>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  // import { isEmail } from '@/utils/validate'
  import { checkUserName, checkMobile, ifExistUser } from '@/api/account'
  export default {
    data () {
      // var validateEmail = (rule, value, callback) => {
      //   const reg = new RegExp(/9fbank|ithro/)
      //   if (!isEmail(value)) {
      //     callback(new Error('邮箱格式错误'))
      //   } else if (!reg.test(value)) {
      //     callback(new Error('账号格式有误'))
      //   } else {
      //     callback()
      //   }
      // }
      return {
        visible: false,
        roleList: [],
        dataForm: {
          id: 0,
          userName: '',
          ismodifyPasswd: '',
          email: '',
          mobile: '',
          mcAccount: '',
          department: ''
        },
        systenantList: [],
        dataRule: {
          // email: [
          //   { validator: validateEmail, trigger: 'blur' }
          // ]
        },
        jieshouren: [],
        emailGroup: []
      }
    },
    methods: {
      init (val) {
        this.dataForm.id = val.id
        this.dataForm.userid = val.userid
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
            this.$refs['dataForm'].clearValidate()
          })
        }).then(() => {
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/sys/user/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm = data.user.user
                this.dataForm.userName = data.user.user.username
                this.dataForm.email = data.user.emailList
                this.dataForm.mobile = data.user.user.mobile
                this.dataForm.mcAccount = data.user.mcAccount
                this.dataForm.department = data.user.department
              }
            })
          }
        })
      },
      change (e) {
        this.$forceUpdate()
      },
      inputblur (value) {
        var activityList = [value]
        this.emailGroup = activityList
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
                'userId': this.dataForm.userid || undefined,
                'username': this.dataForm.username,
                'emailList': this.emailGroup,
                'mcAccount': this.dataForm.mcAccount
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
          username: this.dataForm.userName
        }
        let res = await new Promise(resolve => {
          checkUserName(data).then(({data}) => {
            if (data && data.code == 0) {
              resolve(true)
            } else {
              resolve(false)
            }
          })
        })
        return res
      },
      async checkIfMobile () {
        let res = await new Promise(resolve => {
          const data = {
            mobile: this.dataForm.mobile
          }
          checkMobile(data).then(({data}) => {
            if (data && data.code == 0) {
              resolve(true)
            } else {
              resolve(false)
            }
          })
        })
        return res
      },
      async checkIfInIdap () {
        const data = {
          username: this.dataForm.userName
        }
        let res = await new Promise(resolve => {
          ifExistUser(data).then(({data}) => {
            if (data && data.code == 0) {
              resolve(true)
            } else {
              resolve(false)
            }
          })
        })
        return res
      }
    }
  }
</script>
