import { httpGet } from '@/api'
let base = 'jindouyun/'
// let base = '/'
// 策略模块
export const jdyProductList = (params, flag) => httpGet(base + 'custom/jdy_product_number_type_score', params, flag) // 初始化列表
