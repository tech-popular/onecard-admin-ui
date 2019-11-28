import { httpPost } from '@/api'

export const loginIn = (params, url) => httpPost(url, params) // 登陆
export const sendCode = (params) => httpPost('/sms/sendVerifyCode', params) // 发送短信验证码
export const checkCaptcha = (params) => httpPost('/sms/validateCaptcha', params) // 验证图片验证码
