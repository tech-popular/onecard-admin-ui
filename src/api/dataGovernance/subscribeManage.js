import { httpGet, httpPost } from '@/api'
let da = '/'
export const queryEnableList = params => httpGet(da + 'data/governance/datasource/queryEnableList', params) // 查询所有启用数据源列表
export const databaseList = datasourceId => httpGet(da + `data/governance/database/${datasourceId}`) // 查看数据源下所有库
export const getUsersList = () => httpGet(da + 'export/data/getReceiveUsers') // 租户下的用户信息

export const getList = params => httpGet(da + 'data/governance/subscription/list', params) // 订阅列表
export const saveTask = params => httpPost(da + 'data/governance/subscription/saveTask', params) // 添加订阅
export const editTask = params => httpPost(da + 'data/governance/subscription/editTask', params) // 添加订阅
export const taskDetail = id => httpGet(da + `data/subscription/taskDetail/${id}`) // 查询订阅详情
export const updateSubscriptionAuth = params => httpPost(da + 'data/governance/subscription/updateSubscriptionAuth', params) // 单条数据权限
export const batchUpdateSubscriptionAuth = params => httpPost(da + 'data/governance/subscription/batchUpdateSubscriptionAuth', params) // 批量多条数据更新
export const subscriptionUpAndDown = params => httpGet(da + 'data/governance/subscription/upAndDown', params) // 订阅上下线
export const configDepend = params => httpPost(da + 'data/governance/subscription/configDepend', params) // 配置调度任务依赖
export const queryDenpendJob = id => httpPost(da + `data/subscription/queryDenpendJob/${id}`) // 根据订阅任务Id查看依赖任务进度

export const honeycombTasks = params => httpGet(da + 'data/governance/dispatchDepend/honeycombTasks', params) // 查看蜂巢调度任务
export const oldDispatchTasks = params => httpGet(da + 'data/governance/dispatchDepend/oldDispatchTasks', params) // 查看老调度任务
