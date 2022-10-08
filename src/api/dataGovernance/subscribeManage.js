import { httpGet, httpPost } from '@/api'
let da = '/'
export const queryEnableList = params => httpGet(da + 'data/governance/datasource/queryEnableList', params) // 查询所有启用数据源列表
export const databaseList = datasourceId => httpGet(da + `data/governance/datasource/database/${datasourceId}`) // 查看数据源下所有库
export const getUsersList = () => httpGet(da + 'data/governance/getReceiveUsers') // 租户下的用户信息

export const getList = params => httpGet(da + 'data/governance/list', params) // 订阅列表
export const saveTask = params => httpPost(da + 'data/governance/saveTask', params) // 添加订阅
export const editTask = params => httpPost(da + 'data/governance/editTask', params) // 添加订阅
export const taskDetail = id => httpGet(da + `data/governance/taskDetail/${id}`) // 查询订阅详情
export const updateSubscriptionAuth = params => httpPost(da + 'data/governance/updateSubscriptionAuth', params) // 单条数据权限
export const batchUpdateSubscriptionAuth = params => httpPost(da + 'data/governance/batchUpdateSubscriptionAuth', params) // 批量多条数据更新
export const subscriptionUpAndDown = id => httpGet(da + `data/governance/upAndDown/${id}`) // 订阅上下线
export const configDepend = params => httpPost(da + 'data/governance/configDepend', params) // 配置调度任务依赖
export const queryDenpendJob = id => httpGet(da + `data/governance/queryDependJob/${id}`) // 根据订阅任务Id查看依赖任务进度

export const honeycombTasks = params => httpGet(da + 'data/governance/dispatchDepend/honeycombTasks', params) // 查看蜂巢调度任务
export const oldDispatchTasks = params => httpGet(da + 'data/governance/dispatchDepend/oldDispatchTasks', params) // 查看老调度任务
export const checkUserHaveHtml = () => httpGet(da + 'data/governance/checkUserHaveHtmlButton') // 订阅列表