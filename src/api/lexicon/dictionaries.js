import { httpPut, httpPost, httpGet } from '@/api'
// 字典管理
let base = '/'
export const getBaseDicdataList = params => httpGet(base + 'baseDicdata/getBaseDicdataList', params) // 推荐列表
export const saveorupt = (params, id) => id ? httpPut(base + `baseDicdata/addBaseDicdata${id}`, params) : httpPost(base + 'baseDicdata/addBaseDicdata', params) // 新增表单提交
export const getBaseDicdataInfo = params => httpPost(base + `baseDicdata/getBaseDicdataInfo/${params}`, params) // 详情
