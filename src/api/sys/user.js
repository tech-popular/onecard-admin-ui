// sys/user/list
import { httpPost, httpGet } from '@/api' // , httpGetSeries, httpPost, httpPut httpGet,
let da = '/'  // POST /tenantManage/selectTenantIdByUserId
export const getUserList = params => httpGet(da + 'sys/user/list', params) // 用户信息列表
export const getUserInfoById = id => httpGet(da + `sys/user/info/${id}`) // 用户详情信息
export const saveUserInfo = params => httpPost(da + `sys/user/save`, params) // 保存
export const updateUserInfo = params => httpPost(da + `sys/user/updateUserInfo`, params)
export const getUserInfo = () => httpGet(da + `sys/user/info`) // 用户信息
export const syncUser = () => httpGet(da + 'oa/init') // 同步用户信息
