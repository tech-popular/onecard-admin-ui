import { httpGet, httpPost, httpPut, httpDelete } from '@/api'
let gf = '/gongFeng'
// 元数据管理
export const workFlowList = (params, flag) => httpGet(gf + '/bee/workflow/list', params, flag) // 初始化列表
export const saveWorkFlow = (params, updateIds) => updateIds ? httpPut(gf + `/bee/workflow/update/${updateIds}`, params) : httpPost(gf + '/bee/workflow/add', params) // 新增表单提交
export const getUpdateWorkFlow = (params) => httpPost(gf + `/bee/workflow/info/${params}`, params)// 获取修改的值
export const deleteWorkFlow = (params) => httpDelete(gf + `/bee/workflow/delete/${params}`, params)// 删除
export const workFlowShow = (params) => httpGet(gf + `/bee/workflow/showFlow/${params}`)// 流程预览

export const workFlowTaskList = (params, flag) => httpGet(gf + '/bee/workflowtask/list', params, flag) // 工作流任务关系列表
export const saveWorkTaskFlow = (params, id) => id ? httpPut(gf + `/bee/workflowtask/update/${id}`, params) : httpPost(gf + '/bee/workflowtask/add', params) // 关系新增修改表单提交
export const getAllBeeTaskList = (params, flag) => httpPost(gf + '/beeTask/getAllBeeTaskList', params, flag) // 工作流任务关系列表
export const getTaskDefWithWorkFlowTask = (params) => httpGet(gf + `/bee/workflow/getshowPicWorkFlowTask/${params}`) // 初始化列表
export const getNotBaseTypeList = () => httpGet(gf + '/beeTask/getNotBaseTypeList') // 初始化TYPE列表
export const getAllWorkFlow = (params) => httpGet(gf + `/bee/workflow/getAllWorkFlow/${params}`) // SUB_WORKFLOW&&FOR_EACH子流程
export const getAllSys = () => httpGet(gf + '/beeSysManager/getAllSys') // 归属系统
export const workFlowTaskDelete = (params) => httpGet(gf + `/bee/workflowtask/delete/${params}`) // 数据关系删除
export const workFlowTaskinfo = (params) => httpGet(gf + `/bee/workflowtask/info/${params}`) // 数据关系详情
