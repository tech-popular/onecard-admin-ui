import { httpGet, httpPost, httpPut } from '@/api'
// let da = '/dataAnalysis/'
let da = '/'
//
// 出参映射
export const dataIndexAliasList = (id, params) => httpPost(da + `dataIndexAlias/list/${id}`, params)
export const dataIndexAliasAdd = (id, username, params) => httpPost(da + `dataIndexAlias/batch/add/${id}?username=${username}`, params, false)
export const dataIndexAliasUpdate = (id, username, params) => httpPut(da + `dataIndexAlias/batch/update/${id}?username=${username}`, params, false)
export const dataIndexAliasCustomList = (id, params) => httpGet(da + `dataIndexAlias/customise/list/${id}`, params)
export const dataIndexAliasDelete = (transferId, id) => httpPost(da + `dataIndexAlias/del/${transferId}/${id}`)
export const dataAnalysisGetUpdator = (id) => httpGet(da + `dataIndexAlias/getUpdater/${id}`)
