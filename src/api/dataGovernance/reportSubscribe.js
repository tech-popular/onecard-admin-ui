import { httpGet, httpPost } from '@/api'
let da = '/'
export const getList = params => httpGet(da + 'data/menu/pubsub/list', params) // 订阅列表
export const subscriptionUpAndDown = id => httpGet(da + `data/menu/pubsub/switch/status/${id}`) // 订阅上下线

export const applyScriptions = params => httpPost(da + 'data/menu/pubsub/save', params)
// 系统模块
export const getSystemModulesById = params => httpGet(da + 'oa/getMenuListBySystemId', params)
export const getUserGroupList = (params) => httpGet(da + 'bi/biUserGroup/getUserGroupListByUserId', params)
// 查看
export const infoData = id => httpGet(da + `data/menu/pubsub/info/${id}`) // 订阅上下线
