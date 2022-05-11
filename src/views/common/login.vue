<template>
  <div class="site-wrapper site-page--login">
    <div class="site-content__wrapper">
      <div class="site-content">
        <!-- <div class="brand-info">
          <h2 class="brand-info__text">玖富数据中台</h2>
          <p class="brand-info__intro">提供平台的全方位的报警监控。</p>
        </div>-->
        <!-- <el-tabs tab-position="bottom" class="login-tabs"> -->
        <!-- <el-tab-pane label="账号密码登陆"> -->
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
          <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit('dataForm')" status-icon>
            <el-form-item prop="username">
              <el-input v-model="dataForm.username" placeholder="用户名"></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input v-model="dataForm.password" type="password" placeholder="密码"></el-input>
            </el-form-item>
            <!-- <el-form-item prop="captcha">
              <el-row :gutter="20">
                <el-col :span="14">
                  <el-input v-model="dataForm.captcha" placeholder="验证码"></el-input>
                </el-col>
                <el-col :span="10" class="login-captcha">
                  <img :src="captchaPath" @click="getCaptcha()" alt />
                </el-col>
              </el-row>
            </el-form-item>-->
            <p class="forgetPass">请使用上网账号登陆使用</p>
            <el-form-item>
              <el-button class="login-btn-submit" type="primary" @click="dataFormSubmit('dataForm')" :loading="loadingVlaue">登录</el-button>
            </el-form-item>
            <el-form-item>
              <p class="loginMethod" @click="changeType">扫码登陆</p>
            </el-form-item>
             <!-- <el-form-item>
              <p class="loginMethod" @click="changeType">手机验证码登录</p>
            </el-form-item>-->
          </el-form>
          </el-form>
        </div>
        <!-- </el-tab-pane>
          <el-tab-pane label="扫码登陆">扫码登陆</el-tab-pane>
        </el-tabs>-->

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
            ref="dataElseForm"
            status-icon
          >
           <div id="login_container"></div>
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
// import { isMobile } from '@/utils/validate'
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
    // var validateMobile = async (rule, value, callback) => {
    //   if (!value) {
    //     callback(new Error('手机号不能为空'))
    //   } else if (!isMobile(value)) {
    //     callback(new Error('手机号格式有误'))
    //   } else {
    //     callback()
    //   }
    // }
    // var validateCaptcha = async (rule, value, callback) => {
    //   if (!value) {
    //     callback(new Error('图片验证码不能为空'))
    //   } else if (!(await this.checkCaptcha())) {
    //     callback(new Error('图片验证码输入有误'))
    //   } else {
    //     callback()
    //   }
    // }
    var validateUsername = (rule, value, callback) => {
      const reg = /^[a-zA-Z0-9]{0,20}$/
      if (!value) {
        callback(new Error('用户名不能为空'))
      } else if (!reg.test(value)) {
        callback(new Error('请输入20以内英文数字格式的用户名'))
      } else {
        callback()
      }
    }
    var validatePass = (rule, value, callback) => {
      if ((this.dataForm.username + '').toLowerCase() !== 'unifiedaccount' && !value) {
        callback(new Error('密码不能为空'))
      } else {
        callback()
      }
    }
    return {
      ifTrueCaptcha: false,
      loadingVlaue: false,
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
        uuid: ''
        // captcha: ''
      },
      // 钉钉扫码登录
      redirect: 'http://test.tech.9fbank.com/canary/#/home',
      appid: 'dingx2dp7goiirz78ncj',
      redirectUrl: 'http://test.tech.9fbank.com/canary/#/login',
      redirectUrl: 'http://localhost:8001/#/login',
      // apiUrl: 'http://192.168.161.219:8000/canary-admin/sys/dingTalkLogin',
      dingCodeConfig: {
        id: 'login_container',
        style: 'border:none;background-color:#FFFFFF;',
        width: '365',
        height: '320'
      },
      dataRule: {
        // email: [
        //   { required: true, trigger: 'blur', validator: validateEmail }
        // ],
        username: [
          { required: true, trigger: 'blur', validator: validateUsername, max: 20 }
        ],
        password: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ]
        // captcha: [
        //   { required: true, message: '验证码不能为空', trigger: 'blur' }
        // ]
      },
      // elseRule: {
      //   mobile: [
      //     { required: true, trigger: 'blur', validator: validateMobile }
      //   ],
      //   captcha: [
      //     { required: true, trigger: 'blur', validator: validateCaptcha }
      //   ]
      // },
      // captchaPath: '',
      // phoneCaptchaPath: '',
      userId: '',
      time: 60,
      timer: null,
      // url: '',
      imgTop: require('../../assets/img/top.png'),
      imgRight: require('../../assets/img/right.png'),
      imgBottom: require('../../assets/img/bottom.png'),
      imgLeft: require('../../assets/img/left.png')
    }
  },
   watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  computed: {
    getRedirectUrl() {
      return encodeURIComponent(this.redirectUrl)
    },
    getAuthUrl() {
      return `https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid=${this.appid}&response_type=code&scope=snsapi_login&state=STATE&redirect_uri=${this.getRedirectUrl}`
    },
    getGoto() {
      return encodeURIComponent(this.getAuthUrl)
    },
    getDingCodeConfig() {
      return { ...this.dingCodeConfig, goto: this.getGoto }
    }
  },
  created () {
    // const url = location.href.split('#')[0]
    this.getCaptcha()
    this.initDingJs()
    sessionStorage.clear()
    this.getUser()
    // this.getPhoneCaptcha()
    // this.url = url + '#/resetPassword'\
    // this.$message({
    //   showClose: true,
    //   message: '请使用上网账号登陆使用',
    //   duration: 30 * 1000
    // })
  },
  mounted() {
    this.getUser()
  },
  methods: {
    // 提交表单
    dataFormSubmit (form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          this.loadingVlaue = true
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
              this.loadingVlaue = false
            } else {
              this.getCaptcha()
              this.$message.error(data.msg)
              this.loadingVlaue = false
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
      if (!this.type) {
        this.addDingListener()
        this.initDingLogin()
        // this.getUser()
      }
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
    },
    // 钉钉扫码登陆
    initDingJs() {
      !function(window, document) {
        function d(a) {
          let e
          let c = document.createElement('iframe')
          let d = 'https://login.dingtalk.com/login/qrcode.htm?goto=' + a.goto
            d += a.style ? '&style=' + encodeURIComponent(a.style) : ''
            d += a.href ? '&href=' + a.href : ''
            c.src = d
            c.frameBorder = '0'
            c.allowTransparency = 'true'
            c.scrolling = 'no'
            c.width = a.width ? a.width + 'px' : '365px'
            c.height = a.height ? a.height + 'px' : '400px'
            e = document.getElementById(a.id)
            e.innerHTML = ''
            e.appendChild(c)
        }
        window.DDLogin = d
      }(window, document)
    },
    addDingListener() {
      let self = this
      let handleLoginTmpCode = function(loginTmpCode) {
        console.log('loginTmpCode: ', loginTmpCode)
        window.location.href = self.getAuthUrl + `&loginTmpCode=${loginTmpCode}`
        self.getUser()
      }
      let handleMessage = function(event) {
        if (event.origin == 'https://login.dingtalk.com') {
          handleLoginTmpCode(event.data)
        }
      }
      if (typeof window.addEventListener != 'undefined') {
        window.addEventListener('message', handleMessage, false)
      } else if (typeof window.attachEvent != 'undefined') {
        window.attachEvent('onmessage', handleMessage)
      }
    },
    initDingLogin() {
      window.DDLogin(this.getDingCodeConfig)
    },
    getUser() {
      let getQueryString = function(name) {
        let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
        let params = window.location.search.substr(1) || window.location.href.split('?')[1]
        let r = params && params.match(reg)
        if (r != null) {
          return unescape(r[2])
        }
        return null
      }
      let code = getQueryString('code')
      if (code !== null) {
        this.$http({
          url: this.$http.adornUrl(`/sys/dingTalkLogin?tmpAuthCode=${code}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          console.log('data: ', data)
          this.$cookie.set('token', data.token)
          //我调用api后，就不需要这些参数了，就删除了了url后携带的参数，直接跳转首页
          let url = window.location.href //获取当前页面的url
          if (url.indexOf("?") != -1) {
            //判断是否存在参数
            url = url.replace(/(\?|#)[^'"]*/, "") //去除参数
            window.history.pushState({}, 0, url)
          }
          this.$router.replace({ name: 'home' })
        })
      }
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
    content: '';
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
  .login-tabs {
    width: 470px;
    // height: 300px;
    position: absolute;
    top: 50%;
    margin-top: 0px;
    left: 50%;
    margin-left: -235px;
    .el-tabs__content {
      padding: 0px;
    }
    .el-tabs__header {
      position: absolute;
      top: 0;
      left: 0;
    }
    .el-tabs__nav {
      width: 100%;
    }
    .el-tabs__item {
      width: 50%;
      text-align: center;
    }
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
      // width: 60px;
      margin: 0;
      text-align: center;
      font-size: 12px;
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
