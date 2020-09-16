import { httpGet, httpPost } from '@/api'
// let base = 'jindouyun/'
let base = '/'
// 策略模块
export const jdyAdd = params => httpPost(base + 'jdy/add', params)
export const jdyEdit = params => httpPost(base + 'jdy/edit', params)
export const jdyList = params => httpPost(base + 'jdy/list', params)
export const jdyDetail = id => httpGet(base + `jdy/detail/${id}`)
export const jdyTaskOn = id => httpGet(base + `jdy/taskOn/${id}`)
export const jdyTaskOff = id => httpGet(base + `jdy/taskOff/${id}`)
export const jdyDelete = params => httpPost(base + 'jdy/delete', params, false)
export const jdyGetPro = params => httpPost(base + 'jdy/getProByNumOrName', params)
