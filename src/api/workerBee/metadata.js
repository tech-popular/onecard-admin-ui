import { httpGet, httpPost } from '@/api'
let gf = '/gongFeng'
// 元数据管理
export const beeTaskList = (params) => httpGet(gf + '/beeTask/list', params) // 初始化列表
export const allRuleTemplate = (params, flag) => httpPost('/sys/sysdictitem/selectbydictypes', params, flag) // 任务类型
export const deleteBeeTask = (params) => httpGet(gf + '/beeTask/deleteBeeTask', params) // 删除
