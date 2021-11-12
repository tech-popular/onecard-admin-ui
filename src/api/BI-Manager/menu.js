import {httpPost} from '@/api'
let da = '/'
export const savaBiInfo = params => httpPost(da + 'bi/biSysMenu/save', params) // 新增保存
export const updateBiInfo = params => httpPut(da + 'bi/biSysMenu/info', params) // 编辑保存
export const findAllRecursionList = params => httpPut(da + 'bi/biSysMenu/findAllRecursionList', params) // 递归菜单查询
