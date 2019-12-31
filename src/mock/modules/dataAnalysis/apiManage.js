import Mock from 'mockjs'

var baseList = []
for (let i = 0; i < Math.floor(Math.random() * 10 + 1); i++) {
  let name = Mock.Random.name()
  baseList.push(Mock.mock({
    'id': '@increment',
    'name': name,
    'status|1': ['1', '0'],
    'desc|1': ['iowoiewewe', 'oppjkclds'],
    'creator': '@name',
    'error': null,
    'times|1-1000': 1000,
    'createTime': '@datetime',
    'updateTime': '@datetime'
  }))
}

export function apiManageList () {
  return {
    // isOpen: false,
    url: '/apiManage/list',
    type: 'get',
    data: {
      'msg': 'success',
      'code': 0,
      'data': {
        'totalCount': baseList.length,
        'pageSize': 10,
        'totalPage': 1,
        'currPage': 1,
        'list': baseList
      }
    }
  }
}

// 获取定时任务日志信息
export function scheduleInfo () {
  let name = Mock.Random.name()
  return {
    // isOpen: false,
    url: '/sys/scheduleLog/info',
    type: 'get',
    data: {
      'msg': 'success',
      'code': 0,
      'log': {
        'logId': 1225,
        'jobId': 3,
        'beanName': name,
        'methodName': name,
        'params': null,
        'status': 1,
        'error': `org.springframework.beans.factory.NoSuchBeanDefinitionException: No bean named '${name}' available`,
        'times': Mock.Random.integer(1, 1000),
        'createTime': Mock.Random.datetime
      }
    }
  }
}
