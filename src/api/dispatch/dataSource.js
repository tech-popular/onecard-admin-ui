import {
  httpGet,
  httpPost
} from '@/api'
let base = '/'
// 缓存清除
export const list = (params, flag) => httpPost(base + 'dispatch/datasource/select', params, flag) // 初始化列表
export const saveorupt = (params) => httpPost(base + 'dispatch/datasource/save', params) // 新增
export const saveAccount = (params) => httpPost(base + 'dispatch/account/save', params) // 新增
export const deleted = (params) => httpPost(base + 'cachemanage/delcachemanage', params) // 删除
export const implement = (params) => httpPost(base + 'cachemanage/execute', params) // 执行
export const info = (params) => httpGet(base + `dispatch/datasource/info/${params}`, params) // 详情
export const commonDatasourceItem = () => httpGet(base + 'dispatch/common/items/datasource')
export const accountConnect = params => httpPost(base + 'dispatch/account/connect', params)
