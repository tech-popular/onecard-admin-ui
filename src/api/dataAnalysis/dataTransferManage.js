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
export const dataTransferManageOutParams = params => httpGetSeries(da + 'dataCatalog/selectAllCataNew', params) // 加载目录树接口
export const dataTransferManageOutParamsEdit = (id) => httpGet(da + `dataTransferOutParams/outParams/${id}`) // 修改回显时查询出参
export const dataTransferManageKafka = (params) => httpGet(da + `dataTransferDatasourceConfig/getAllDatasourceConfig`, params) // kafka地址
export const dataTransferManageMysql = (params) => httpGetSeries(da + `dataTransferDatasourceConfig/getAllDatasourceConfig`, params) // mysql地址
export const defaultOutParams = (channelCode, datasourceId) => httpGetSeries(da + `dataTransfer/out/default/datasource/${datasourceId}`, channelCode) // 渠道多选，传参方式改变
export const r3Log = params => httpPost(da + 'r3log/list', params)
export const getAllSmsChannels = () => httpGet(da + `data/resource/smart/getAllSmsChannels`) // 短信渠道
export const getSmsCodeInfo = (channelId) => httpGet(da + `data/resource/smart/getSmsCodeInfoByChannelId/${channelId}`) // 短信code
export const addCanvasInfo = (params) => httpPost(da + 'data/decision/canvas/info', params) // 决策画布提交
export const getSmsMessage = (resourceId) => httpGet(da + `resource/binding/fetchByResourceId/${resourceId}`) // 校验是否已进行资源绑定
export const getSmsAllMessage = (resourceId) => httpGet(da + `resource/binding/fetchDescByResourceId/${resourceId}`) // 获取短信所有详细信息
// 执行进度
export const dataTransferManageTaskProgress = (id) => httpGet(da + `dataTransfer/execution/progress/${id}`) // 历史记录
export const dataTransferManageExecutionMetric = (id, percent) => httpGet(da + `dataTransfer/execution/metric/${id}`, percent) // 历史记录
//  获取已绑定资源
export const selectResourceBindingList = (params) => httpGet(da + `resource/binding/selectResourceBindingList`, params)
// 决策画布校验任务名称是否重复
export const validTransferName = (transferName) => httpGet(da + `dataTransfer/valid/${transferName}`)
