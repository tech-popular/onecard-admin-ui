import { httpGet, httpPost, httpPut, httpDelete } from '@/api'
let da = '/'
// 账号管理
export const accoutAuthInitInfo = (params) => httpGet(da + 'canary-admin/oa/accoutAuthInitInfo', params) // 账号管理初始化列表
