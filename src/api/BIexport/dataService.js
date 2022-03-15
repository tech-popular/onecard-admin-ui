import { httpPost, httpGet } from '@/api'
let da = '/'

export const exportDataList = params => httpPost(da + 'export/data/list', params) // 查询数据列表并分页
export const datasourceDataList = () => httpGet(da + 'export/data/datasource/list') // 服务器 列表
export const databaseDataList = (datasourceId) => httpGet(da + `export/data/database/${datasourceId}`) // 数据库列表
export const sqlPreview = params => httpPost(da + 'export/data/sql/preview', params) // sql执行预览
export const checkDatasource = params => httpPost(da + 'export/data/checkDatasource', params) // 数据源预览
export const saveDatasource = params => httpPost(da + 'export/data/saveDatasource', params) // 数据源保存
