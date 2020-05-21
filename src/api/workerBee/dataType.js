import { httpGet, httpPost, httpPut, httpDelete } from '@/api'
let gf = '/gongFeng'
// 数据源管理
export const dataTypeList = (params, flag) => httpGet(gf + '/beeDataSource/list', params, flag) // 初始化列表
export const deleteBeeTask = (params) => httpDelete(gf + `/bee/mkafka/${params}`) // 删除
export const start = (params) => httpGet(gf + `/bee/mkafka/start/${params}`) // 启动
export const stop = (params) => httpGet(gf + `/bee/mkafka/stop/${params}`) // 停止
export const infoBeeTask = (params) => httpGet(gf + `/bee/mkafka/info/${params}`) // 修改回显
export const saveorupt = (params, id) => id ? httpPut(gf + `/beeDataSource/updateBeeDataSourceConfig`, params) : httpPost(gf + '/beeDataSource/saveBeeDataSourceConfig', params) // 新增表单提交
