import { httpGet, httpPost } from '@/api'
let da = '/dataAnalysis'
// 元数据管理任务模块
export const indexManageList = (params) => httpGet(da + '/indexManage/list', params) // 初始化列表
export const updateIndexManage = (params) => httpPost(da + '/indexManage/update', params) // 初始化列表
