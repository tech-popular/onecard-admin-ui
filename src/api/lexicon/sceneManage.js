import { httpPut, httpPost } from '@/api'
// 场景推荐
let base = '/'
export const listSearchScene = params => httpPost(base + 'scene/listSearchScene', params) // 推荐列表
export const saveorupt = (params, id) => id ? httpPut(base + `scene/updateSearchScene${id}`, params) : httpPost(base + 'scene/addSearchScene', params) // 新增表单提交
export const listSceneBoxInfo = params => httpPost(base + 'scene/listSceneBoxInfo', params) // 推荐类型下拉列表
export const listProductPool = params => httpPost(base + 'scene/listProductPool', params) // 商品池列表
export const getSceneWeightList = params => httpPost(base + 'sceneRule/getSceneWeightList', params) // 物品规则列表
export const selectFirstCategoryName = params => httpPost(base + 'productInfo/selectCategoryName', params) // 第一类别
// export const selectFirstCategoryName = params => httpPost(base + 'sceneRule/getSceneWeightList', params) // 物品规则列表
export const selectSecondCategoryName = params => httpPost(base + `productInfo/selectSecondCategoryName/${params}`, params) // 第二类别
