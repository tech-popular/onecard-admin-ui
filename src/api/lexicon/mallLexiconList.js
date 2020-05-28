import Vue from 'vue'
import { httpGet, httpPost } from '@/api'
import http from '@/utils/httpRequest'
// let base = '/lexicon/'
let base = '/'
export const wordTypeList = () => httpGet(base + 'word/wordTypeList') // 词组类型列表-
export const wordList = params => httpPost(base + 'word/list', params) // 列表-
export const changeWordsInfoStatus = (id, status, username) => httpPost(base + `word/changeWordsInfoStatus/${id}/${status}/${username}`) // 修改词组状态 启用停用
export const deleteWordsInfo = id => httpPost(base + `word/deleteWordsInfo/${id}`) // 删除
export const downloadTemplate = http.adornUrl(base + 'word/downLoadTemplate?token=' + Vue.cookie.get('token')) // 下载模板
export const uploadWords = http.adornUrl(base + 'word/upLoadWords?token=' + Vue.cookie.get('token')) // 导入
export const addWordsInfo = params => httpPost(base + 'word/addWordsInfo', params) // 新增
export const showWordsInfo = id => httpPost(base + `word/showWordsInfo/${id}`) // 查看词组信息
export const updateWordsInfo = params => httpPost(base + 'word/updateWordsInfo', params) // 更新词组信息
export const getBrandNamesAndCategoryNames = params => httpPost(base + 'word/showBrandNamesAndCategoryNames', params) // 词组搜索词模糊查询
// export const downLoadWordsTXT = type => httpGet(base + `/word/downLoadWordsTXT/${type}`)
export const downLoadWordsTXT = type => http.adornUrl(base + 'word/downLoadWordsTXT/' + type + '?token=' + Vue.cookie.get('token'))

// 场景推荐
