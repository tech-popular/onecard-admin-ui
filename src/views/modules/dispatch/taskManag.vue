<template>
    <div>
        <el-form :inline="true" :model="dataForm" ref="dataForm">
            <!--            <el-form-item label="任务ID">-->
            <!--                <el-input v-model.trim="dataForm.id" placeholder="任务ID" clearable/>-->
            <!--            </el-form-item>-->
            <el-form-item label="任务名称" prop="taskName">
                <el-input v-model.trim="dataForm.taskName" placeholder="任务名称" clearable/>
            </el-form-item>
<!--            <el-form-item label="任务类型" prop="type">-->
<!--                <el-select v-model="dataForm.type" placeholder="任务类型" filterable clearable>-->
<!--                    <el-option :label="item.label" :value="item.value" v-for="(item, index) in typeList"-->
<!--                               :key="index"></el-option>-->
<!--                </el-select>-->
<!--            </el-form-item>-->
            <el-form-item label="Tag标签" prop="tag">
                <el-select v-model="dataForm.tag" placeholder="Tag标签" filterable clearable>
                    <el-option :label="item" :value="item" v-for="(item, index) in tagDownList"
                               :key="index"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="负责人" prop="createUser">
                <el-input v-model.trim="dataForm.createUser" placeholder="负责人" clearable/>
            </el-form-item>
            <el-form-item label="任务状态" prop="taskDisable">
                <el-select v-model="dataForm.taskDisable" placeholder="任务状态" clearable>
                    <el-option :label="item.label" :value="item.value" v-for="(item, index) in statusList"
                               :key="index"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="任务执行状态" prop="executeStatus">
                <el-select v-model="dataForm.executeStatus" placeholder="任务执行状态" clearable>
                    <el-option :label="item.desc" :value="item.desc" v-for="(item, index) in allStatusList"
                               :key="index"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleSearch()">查询</el-button>
                <!--                <el-button @click="resetHandle()">重置</el-button>-->
                <el-button type="primary" @click="computAddOrUpdateHandle()">新增任务</el-button>
                <el-button type="warning" @click="paramsView()">可用参数</el-button>
                <!--                <el-button type="primary" @click="scriptAddOrUpdateHandle()">新增脚本任务</el-button>-->
            </el-form-item>
        </el-form>
        <el-table :data="dataList" border
                  v-loading="dataListLoading"
                  style="width: 100%;">
            <!--            <el-table-column prop="id" fixed header-align="center" align="center" label="任务ID"/>-->
<!--            <el-table-column :show-overflow-tooltip="true" prop="taskName" fixed header-align="center" :width="170" align="center" label="任务名称">-->
<!--                <template slot-scope="scope">-->
<!--&lt;!&ndash;                    <el-tooltip class="item" :content="scope.row.taskName" placement="top-start"&ndash;&gt;-->
<!--&lt;!&ndash;                    >&ndash;&gt;-->
<!--                        <a @click="gotoTaskBatchHandle(scope.row.taskName)">{{-->
<!--                            scope.row.taskName-->
<!--                            }}</a>-->
<!--&lt;!&ndash;                    </el-tooltip>&ndash;&gt;-->
<!--                </template>-->
<!--            </el-table-column>-->
<!--            <el-table-column :width="50" fixed>-->
<!--                <template slot-scope="scope">-->
<!--                  <el-button  size="mini" :data-clipboard-text="scope.row.taskName"  plain class="custom-button" icon="el-icon-copy-document" @click="copyToClipboard()"></el-button>-->
<!--                </template>-->
<!--            </el-table-column>-->
            <el-table-column :show-overflow-tooltip="true" prop="taskName" header-align="center" align="center" :width="200" label="任务名称" fixed>
                <template slot-scope="scope">
                    <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                        <div style="flex-grow: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                            <a @click="gotoTaskBatchHandle(scope.row.taskName)">{{ scope.row.taskName }}</a>
                        </div>
                        <el-button size="mini" :data-clipboard-text="scope.row.taskName" plain class="no-border" icon="el-icon-copy-document" @click.stop="copyToClipboard(scope.row.taskName)"></el-button>
                    </div>
                </template>
            </el-table-column>


