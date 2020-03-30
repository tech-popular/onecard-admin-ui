import { httpGet, httpPost } from '@/api'
let base = '/'
export const wordTypeList = () => httpGet(base + 'word/wordTypeList') // 词组类型列表-
export const wordList = params => httpPost(base + 'word/list', params) // 列表-
export const changeWordsInfoStatus = (id, status) => httpPost(base + `word/changeWordsInfoStatus/${id}/${status}`) // 修改词组状态 启用停用
export const deleteWordsInfo = id => httpPost(base + `word/deleteWordsInfo/${id}`) // 删除
export const downloadTemplate = () => httpGet(base + 'word/downLoadTemplate') // 下载模板
export const uploadWords = () => httpPost(base + 'word/uploadWords') // 导入
export const addWordsInfo = params => httpPost(base + 'word/addWordsInfo', params) // 新增
export const showWordsInfo = id => httpGet(base + `word/showWordsInfo/${id}`) // 查看词组信息
export const updateWordsInfo = params => httpPost(base + 'word/updateWordsInfo', params) // 更新词组信息
