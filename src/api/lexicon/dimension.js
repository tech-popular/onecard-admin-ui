import { httpPost } from '@/api'
import {httpGet} from "../index";
let base = '/'
// 策略模块
export const beeTaskList = (params, flag) => httpPost(base + 'dimension/selectDimensionList', params, flag) // 初始化列表
export const infoBeeTask = (params) => httpPost(base + `dimension/selectByPrimaryKey/${params}`) // 修改回显
export const saveorupt = (params, id) => id ? httpPost(base + 'dimension/updateStrategyDimension', params) : httpPost(base + 'dimension/insertStrategyDimension', params) // 新增表单提交
export const deleteBeeTask = (params) => httpPost(base + `dimension/deleteByPrimaryKey/${params}`) // 删除
export const updateToRedis = (params) => httpGet(base + `strategySetInit/oneClickUpdateToRedis`, params) // 更新到redis
