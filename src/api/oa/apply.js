import { httpGet, httpPost, httpPut, httpDelete } from '@/api'
let da = '/'
// 账号管理
export const accoutAuthInitInfo = (params) => httpGet(da + 'oa/accoutAuthInitInfo', params) // 账号管理初始化列表
// 模糊查询数据库表字段
export const getListOnPage = (params) => httpPost(da + 'mcCompute/listOnPage', params)
