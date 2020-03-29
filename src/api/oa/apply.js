import { httpGet, httpPost } from '@/api'
let da = '/'
// 账号管理初始化
export const accoutAuthInitInfo = (params) => httpGet(da + 'oa/accoutAuthInitInfo', params)
// 库表管理初始化
export const databaseInitInfo = (params) => httpGet(da + 'oa/databaseInitInfo', params)
// 模糊查询数据库表字段
export const getListOnPage = (params) => httpPost(da + 'mcCompute/listOnPage', params)
// 我的申请列表
export const myAccoutList = (params) => httpPost(da + 'oa/applyRecord', params)
// 我的申请列表条件查询
export const myAccoutSelect = (params) => httpGet(da + 'oa/initApplyRecordInfo', params)
// 我的申请详情
export const lookAccout = (params) => httpGet(da + `oa/detail/${params}`, params)

export const saveDatabaseAuthApply = (params) => httpPost(da + 'oa/saveDatabaseAuthApply', params)
