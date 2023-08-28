<template>
    <div>
        <el-form :inline="true" :model="dataForm" ref="dataForm">
            <el-form-item label="任务ID">
                <el-input v-model.trim="dataForm.id" placeholder="任务ID" clearable/>
            </el-form-item>
            <el-form-item label="任务名称" prop="taskName">
                <el-input v-model.trim="dataForm.taskName" placeholder="任务名称" clearable/>
            </el-form-item>
            <el-form-item label="任务类型" prop="type">
                <el-select v-model="dataForm.type" placeholder="任务类型" filterable>
                    <el-option :label="item.label" :value="item.value" v-for="(item, index) in typeList"
                               :key="index"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="Tag标签" prop="tag">
                <el-select v-model="dataForm.tag" placeholder="Tag标签" filterable>
                    <el-option :label="item" :value="item" v-for="(item, index) in tagDownList"
                               :key="index"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="创建人" prop="createUser">
                <el-input v-model.trim="dataForm.createUser" placeholder="创建人" clearable/>
            </el-form-item>
            <el-form-item label="任务类型" prop="taskDisable">
                <el-select v-model="dataForm.taskDisable" placeholder="任务类型" filterable>
                    <el-option :label="item.label" :value="item.value" v-for="(item, index) in statusList"
                               :key="index"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleSearch()">查询</el-button>
                <el-button @click="resetHandle()">重置</el-button>
                <el-button type="primary" @click="computAddOrUpdateHandle()">新增SQL任务</el-button>
                <el-button type="primary" @click="scriptAddOrUpdateHandle()">新增脚本任务</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="dataList" border
                  v-loading="dataListLoading"
                  style="width: 100%;">
            <el-table-column
                    type="selection"
                    header-align="center"
                    align="center"
                    width="50">
            </el-table-column>
            <el-table-column prop="id" header-align="center" align="center" label="任务ID"/>
            <el-table-column prop="taskName" header-align="center" align="center" label="任务名称"/>
            <el-table-column prop="dolphinProcessName" header-align="center" align="center" label="所属工作流"/>
            <el-table-column prop="taskType" header-align="center" align="center" label="任务类型"/>
            <el-table-column prop="tag" header-align="center" align="center" label="Tag标记"/>
            <el-table-column prop="createTime" header-align="center" align="center" label="任务创建时间"/>
            <el-table-column prop="createUser" header-align="center" align="center" label="创建人"/>
            <el-table-column prop="taskDisable" header-align="center" align="center" label="任务状态"/>
            <el-table-column prop="dispatchStatus" header-align="center" align="center" label="调度起停状态"/>
            <el-table-column prop="dependence" header-align="center" align="center" label="有无依赖"/>
            <el-table-column header-align="center" align="center" width="200" label="操作" class="but">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" :content="'编辑任务'" placement="top">
                        <el-button type="primary" size="mini" circle :icon="'el-icon-edit'"
                                   @click="addOrUpdateHandle(scope.row)"></el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="依赖配置" placement="top">
                        <el-button type="success" size="mini" icon="el-icon-sort" circle
                                   @click="addOrUpdateDispatchConfig(scope.row.id,scope.row)"></el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="执行任务" placement="top">
                        <el-button type="warning" size="mini" icon="el-icon-view" circle
                                   @click="taskExecuteHandle(scope.row)"></el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="调度管理" placement="top">
                        <el-button type="success" size="mini" icon="el-icon-alarm-clock" circle
                                   @click="snapshotHandle(scope.row)"></el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="参数配置" placement="top">
                        <el-button type="warning" size="mini" icon="el-icon-connection" circle
                                   @click="paramsHandle(scope.row)"></el-button>
                    </el-tooltip>
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
        <!--调度配置-->
        <dispatch-config-add-or-update v-if="dispatchConfigAddOrUpdateVisible" ref="dispatchConfigAddOrUpdate"
                                       @refreshDataList="init"/>
        <!-- 授权 -->
        <assign-permission v-if="assignPermissionVisible" :submitDataApi="submitDataApi"
                           :submitDataApis="submitDataApis" ref="assignPermission"
                           @refreshDataList="init"></assign-permission>
        <!-- 依赖快照 -->
        <taskManag-snap-shot v-if="taskManagSnapShotVisible" ref="taskManagSnapShot"></taskManag-snap-shot>
        <!-- 参数管理 -->
        <taskManagParams v-if="taskManagParamsVisible" ref="taskManagParams" @refreshDataList="init"></taskManagParams>
    </div>
