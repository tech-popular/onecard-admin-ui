import { httpGet, httpPost } from '@/api'
let da = '/'
// 账号管理初始化
export const accoutAuthInitInfo = (params) => httpGet(da + 'oa/accoutAuthInitInfo', params)
// 账号保存
export const saveAccountAuthApply = (params) => httpPost(da + 'oa/saveAccountAuthApply', params)
// 账号用户组列表
// export const getUserGroupList = (userId) => httpGet(da + `bi/biUserGroup/getUserGroupListByUserId/${userId}`)
export const getUserGroupList = (params) => httpGet(da + 'bi/biUserGroup/getUserGroupListByUserId', params)
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
// 库表保存
export const saveDatabaseAuthApply = (params) => httpPost(da + 'oa/saveDatabaseAuthApply', params)
// maxcomputer申请记录接口
export const mcCompute = (params) => httpPost(da + 'mcCompute/getDefaultApplyInfo', params)
// 库表空间配置列表
export const databaseTableList = (params) => httpGet(da + 'database/selectdatabase', params)
// 库表空间配置保存
export const savaOadatabase = (params) => httpPost(da + 'database/savaOadatabase', params)
// 更改状态
export const updatedatabase = (params) => httpPost(da + 'database/updatedatabase', params)
// 租户信息下啦
export const tenantInif = (params) => httpPost(da + 'tenantManage/getTenantManageList', params)
// 租户默认
export const tenantCrent = (params) => httpPost(da + 'tenantManage/selectTenantIdsFromUser', params)
// 租户详情
export const tenantShow = (params) => httpPost(da + 'tenantManage/selectTenantIdsFromUser', params)
// 租户保存
export const saveTenant = (params) => httpPost(da + 'oa/saveTenantAuthApply', params)
