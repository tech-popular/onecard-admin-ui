import { httpGet, httpPost } from '@/api'

// 元数据管理
export const metadataList = (params) => httpGet('/canary/canaryproject/list', params) // 初始化列表
export const allRuleTemplate = (params, flag) => httpPost('/sys/sysdictitem/selectbydictypes', params, flag) // 任务类型

export const deleteArea = (params) => httpPost('/cash/area/delete', params) // 删除
export const findAllCapitalList = () => httpGet('/cash/instmanage/findAllCapitalList') // findAllCapitalList
export const areaListArea = () => httpGet('/cash/area/areaList')// areaListArea
export const saveArea = (params) => httpPost('/cash/area/save', params) // 新增 > 表单提交
export const infoArea = (params) => httpGet('/cash/area/info', params) // 修改回显
export const deleteByCapitalId = (params) => httpPost('/cash/area/deleteByCapitalId', params) // deleteByCapitalId
export const updateArea = (params) => httpPost('/cash/area/save', params)// 修改 > 表单提交
