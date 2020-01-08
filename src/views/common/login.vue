<template>
  <div class="site-wrapper site-page--login">
    <div class="site-content__wrapper">
      <div class="site-content">
        <!-- <div class="brand-info">
          <h2 class="brand-info__text">玖富数据中台</h2>
          <p class="brand-info__intro">提供平台的全方位的报警监控。</p>
        </div>-->
        <!-- 账号密码登录 -->
        <div class="login-main" v-show="type">
          <div class="login-tri-top">
            <img :src="imgTop" alt />
          </div>
          <div class="login-tri-right">
            <img :src="imgRight" alt />
          </div>
          <div class="login-tri-bottom">
            <img :src="imgBottom" alt />
          </div>
          <div class="login-tri-left">
            <img :src="imgLeft" alt />
          </div>
          <div class="login-title-all">
            <h3 class="login-title">玖富数据中台</h3>
            <p class="login-title-single">JIAGOUZONGHEFUWUPINGTAI</p>
          </div>
          <el-form
            :model="dataForm"
            :rules="dataRule"
            ref="dataForm"
            @keyup.enter.native="dataFormSubmit()"
            status-icon
          >
            <el-form-item prop="username">
              <el-input v-model="dataForm.username" placeholder="邮箱"></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input v-model="dataForm.password" type="password" placeholder="密码"></el-input>
            </el-form-item>
            <el-form-item prop="captcha">
              <el-row :gutter="20">
                <el-col :span="14">
                  <el-input v-model="dataForm.captcha" placeholder="验证码"></el-input>
                </el-col>
                <el-col :span="10" class="login-captcha">
                  <img :src="captchaPath" @click="getCaptcha()" alt />
                </el-col>
              </el-row>
            </el-form-item>
            <p class="forgetPass" @click="forgetToPass">忘记密码</p>
            <el-form-item>
              <el-button
                class="login-btn-submit"
                type="primary"
                @click="dataFormSubmit('dataForm')"
              >登录</el-button>
            </el-form-item>
            <el-form-item>
              <p class="loginMethod" @click="changeType">手机验证码登录</p>
            </el-form-item>
          </el-form>
        </div>
        <!-- 手机验证码登录 -->
        <div class="login-main" v-show="!type">
          <div class="login-tri-top">
            <img :src="imgTop" alt />
          </div>
          <div class="login-tri-right">
            <img :src="imgRight" alt />
          </div>
          <div class="login-tri-bottom">
            <img :src="imgBottom" alt />
          </div>
          <div class="login-tri-left">
            <img :src="imgLeft" alt />
          </div>
          <div class="login-title-all">
            <h3 class="login-title">玖富数据中台</h3>
            <p class="login-title-single">JIAGOUZONGHEFUWUPINGTAI</p>
          </div>
          <el-form
            :model="dataElseForm"
            :rules="elseRule"
            ref="dataElseForm"
            @keyup.enter.native="dataFormSubmit()"
            status-icon
          >
            <el-form-item prop="mobile">
              <el-input v-model="dataElseForm.mobile" placeholder="手机号"></el-input>
            </el-form-item>
            <el-form-item prop="captcha">
              <el-row :gutter="20">
                <el-col :span="14">
                  <el-input v-model="dataElseForm.captcha" placeholder="验证码" @blur="checkCaptcha"></el-input>
                </el-col>
                <el-col :span="10" class="login-captcha">
                  <img :src="phoneCaptchaPath" @click="getPhoneCaptcha()" alt />
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item prop="verifyCode">
              <el-row :gutter="20">
                <el-col :span="14">
                  <el-input v-model="dataElseForm.verifyCode" placeholder="短信验证码"></el-input>
                </el-col>
                <el-col :span="10" class="login-captcha">
                  <el-button
                    class="code"
                    type="primary"
                    @click="getCode()"
                    :disabled="timer ? true : false"
                  >{{timer ? time + 's' : '获取验证码'}}</el-button>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item>
              <el-button
                class="login-btn-submit"
                type="primary"
                @click="dataFormSubmit('dataElseForm')"
              >登录</el-button>
            </el-form-item>
            <el-form-item>
              <p class="loginMethod" @click="changeType">账号密码登录</p>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getUUID } from '@/utils'
