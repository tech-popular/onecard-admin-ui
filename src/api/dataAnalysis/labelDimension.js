import { httpGet, httpPost, httpDelete } from '@/api'
// let da = '/dataAnalysis/'
let da = '/'
// 指标管理模块
export const selectAllGroupTypeNum = () => httpGet(da + 'dataEnumType/selectAllGroupTypeNum') // 初始化列表
export const addEnum = (params) => httpGet(da + 'dataEnumType/addEnum', params) // 添加枚举类
export const updateEnum = (params) => httpGet(da + 'dataEnumType/updateEnum', params) // 添加枚举类
export const deleteEnum = (typeNum) => httpDelete(da + `dataEnumType/${typeNum}`) // 删除枚举类
export const getchildrenList = (params) => httpGet(da + 'dataEnumType/childrenList', params) // 查看枚举值列表
export const addChildren = (params) => httpPost(da + 'dataEnumType/addChildren', params) // 添加枚举值
export const updateChildren = (params) => httpPost(da + 'dataEnumType/updateChildren', params) // 添加枚举值
export const dellteChildren = (id) => httpDelete(da + `dataEnumType/delChildren/${id}`) // 删除枚举值
