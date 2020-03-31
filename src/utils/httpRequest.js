import Vue from 'vue'
import axios from 'axios'
import router from '@/router'
import qs from 'qs'
import merge from 'lodash/merge'
import { clearLoginInfo } from '@/utils'
const http = axios.create({
  timeout: 1000 * 30,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json; charset=utf-8'
  }
})

/**
 * 请求拦截
 */
http.interceptors.request.use(config => {
  config.headers['token'] = Vue.cookie.get('token') // 请求头带上token
  return config
}, error => {
  return Promise.reject(error)
})

/**
 * 响应拦截
 */
http.interceptors.response.use(response => {
  if (response.data && response.data.code === 401) { // 401, token失效
    clearLoginInfo()
    router.push({ name: 'login' })
  }
  return response
}, error => {
  return Promise.reject(error)
})

/**
 * 请求地址处理
 * @param {*} actionName action方法名称
 */
http.adornUrl = (actionName) => {
  // 非生产环境 && 开启代理, 接口前缀统一使用[/proxyApi/]前缀做代理拦截!
  // if (process.env.PHOENIX) {
  //   console.log('1111')
  //   return actionName
  // } else {
  //   console.log('2222')
  //   return (process.env.NODE_ENV !== 'production' && process.env.OPEN_PROXY ? '/proxyApi/' : window.SITE_CONFIG.baseUrl) + actionName
  // }
  // 工蜂项目 凤凰大屏
  if (actionName.indexOf('gongFeng') !== -1) {
    actionName = actionName.replace(/gongFeng\//, '')
    return (process.env.NODE_ENV !== 'production' && process.env.OPEN_PROXY ? '/gongFeng' : window.SITE_CONFIG.baseUrl) + actionName
  // } else if (actionName.indexOf('dataAnalysis') !== -1) {
  //   actionName = actionName.replace(/dataAnalysis\//, '')
  //   return (process.env.NODE_ENV !== 'production' && process.env.OPEN_PROXY ? 'http://192.168.37.132:18085' : window.SITE_CONFIG.baseUrl) + actionName
  } else if (actionName.indexOf('lexicon') !== -1) {
    actionName = actionName.replace(/lexicon\//, '')
    return (process.env.NODE_ENV !== 'production' && process.env.OPEN_PROXY ? 'http://10.1.40.147:8080' : window.SITE_CONFIG.baseUrl) + actionName
  } else {
    return (process.env.NODE_ENV !== 'production' && process.env.OPEN_PROXY ? '/proxyApi/' : window.SITE_CONFIG.baseUrl) + actionName
  }
}
/**
 * get请求参数处理
 * @param {*} params 参数对象
 * @param {*} openDefultParams 是否开启默认参数?
 */
http.adornParams = (params = {}, openDefultParams = true) => {
  var defaults = {
    't': new Date().getTime()
  }
  return openDefultParams ? merge(defaults, params) : params
}

/**
 * post请求数据处理
 * @param {*} data 数据对象
 * @param {*} openDefultdata 是否开启默认数据?
 * @param {*} contentType 数据格式
 *  json: 'application/json; charset=utf-8'
 *  form: 'application/x-www-form-urlencoded; charset=utf-8'
 */
http.adornData = (data = {}, openDefultdata = true, contentType = 'json') => {
  var defaults = {
    't': new Date().getTime()
  }
  data = openDefultdata ? merge(defaults, data) : data
  return contentType === 'json' ? JSON.stringify(data) : qs.stringify(data)
}

export default http
