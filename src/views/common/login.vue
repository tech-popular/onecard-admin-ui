<template>
  <div class="site-wrapper site-page--login">
    <div class="site-content__wrapper">
      <div class="site-content">
        <div class="brand-info">
          <h2 class="brand-info__text">金丝雀系统</h2>
          <p class="brand-info__intro">提供平台的全方位的报警监控。</p>
        </div>
        <!-- 账号密码登录 -->
        <div class="login-main" v-show="type">
          <h3 class="login-title">账号密码登录</h3>
          <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" status-icon>
            <el-form-item prop="username">
              <el-input v-model="dataForm.username" placeholder="邮箱"></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input v-model="dataForm.password" type="password" placeholder="密码"></el-input>
            </el-form-item>
            <el-form-item prop="captcha">
              <el-row :gutter="20">
                <el-col :span="14">
                  <el-input v-model="dataForm.captcha" placeholder="验证码">
                  </el-input>
                </el-col>
                <el-col :span="10" class="login-captcha">
                  <img :src="captchaPath" @click="getCaptcha()" alt="">
                </el-col>
              </el-row>
            </el-form-item>
            <p class='forgetPass' @click="forgetPass">忘记密码</p>
            <el-form-item>
              <el-button class="login-btn-submit" type="primary" @click="dataFormSubmit('dataForm')">登录</el-button>
            </el-form-item>
            <el-form-item>
              <p class='loginMethod' @click="changeType">手机验证码登录</p>
            </el-form-item>
          </el-form>
        </div>
        <!-- 手机验证码登录 -->
        <div class="login-main" v-show="!type">
          <h3 class="login-title">手机验证码登录</h3>
          <el-form :model="dataElseForm" :rules="elseRule" ref="dataElseForm" @keyup.enter.native="dataFormSubmit()" status-icon>
            <el-form-item prop="mobile">
              <el-input v-model="dataElseForm.mobile" placeholder="手机号"></el-input>
            </el-form-item>
            <el-form-item prop="captcha">
              <el-row :gutter="20">
                <el-col :span="14">
                  <el-input v-model="dataElseForm.captcha" placeholder="验证码" @blur='checkCaptcha'>
                  </el-input>
                </el-col>
                <el-col :span="10" class="login-captcha">
                  <img :src="phoneCaptchaPath" @click="getPhoneCaptcha()" alt="">
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item prop="verifyCode">
              <el-row :gutter="20">
                <el-col :span="14">
                  <el-input v-model="dataElseForm.verifyCode" placeholder="短信验证码">
                  </el-input>
                </el-col>
                <el-col :span="10" class="login-captcha">
                  <el-button class="code" type="primary" @click="getCode()" :disabled="timer ? true : false">{{timer ? time + 's' : '获取验证码'}}</el-button>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item>
              <el-button class="login-btn-submit" type="primary" @click="dataFormSubmit('dataElseForm')">登录</el-button>
            </el-form-item>
            <el-form-item>
              <p class='loginMethod' @click="changeType">账号密码登录</p>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { getUUID } from '@/utils'
  import { loginIn, sendCode, checkCaptcha, checkEmail, forgetPass } from '@/api/account'
  import { isMobile, isEmail } from '@/utils/validate'
  export default {
    data () {
      var validateEmail = async (rule, value, callback) => {
        const reg = new RegExp(/9fbank|ithro/)
        if (!value) {
          callback(new Error('邮箱不能为空'))
        } else if (!reg.test(value)) {
          callback(new Error('账号格式有误'))
        } else if (!isEmail(value)) {
          callback(new Error('账号格式有误'))
        } else if (!await this.checkEmailTrue(value)) { // 校验 库里 是否有该邮箱
          callback(new Error('该账号尚未开通权限'))
        } else {
          callback()
        }
      }
      var validateMobile = async (rule, value, callback) => {
        if (!value) {
          callback(new Error('手机号不能为空'))
        } else if (!isMobile(value)) {
          callback(new Error('手机号格式有误'))
        } else {
          callback()
        }
      }
      var validateCaptcha = async (rule, value, callback) => {
        if (!value) {
          callback(new Error('图片验证码不能为空'))
        } else if (!await this.checkCaptcha()) {
          callback(new Error('图片验证码输入有误'))
        } else {
          callback()
        }
      }
      return {
        ifTrueCaptcha: false,
        type: true,
        if_code: false,
        dataElseForm: {
          mobile: '',
          captcha: '',
          verifyCode: '',
          uuid: ''
        },
        dataForm: {
          email: '',
          username: '',
          password: '',
          uuid: '',
          captcha: ''
        },
        dataRule: {
          email: [
            { required: true, trigger: 'blur', validator: validateEmail }
          ],
          username: [
            { required: true, message: '账号不能为空', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '密码不能为空', trigger: 'blur' }
          ],
          captcha: [
            { required: true, message: '验证码不能为空', trigger: 'blur' }
          ]
        },
        elseRule: {
          mobile: [
            { required: true, trigger: 'blur', validator: validateMobile }
          ],
          captcha: [
            { required: true, trigger: 'blur', validator: validateCaptcha }
          ]
        },
        captchaPath: '',
        phoneCaptchaPath: '',
        time: 60,
        timer: null
      }
    },
    created () {
      this.getCaptcha()
      this.getPhoneCaptcha()
    },
    methods: {
      // 提交表单
      dataFormSubmit (form) {
        this.$refs[form].validate((valid) => {
          if (valid) {
            const params = form == 'dataForm' ? this.dataForm : {
              mobile: this.dataElseForm.mobile,
              verifyCode: this.dataElseForm.verifyCode
            }
            const url = form == 'dataForm' ? '/sys/login' : '/sys/mobileLogin'
            loginIn(params, url).then(({data}) => {
              if (data && data.code === 0) {
                this.$cookie.set('token', data.token)
                this.$router.replace({ name: 'home' })
              } else {
                this.getCaptcha()
                this.$message.error(data.msg)
              }
            })
          }
        })
      },
      // 获取验证码
      getCaptcha () {
        const uuid = getUUID()
        this.dataForm.uuid = uuid
        this.captchaPath = this.$http.adornUrl(`/captcha.jpg?uuid=${uuid}`)
      },
      getPhoneCaptcha () {
        const uuid = getUUID()
        this.dataElseForm.uuid = uuid
        this.phoneCaptchaPath = this.$http.adornUrl(`/captcha.jpg?uuid=${uuid}`)
      },
      // 切换 登录方式
      changeType () {
        this.type = !this.type
      },
      // 忘记密码
      forgetPass () {
        const data = {
          userId: '',
          email: '',
          url: ''
        }
        forgetPass(data).then(() => {
  
        })
      },
      // 获取验证
      async getCode () {
        let result = await this.checkCaptcha()
        if (result) {
          const data = {
            mobile: this.dataElseForm.mobile
          }
          sendCode(data).then(({data}) => {
            if (data && data.code == 0) {
              this.$message({
                message: '短信验证码发送成功',
                type: 'success'
              })
              this.timer = setInterval(() => {
                this.time--
                if (this.time <= 0) {
                  clearInterval(this.timer)
                  this.time = 60
                  this.timer = null
                }
              }, 1000)
            } else {
              this.$message({
                message: data.msg,
                type: 'warning'
              })
            }
          })
        } else {
          this.$refs.dataElseForm.validateField('captcha')
        }
      },
      // 校验图片验证码
      async checkCaptcha () {
        let res = await new Promise(resolve => {
          const data = {
            uuid: this.dataElseForm.uuid,
            captcha: this.dataElseForm.captcha
          }
          checkCaptcha(data).then(({data}) => {
            if (data.code == 0) {
              resolve(true)
            } else {
              resolve(false)
            }
          })
        })
        return res
      },
      async checkEmailTrue () {
        let res = await new Promise(resolve => {
          const data = {
            email: this.dataForm.email
          }
          checkEmail(data).then(() => {

          })
        })
        return res
      }
    }
  }
