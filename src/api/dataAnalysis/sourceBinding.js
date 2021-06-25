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
