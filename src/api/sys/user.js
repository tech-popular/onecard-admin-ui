// sys/user/list
import { httpPost, httpGet } from '@/api' // , httpGetSeries, httpPost, httpPut httpGet,
let da = '/'  // POST /tenantManage/selectTenantIdByUserId
export const getUserList = params => httpGet(da + 'sys/user/list', params) // 用户信息列表
export const getUserInfo = id => httpGet(da + `sys/user/info/${id}`) // 用户信息
export const saveUserInfo = params => httpPost(da + `sys/user/save`, params) // 保存
export const updateUserInfo = params => httpPost(da + `sys/user/updateUserInfo`, params)