</script>

<style lang="scss">
  .site-wrapper.site-page--login {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(38, 50, 56, .6);
    overflow: hidden;
    &:before {
      position: fixed;
      top: 0;
      left: 0;
      z-index: -1;
      width: 100%;
      height: 100%;
      content: "";
      background-image: url(~@/assets/img/login_bg.jpg);
      background-size: cover;
    }
    .site-content__wrapper {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      padding: 0;
      margin: 0;
      overflow-x: hidden;
      overflow-y: auto;
      background-color: transparent;
    }
    .site-content {
      min-height: 100%;
      padding: 30px 500px 30px 30px;
    }
    .brand-info {
      margin: 220px 100px 0 90px;
      color: #fff;
    }
    .brand-info__text {
      margin:  0 0 22px 0;
      font-size: 48px;
      font-weight: 400;
      text-transform : uppercase;
    }
    .brand-info__intro {
      margin: 10px 0;
      font-size: 16px;
      line-height: 1.58;
      opacity: .6;
    }
    .login-main {
      position: absolute;
      top: 0;
      right: 0;
      padding: 150px 60px 180px;
      width: 470px;
      min-height: 100%;
      background-color: #fff;
      .forgetPass {
        color: #2093f7;
        cursor: pointer;
      }
      .loginMethod {
        width: 140px;
        margin: 0 auto;
        text-align: center;
        color: #2093f7;
        cursor: pointer;
      }
      .code {
        width: 135px;
      }
    }
    .login-title {
      font-size: 16px;
      text-align: center;
      margin: 25px 0;
    }
    .login-captcha {
      overflow: hidden;
      > img {
        width: 100%;
        cursor: pointer;
      }
    }
    .login-btn-submit {
      width: 100%;
      margin-top: 10px;
    }
  }
</style>
