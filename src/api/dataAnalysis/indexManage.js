import { httpGet, httpPost, httpGetSeries, httpDelete } from '@/api'
// let da = '/dataAnalysis/'
let da = '/'
// 指标管理模块
export const indexManageList = (params) => httpPost(da + 'dataIndexManager/list', params) // 初始化列表
export const addIndexManage = (params) => httpPost(da + 'dataIndexManager/save', params) // 新增表单提交
export const infoIndexManage = (id) => httpGet(da + `dataIndexManager/info/${id}`) // 详情查看
export const updateIndexManage = (params) => httpPost(da + 'dataIndexManager/update', params) // 更新表单提交
export const deleteDataInfo = id => httpDelete(da + `dataIndexManager/delete/${id}`) // 根据主键ID删除配置信息
// export const updateIndexManage = (id, params) => httpPut(da + `dataIndexManager/upd/${id}`, params) // 修改表单提交
export const indexManageTypeList = (params) => httpGet(da + `dataEnumType/selectByTypeNum/${params}`) // 数据类型
export const indexManageMinCataList = () => httpGet(da + 'dataCatalog/selectMinCata') // 指标类别
export const indexManageTypeNumList = () => httpGet(da + 'dataEnumType/selectAllGroupTypeNum') // 枚举类型值
export const syncDataIndex = () => httpPost(da + 'sync/v3/dataIndex', {}) // 同步数语指标
export const selectAllCata = params => httpGetSeries(da + 'dataCatalog/selectAllCataNew', params) // 加载目录树接口
export const channelsList = () => httpGet(da + 'common/select/channels')
export const getDimension = (params) => httpGet(da + 'dataIndexManager/getDimension', params) // 分组查看
export const setDimension = (params) => httpPost(da + 'dataIndexManager/setDimension', params) // 设置分组
