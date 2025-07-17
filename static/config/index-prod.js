/**
 * 生产环境
 */
;(function () {
  window.SITE_CONFIG = {}

  var currentDomain = window.location.hostname

  // 判断当前域名并设置相应的配置
  if (currentDomain === 'inner-tech.9f.cn') {
    // api接口请求地址
    window.SITE_CONFIG['baseUrl'] = '//inner-tech.9f.cn/canary-admin'
  } else {
    // api接口请求地址
    window.SITE_CONFIG['baseUrl'] = '/canary-admin'
  }
  // cdn地址 = 域名 + 版本号
  window.SITE_CONFIG['BIGDATA_HREFLINK'] = 'http://unify-manager.datacenter-standard' // 域名

  window.SITE_CONFIG['domain'] = './' // 域名
  window.SITE_CONFIG['version'] = ''   // 版本号(年月日时分)
  window.SITE_CONFIG['cdnUrl'] = window.SITE_CONFIG.domain + window.SITE_CONFIG.version
})()
