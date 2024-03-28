import { httpGet, httpPost } from '@/api'
let da = '/'
export const pageList = params => httpGet(da + 'connect/pageList', params) // 列表
export const save = params => httpPost(da + 'connect/save', params) // 保存
export const update = params => httpPost(da + 'connect/update', params) // 更新
export const pause = params => httpPost(da + 'connect/pause', params) // 暂停
export const resume = params => httpPost(da + 'connect/resume', params) // 恢复暂停
export const restart = params => httpPost(da + 'connect/restart', params) // 重启
export const deleteConnector = params => httpPost(da + 'connect/delete', params) // 重启

export const getHost = id => httpGet(da + `connect/getHost`) // 获取host

export const get = params => httpPost(da + `connect/get`, params) // 获取

export const getSubTask = params => httpPost(da + `connect/getSubTask`, params) // 获取
