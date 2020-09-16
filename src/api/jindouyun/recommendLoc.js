import { httpGet } from '@/api'
let base = '/'
// 策略模块
export const getProInfo = () => httpGet(base + 'jdy/getProInfo') // 初始化列表
