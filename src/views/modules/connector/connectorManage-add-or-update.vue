<template>
    <div>
    <el-dialog  :visible.sync="visible">
        <el-form :model="baseForm"  ref="baseForm">
            <el-form-item  prop="body">
                <el-input v-model="baseForm.body" type="textarea" :rows="20"></el-input>
                <div style="text-align: right;">
                    <el-button type="primary" @click="save" size="small">保存</el-button>
                    <el-button type="default" @click="cancelHandle" size="small">取消</el-button>
                </div>
            </el-form-item>
            <!-- 遍历 attributesList 来映射每个对象的属性 -->
            <el-table :data="baseForm.subTaskList" style="width: 100%">
                <el-table-column prop="id" label="id" width="180"></el-table-column>
                <el-table-column prop="state" label="state">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.state === 'RUNNING'" type="success">
                            {{ scope.row.state }}
                        </el-tag>
                        <el-tag v-else-if="scope.row.state === 'FAILED'" type="danger">{{ scope.row.state }}</el-tag>
                        <el-tag v-else type="warning">{{ scope.row.state }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="worker_id" label="worker_id"></el-table-column>
                <el-table-column prop="trace" label="trace">
                    <template slot-scope="scope">
                        <el-button type="text" @click="showTrace(scope.row.trace)">详情</el-button>
                        <el-button type="text" @click="restart(scope.row.id)">重启</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-form>
<!--        <span slot="footer">-->
<!--            <el-button type="primary" @click="save" size="small">保存</el-button>-->
<!--            <el-button type="default" @click="cancelHandle" size="small">取消</el-button>-->
<!--        </span>-->
    </el-dialog>
    <el-dialog :visible.sync="traceDialogVisible" width="50%">
        <span>Trace Information</span>
        <div style="margin-top: 20px; white-space: pre-wrap;">{{ selectedTrace }}</div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="traceDialogVisible = false">关闭</el-button>
        </span>
    </el-dialog>
    </div>
</template>
<script>
import {get, getHost, save, update, getSubTask, restart} from '@/api/connector/connectorManage'

export default {
    components: {},
    data() {
        return {
            loading: false,
            visible: true,
            dataListLoading: false,
            traceDialogVisible: false,
            selectedTrace: '',
            connectorSource: '',
            baseForm: {
                name: '',
                body: '',
                subTaskList: []
            }
        }
    },
    methods: {
        // 打开抽屉弹窗
        init(name, connectorSource) {
          this.$refs['baseForm'].resetFields()
            this.connectorSource = connectorSource
            console.log('init,name:' + JSON.stringify(name))
            if (name) {
                this.baseForm.name = name
                console.log('getInfo,connectorSource:' + this.connectorSource)
                let params = {
                    'connectorSource': connectorSource,
                    'name': name
                }
                this.getInfo(params)
                this.getSubTask(params)
            }
            this.visible = true
        },
        showTrace(trace) {
            this.selectedTrace = trace
            this.traceDialogVisible = true
        },
        restart(id) {
            console.log('id:' + id)
            console.log('name:' + this.baseForm.name)
            let params = {
                'connectorSource': this.connectorSource,
                'name': this.baseForm.name,
                'taskId': id
            }
            restart(params).then(({data}) => {
                if (data && data.code === 0) {
                    this.$message({
                        message: '成功',
                        type: 'success',
                        duration: 1500,
                        onClose: () => {
                            this.searchData()
                        }
                    })
                } else {
                    this.$message.error(data.msg)
                }
            })
        },
        getTagType(subState) {
            const [left, right] = subState.split('/').map(Number)
            return left === right ? 'success' : 'danger'
        },
        getHost() {
            getHost(1).then(({data}) => {
                if (data.code === 0 && data.data) {
                    this.connectorSource = data.data
                }
            })
        },
        getSubTask(params) {
            getSubTask(params).then(({data}) => {
                if (data && data.code === 0) {
                    this.baseForm.subTaskList = data.data
                } else {
                    this.$message({
                        message: data.message || '数据异常',
                        type: 'error'
                    })
                }
            })
        },
        getInfo(params) {
            get(params).then(({data}) => {
                if (data && data.code === 0) {
                    this.baseForm.body = data.data
                } else {
                    this.$message({
                        message: data.message || '数据异常',
                        type: 'error'
                    })
                }
            })
        },
        save() {
            let params = {
                'connectorSource': this.connectorSource,
                'body': this.baseForm.body
            }
            if (this.baseForm.name) {
                params.name = this.baseForm.name
                update(params).then(({data}) => {
                    if (data && data.code === 0) {
                        this.$message({
                            message: '保存成功',
                            type: 'success',
                            duration: 1500,
                            onClose: () => {
                                this.$emit('refreshDataList')
                                this.$refs['baseForm'].resetFields()
                                this.visible = false
                            }
                        })
                    } else {
                        this.$message.error(data.msg)
                    }
                })
            } else {
                save(params).then(({data}) => {
                    if (data && data.code === 0) {
                        this.$message({
                            message: '保存成功',
                            type: 'success',
                            duration: 1500,
                            onClose: () => {
                                this.$emit('refreshDataList')
                                this.$refs['baseForm'].resetFields()
                                this.visible = false
                            }
                        })
                    } else {
                        this.$message.error(data.msg)
                    }
                })
            }
        },
        // 关闭抽屉弹窗
        drawerClose() {
            this.visible = false
            this.$parent.addOrUpdateVisible = false
        },
        // 关闭
        cancelHandle() {
            this.visible = false
            this.$parent.addOrUpdateVisible = false
        }
    }
}
</script>
<style lang="scss">

.wrap {
    padding: 0 20px 20px;
    margin-top: -12px;
    width: 100%;
    overflow-y: auto;
    position: absolute;
    top: 75px;
    bottom: 55px;
}

.footer {
    position: absolute;
    bottom: 0;
    background: #fff;
    padding: 10px 22px 10px 10px;
    width: 100%;
    height: 55px;
    text-align: right;
    box-shadow: 0 -2px 9px 0 rgba(153, 169, 191, 0.17);
    z-index: 500;
}

.el-drawer__open .el-drawer.rtl {
    width: 80% !important;
}
</style>
