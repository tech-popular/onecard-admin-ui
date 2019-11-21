import { httpGet, httpPost, httpPut } from '@/api'
let gf = '/gongFeng'
// 元数据管理任务模块
export const beeTaskList = (params) => httpGet(gf + '/beeTask/list', params) // 初始化列表
export const getBeeTaskTypeList = () => httpGet(gf + '/beeTask/getBeeTaskTypeList') // 任务类型
export const deleteBeeTask = (params) => httpGet(gf + '/beeTask/deleteBeeTask', params) // 删除
export const infoBeeTask = (params) => httpGet(gf + '/beeTask/info', params) // 修改回显
export const saveWorkFlow = (params, updateIds) => updateIds ? httpPut(gf + `/bee/workflow/beeTask/${updateIds}`, params) : httpPost(gf + '/bee/workflow/add', params) // 新增&修改表单提交
