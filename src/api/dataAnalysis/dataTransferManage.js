import { httpGet, httpGetSeries, httpPost, httpPut } from '@/api'
// let da = 'dataTransfer/'
let da = '/'
// 数据流转管理模块
export const dataTransferManageList = (params) => httpGet(da + 'dataTransfer/listOnPage', params) // 初始化列表
export const addDataTransferManage = (params) => httpPost(da + 'dataTransfer/add', params) // 新增表单提交
export const infoDataTransferManage = (id) => httpGet(da + `dataTransfer/info/${id}`) // 详情查看
export const updateDataTransferManage = (params) => httpPut(da + `dataTransfer/update`, params) // 修改表单提交
export const enableDataTransferManage = (id, status) => httpGet(da + `dataTransfer/${id}/status/${status}`) // 开关
export const lowerDataTransferManage = (id) => httpGet(da + `dataTransfer/trigger/${id}`) // 立即下发
export const dataTransferManageCuster = () => httpGet(da + `data/group/select/available`) // 分群ID
// export const dataTransferManageOutParams = (params) => httpGet(da + `dataCatalog/outparams`, params) // 分群出参
export const dataTransferManageOutParams = params => httpGet(da + 'dataCatalog/selectAllCata', params) // 加载目录树接口
export const dataTransferManageOutParamsEdit = (id) => httpGet(da + `dataTransferOutParams/outParams/${id}`) // 修改回显时查询出参
export const dataTransferManageKafka = (params) => httpGet(da + `dataTransferDatasourceConfig/getAllDatasourceConfig`, params) // kafka地址
export const dataTransferManageMysql = (params) => httpGetSeries(da + `dataTransferDatasourceConfig/getAllDatasourceConfig`, params) // mysql地址
export const defaultOutParams = (channelCode, datasourceId) => httpGet(da + `dataTransfer/out/default/channel/${channelCode}/datasource/${datasourceId}`)
export const r3Log = params => httpPost(da + 'r3log/list', params)
