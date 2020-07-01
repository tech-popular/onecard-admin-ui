import { httpPost, httpGet } from '@/api'
// 字典管理
let base = '/'
export const getBaseDicdataList = params => httpGet(base + 'baseDicdata/getBaseDicdataList', params) // 推荐列表
export const saveorupt = (params, id) => id ? httpPost(base + 'baseDicdata/updateBaseDicdataInfo', params) : httpPost(base + 'baseDicdata/addBaseDicdata', params) // 新增表单提交
export const getBaseDicdataInfo = params => httpPost(base + `baseDicdata/getBaseDicdataInfo/${params}`, params) // 详情
export const manageBaseDicdataInfo = params => httpPost(base + `baseDicdata/manageBaseDicdataInfo/${params}`, params) // 字典树
export const addChildBaseDicdata = params => httpPost(base + 'baseDicdata/addChildBaseDicdata', params) // 新增子级字典
export const deleteBaseDicdataInfo = params => httpPost(base + `baseDicdata/deleteBaseDicdataInfo/${params}`, params) // 删除子级字典
