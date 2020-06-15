import { httpPost, httpGet } from '@/api'
let base = '/'
// 策略模块
export const beeTaskList = (params, flag) => httpGet(base + 'baseDicdata/list', params, flag) // 初始化列表
export const showStrategyDropDown = (params, flag) => httpPost(base + 'strategySet/showStrategyDropDown', params, flag) // 下拉集合
export const infoBeeTask = (params) => httpPost(base + `strategySet/showStrategySetInfo/${params}`) // 修改回显
export const saveorupt = (params) => httpPost(base + 'baseDicdata/addExperimentSett', params) // 新增复制策略
export const deleteBeeTask = (params) => httpPost(base + `strategySet/deleteStrategySetInfo/${params}`) // 删除
export const getSceneDropDown = (params, flag) => httpPost(base + 'scene/getSceneDropDown', params, flag) // 场景下拉
