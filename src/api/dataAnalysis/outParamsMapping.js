import { httpGet, httpPost, httpPut, httpDelete } from '@/api'
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
export const dataCustomisedAdd = (userName, params) => httpPost(da + `dataCustomisedParameter/save/${userName}`, params, false) // 定制化出参提交按钮 post
export const dataCustomisedDel = id => httpDelete(da + `dataCustomisedParameter/del/${id}`) // 删除标记 delete方式
export const dataCustomisedList = id => httpGet(da + `dataCustomisedParameter/list/${id} `) // 显示列表
export const dataCustomisedLastModifier = id => httpGet(da + `dataCustomisedParameter/getLatestUpdater/${id} `) // 获取定制化出参最后修改人。
