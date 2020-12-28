import { httpGet, httpPost } from '@/api'
// let da = '/dataAnalysis/'
let da = '/'
export const getUsersList = id => httpGet(da + `oa/getUsersFromTenantId/${id}`) // 租户下的用户信息
// 蜂巢任务权限按钮
export const updateHoneycombAuth = params => httpPost(da + 'honeycomb/honeycombtask/updateHoneycombAuth', params) // 保存权限

// 金丝雀任务权限分配
export const updateCanaryAuth = params => httpPost(da + 'canary/canarybasetask/updateCanaryAuth', params) // 保存权限

// 金丝雀模板配置权限分配
export const updateCanaryTemplateAuth = params => httpPost(da + 'canary/canarytemplate/updateCanaryTemplateAuth', params) // 保存权限

// 金丝雀报警渠道权限分配
export const updateCanaryPipelineAuth = params => httpPost(da + 'canary/canarypipeline/updateCanaryPipelineAuth', params) // 保存权限
