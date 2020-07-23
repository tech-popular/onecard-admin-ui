// sys/menu/pageList
import { httpPost, httpGet } from '@/api' // , httpGetSeries, httpPost, httpPut httpGet,
let da = '/'  // POST /tenantManage/selectTenantIdByUserId
export const getRoleList = params => httpGet(da + 'sys/role/list', params) // 所有版块信息
export const getRoleDelete = params => httpPost(da + 'sys/role/delete', params, false) // 级联下拉 除按钮以上的所有菜单
export const getRoleInfo = id => httpGet(da + `sys/role/info/${id}`)
export const updateRoleInfo = params => httpPost(da + `sys/role/update`, params)
export const saveRoleInfo = params => httpPost(da + `sys/role/save`, params)
export const roleSelectList = () => httpGet(da + 'sys/role/select') // 角色集合
