import {
  httpGet,
  httpPost,
  httpPut,
  httpPostFile,
  httpDelete
} from '@/api'
let base = '/'
// 缓存清除
export const list = (params) => httpPost(base + 'dispatch/task/select', params) // 初始化列表
export const info = (params) => httpGet(base + `dispatch/task/info/${params}`) // 详情
export const update = (params) => httpPost(base + 'dispatch/task/update', params) // 修改
export const save = (params) => httpPost(base + 'dispatch/task/save', params) // 新增
export const dataSourceAll = (type, flow) => httpGet(base + `dispatch/datasource/supports?taskType=${type}&dataFlow=${flow}`) // 同步及计算任务中的殴打让你源类型下选
export const accountAll = params => httpPost(base + 'dispatch/account/selectall', params)
export const tagAll = () => httpGet(base + 'dispatch/task/tag/list')
export const getResourceList = () => httpGet(base + 'dispatch/task/getResourceList')
export const changeTaskDisable = (id) => httpGet(base + `dispatch/task/changeTaskDisable/${id}`)
export const changeDispatchStatus = (id) => httpGet(base + `dispatch/task/changeDispatchStatus/${id}`)
export const getExtraParam = (taskType) => httpGet(base + `dispatch/task/extraParam/list/${taskType}`)
export const getDolphinFlowList = (projectId) => httpGet(base + `dispatch/task/getDolphinFlowList/${projectId}`)
export const getTaskList = (type) => httpGet(base + `dispatch/task/getTaskList/${type}`)
export const getDolphinProcessList = () => httpGet(base + `dispatch/task/getDolphinProcessList`)
export const getDolphinProcessById = (processId) => httpGet(base + `dispatch/task/getDolphinProcessById/${processId}`)
export const getDolphinTaskById = (taskId) => httpGet(base + `dispatch/task/getDolphinTaskById/${taskId}`)
export const projectAll = () => httpPost(base + 'dispatch/project/selectall')
export const getGitLabProjects = () => httpGet(base + 'gitlab/getGitLabProjects')
export const getTagsAPI = () => httpGet(base + 'dispatch/task/tag/list')
export const getGitLabCatalog = (projectId) => httpGet(base + `gitlab/getGitLabCatalog/${projectId}`)
export const getRawBlobContent = (params) => httpPost(base + `gitlab/getRawBlobContent`, params)
export const sqlParse = params => httpPostFile(base + 'dispatch/task/sql/parse', params)
export const taskBatchList = params => httpGet(base + 'dispatch/task/instance/listOnPage', params)
export const taskBatchStatus = () => httpGet(base + 'dispatch/task/instance/task/status')
export const taskExecute = id => httpPut(base + `dispatch/task/${id}/execute`) // 任务执行
export const taskBaseInfo = id => httpGet(base + `dispatch/task/infoTask/${id}`) // 基础任务回显
export const taskDependenceAdd = params => httpPost(base + 'dispatch/task/dependence/insertBatch', params) // 依赖任务批量新增
export const taskBaseList = params => httpPost(base + 'dispatch/task/listOnPage', params) // 基础任务分页列表
export const taskDependenceDelete = params => httpPostFile(base + 'dispatch/task/dependence/delete', params) // 依赖任务批量删除
export const taskSelectDependence = id => httpGet(base + `dispatch/task/dependence/selectDependence/${id}`) // 已选依赖列表
// 参数管理
export const getParamsList = () => httpGet(base + '/dispatch/task/params/globalParamList')

export const getParamsListByTaskId = id => httpGet(base + `/dispatch/task/params/getParamsListByTaskId/${id}`)
export const getParamsByProp = prop => httpGet(base + `/dispatch/task/params/getParamsByProp/${prop}`)
export const saveParams = params => httpPost(base + '/dispatch/task/params/save', params) // 保存
// 调度周期
export const taskPeriodInfo = id => httpGet(base + `dispatch/task/period/info/${id}`) // 调度周期信息回显接口
export const taskPeriodSaveOrUpdate = params => httpPost(base + 'dispatch/task/period/saveOrUpdate', params) // 周期保存接口
// 调度报警
export const taskAlertInit = () => httpGet(base + 'dispatch/task/alert/init')
export const taskAlertReceiverList = params => httpPost(base + 'dispatch/task/alert/receiverList', params) // 通过username或name查询用户
export const taskAlertSave = params => httpPost(base + 'dispatch/task/alert/save', params) // 保存
export const taskAlertUpdate = params => httpPost(base + 'dispatch/task/alert/update', params) // 更新
export const taskAlertInfo = id => httpGet(base + `dispatch/task/alert/${id}`) // 详情
export const taskAlertDelete = id => httpDelete(base + `dispatch/task/alert/delete/${id}`) // 删除
 // 老调度配置
 export const taskSelectOldDependence = id => httpGet(base + `old/dispatch/task/dependence/selectDependence/${id}`) // 已选老调度依赖列表
 export const oldTaskBaseList = params => httpPost(base + 'old/dispatch/task/dependence/listOnPage', params) // 基础任务分页列表
 export const oldTaskDependenceAdd = params => httpPost(base + 'old/dispatch/task/dependence/insertBatch', params) // 依赖任务批量新增
 export const oldTaskDependenceDelete = params => httpPostFile(base + 'old/dispatch/task/dependence/delete', params) // 依赖任务批量删除
 // 查看日志
 export const taskBatchLog = dolphinInstanceId => httpGet(base + `dispatch/task/instance/logs/${dolphinInstanceId}`) // 查看新调度日志
 export const downloadLog = dolphinInstanceId => httpGet(base + `dispatch/task/instance/log/download/${dolphinInstanceId}`) // 下载新调度日志
//  查询Yarn日志
export const taskBatchYarnLog = dolphinInstanceId => httpGet(base + `dispatch/task/instance/applicationLogs/${dolphinInstanceId}`) // 查看新调度日志

// 依赖快照
export const taskSnapshotNewDepends = params => httpPost(base + 'dispatch/snapshot/newDepends', params) // 任务新调度
export const taskSnapshotOldDepends = params => httpPost(base + 'dispatch/snapshot/oldDepends', params) // 任务老调度
export const mcSyncPage = (params) => httpGet(base + 'dispatch/mc/sync/listOnPage', params) // 初始化列表
export const mcSyncSave = (params) => httpPost(base + 'dispatch/mc/sync/save', params)
export const paramsViewPage = (params) => httpGet(base + 'dispatch/task/params/listOnPage', params)
export const getAllDataSourceList = () => httpGet(base + 'dispatch/account/getAllDataSourceList')
export const getDolphinTaskId = () => httpGet(base + 'dispatch/task/getDolphinTaskId')