</template>

<script>
import {
    list,
    taskExecute,
    tagAll
} from '@/api/dispatch/taskManag'
import AddOrUpdate from './taskManag-add-or-update'
import ComputAddOrUpdate from './compute-add-or-update'
import AddDBTPop from './add-DBT-pop'
import ScriptAddOrUpdate from './script-add-or-update'
import dispatchConfigAddOrUpdate from './dispatchConfig-add-or-update'
import AssignPermission from '../../components/permission/assign-permission'
import taskManagSnapShot from './taskManag-snap-shot'
import taskManagParams from './taskManag-params.vue'

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
            taskManagParamsVisible: false,
            addDBTVisible: false,
            tagDownList: [],
            dataForm: {
                id: '',
                taskName: '',
                type: '',
                tag: '',
                createUser: '',
                taskDisable: ''
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
                label: '全部',
                value: -1
            }, {
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
        taskManagParams
    },
    mounted() {
        this.init()
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
        // 重置
        resetHandle() {
            this.pageNum = 1
            this.searchData = {
                id: '',
                name: '',
                type: -1,
                user: '',
                status: -1
            }
            this.init()
        },
        // 调度配置
        addOrUpdateDispatchConfig(id) {
            console.log('addOrUpdateDispatchConfig->id=', id)
            this.dispatchConfigAddOrUpdateVisible = true
            this.$nextTick(() => {
                let canUpdate = true
                if (!this.isAdmin) {
                    // canUpdate = id ? id.authOtherList.includes(this.userid) || id.authOwner === this.userid : true
                    canUpdate = true
                }
                this.$refs.dispatchConfigAddOrUpdate.init(id, canUpdate)
            })
        },
        // 执行任务
        taskExecuteHandle(id) {
            taskExecute(id.id).then(({data}) => {
                if (data && data.code === 0) {
                    this.$message.success(data.msg || '执行成功')
                } else {
                    this.$message.error(data.msg || '执行失败')
                }
            })
        },
        // 新增 / 修改同步任务
        addOrUpdateHandle(id) {
            if (id.taskType === 'KYUUBI' || id.taskType === 'SPARKSQL' || id.taskType === 'TRINO') {
                this.computAddOrUpdateHandle(id)
            } else if (id.taskType === 'DBT') {
                this.addDBTHandle(id)
            } else {
                this.scriptAddOrUpdateHandle(id)
            }
        },
        // 新增 / 修改Trino任务
        computAddOrUpdateHandle(id) {
            this.computAddOrUpdateVisible = true
            this.$nextTick(() => {
                let canUpdate = true
                if (!this.isAdmin) {
                    // canUpdate = id ? id.authOtherList.includes(this.userid) || id.authOwner === this.userid : true
                    canUpdate = true
                }
                this.$refs.computAddOrUpdate.init(id, canUpdate)
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
            this.$router.push({name: 'dispatch-taskBatch', query: {name: params.row.taskName}})
        },
        // 点击名称跳转到流程图
        gotoTaskProcessManag(params) {
            console.log(params)
            this.$router.push({name: 'dispatch-processManag', query: {name: params.row.id}})
        },
        snapshotHandle(data) {
            this.taskManagSnapShotVisible = true
            this.$nextTick(() => {
                console.log(data.dolphinProcessId)
                this.$refs.taskManagSnapShot.init(data.dolphinProcessId)
            })
            // window.open(url, '_blank')
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
        }
    }
}
</script>
<style scoped>
.el-button + .el-button {
    margin: 0 !important;
}

.toZhi {
    line-height: 36px;
    margin-right: 8px;
}

.goback {
    position: absolute;
    right: 50px;
    top: 20px;
    font-size: 18px;
    cursor: pointer;
}
</style>