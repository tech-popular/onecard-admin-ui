import { httpGet, httpPost, httpPut } from '@/api'
// let da = '/dataAnalysis/'
let da = '/'
//
export const getDataList = (params) => httpGet(da + `resource/binding/listOnPage`, params)
export const getChannelist = () => httpGet(da + `common/selectAll/channels`)
export const addDataInfo = (params) => httpPost(da + `resource/binding/info`, params)
export const editDataInfo = (params) => httpPut(da + `resource/binding/info`, params)
export const lookDataList = (id) => httpGet(da + `resource/binding/info/${id}`)
