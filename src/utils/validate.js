/**
 * 邮箱
 * @param {*} s
 */
export function isEmail (s) {
  return /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(s)
}

/**
 * 手机号码
 * @param {*} s
 */
export function isMobile (s) {
  return /^1(3|4|5|6|7|8|9)\d{9}$/.test(s)
}

/**
 * 电话号码
 * @param {*} s
 */
export function isPhone (s) {
  return /^([0-9]{3,4}-)?[0-9]{7,8}$/.test(s)
}

/**
 * URL地址
 * @param {*} s
 */
export function isURL (s) {
  return /^http[s]?:\/\/.*/.test(s)
}

/**
 * 内网外网
 *
 */
// 判断是否内外网  20190505
export function isInnerIPFn() {
  // 返回的地址值
   var BASE_URL = ''
  // 获取当前页面url
  var curPageUrl = window.location.href
  console.log('curPageUrl-0  ', curPageUrl)

  var reg1 = /(http|ftp|https|www):\/\//g // 去掉前缀
  curPageUrl = curPageUrl.replace(reg1, '')
  console.log('curPageUrl-1' + curPageUrl)

  var reg2 = /\:+/g // 替换冒号为一点
  curPageUrl = curPageUrl.replace(reg2, '.')
  console.log('curPageUrl-2  ' + curPageUrl)

  curPageUrl = curPageUrl.split('.')// 通过一点来划分数组
  console.log('curPageUrl:', curPageUrl)

  var ipAddress = curPageUrl[0] + '.' + curPageUrl[1] + '.' + curPageUrl[2] + '.' + curPageUrl[3]

  var isInnerIp = false// 默认给定IP不是内网IP
  var ipNum = getIpNum(ipAddress)
  /**
     * 私有IP：
     *       A类  10.0.0.0    -10.255.255.255
     *       B类  172.16.0.0  -172.31.255.255
     *       C类  192.168.0.0 -192.168.255.255
     *       D类  127.0.0.0   -127.255.255.255(环回地址)
        **/
  var aBegin = getIpNum('10.0.0.0')
  var aEnd = getIpNum('10.255.255.255')

  var bBegin = getIpNum('172.16.0.0')
  var bEnd = getIpNum('172.31.255.255')

  var cBegin = getIpNum('192.168.0.0')
  var cEnd = getIpNum('192.168.255.255')

  var dBegin = getIpNum('127.0.0.0')
  var dEnd = getIpNum('127.255.255.255')

  isInnerIp = isInner(ipNum, aBegin, aEnd) || isInner(ipNum, bBegin, bEnd) || isInner(ipNum, cBegin, cEnd) || isInner(ipNum, dBegin, dEnd) || 'http://localhost'
  console.log('是否是内网:' + isInnerIp)
  // return isInnerIp;
  if (isInnerIp) {
    //  BASE_URL = 'http://10.19.8.21:9010' // 内网
    BASE_URL = true // 内网
  } else {
    //  BASE_URL = 'http://222.240.233.67:9010' // 外网
    BASE_URL = false // 外网
  }
  console.log('BASE_URL:', BASE_URL)
  return BASE_URL
}

function getIpNum(ipAddress) { /* 获取IP数 */
  var ip = ipAddress.split('.')
  var a = parseInt(ip[0])
  var b = parseInt(ip[1])
  var c = parseInt(ip[2])
  var d = parseInt(ip[3])
  var ipNum = a * 256 * 256 * 256 + b * 256 * 256 + c * 256 + d
  return ipNum
}

function isInner(userIp, begin, end) {
  return (userIp >= begin) && (userIp <= end)
}
