import { httpGet, httpPost } from '@/api'
// let da = '/dataAnalysis/'
let da = '/'
export const getUsersList = id => httpGet(da + `oa/getUsersFromTenantId/${id}`) // 租户下的用户信息
// 蜂巢任务权限按钮
export const updateHoneycombAuth = params => httpPost(da + 'honeycomb/honeycombtask/updateHoneycombAuth', params) // 保存权限

// 金丝雀任务权限分配
export const updateCanaryAuth = params => httpPost(da + 'canary/canarybasetask/updateCanaryAuth', params) // 保存权限
