import { httpGet, httpPost, httpPut, httpDelete } from '@/api'
let gf = '/gongFeng'
// 元数据管理
export const workFlowList = (params, flag) => httpGet(gf + '/bee/workflow/list', params, flag) // 初始化列表
export const saveWorkFlow = (params, updateIds) => updateIds ? httpPut(gf + `/bee/workflow/update/${updateIds}`, params) : httpPost(gf + '/bee/workflow/add', params) // 新增表单提交
export const getUpdateWorkFlow = (params) => httpPost(gf + `/bee/workflow/info/${params}`, params)// 获取修改的值
export const deleteWorkFlow = (params) => httpDelete(gf + `/bee/workflow/delete/${params}`, params)// 删除
