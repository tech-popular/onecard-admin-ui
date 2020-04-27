import http from '../utils/httpRequest'
import Qs from 'qs'

// POST 请求
function httpPost (url, params, flag = true) {
  return http({
    method: 'post',
    url: http.adornUrl(url),
    data: http.adornData(params, flag)
  })
}

// POST 请求
function httpPostFile (url, params) {
  return http({
    method: 'post',
    url: http.adornUrl(url),
    data: params
  })
}

// PUT 请求
function httpPut (url, params, flag = true) {
  return http({
    method: 'put',
    url: http.adornUrl(url),
    data: http.adornData(params, flag)
  })
}
// DELETE 请求
function httpDelete (url, params, flag = true) {
  return http({
    method: 'delete',
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

// GET 请求
function httpGetSeries (url, data = {}, flag = true) {
  if (data.utcParam) { // utcParam 为数组
    const router = data.utcParam.join('/')
    url = `${url}/${router}`
    delete data.utcParam
  }

  return http({
    method: 'get',
    url: http.adornUrl(url),
    params: data ? http.adornParams(data, flag) : http.adornParams(),
    paramsSerializer: (params) => {
      return Qs.stringify(params, {arrayFormat: 'repeat'})
    }
  })
}
export {
  httpPost,
  httpPostFile,
  httpGet,
  httpGetSeries,
  httpPut,
  httpDelete
}
