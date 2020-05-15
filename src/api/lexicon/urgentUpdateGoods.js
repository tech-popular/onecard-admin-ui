import Vue from 'vue'
import { httpGet, httpPost } from '@/api'
import http from '@/utils/httpRequest'
// let base = '/lexicon/'
let base = '/'
export const wordTypeList = () => httpGet(base + 'word/wordTypeList') // 词组类型列表-
export const wordList = params => httpPost(base + 'word/list', params) // 列表-
export const changeWordsInfoStatus = (id, status, username) => httpPost(base + `word/changeWordsInfoStatus/${id}/${status}/${username}`) // 修改词组状态 启用停用
export const downloadTemplate = http.adornUrl(base + 'word/downLoadTemplate?token=' + Vue.cookie.get('token')) // 下载模板
export const uploadFile = http.adornUrl(base + 'word/upLoadWords?token=' + Vue.cookie.get('token')) // 导入
export const showWordsInfo = id => httpPost(base + `word/showWordsInfo/${id}`) // 查看词组信息
