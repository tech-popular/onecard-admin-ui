import { httpGet, httpPost, httpPut, httpDelete } from '@/api'
// let da = '/dataAnalysis/'
let da = '/'
//
export const getDataList = (params) => httpPost(da + `resource/binding/listOnPage`, params)
