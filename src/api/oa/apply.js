import { httpGet, httpPost, httpPut, httpDelete } from '@/api'
let da = '/'
// 账号管理初始化
export const accoutAuthInitInfo = (params) => httpGet(da + 'oa/accoutAuthInitInfo', params)
// 库表管理初始化
export const databaseInitInfo = (params) => httpGet(da + 'oa/databaseInitInfo', params)
// 模糊查询数据库表字段
export const getListOnPage = (params) => httpPost(da + 'mcCompute/listOnPage', params)
// 新增库表
export const saveDatabaseAuthApply = (params) => httpPost(da + 'oa/saveDatabaseAuthApply', params)
