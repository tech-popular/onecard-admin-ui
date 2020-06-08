import { httpGet, httpPost } from '@/api'
let gf = '/gongFeng'
// 元数据管理任务模块
export const beeTaskList = (params) => httpGet(gf + '/beeTask/list', params) // 初始化列表
export const getBeeTaskTypeList = () => httpGet(gf + '/beeTask/getBeeTaskTypeList') // 任务类型
export const deleteBeeTask = (params) => httpGet(gf + '/beeTask/deleteBeeTask', params) // 删除
export const updateStatus = (params) => httpPost(gf + `/beeTask/changeStatus/${params.id}/${params.status}`, params) // 启用禁用
export const getAllDataSourceByType = (params) => httpPost(gf + `/beeDataSource/getAllDataSourceByType/${params.type}`, params) // 启用禁用
export const infoBeeTask = (params) => httpGet(gf + '/beeTask/info', params) // 修改回显
export const beeTask = (params, url) => httpPost(gf + url, params) // 新增&修改表单提交
