import { httpGet } from '@/api'
let da = '/'

export const taskManageList = params => httpGet(da + 'honeycomb/honeycombtask/list', params) // 获取数据list
export const selectTaskName = key => httpGet(da + `honeycomb/honeycombtask/search/${key}`) // 获取任务名称
// export const starttask = id => httpPost(da + `honeycomb/honeycombtask/starttask/${id}`) // 手动执行
