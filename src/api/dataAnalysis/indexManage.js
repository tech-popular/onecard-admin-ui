import { httpGet, httpPost, httpPut } from '@/api'
// let da = '/dataAnalysis/'
let da = '/'
// 指标管理模块
export const indexManageList = (params) => httpPost(da + 'dataIndexManager/list', params) // 初始化列表
export const addIndexManage = (params) => httpPost(da + 'dataIndexManager/add', params) // 新增表单提交
export const infoIndexManage = (id) => httpGet(da + `dataIndexManager/info/${id}`) // 详情查看
export const updateIndexManage = (id, params) => httpPut(da + `dataIndexManager/upd/${id}`, params) // 修改表单提交
export const indexManageTypeList = (params) => httpGet(da + `dataEnumType/selectByTypeNum/${params}`) // 数据类型
export const indexManageMinCataList = () => httpGet(da + 'dataCatalog/selectMinCata') // 指标类别
export const indexManageTypeNumList = () => httpGet(da + 'dataEnumType/selectAllGroupTypeNum') // 枚举类型值
