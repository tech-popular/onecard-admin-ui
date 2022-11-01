/**
 * 开发环境
 */
(function () {
  window.SITE_CONFIG = {}
  // api接口请求地址
  // window.SITE_CONFIG['baseUrl'] = '//10.3.0.30:8000/canary-admin' // 开发环境
  window.SITE_CONFIG['baseUrl'] = '//test02.bigdata.9f.cn/canary-admin' // 开发环境
  // cdn地址 = 域名 + 版本号
  window.SITE_CONFIG['domain'] = './' // 域名
  window.SITE_CONFIG['BIGDATA_HREFLINK'] = 'http://test02.bigdata.9f.cn' // 域名
  window.SITE_CONFIG['version'] = '' // 版本号(年月日时分)
  window.SITE_CONFIG['cdnUrl'] =
    window.SITE_CONFIG.domain + window.SITE_CONFIG.version
})()
