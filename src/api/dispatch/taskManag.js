import {
  httpGet,
  httpPost,
  httpPut,
  httpPostFile
} from '@/api'
let base = '/'
// 缓存清除
export const list = (params) => httpPost(base + 'dispatch/task/select', params) // 初始化列表
export const info = (params) => httpGet(base + `dispatch/task/info/${params}`) // 详情
export const update = (params) => httpPost(base + 'dispatch/task/update', params) // 修改
export const save = (params) => httpPost(base + 'dispatch/task/save', params) // 新增
export const dataSourceAll = () => httpPost(base + 'dispatch/datasource/selectall')
export const accountAll = params => httpPost(base + 'dispatch/account/selectall', params)
export const projectAll = () => httpPost(base + 'dispatch/project/selectall')
export const sqlParse = params => httpPostFile(base + 'dispatch/task/sql/parse', params)
export const taskBatchList = params => httpGet(base + 'dispatch/task/instance/listOnPage', params)
export const taskExecute = id => httpPut(base + `dispatch/task/${id}/execute`) // 任务执行
export const taskBaseInfo = id => httpGet(base + `dispatch/task/infoTask/${id}`) // 基础任务回显
export const taskDependenceAdd = params => httpPost(base + 'dispatch/task/dependence/insertBatch', params) // 依赖任务批量新增
export const taskBaseList = params => httpPost(base + 'dispatch/task/listOnPage', params) // 基础任务分页列表
export const taskDependenceDelete = params => httpPostFile(base + 'dispatch/task/dependence/delete', params) // 依赖任务批量删除
export const taskSelectDependence = id => httpGet(base + `dispatch/task/dependence/selectDependence/${id}`) // 已选依赖列表
export const taskPeriodInfo = id => httpGet(base + `dispatch/task/period/info/${id}`) // 调度周期信息回显接口
export const taskPeriodSave = params => httpPost(base + 'dispatch/task/period/save', params) // 周期保存接口
export const taskPeriodUpdate = params => httpPost(base + 'dispatch/task/period/update') // 周期更新接口
