import { httpPost, httpPostFile } from '@/api'
import http from '@/utils/httpRequest'
import Vue from 'vue'
let da = '/'

export const biExcelList = params => httpPost(da + 'bi/excel/getListByPage', params) // 查询数据列表并分页
export const biExcelUpload = params => httpPostFile(da + 'bi/excel/upload', params) // 查询数据列表并分页
export const biExcelDownload = http.adornUrl(da + 'bi/excel/template/download?token=' + Vue.cookie.get('token'))
