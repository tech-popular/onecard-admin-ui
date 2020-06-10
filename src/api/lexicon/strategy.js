import { httpPost } from '@/api'
let base = '/'
// 策略模块
export const beeTaskList = (params, flag) => httpPost(base + '/strategySet/list', params, flag) // 初始化列表
export const showStrategyDropDown = (params, flag) => httpPost(base + '/strategySet/showStrategyDropDown', params, flag) // 下拉集合
export const infoBeeTask = (params) => httpPost(base + `/strategySet/showStrategySetInfo/${params}`) // 修改回显
export const saveorupt = (params) => httpPost(base + '/strategySet/addStrategySet', params) // 新增复制策略
export const deleteBeeTask = (params) => httpPost(base + `/strategySet/deleteStrategySetInfo/${params}`) // 删除
