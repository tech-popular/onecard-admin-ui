import { httpGet, httpPost } from '@/api'
let da = '/'
export const savaBiInfo = params => httpPost(da + 'bi/biSysMenu/save', params) // 新增保存
export const updateBiInfo = params => httpPost(da + 'bi/biSysMenu/update', params) // 编辑保存
export const findAllRecursionList = params => httpGet(da + 'bi/biSysMenu/findAllRecursionList', params) // 递归菜单查询
export const getMenuList = params => httpGet(da + 'bi/biSysMenu/getListByPage', params)
export const taskManageList = () => httpGet(da + 'honeycomb/honeycombtask/getNewBiHoneycombtaskList') // 获取计算任务
export const lookDataInfo = id => httpGet(da + `bi/biSysMenu/info/${id}`) // 根据id查询详情
export const updateFlagInfo = params => httpPost(da + 'bi/biSysMenu/updateByFlag', params) // 编辑保存
export const getListByParentId = params => httpGet(da + 'bi/biSysMenu/getListByParentId', params) // 根据ID获取下级目录或菜单
export const updateOrder = params => httpGet(da + 'bi/biSysMenu/updateOrder', params) // 保存排序
export const queryAllTypeTasks = () => httpGet(da + 'data/governance/dispatchDepend/queryAllTypeTasks') // 获取计算任务
