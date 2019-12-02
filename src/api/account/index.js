import { httpPost, httpGet } from '@/api'

export const loginIn = (params, url) => httpPost(url, params) // 登陆
export const sendCode = (params) => httpPost('/sms/sendVerifyCode', params) // 发送短信验证码
export const checkCaptcha = (params) => httpPost('/sms/validateCaptcha', params) // 验证图片验证码
export const checkEmail = (params) => httpPost('/sys/validateUserName', params) // 判断邮箱是否有效
export const forgetPass = (params) => httpPost('/sys/sendEmail', params) // 账号密码登陆点击忘记密码链接后调用接口
export const resetPass = (params) => httpPost('/sys/resetPwd', params) // 重置密码
export const getRolesList = (params) => httpGet('/sys/role/select', params) // 查询所有角色
export const checkUserName = (params) => httpPost('/sys/user/validUserName', params) // 校验用户名是否已存在
export const checkMobile = (params) => httpPost('/sys/user/validMobile', params) // 校验手机号是否已注册过接口
