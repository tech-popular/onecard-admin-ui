import {
  httpGet,
  httpPost
} from '@/api'
let base = '/'
// 缓存清除
export const list = (params) => httpPost(base + 'dispatch/project/select', params) // 初始化列表
export const info = (params) => httpGet(base + `dispatch/project/info/${params}`) // 详情
export const update = (params) => httpPost(base + 'dispatch/project/update', params) // 修改
export const save = (params) => httpPost(base + 'dispatch/project/save', params) // 新增
