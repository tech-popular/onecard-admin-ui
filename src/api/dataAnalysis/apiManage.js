import { httpGet, httpPost, httpPut } from '@/api'
let da = '/dataAnalysis/'
// 元数据管理任务模块
export const apiManageList = params => httpGet(da + 'data/api/listOnPage', params) // 查询数据API列表并分页
export const selectOperate = params => httpGet(da + `common/select/operators/${params}`) // 获取操作符
export const selectAllCata = () => httpGet(da + 'dataCatalog/selectAllCata') // 加载目录树接口
export const enumTypeList = type => httpGet(da + `dataEnumType/selectByTypeNum/${type}`) // 获取枚举数据
export const savaApiInfo = params => httpPost(da + 'data/api/info', params) // 新增保存
export const updateApiInfo = params => httpPut(da + 'data/api/info', params) // 编辑保存
export const viewApiInfo = apiId => httpGet(da + `data/api/info/${apiId}`) // 根据API主键ID查询配置信息
export const getOutParams = apiId => httpGet(da + `data/api/outParams/${apiId}`) // 根据API主键ID查询出参信息列表
