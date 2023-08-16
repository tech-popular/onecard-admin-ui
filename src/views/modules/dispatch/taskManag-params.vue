<template>
    <el-dialog title="参数配置" :close-on-click-modal="false" :visible.sync="visible">
        <el-form :model="dataForm" ref="dataForm" label-width="150px">
            <el-form-item v-for="(dispatchTaskParams, index) in dataForm.dispatchTaskParamsList"
                          :label="'参数' + index" :key="dispatchTaskParams.key">
                <el-row :gutter="24">
                    <el-col :span="7">
                        <el-select v-model="dispatchTaskParams.prop" placeholder="参数名"
                                   @change="changeParamsKey(index)"
                                   filterable allow-create>
                            <el-option :label="item.prop" :value="item.prop" v-for="(item, index) in paramsList"
                                       :key="index"></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="9">
                        <el-input v-model="dispatchTaskParams.value"></el-input>
                    </el-col>
                    <el-col :span="4">
                        <el-button @click.prevent="removeDomain(dispatchTaskParams)">删除</el-button>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item>
                <el-button @click="addDomain">新增参数</el-button>
                <el-button type="primary" @click="dataFormSubmit()">提交</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>
<script>
import {
    getParamsList,
    getParamsByProp,
    getParamsListByTaskId,
    saveParams
} from '@/api/dispatch/taskManag'

export default {
    data() {
        return {
            visible: false,
            dataForm: {
                taskId: '',
                dispatchTaskParamsList: [{
                    prop: '',
                    value: ''
                }
                ]
            },
            paramsList: []
        }
    },
    mounted() {
        this.init()
    },
    methods: {
        init(id) {
            this.dataForm.taskId = id
            console.log('this.taskId:' + id)
            this.visible = true
            this.selectParamsList()
            this.$nextTick(() => {
                if (id) {
                    getParamsListByTaskId(id).then(({data}) => {
                        this.dataForm.dispatchTaskParamsList = data.data
                    })
                }
            })
        },
        selectParamsList() {
            getParamsList().then(({data}) => {
                this.paramsList = data.data
            })
        },
        changeParamsKey(index) {
            getParamsByProp(this.dataForm.dispatchTaskParamsList[index].prop).then(({data}) => {
                this.dataForm.dispatchTaskParamsList[index].value = data.data
            })
        },
        addDomain() {
            this.dataForm.dispatchTaskParamsList.push({
                value: '',
                key: Date.now()
            })
        },
        removeDomain(item) {
            var index = this.dataForm.dispatchTaskParamsList.indexOf(item)
            if (index !== -1) {
                this.dataForm.dispatchTaskParamsList.splice(index, 1)
            }
        },
        dataFormSubmit() {
            console.log('this.dataForm.taskId' + this.dataForm.taskId)
            saveParams({
                dispatchTaskParamsList: this.dataForm.dispatchTaskParamsList,
                taskId: this.dataForm.taskId
            }).then(({data}) => {
                if (data && data.code === 0) {
                    this.$message.success(data.msg || '保存成功')
                    this.$emit('refreshTaskDependence')
                    this.closed()
                } else {
                    this.$message.error(data.msg || '提交异常')
                }
            })
        }
    }
}
</script>
