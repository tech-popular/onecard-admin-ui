import http from '../utils/httpRequest'

// POST 请求
function httpPost (url, params, flag = true) {
  return http({
    method: 'post',
    url: http.adornUrl(url),
    data: http.adornData(params, flag)
  })
}
// GET 请求
function httpGet (url, data = {}, flag = true) {
  if (data.utcParam) { // utcParam 为数组
    const router = data.utcParam.join('/')
    url = `${url}/${router}`
    delete data.utcParam
  }

  return http({
    method: 'get',
    url: http.adornUrl(url),
    params: data ? http.adornParams(data, flag) : http.adornParams()
  })
}
export {
  httpPost,
  httpGet
}