import {
  loginIn,
  sendCode,
  checkCaptcha,
  checkEmail,
  forgetPass
} from '@/api/account'
import { isMobile } from '@/utils/validate'
export default {
  data () {
    // var validateEmail = async (rule, value, callback) => {
    //   const reg = new RegExp(/9fbank|ithro/)
    //   if (!value) {
    //     callback(new Error('邮箱不能为空'))
    //   } else if (!reg.test(value)) {
    //     callback(new Error('账号格式有误'))
    //   } else if (!isEmail(value)) {
    //     callback(new Error('账号格式有误'))
    //   } else if (!await this.checkEmailTrue(value)) { // 校验 库里 是否有该邮箱
    //     callback(new Error('该账号尚未开通权限'))
    //   } else {
    //     callback()
    //   }
    // }
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
      } else if (!(await this.checkCaptcha())) {
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
        // email: '',
        username: '',
        password: '',
        uuid: '',
        captcha: ''
      },
      dataRule: {
        // email: [
        //   { required: true, trigger: 'blur', validator: validateEmail }
        // ],
        username: [
          { required: true, trigger: 'blur', message: '账号不能为空' }
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
      userId: '',
      time: 60,
      timer: null,
      url: '',
      imgTop: require('../../assets/img/top.png'),
      imgRight: require('../../assets/img/right.png'),
      imgBottom: require('../../assets/img/bottom.png'),
      imgLeft: require('../../assets/img/left.png')
    }
  },
  created () {
    const url = location.href.split('#')[0]
    this.getCaptcha()
    this.getPhoneCaptcha()
    this.url = url + '#/resetPassword'
  },
  methods: {
    // 提交表单
    dataFormSubmit (form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          const params =
            form == 'dataForm'
              ? this.dataForm
              : {
                mobile: this.dataElseForm.mobile,
                verifyCode: this.dataElseForm.verifyCode
              }
          const url = form == 'dataForm' ? '/sys/login' : '/sys/mobileLogin'
          loginIn(params, url).then(({ data }) => {
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
    async forgetToPass () {
      let flag = await this.checkEmailTrue()
      if (flag) {
        const data = {
          userId: this.userId,
          // email: this.dataForm.email,
          username: this.dataForm.username,
          url: this.url
        }
        forgetPass(data).then(({ data }) => {
          if (data && data.code == 0) {
            this.$message({
              message: data.msg,
              type: 'success'
            })
          } else {
            this.$message.error(data.msg)
          }
        })
      } else {
        this.$message({
          message: '请输入合法的邮箱'
        })
        this.$refs.dataForm.validateField('email')
      }
    },
    // 获取验证
    async getCode () {
      let result = await this.checkCaptcha()
      if (result) {
        const data = {
          mobile: this.dataElseForm.mobile
        }
        sendCode(data).then(({ data }) => {
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
        checkCaptcha(data).then(({ data }) => {
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
          // email: this.dataForm.email
          email: this.dataForm.username
        }
        checkEmail(data).then(({ data }) => {
          if (data && data.code == 0) {
            this.userId = data.userId
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

<style lang="scss">
.site-wrapper.site-page--login {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(38, 50, 56, 0.6);
  overflow: hidden;
  &:before {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 0;
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
    margin: 0 0 22px 0;
    font-size: 48px;
    font-weight: 400;
    text-transform: uppercase;
  }
  .brand-info__intro {
    margin: 10px 0;
    font-size: 16px;
    line-height: 1.58;
    opacity: 0.6;
  }
  .login-main {
    position: absolute;
    top: 50%;
    margin-top: -200px;
    left: 50%;
    margin-left: -235px;
    padding: 30px 60px 20px;
    width: 470px;
    background: rgba(0, 0, 0, 0.3) !important;
    .login-tri-top {
      position: absolute;
      top: 0;
      left: 0;
    }
    .login-tri-right {
      position: absolute;
      top: 0;
      right: 0;
    }
    .login-tri-bottom {
      position: absolute;
      bottom: 0;
      right: 0;
    }
    .login-tri-left {
      position: absolute;
      bottom: 0;
      left: 0;
    }
    .forgetPass {
      width: 60px;
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
  .login-title-all {
    color: rgba(0, 191, 244, 1);
    background: linear-gradient(0deg, rgba(0, 159, 241, 1) 0%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    .login-title {
      text-align: center;
      margin: 10px 0;
      font-size: 36px;
      font-weight: 400;
      text-transform: uppercase;
    }
    .login-title-single {
      text-align: center;
      margin: 10px 0;
      letter-spacing: 2px;
    }
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
