import { httpGet, httpPost, httpPut, httpGetSeries } from '@/api'
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
export const custerList = (code) => httpGet(da + `/data/group/select/available?channelCode=${code}`)
export const channelsList = () => httpGet(da + 'common/select/channels')

export const selectOperate = params => httpGet(da + `common/select/operators/${params}`) // 获取操作符
export const selectAllCata = params => httpGetSeries(da + 'dataCatalog/selectAllCataNew', params) // 加载目录树接口
export const enumTypeList = type => httpGet(da + `dataEnumType/selectByTypeNum/${type}`) // 获取枚举数据
export const dataIndexManagerCandidate = params => httpGet(da + 'dataIndexManager/value/candidate', params)
