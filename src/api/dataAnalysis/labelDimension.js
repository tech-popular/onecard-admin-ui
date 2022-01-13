import { httpGet, httpPost, httpGetSeries, httpDelete } from '@/api'
// let da = '/dataAnalysis/'
let da = '/'
// 指标管理模块
export const selectAllGroupTypeNum = (params) => httpGet(da + 'dataEnumType/selectAllGroupTypeNum') // 初始化列表
