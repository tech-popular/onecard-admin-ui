import { httpPost } from '@/api'
let da = '/'
// 邮箱接口
export const getUser9FbankEmail = (params) => httpPost(da + 'oa/email/getUser9FbankEmail', params)
