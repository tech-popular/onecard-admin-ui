// http://unif-manager-lirong.sk.9f.cn/canary-admin/accessLog/selectAccessLog
// sys/menu/pageList
import { httpGet } from '@/api'
let da = '/'
// let da = '/reportlog/'
export const selectAccessLog = params => httpGet(da + 'accessLog/selectAccessLog', params)
export const selectAccessLogPage = params => httpGet(da + `accessLog/selectAccessLogPage`, params)
export const queryAccessList = params => httpGet(da + 'accessLog/queryAccessList', params)
