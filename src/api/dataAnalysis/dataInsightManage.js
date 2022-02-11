import Vue from 'vue'
import { httpGet, httpGetSeries, httpPost, httpPostFile, httpPut, httpDelete } from '@/api'
import http from '@/utils/httpRequest'
// let da = '/dataAnalysis/'
let da = '/'
//
// 元数据管理任务模块
export const dataInsightManageList = params => httpGet(da + 'data/group/listOnPage', params) // 查询数据API列表并分页
export const selectOperate = params => httpGet(da + `common/select/operators/${params}`) // 获取操作符
export const selectAllCata = params => httpGetSeries(da + 'dataCatalog/selectAllCataNew', params) // 加载目录树接口
export const enumTypeList = type => httpGet(da + `dataEnumType/selectByTypeNum/${type}`) // 获取枚举数据
export const savaDataInfo = params => httpPost(da + 'data/group/info', params) // 新增保存
export const updateDataInfo = params => httpPut(da + 'data/group/info', params) // 编辑保存
export const viewDataInfo = id => httpGet(da + `data/group/info/${id}`) // 根据主键ID查询配置信息
export const deleteDataInfo = id => httpDelete(da + `data/group/${id}`) // 根据主键ID删除配置信息
export const dataPreviewInfo = params => httpPut(da + 'data/group/preview', params) // 数据预览
export const uploadFileInfo = params => httpGet(da + 'data/group/listOnPage', params)
export const importExcelFile = params => httpPostFile(da + 'data/group/import', params)
export const channelsList = () => httpGet(da + 'common/select/channels')
export const vestPackAvailable = code => httpGetSeries(da + `vest/pack/select/available`, code)
export const custerAvailable = code => httpGet(da + `data/group/select/available?channelCode=${code}`) // 分群ID
export const templateDownload = http.adornUrl(da + 'data/group/template/download?token=' + Vue.cookie.get('token'))
export const dataIndexManagerCandidate = params => httpGet(da + 'dataIndexManager/value/candidate', params)

export const overviewData = id => httpGet(da + `data/group/overview/${id}`)
export const transferLogList = params => httpGet(da + `data/transferLog/listOnPage`, params)
export const chartInfo = params => httpGet(da + `data/group/chartInfo`, params, 1000 * 60)

export const selectEventAllCata = params => httpGetSeries(da + 'data/event/getEventDropDownList', params) // 加载事件类型接口
export const selectEventIndexAllCata = params => httpGet(da + 'data/event/index/getEventIndexByElementId', params) // 加载事件属性类型接口
export const collisionList = () => httpGet(da + 'data/collision/list')
export const collisionParams = (collisionPackId, groupId) => httpGet(da + `data/collision/params?collisionPackId=${collisionPackId}&groupId=${groupId}`)
export const collisionSave = (params, collisionPackId) => httpPost(da + `data/collision/config/group?collisionPackId=${collisionPackId}`, params, false)
export const collisionUpdate = (params, collisionPackId, groupId) => httpPut(da + `data/collision/config/group?groupId=${groupId}&collisionPackId=${collisionPackId}`, params, false)
export const importSqlInfo = params => httpPost(da + 'data/group/sql/import', params) // 保存SQL
export const databaseInitInfo = () => httpGet(da + 'oa/databaseInitInfo') // 库表管理初始化
export const selectDataGroupInfos = params => httpGet(da + 'dataCatalog/selectDataGroupInfos', params) // 分群包