<!--            <el-table-column prop="dolphinProcessName" header-align="center" :width=170 align="center"-->
<!--                             label="所属工作流">-->
<!--                <template slot-scope="scope">-->
<!--                    <el-tooltip class="item" effect="dark" :content="scope.row.dolphinProcessName"-->
<!--                                placement="top-start">-->
<!--                        <p>{{-->
<!--                            scope.row.dolphinProcessName-->
<!--                            }}</p>-->
<!--                    </el-tooltip>-->
<!--                </template>-->
<!--            </el-table-column>-->
<!--            <el-table-column :show-overflow-tooltip="true" prop="taskType" header-align="center" align="center" label="任务类型">-->
<!--                <template slot-scope="scope">-->
<!--                        <el-tag type="warning">{{ scope.row.taskType }}</el-tag>-->
<!--                </template>-->
<!--            </el-table-column>-->
            <el-table-column :show-overflow-tooltip="true" prop="tag" header-align="center" align="center" :width="140" label="Tag标记" sortable>
                <template slot-scope="scope">
                  <div  v-if="scope.row.tag !== null && scope.row.tag !== ''">
                      <span v-for="tag in scope.row.tag.split(',')" :key="tag">
                        <el-tag type="primary">{{ tag }}</el-tag>
                      </span>
                  </div>
                </template>
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="executeStatus" header-align="center" align="center" label="执行状态">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.executeStatus === '执行失败'" type="danger">
                        {{ scope.row.executeStatus }}
                    </el-tag>
                    <el-tag v-else-if="scope.row.executeStatus === '执行成功'" type="success">{{ scope.row.executeStatus }}</el-tag>
                    <el-tag v-else type="primary">{{ scope.row.executeStatus }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="nextExecuteTime" header-align="center" align="center" :width="180" sortable
                             label="下次执行时间"/>
            <el-table-column :show-overflow-tooltip="true" prop="createTime" header-align="center" align="center" :width="180" sortable
                             label="创建时间"/>
            <el-table-column :show-overflow-tooltip="true" prop="updateTime" header-align="center" align="center" :width="180" sortable
                             label="修改时间"/>
            <el-table-column :show-overflow-tooltip="true" prop="taskDisable" header-align="center" align="center" label="任务状态" >
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.taskDisable === 1" type="success" @click="changeTaskDisable(scope.row)">
                        上线
                    </el-tag>
                    <el-tag v-else type="danger" @click="changeTaskDisable(scope.row)">下线</el-tag>
                </template>
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="dispatchStatus" header-align="center" align="center" label="定时状态">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.dispatchStatus === 1" type="success"
                            @click="changeDispatchStatus(scope.row)">上线
                    </el-tag>
                    <el-tag v-else-if="scope.row.dispatchStatus === 0" type="danger"
                            @click="changeDispatchStatus(scope.row)">下线
                    </el-tag>
                    <el-tag v-else-if="scope.row.dispatchStatus === -1" type="danger">-</el-tag>
                </template>
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="createUser" header-align="center" align="center" label="负责人"/>
            <el-table-column :show-overflow-tooltip="true" prop="topDependence" header-align="center" align="center" label="上游依赖" />
            <el-table-column :show-overflow-tooltip="true" prop="downDependence" header-align="center" align="center" label="下游依赖" />
            <el-table-column  header-align="center" align="center" width="300" fixed="right" label="操作" class="but">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" :content="'编辑任务'" placement="top">
                        <el-button type="primary" size="mini" circle :icon="'el-icon-edit'"
                                   @click="computAddOrUpdateHandle(scope.row)"></el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="依赖配置" placement="top">
                        <el-button type="warning" size="mini" icon="el-icon-sort" circle
                                   @click="addOrUpdateDispatchConfig(scope.row)"></el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="依赖快照" placement="top">
                        <el-button type="primary" size="mini" icon="el-icon-camera-solid" circle
                                   @click="snapshotHandle(scope.row)"></el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="执行任务" placement="top">
                        <el-button :disabled="scope.row.executeStatus === '提交成功' || scope.row.executeStatus === '运行中'" type="success" size="mini" icon="el-icon-video-play" circle
                                   @click="taskExecuteHandle(scope.row)"></el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="调度配置" placement="top">
                        <el-button type="primary" size="mini" icon="el-icon-alarm-clock" circle
                                   @click="periodConfigHandle(scope.row)"></el-button>
                    </el-tooltip>
<!--                    <el-tooltip class="item" effect="dark" content="参数配置" placement="top">
                        <el-button type="warning" size="mini" icon="el-icon-connection" circle
                                   @click="paramsHandle(scope.row)"></el-button>
                    </el-tooltip>-->
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
                @size-change="sizeChangeHandle"
                @current-change="currentChangeHandle"
                :current-page="pageNum"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="pageSize"
                :total="totalPage"
                layout="total, sizes, prev, pager, next, jumper"/>
        <!-- 弹窗, 新增 / 修改同步任务 -->
        <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="init"/>
        <!-- 弹窗, 新增 / 修改Trino任务 -->
        <comput-add-or-update
                v-if="computAddOrUpdateVisible"
                ref="computAddOrUpdate"
                @refreshDataList="init"
        />
        <!-- 弹窗, 新增 / 修改DBT任务 -->
        <AddDBTPop
                v-if="addDBTVisible"
                ref="addDBTRef"
                @refreshDataList="init"
        />
        <!-- 弹窗, 新增 / 修改脚本任务 -->
        <script-add-or-update
                v-if="scriptAddOrUpdateVisible"
                ref="scriptAddOrUpdate"
                @refreshDataList="init"
        />
        <!--依赖配置-->
        <dispatch-config-add-or-update v-if="dispatchConfigAddOrUpdateVisible" ref="dispatchConfigAddOrUpdate"
                                       @refreshDataList="init"/>
        <!-- 授权 -->
        <assign-permission v-if="assignPermissionVisible" :submitDataApi="submitDataApi"
                           :submitDataApis="submitDataApis" ref="assignPermission"
                           @refreshDataList="init"></assign-permission>
        <!-- 依赖快照 -->
        <taskManag-snap-shot v-if="taskManagSnapShotVisible" ref="taskManagSnapShot"
                             @refreshDataList="init"></taskManag-snap-shot>
        <!-- 调度快照 -->
        <taskManagPeriod v-if="taskManagPeriodVisible" ref="taskManagPeriod" @refreshDataList="init"></taskManagPeriod>
        <!-- 参数管理 -->
        <taskManagParams v-if="taskManagParamsVisible" ref="taskManagParams" @refreshDataList="init"></taskManagParams>
        <paramsView v-if="paramsViewVisible" ref="paramsView" @refreshDataList="init"></paramsView>
    </div>
</template>

<script>
import {
    list,
    taskExecute,
    tagAll,
    changeTaskDisable,
    changeDispatchStatus,
    taskBatchStatus
} from '@/api/dispatch/taskManag'
import AddOrUpdate from './taskManag-add-or-update'
import ComputAddOrUpdate from './compute-add-or-update'
import AddDBTPop from './add-DBT-pop'
import ScriptAddOrUpdate from './script-add-or-update'
import dispatchConfigAddOrUpdate from './dispatchConfig-add-or-update'
import AssignPermission from '../../components/permission/assign-permission'
import taskManagSnapShot from './taskManag-snap-shot'
import taskManagPeriod from './dispatch-config-period'
import taskManagParams from './taskManag-params.vue'
import paramsView from './params-view.vue'
export default {
    data() {
        return {
            visible: false,
            pageNum: 1, // 当前页
            pageSize: 10, // 默认每页10条
            totalPage: 0,
            dataListLoading: false,
            addOrUpdateVisible: false,
            dispatchConfigAddOrUpdateVisible: false,
            computAddOrUpdateVisible: false,
            scriptAddOrUpdateVisible: false,
            assignPermissionVisible: false,
            taskManagSnapShotVisible: false,
            taskManagPeriodVisible: false,
            taskManagParamsVisible: false,
            paramsViewVisible: false,
            addDBTVisible: false,
            tagDownList: [],
            allStatusList: [],
            localDolphinProcessId: '',
            dataForm: {
                id: '',
                taskName: '',
                type: '',
                tag: '',
                createUser: '',
                taskDisable: '',
                executeStatus: ''
            },
            typeList: [{
                label: '全部',
                value: -1
            }, {
                label: 'Trino任务',
                value: 'Trino'
            }, {
                label: 'DBT任务',
                value: 'DBT'
            }, {
                label: 'python任务',
                value: 'PYTHON'
            }, {
                label: 'shell任务',
                value: 'SHELL'
            }],
            statusList: [{
                label: '上线',
                value: 1
            }, {
                label: '下线',
                value: 0
            }],
            dataList: []
        }
    },
    components: {
        AddDBTPop,
        AddOrUpdate,
        ComputAddOrUpdate,
        ScriptAddOrUpdate,
        dispatchConfigAddOrUpdate,
        AssignPermission,
        taskManagSnapShot,
        taskManagPeriod,
        taskManagParams,
        paramsView
    },
    mounted() {
        this.init()
        this.getAllStatus()
    },
    methods: {
        init() {
            const dataBody = {
                'pageNum': this.pageNum,
                'pageSize': this.pageSize,
                'id': this.dataForm.id,
                'name': this.dataForm.taskName,
                'tag': this.dataForm.tag,
                'type': this.dataForm.type === -1 ? '' : this.dataForm.type,
                'user': this.dataForm.createUser,
                'status': this.dataForm.taskDisable === -1 ? '' : this.dataForm.taskDisable,
                'executeStatus': this.dataForm.executeStatus,
                'tenantId': sessionStorage.getItem('tenantId')
            }
            this.getList(dataBody)
            this.buildTagDownList()
        },
        // 查询
        handleSearch() {
            this.pageNum = 1
            this.init()
        },
        getAllStatus () {
            taskBatchStatus().then(({data}) => {
                this.allStatusList = data.data
            })
        },
        changeTaskDisable(data) {
            this.$confirm(data.taskDisable === 1 ? '是否确认要下线' + data.taskName : '是否确认要上线' + data.taskName, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                changeTaskDisable(Number(data.id)).then(({data}) => {
                    if (data && data.code === 0) {
                        this.$message.success(data.msg || '执行成功')
                    } else {
                        this.$message.error(data.msg || '执行失败')
                    }
                    this.init()
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消'
                })
            })
        },
        changeDispatchStatus(data) {
            this.$confirm(data.dispatchStatus === 1 ? '是否确认要下线' + data.taskName + '的调度周期' : '是否确认要上线' + data.taskName + '的调度周期', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                changeDispatchStatus(Number(data.id)).then(({data}) => {
                    if (data && data.code === 0) {
                        this.$message.success(data.msg || '执行成功')
                    } else {
                        this.$message.error(data.msg || '执行失败')
                    }
                    this.init()
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消'
                })
            })
        },
        // 调度配置
        addOrUpdateDispatchConfig(data) {
            // if (data.taskDisable === 1) {
            //     this.$message({
            //         message: '请调整任务状态为下线时，配置依赖！',
            //         type: 'warning'
            //     })
            // } else {
                console.log('addOrUpdateDispatchConfig->id=', data.id)
                this.dispatchConfigAddOrUpdateVisible = true
                this.$nextTick(() => {
                    let canUpdate = true
                    if (!this.isAdmin) {
                        // canUpdate = id ? id.authOtherList.includes(this.userid) || id.authOwner === this.userid : true
                        canUpdate = true
                    }
                    this.$refs.dispatchConfigAddOrUpdate.init(data.id, canUpdate)
                })
            // }
        },
        // 执行任务
        taskExecuteHandle(data) {
            if (data.taskDisable === 0) {
                this.$message({
                    message: '请调整任务状态为上线时，执行任务！',
                    type: 'warning'
                })
            } else {
                this.$confirm('是否确认执行' + data.taskName, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    taskExecute(data.id).then(({data}) => {
                        if (data && data.code === 0) {
                            this.$message.success(data.msg || '执行成功')
                        } else {
                            this.$message.error(data.msg || '执行失败')
                        }
                        this.init()
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    })
                })
            }
        },
        // 新增 / 修改任务
        computAddOrUpdateHandle(data) {
            let canUpdate = true
            // if (data && data.taskDisable && data.taskDisable === 1) {
            //     canUpdate = false
            // }
            this.computAddOrUpdateVisible = true
            this.$nextTick(() => {
                // let canUpdate = true
                // if (!this.isAdmin) {
                //     // canUpdate = id ? id.authOtherList.includes(this.userid) || id.authOwner === this.userid : true
                //     canUpdate = true
                // }
                console.log('computAddOrUpdateHandle->canUpdate:' + canUpdate)
                this.$refs.computAddOrUpdate.init(data, canUpdate)
            })
        },
        // 新增 / 修改脚本任务
        scriptAddOrUpdateHandle(id) {
            this.scriptAddOrUpdateVisible = true
            this.$nextTick(() => {
                let canUpdate = true
                if (!this.isAdmin) {
                    // canUpdate = id ? id.authOtherList.includes(this.userid) || id.authOwner === this.userid : true
                    canUpdate = true
                }
                this.$refs.scriptAddOrUpdate.init(id, canUpdate)
            })
        },
        // 新增 / 修改DBT任务
        addDBTHandle(id) {
            this.addDBTVisible = true
            this.$nextTick(() => {
                let canUpdate = true
                if (!this.isAdmin) {
                    // canUpdate = id ? id.authOtherList.includes(this.userid) || id.authOwner === this.userid : true
                    canUpdate = true
                }
                this.$refs.addDBTRef.init(id, canUpdate)
            })
        },
        buildTagDownList() {
            tagAll().then(({data}) => {
                this.tagDownList = data.data
            })
        },
        // 点击名称跳转到批次
        gotoTaskBatchHandle(params) {
            console.log(params)
            this.$router.push({name: 'dispatch-taskBatch', query: {name: params}})
        },
        // 点击名称跳转到流程图
        gotoTaskProcessManag(params) {
            console.log(params)
            this.$router.push({name: 'dispatch-processManag', query: {name: params.row.id}})
        },
        snapshotHandle(data) {
            this.taskManagSnapShotVisible = true
            this.$nextTick(() => {
                console.log(data)
                this.$refs.taskManagSnapShot.init(data)
            })
            // window.open(url, '_blank')
        },
        periodConfigHandle(data) {
            // if (data.taskDisable === 0) {
            //     this.$message({
            //         message: '请调整任务状态为上线时，进行调度配置！',
            //         type: 'warning'
            //     })
            // } else {
                let canUpdate = true
                // if (data && data.dispatchStatus && data.dispatchStatus === 1) {
                //     canUpdate = false
                // }
                console.log('periodConfigHandle->data.dispatchStatus' + data.dispatchStatus + ',canUpdate->' + canUpdate)
                this.taskManagPeriodVisible = true
                this.$nextTick(() => {
                    this.localDolphinProcessId = data.dolphinProcessId
                    console.log(data.dolphinProcessId)
                    this.$refs.taskManagPeriod.init(this.localDolphinProcessId, canUpdate)
                })
            // }
        },
        // 全局参数
        paramsView() {
            this.paramsViewVisible = true
            this.$nextTick(() => {
                this.$refs.paramsView.init()
            })
        },
        // 参数配置
        paramsHandle(data) {
            this.taskManagParamsVisible = true
            this.$nextTick(() => {
                console.log(data.id)
                this.$refs.taskManagParams.init(data.id)
            })
        },
        // 每页数
        sizeChangeHandle(val) {
            this.pageSize = val
            this.init()
        },
        // 当前页
        currentChangeHandle(val) {
            this.pageNum = val
            this.init()
        },
        // 多选
        handleSelectionChange(val) {
            this.dataListSelections = val
        },
        // 列表接口
        getList(dataBody) {
            this.dataListLoading = true
            list(dataBody).then(({
                                     data
                                 }) => {
                if (data && data.code === 0) {
                    this.dataListLoading = false
                    this.dataList = data.data.records
                    this.totalPage = data.data.total
                } else {
                    this.dataList = []
                    this.totalPage = 0
                    this.$message.error(data.msg)
                }
            })
        },
        // 数据授权
        taskPermission(row) {
            // 打开权限分配弹框
            // 根据登陆用户和数据创建人判断是否是同一用户决定权限按钮是否显示
            this.assignPermissionVisible = true
            this.$nextTick(() => {
                this.$refs.assignPermission.init(row)
            })
        },
        // 批量授权
        multiTaskPermission() {
            this.assignPermissionVisible = true
            let ids = this.dataListSelections.map(item => {
                return item.id
            })
            this.$nextTick(() => {
                this.$refs.assignPermission.init(ids, true)
            })
        },
        copyToClipboard(textToCopy) {
            const textArea = document.createElement('textarea')
            textArea.value = textToCopy
            document.body.appendChild(textArea)
            textArea.select()
            const successful = document.execCommand('copy')
            textArea.remove()
            if (successful) {
                this.$message.success('任务名称已复制到剪切板')
            } else {
                this.$message.error('复制失败，请手动复制')
            }
        }
    }
}
</script>
<style scoped>
.el-button + .el-button {
    margin: 0 !important;
}
.no-border {
    border: none !important; /* 移除边框 */
    background-color: transparent !important; /* 设置背景透明 */
}
</style>