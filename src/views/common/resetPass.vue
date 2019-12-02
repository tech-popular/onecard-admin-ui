<template>
  <div>
    <div class="reset">
      <el-form
        :model="dataForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
        v-if="!effective"
      >
        <el-form-item>
          <h2 class="resrt-title reset-input">重置密码</h2>
        </el-form-item>
        <el-form-item label="密码" prop="pass">
          <el-input
            type="password"
            v-model="dataForm.pass"
            autocomplete="off"
            placeholder="请输入密码"
            class="reset-input"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input
            type="password"
            v-model="dataForm.checkPass"
            autocomplete="off"
            placeholder="请确认密码"
            class="reset-input"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')" class="sumbit reset-input">确 认</el-button>
        </el-form-item>
      </el-form>
      <div v-if="effective">
        <p class="effective">该链接已失效，请重新获取链接</p>
        <p class="effective">
          <el-button type="primary" @click="back">返回</el-button>
        </p>
      </div>
    </div>
  </div>
</template>
<script>
import { resetPass } from '@/api/account'
export default {
  mounted () {
    document.body.removeChild(document.getElementById('1.23452384164.123412415'))
  },
  data () {
    var validatePass = (rule, value, callback) => {
      let reg = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[._~!@#$^&*])[A-Za-z0-9._~!@#$^&*]{6,16}$/
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (!reg.test(value)) {
        callback(
          new Error(
            '密码长度为6到16个字符,设置时使用英文字母、数字和符号的组合'
          )
        )
      } else {
        if (this.dataForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.dataForm.pass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      dataForm: {
        pass: '',
        checkPass: ''
      },
      rules: {
        pass: [{ validator: validatePass, trigger: 'blur' }],
        checkPass: [{ validator: validatePass2, trigger: 'blur' }]
      },
      effective: true // 是否有效
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const data = {
            token: '',
            userId: '',
            password: '',
            passwordNew: ''
          }
          resetPass(data).then(() => {

          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    back () {
      this.$router.push('/login')
    }
  }
}
</script>
<style lang="scss" scoped>
.reset {
  width: 500px;
  height: 500px;
  margin: 150px auto;
  .resrt-title {
    text-align: center;
    margin: 0;
  }
  .reset-input {
    width: 80%;
  }
  .sumbit {
    margin-top: 30px;
  }
  .effective {
    text-align: center;
    font-size: 26px;
  }
}
</style>