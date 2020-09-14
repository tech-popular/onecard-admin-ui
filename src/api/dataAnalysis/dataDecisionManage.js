import { httpGet, httpPost, httpPut } from '@/api'
// let da = '/dataAnalysis/'
let da = '/'
export const decisionList = params => httpGet(da + 'data/decision/listOnPage', params)
// 保存查询流程配置信息
export const saveFlowInfo = params => httpPost(da + 'data/decision/info', params)
// 修改查询流程配置信息
export const editFlowInfo = params => httpPut(da + 'data/decision/info', params)
// /flow/view/{flowId}查看流程配置
export const flowView = id => httpGet(da + `data/decision/info/${id}`)

export const inparamsSelect = () => httpGet(da + 'data/decision/inparams')
export const custerList = (code) => httpGet(da + `/data/group/select/available?channelCode=${code}&type=dynamic`)
export const channelsList = () => httpGet(da + 'common/select/channels')
