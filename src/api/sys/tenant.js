import { httpPost } from '@/api' // , httpGet,httpGetSeries, httpPost, httpPut
// let da = '/permission/'
let da = '/'
export const getTenantList = () => httpPost(da + `tenantManage/selectTenantDown`) // 首页租户下拉
export const saveHomeTenantId = id => httpPost(da + `tenantManage/saveHomeTenantId/${id}`) // 首页选中租户时保存

export const getTenantManagePage = params => httpPost(da + 'tenantManage/getTenantManagePage', params) // 租户分页列表
export const getTenantManageInfo = id => httpPost(da + `tenantManage/getTenantManageInfo/${id}`) // 查看租户信息
export const deleteTenantManage = id => httpPost(da + `tenantManage/deleteTenantManage`, id) // 删除租户信息
export const updateTenantManage = params => httpPost(da + `tenantManage/updateTenantManage`, params) // 修改租户信息
export const addTenantManage = params => httpPost(da + `tenantManage/addTenantManage`, params) // 新增租户信息
