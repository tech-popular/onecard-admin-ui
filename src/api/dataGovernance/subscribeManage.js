import { httpGet } from '@/api'
let da = '/'
export const queryEnableList = params => httpGet(da + 'data/governance/datasource/queryEnableList', params) // 查询所有启用数据源列表
export const databaseList = datasourceId => httpGet(da + `data/governance/database/${datasourceId}`) // 查看数据源下所有库
export const getUsersList = () => httpGet(da + 'export/data/getReceiveUsers') // 租户下的用户信息
