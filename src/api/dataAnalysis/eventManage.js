import { httpPost, httpGet } from '@/api'
// let da = 'dataTransfer/'
let da = '/'
// 事件管理模块
export const eventManageList = (params) => httpPost(da + 'data/event/listOnPage', params) // 初始化列表
export const eventTypeList = () => httpGet(da + 'data/event/getEventList') // 事件类型列表
export const channelsList = () => httpGet(da + 'common/selectAll/channels') // 渠道
export const infoEventManage = (id) => httpGet(da + `data/event/info/${id}`) // 查看详情
