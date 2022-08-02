import { httpPost, httpGet } from '@/api'
let da = '/'
export const datasourceList = params => httpGet(da + 'data/governance/datasource/list', params) // 查询数据列表并分页
export const queryEnableList = params => httpGet(da + 'data/governance/datasource/queryEnableList', params) // 查询所有启用数据源列表
export const saveDatasource = params => httpPost(da + 'data/governance/datasource/saveDatasource', params) // 新增
export const editDatasource = params => httpPost(da + 'data/governance/datasource/editDatasource', params) // 修改
export const lookDatasource = id => httpGet(da + `data/governance/datasource/${id}`) // 查看
export const databaseList = datasourceId => httpGet(da + `data/governance/database/${datasourceId}`) // 查看数据源下所有库
export const updateDataSourceAuth = params => httpPost(da + 'data/governance/datasource/updateDataSourceAuth', params) // 单条数据源权限
export const batchUpdateDataSourceAuth = params => httpPost(da + 'data/governance/datasource/batchUpdateDataSourceAuth', params) // 批量多条数据更新
export const biUserGroupList = () => httpGet(da + 'bi/biUserGroup/list') // 用户组列表
export const authUserGroup = params => httpPost(da + 'data/governance/datasource/authUserGroup', params) // 用户组授权
export const testDatasource = params => httpPost(da + 'data/governance/datasource/testDatasource', params) // 测试数据源
