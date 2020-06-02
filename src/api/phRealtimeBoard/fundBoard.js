// import Vue from 'vue'
import { httpPost } from '@/api'
// import http from '@/utils/httpRequest'
// let base = '/phRealTime/'
let base = '/'
// 日志
export const log = params => httpPost(base + 'realtime/yhjx/log', params)
// 列表数据
export const list = params => httpPost(base + `realtime/yhjx/list`, params)
// 图表数据
export const chart = params => httpPost(base + 'realtime/yhjx/chart', params) // 新增
