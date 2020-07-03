import { httpGet, httpPost } from '@/api'
let base = '/'
// 缓存清除
export const list = (params, flag) => httpGet(base + 'cachemanage/cachelist', params, flag) // 初始化列表
export const saveorupt = (params) => httpPost(base + 'cachemanage/savacachemanage', params) // 新增
export const deleted = (params) => httpPost(base + 'cachemanage/delcachemanage', params) // 删除
// export const deleted = (params) => httpPost(base + `cachemanage/delcachemanage /${params}`) // 删除
