import { httpPost, httpPostFile, httpGet } from '@/api'
import http from '@/utils/httpRequest'
import Vue from 'vue'
let da = '/'

export const biExcelList = params => httpPost(da + 'bi/excel/getListByPage', params) // 查询数据列表并分页
export const biExcelUpload = params => httpPostFile(da + 'bi/excel/upload', params) // 查询数据列表并分页
export const biExcelDownload = http.adornUrl(da + 'bi/excel/template/download?token=' + Vue.cookie.get('token'))

export const exportDataList = params => httpPost(da + 'export/data/list', params) // 查询数据列表并分页
export const datasourceDataList = () => httpGet(da + 'export/data/datasource/list') // 服务器 列表
export const databaseDataList = (datasourceId) => httpGet(da + `export/data/database/${datasourceId}`) // 数据库列表
export const sqlPreview = params => httpPost(da + 'export/data/sql/preview', params) // sql执行预览
export const checkDatasource = params => httpPost(da + 'export/data/checkDatasource', params) // 数据源预览
export const saveDatasource = params => httpPost(da + 'export/data/saveDatasource', params) // 数据源保存
export const getUsersList = id => httpGet(da + `oa/getUsersFromTenantId/${id}`) // 租户下的用户信息
export const saveDatabySql = params => httpPost(da + 'export/data/bySql', params) // 数据源保存
export const approveRenewal = params => httpGet(da + 'export/data/approveRenewal', params) // 申请延长期限
export const approveDisable = id => httpGet(da + `export/data/disable/${id}`) // 申请失效
