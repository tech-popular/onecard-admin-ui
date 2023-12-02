<template>
    <el-dialog title="同步任务配置" :close-on-click-modal="false" :visible.sync="visible">
        <el-form label-width="100px" :model="dataForm"  ref="dataForm"
                 class="base-form" :disabled="!canUpdate">

            <el-form-item label="空间名"  prop="project">
                <el-input v-model="dataForm.project" placeholder="空间名" style="width:500px"/>
            </el-form-item>

            <el-form-item label="表名" prop="tableNames">
                <el-input v-model="dataForm.tableNames" placeholder="表名" style="width:500px"/>
            </el-form-item>

            <el-form-item label="同步历史数据" prop="history">
                <el-radio v-model="dataForm.history" label="0">否</el-radio>
                <el-radio v-model="dataForm.history" label="1">是</el-radio>
            </el-form-item>

        </el-form>
        <div style="text-align: right">
            <el-button @click="visible = false">关闭</el-button>
            <el-button type="primary"  v-if="canUpdate" @click="submitData()">确定</el-button>
        </div>
    </el-dialog>
</template>
<script>
import { mcSyncSave } from '@/api/dispatch/taskManag'

export default {
    name: 'Mind',
    props: {
        dispatchStatus: Object,
        // 数据
        data: {
            type: Object,
            default () {
                return {}
            }
        },
        height: {
            type: Number,
            default () {
                return 0
            }
        }
    },
    data() {
        return {
            visible: false,
            canUpdate: true,
            dataForm: {
                project: '',
                tableNames: '',
                history: '0'
            }
        }
    },
    methods: {
        init(canUpdate) {
            this.canUpdate = canUpdate
            this.visible = true
            this.dataForm.history = '0'
        },
        drawerClose () { // 关闭抽屉弹窗
            this.visible = false
            this.$parent.taskMcSyncAddVisible = false
        },
        submitData() {
            mcSyncSave(this.dataForm).then(({data}) => {
                if (data && data.code === 0) {
                    this.$message({
                        message: data.msg || '操作成功"',
                        type: 'success',
                        onClose: () => {
                            this.visible = false
                            this.$emit('refreshDataList')
                        }
                    })
                } else {
                    this.$message.error(data.msg)
                }
            })
        }
    }
}
</script>
<style>
.api-manage-drawer .wrap {
    padding: 0 20px 20px;
    margin-top: -12px;
    width: 100%;
    overflow-y: auto;
    position: absolute;
    top: 75px;
    bottom: 55px;
}

.wrap h3 span {
    float: right;
    font-size: 12px;
    font-weight: normal;
}

.wrap h3 span i {
    font-style: normal;
    padding-right: 10px;
    color: #000;
}

.drawer-title {
    padding: 15px;
    background: #333;
    color: #fff;
    font-size: 15px;
    margin: -20px -20px 0 -20px;
    position: relative;
}

.drawer-close {
    position: absolute;
    right: 20px;
}

.codesql {
    font-size: 11pt;
    font-family: Consolas, Menlo, Monaco, Lucida Console, Liberation Mono,
    DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace, serif;
}

.btn-code-continue {
    text-align: right;
}

.work-content-1 {
    border-top: 1px #cccccc dashed;
    padding: 20px 20px 10px 0;
    margin-top: 20px;
}

.footer {
    position: absolute;
    bottom: 0;
    background: #fff;
    padding: 10px 22px 10px 10px;
    width: 90%;
    height: 55px;
    text-align: right;
    box-shadow: 0 -2px 9px 0 rgba(153, 169, 191, .17);
    z-index: 500;
}

.CodeMirror {
    height: 260px
}

.styled-background {
    color: red
}

.work-type-pane {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
}

.CodeMirror-hints.xq-light, .CodeMirror-hints.idea {
    position: absolute;
    z-index: 9999;
    display: block;
}

.inputTag {
    border-radius: 4px;
    width: 600px;
    line-height: 22px;
    border: 1px solid #dcdfe6
}
</style>
<style lang="scss" scoped>
#mind{
    width: 100%;
    height: 100%;
}
</style>
