import { httpGet, httpPost } from '@/api'
// let da = '/dataAnalysis/'
let da = '/'
// 蜂巢任务权限按钮
export const getUsersList = id => httpGet(da + `oa/getUsersFromTenantId/${id}`) // 租户下的用户信息
export const updateHoneycombAuth = params => httpPost(da + 'honeycomb/honeycombtask/updateHoneycombAuth', params) // 保存权限
