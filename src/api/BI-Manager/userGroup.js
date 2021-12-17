import {httpGet, httpPost} from '@/api'
let da = '/'
export const getUserGroupList = params => httpGet(da + 'bi/biUserGroup/getListByPage', params) // 获取页面list
export const savaUserGroupInfo = params => httpPost(da + 'bi/biUserGroup/save', params) // 新增保存
export const updateUserGroupInfo = params => httpPost(da + 'bi/biUserGroup/update', params) // 编辑保存
export const lookDataInfo = id => httpGet(da + `bi/biUserGroup/info/${id}`) // 根据id查询详情
export const getSelectTenantDown = () => httpPost(da + 'tenantManage/selectTenantDown') // 租户列表
export const getUsersList = tenantId => httpGet(da + `oa/getUsersFromTenantId/${tenantId}`) // 用户列表
export const deleteUsersById = id => httpGet(da + `bi/biUserGroup/deleteById/${id}`) // 删除
export const getRoleMenuList = userGroupId => httpGet(da + 'bi/biSysUserGroupMenu/getRoleMenuList', userGroupId) // 获取授权菜单id集合
export const saveRoleInfo = params => httpPost(da + 'bi/biSysUserGroupMenu/saveRole', params) // 分配权限
export const findAllRecursionList = params => httpGet(da + 'bi/biSysMenu/findAllRecursionList', params) // 递归菜单查询
