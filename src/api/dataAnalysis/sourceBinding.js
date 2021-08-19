import { httpGet, httpPost, httpPut, httpDelete } from '@/api'
// let da = '/dataAnalysis/'
let da = '/'
//
export const getDataList = (params) => httpGet(da + `resource/binding/listOnPage`, params) // 获取列表页
export const getChannelist = () => httpGet(da + `common/selectAll/channels`) // 获取用户所属渠道
export const addDataInfo = (params) => httpPost(da + `resource/binding/info`, params) // 新增
export const editDataInfo = (params) => httpPut(da + `resource/binding/info`, params) // 修改
export const lookDataList = (id) => httpGet(da + `resource/binding/info/${id}`)  // 查看详情
export const deleteDataInfo = id => httpDelete(da + `resource/binding/${id}`) // 根据主键ID删除配置信息
export const getFixedParams = (params) => httpGet(da + `resource/binding/selectComplexParams`, params) // 查询固定出参
export const getResourceInfoFromType = (type) => httpGet(da + `data/resource/smart/getResourceInfoFromType/${type}`) // tel和ai渠道
// 流程配置
export const getProgressConfigList = (params) => httpGet(da + `resource/binding/page/flow`, params) // 获取列表
export const deleteSmartFlow = id => httpGet(da + `resource/binding/deleteSmartFlow/${id}`) // 删除标记 delete方式
export const addFlowInfo = (params) => httpPost(da + `resource/binding/add/flow`, params) // 新增
export const editFlowInfo = (params) => httpPost(da + `resource/binding/update/flow`, params) // 修改
export const lookFlowList = (id) => httpGet(da + `resource/binding/getSmartFlow/${id}`)  // 查看详情

// 自定义配置
export const getSmsSignInfo = () => httpGet(da + `data/resource/smart/getSmsSignInfo`) // 短信签名
export const getSmsStyleInfo = () => httpGet(da + `data/resource/smart/getSmsStyleInfo`) // 短信类型
