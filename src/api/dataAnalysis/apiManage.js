import { httpGet, httpPost } from '@/api'
let da = '/dataAnalysis'
// 元数据管理任务模块
export const apiManageList = (params) => httpGet(da + '/apiManage/list', params) // 初始化列表
export const updateIndexManage = (params) => httpPost(da + '/indexManage/update', params) // 初始化列表
