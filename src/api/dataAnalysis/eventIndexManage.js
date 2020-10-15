import { httpPost, httpGet } from '@/api'
// let da = 'dataTransfer/'
let da = '/'
// 事件属性管理模块
export const eventIndexManageList = (params) => httpPost(da + 'data/event/index/listOnPage', params) // 初始化列表
export const infoEventIndexManage = (id) => httpGet(da + `data/event/index/info/${id}`) // 查看详情
