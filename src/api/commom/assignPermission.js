import { httpGet, httpPost } from '@/api'
// let da = '/dataAnalysis/'
let da = '/'
export const getUsersList = id => httpGet(da + `oa/getUsersFromTenantId/${id}`) // 租户下的用户信息
// 蜂巢任务权限按钮
export const updateHoneycombAuth = params => httpPost(da + 'honeycomb/honeycombtask/updateHoneycombAuth', params) // 保存权限
export const updateHoneycombAuths = params => httpPost(da + 'honeycomb/honeycombtask/updateHoneycombAuths', params) // 批量保存权限

// 金丝雀任务权限分配
export const updateCanaryAuth = params => httpPost(da + 'canary/canarybasetask/updateCanaryAuth', params) // 保存权限
export const updateCanaryAuths = params => httpPost(da + 'canary/canarybasetask/updateCanaryAuths', params) // 保存权限

// 金丝雀模板配置权限分配
export const updateCanaryTemplateAuth = params => httpPost(da + 'canary/canarytemplate/updateCanaryTemplateAuth', params) // 保存权限
export const updateCanaryTemplateAuths = params => httpPost(da + 'canary/canarytemplate/updateCanaryTemplateAuths', params) // 保存权限

// 金丝雀报警渠道权限分配
export const updateCanaryPipelineAuth = params => httpPost(da + 'canary/canarypipeline/updateCanaryPipelineAuth', params) // 保存权限
export const updateCanaryPipelineAuths = params => httpPost(da + 'canary/canarypipeline/updateCanaryPipelineAuths', params) // 保存权限

// 调度任务管理权限
export const updateDispatchTaskAuth = params => httpPost(da + 'dispatch/task/updateDispatchTaskAuth', params) // 保存权限
export const updateDispatchTaskAuths = params => httpPost(da + 'dispatch/task/updateDispatchTaskAuths', params) // 保存权限

// 工蜂元数据管理
export const updateBeeTaskAuth = params => httpPost(da + 'beeTask/updateBeeTaskAuth', params) // 保存权限
export const updateBeeTaskAuths = params => httpPost(da + 'beeTask/updateBeeTaskAuths', params) // 保存权限

// 工蜂工作流预览
export const updateWorkflowAuth = params => httpPost(da + '/bee/workflow/updateWorkflowAuth', params) // 保存权限
export const updateWorkflowAuths = params => httpPost(da + '/bee/workflow/updateWorkflowAuths', params) // 保存权限
