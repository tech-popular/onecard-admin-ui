import {
  httpGet,
  httpPost,
  httpPostFile
} from '@/api'
let base = '/'
// 缓存清除
export const list = (params) => httpPost(base + 'dispatch/task/select', params) // 初始化列表
export const info = (params) => httpGet(base + `dispatch/task/info/${params}`) // 详情
export const update = (params) => httpPost(base + 'dispatch/task/update', params) // 修改
export const save = (params) => httpPost(base + 'dispatch/task/save', params) // 新增
export const dataSourceAll = () => httpPost(base + 'dispatch/datasource/selectall')
export const accountAll = params => httpPost(base + 'dispatch/account/selectall', params)
export const projectAll = () => httpPost(base + 'dispatch/project/selectall')
export const sqlParse = params => httpPostFile(base + 'dispatch/task/sql/parse', params)
export const taskBatchList = params => httpGet(base + 'dispatch/task/instance/listOnPage', params)
