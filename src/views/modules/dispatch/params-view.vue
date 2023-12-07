<template>
    <el-dialog title="参数展示" :close-on-click-modal="false" :visible.sync="visible">
        <el-form :model="dataForm"  ref="dataForm" class="base-form" inline>
            <el-form-item label="参数名" prop="paramName">
                <el-input v-model.trim="dataForm.paramName" placeholder="参数名" style="width: 200px" clearable/>
            </el-form-item>
            <el-form-item label="参数值" prop="paramValue">
                <el-input v-model.trim="dataForm.paramValue" placeholder="参数值" style="width: 200px" clearable/>
            </el-form-item>
<!--            <el-form-item label="所属系统" prop="projectCode">
                <el-select v-model="dataForm.projectId" placeholder="所属系统" filterable>
                    <el-option :label="item.projectSystemName" :value="item.id" v-for="(item, index) in allSystemList" :key="index"></el-option>
                </el-select>
            </el-form-item>-->
            <el-form-item>
                <el-button type="primary" @click="handleSearch()">查询</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="dataList" border
                  v-loading="dataListLoading"
                  style="width: 100%;">
            <el-table-column :show-overflow-tooltip="true" prop="paramName" header-align="center" align="center" label="参数名"/>
            <el-table-column :show-overflow-tooltip="true" prop="paramValue" header-align="center" align="center" label="参数值"/>
<!--            <el-table-column :show-overflow-tooltip="true" prop="projectCode" header-align="center" align="center" label="项目名"/>-->
        </el-table>
        <el-pagination
            @size-change="sizeChangeHandle"
            @current-change="currentChangeHandle"
            :current-page="pageNum"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageSize"
            :total="totalPage"
            layout="total, sizes, prev, pager, next, jumper"/>
    </el-dialog>
</template>

<script>
import {
    paramsViewPage, projectAll
} from '@/api/dispatch/taskManag'

export default {
    data() {
        return {
            visible: false,
            pageNum: 1, // 当前页
            pageSize: 10, // 默认每页10条
            totalPage: 0,
            dataListLoading: false,
            taskMcSyncAddVisible: false,
            allSystemList: [],
            dataForm: {
                paramName: '',
                paramValue: '',
                projectCode: ''
            },
            dataList: []
        }
    },
    mounted() {
        this.init()
    },
    methods: {
        init() {
            this.visible = true
            const dataBody = {
                'pageNum': this.pageNum,
                'pageSize': this.pageSize,
                'paramName': this.dataForm.paramName,
                'paramValue': this.dataForm.paramValue,
                'projectCode': this.dataForm.projectCode
            }
            this.getAllSystem()
            this.getList(dataBody)
        },
        // 查询
        handleSearch() {
            this.pageNum = 1
            this.init()
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
        getAllSystem () {
            projectAll().then(({data}) => {
                this.allSystemList = data.data
            })
        },
        // 列表接口
        getList(dataBody) {
            this.dataListLoading = true
            paramsViewPage(dataBody).then(({
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