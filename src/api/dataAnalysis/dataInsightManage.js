import Vue from 'vue'
import { httpGet, httpPost, httpPostFile, httpPut, httpDelete } from '@/api'
import http from '@/utils/httpRequest'
// let da = '/dataAnalysis/'
let da = '/'
//
// 元数据管理任务模块
export const dataInsightManageList = params => httpGet(da + 'data/group/listOnPage', params) // 查询数据API列表并分页
export const selectOperate = params => httpGet(da + `common/select/operators/${params}`) // 获取操作符
export const selectAllCata = params => httpGet(da + 'dataCatalog/selectAllCata', params) // 加载目录树接口
export const enumTypeList = type => httpGet(da + `dataEnumType/selectByTypeNum/${type}`) // 获取枚举数据
export const savaDataInfo = params => httpPost(da + 'data/group/info', params) // 新增保存
export const updateDataInfo = params => httpPut(da + 'data/group/info', params) // 编辑保存
export const viewDataInfo = id => httpGet(da + `data/group/info/${id}`) // 根据主键ID查询配置信息
export const deleteDataInfo = id => httpDelete(da + `data/group/${id}`) // 根据主键ID删除配置信息
export const dataPreviewInfo = params => httpPut(da + 'data/group/preview', params) // 数据预览
export const uploadFileInfo = params => httpGet(da + 'data/group/listOnPage', params)
export const importExcelFile = params => httpPostFile(da + 'data/group/import', params)
export const channelsList = () => httpGet(da + 'common/select/channels')
export const vestPackAvailable = params => httpGet(da + 'vest/pack/select/available', params)
export const custerAvailable = () => httpGet(da + `data/group/select/available`) // 分群ID
export const templateDownload = http.adornUrl(da + 'data/group/template/download?token=' + Vue.cookie.get('token'))

export const selectAllCataNew = () => httpGet('http://10.3.1.64:8085/dataCatalog/selectAllCataNew', {}, true, true)
