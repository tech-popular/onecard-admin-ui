import Vue from 'vue'
import { httpPost } from '@/api'
import http from '@/utils/httpRequest'
let base = '/lexicon/'
// let base = '/'
export const productInfoList = params => httpPost(base + 'productInfo/getProductBySku', params) // 词组类型列表-
export const updateEsProductInfo = params => httpPost(base + 'productInfo/updateEsProductInfo', params) // 列表-
export const downloadTemplate = http.adornUrl(base + 'productInfo/downLoadTemplate?token=' + Vue.cookie.get('token')) // 下载模板
export const uploadFile = http.adornUrl(base + 'productInfo/upLoadWords?token=' + Vue.cookie.get('token')) // 导入
export const getProductsFromBoth = params => httpPost(base + `productInfo/getProductsFromBoth`, params) // 查看词组信息
