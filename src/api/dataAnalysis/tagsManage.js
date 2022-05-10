import { httpGet, httpPost, httpDelete } from '@/api'
let da = '/'

export const dataCatalogList = (params) => httpGet(da + 'dataCatalog/listOnPage', params) // 初始化列表
export const adddataCatalog = (params) => httpPost(da + 'dataCatalog/addNode', params) // 新增表单提交
export const infodataCatalog = (params) => httpGet(da + 'dataCatalog/getDatacataLog', params) // 详情查看
export const updatedataCatalog = (params) => httpPost(da + 'dataCatalog/update', params) // 更新表单提交
export const deleteDataInfo = id => httpDelete(da + `dataCatalog/delete/${id}`) // 根据主键ID删除配置信息
export const getDataCataLog = () => httpGet(da + 'dataCatalog/AlldataCataLog') // 分级目录
