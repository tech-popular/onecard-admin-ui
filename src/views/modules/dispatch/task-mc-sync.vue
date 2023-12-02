<template>
    <div>
        <el-form :inline="true" :model="dataForm" ref="dataForm">
            <el-form-item label="表名" prop="tableName">
                <el-input v-model.trim="dataForm.tableName" placeholder="表名" clearable/>
            </el-form-item>
            <el-form-item label="创建人" prop="createUser">
                <el-input v-model.trim="dataForm.createUser" placeholder="创建人" clearable/>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleSearch()">查询</el-button>
                <el-button type="primary" @click="taskMcSyncAddHandle()">新增任务</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="dataList" border
                  v-loading="dataListLoading"
                  style="width: 100%;">
            <el-table-column prop="id" fixed header-align="center" align="center" label="id"/>
            <el-table-column :show-overflow-tooltip="true" prop="project" header-align="center" align="center" label="空间名"/>
            <el-table-column :show-overflow-tooltip="true" prop="tableName" header-align="center" align="center" label="表名"/>
            <el-table-column :show-overflow-tooltip="true" prop="history" header-align="center" align="center" label="是否同步历史数据">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.history === 1" type="success">
                        是
                    </el-tag>
                    <el-tag v-else type="warning">否</el-tag>
                </template>
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="result" header-align="center" align="center" label="执行结果"/>
            <el-table-column :show-overflow-tooltip="true" prop="createTime" header-align="center" align="center" label="开始时间"/>
            <el-table-column :show-overflow-tooltip="true" prop="completeTime" header-align="center" align="center" label="完成时间"/>
        </el-table>
        <el-pagination
                @size-change="sizeChangeHandle"
                @current-change="currentChangeHandle"
                :current-page="pageNum"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="pageSize"
                :total="totalPage"
                layout="total, sizes, prev, pager, next, jumper"/>
        <task-mc-sync-add
                v-if="taskMcSyncAddVisible"
                ref="taskMcSyncAdd"
                @refreshDataList="init"
        />
    </div>
</template>

<script>
import {
    mcSyncPage
} from '@/api/dispatch/taskManag'
import taskMcSyncAdd from './task-mc-sync-add'

export default {
    data() {
        return {
            visible: false,
            pageNum: 1, // 当前页
            pageSize: 10, // 默认每页10条
            totalPage: 0,
            dataListLoading: false,
            taskMcSyncAddVisible: false,
            dataForm: {
                tableName: '',
                createUser: ''
            },
            dataList: []
        }
    },
    components: {
        taskMcSyncAdd
    },
    mounted() {
        this.init()
    },
    methods: {
        init() {
            const dataBody = {
                'pageNum': this.pageNum,
                'pageSize': this.pageSize,
                'tableName': this.dataForm.tableName,
                'createUser': this.dataForm.createUser
            }
            this.getList(dataBody)
        },
        // 查询
        handleSearch() {
            this.pageNum = 1
            this.init()
        },
        // 新增 / 修改任务
        taskMcSyncAddHandle() {
            let canUpdate = true
            this.taskMcSyncAddVisible = true
            this.$nextTick(() => {
                console.log('taskMcSyncAddHandle->canUpdate:' + canUpdate)
                this.$refs.taskMcSyncAdd.init(canUpdate)
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
            mcSyncPage(dataBody).then(({
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
.custom-button {
    border: none !important;
}
</style>