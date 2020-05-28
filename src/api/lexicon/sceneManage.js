import { httpPut, httpPost } from '@/api'
// 场景推荐
let base = '/'
export const listSceneBoxInfo = params => httpPost(base + 'scene/listSceneBoxInfo', params) // 推荐类型下拉列表
export const saveorupt = (params, id) => id ? httpPut(base + `scene/updateSearchScene${id}`, params) : httpPost(base + 'scene/addSearchScene', params) // 新增表单提交
