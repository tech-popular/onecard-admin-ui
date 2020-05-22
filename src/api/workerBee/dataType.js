import { httpGet, httpPost, httpPut } from '@/api'
let gf = '/gongFeng'
// 数据源管理
export const dataTypeList = (params, flag) => httpGet(gf + '/beeDataSource/list', params, flag) // 初始化列表
export const deleteDatdType = (params) => httpPost(gf + '/beeDataSource/deleteBeeTask', params) // 删除
export const infoDatdType = (params) => httpPost(gf + '/beeDataSource/info', params) // 修改回显
export const saveorupt = (params, id) => id ? httpPut(gf + `/beeDataSource/updateBeeDataSourceConfig`, params) : httpPost(gf + '/beeDataSource/saveBeeDataSourceConfig', params) // 新增表单提交
