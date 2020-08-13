// sys/menu/pageList
import { httpPost, httpGet } from '@/api' // , httpGetSeries, httpPost, httpPut httpGet,
let da = '/'  // POST /tenantManage/selectTenantIdByUserId
export const getPlateList = () => httpGet(da + 'sys/menu/selectPlateList') // 所有版块信息
export const getNavList = id => httpGet(da + `sys/menu/nav/${id}`) // 所有版块信息
export const getDownNoButtonMenu = id => httpGet(da + `sys/menu/selectDownNoButtonMenu/${id}`) // 所有版块信息
export const getPageList = params => httpPost(da + 'sys/menu/pageList', params) // 菜单列表接口
export const getSelectDown = () => httpGet(da + 'sys/menu/selectDown') // 级联下拉 除按钮以上的所有菜单
export const getSelectUp = id => httpGet(da + `sys/menu/selectUp/${id}`)
export const getMenuInfo = id => httpGet(da + `sys/menu/info/${id}`)
export const getMenuList = id => httpGet(da + `sys/menu/menuList/${id}`) // 板块下的所有目录菜单-入参板块id
export const getMenuAll = () => httpGet(da + `sys/menu/selectAllMenuList`) // 获取所有菜单，包含版块导航菜单按钮
