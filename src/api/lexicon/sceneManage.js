import { httpPut, httpPost } from '@/api'
// 场景推荐
let base = '/'
export const listSearchScene = params => httpPost(base + 'scene/listSearchScene', params) // 推荐列表
export const getSceneInterfaceType = params => httpPost(base + 'scene/getSceneInterfaceType', params) // 推荐列表
export const saveorupt = (params, id) => id ? httpPut(base + `scene/updateSearchScene${id}`, params) : httpPost(base + 'scene/addSearchScene', params) // 新增表单提交
export const listSceneBoxInfo = params => httpPost(base + 'scene/listSceneBoxInfo', params) // 推荐类型下拉列表
export const listProductPool = params => httpPost(base + 'scene/listProductPool', params) // 商品池列表
export const getSceneWeightList = params => httpPost(base + 'sceneRule/getSceneWeightList', params) // 物品规则列表
export const updateSceneWeightInfo = params => httpPost(base + 'sceneRule/updateSceneWeightInfo', params) // 物品规则修改权重
export const selectFirstCategoryName = params => httpPost(base + 'productInfo/selectCategoryName', params) // 第一类别
export const getSceneDistinctList = params => httpPost(base + 'sceneRule/getSceneDistinctList', params) // 去重规则列表
export const updateSceneDistinctInfo = params => httpPost(base + 'sceneRule/updateSceneDistinctInfo', params) // 修改去重规则
export const getSceneWillPushList = params => httpPost(base + 'sceneRule/getSceneWillPushList', params) // 必推规则列表
export const queryceneBoxinfoById = params => httpPost(base + `scene/queryceneBoxinfoById/${params}`, params) // 查看必推规则
export const getSceneWillPushsByBoxId = params => httpPost(base + `sceneRule/getSceneWillPushsByBoxId/${params}`, params) // 查看必推规则
export const addSceneWillPush = params => httpPost(base + 'sceneRule/addSceneWillPush', params) // 新增必推规则列表
export const selectSecondCategoryName = params => httpPost(base + `productInfo/selectSecondCategoryName/${params}`, params) // 第二类别
