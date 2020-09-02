import { httpGet, httpPost, httpPut } from '@/api'
// let da = '/dataAnalysis/'
let da = '/'
export const apiManageList = params => httpGet(da + '1', params)
// 保存查询流程配置信息
export const saveFlowInfo = params => httpPost(da + 'flow/info', params)
// 修改查询流程配置信息
export const editFlowInfo = params => httpPut(da + 'flow/info', params)
// /flow/view/{flowId}查看流程配置
export const flowView = flowId => httpGet(da + `flow/info/${flowId}`)
