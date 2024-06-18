import { httpGet, httpPost, httpPut } from '@/api'
// let da = '/dataAnalysis/'
let da = '/'
export const getDataList = (params) => httpGet(da + `dataResourceBindingShortLink/listOnPage`, params)
export const getShortLinkList = () => httpGet(da + `dataResourceBindingShortLink/getShortLinkList`)
export const fetchBindingShortLink = id => httpGet(da + `dataResourceBindingShortLink/info/${id}`)
export const saveBindingShortLinkInfo = (params) => httpPost(da + `dataResourceBindingShortLink/info`, params)
export const updateBindingShortLinkInfo = (params) => httpPut(da + `dataResourceBindingShortLink/info`, params)
