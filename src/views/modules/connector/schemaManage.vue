<template>
    <div class="mod-config">
        <el-form :inline="true" :model="dataForm">
            <el-form-item label="集群" prop="connectorSource">
                <el-select v-model="dataForm.connectorSource" placeholder="集群" filterable clearable>
                    <el-option :label="item" :value="item" v-for="(item, index) in connectorSourceList"
                               :key="index"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="名称">
                <el-input
                        v-model="dataForm.subjectName"
                        clearable
                ></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="searchData()">查询</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%">
            <el-table-column :show-overflow-tooltip="true" prop="subjectName" header-align="center" align="left" label="名称" fixed>
                <template slot-scope="scope">
                    <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                        <div style="flex-grow: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                            <a @click="viewSchemaHandle(scope.row)">{{ scope.row.subjectName }}</a>
                        </div>
                        <el-button size="mini" :data-clipboard-text="scope.row.subjectName" plain class="no-border" icon="el-icon-copy-document" @click.stop="copyToClipboard(scope.row.subjectName)"></el-button>
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                    header-align="center"
                    align="center"
                    width="200"
                    label="操作"
            >
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="deleteSchema(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
                @size-change="sizeChangeHandle"
                @current-change="currentChangeHandle"
                :current-page="currPage"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="pageSize"
                :total="totalPage"
                layout="total, sizes, prev, pager, next, jumper"
        ></el-pagination>
        <schemaManageAddOrUpdate
                v-if="viewSchemaVisible"
                ref="schemaManageAddOrUpdate"
                @refreshDataList="getDataList"
        ></schemaManageAddOrUpdate>
    </div>
</template>
<style>
.input-with-select {
    width: 180px;
}
</style>
<script>
import {schemaPageList, deleteSchema, getSchemaHost} from '@/api/connector/connectorManage'
import schemaManageAddOrUpdate from './schemaManage-add-or-update'

export default {
    data() {
        return {
            historySqlList: [],
            dialogTableVisible: false,
            dataList: [],
            dataListSelections: [],
            currPage: 1,
            pageSize: 10,
            totalPage: 0,
            dataListLoading: false,
            viewSchemaVisible: false,
            dataForm: {
              subjectName: ''
            },
            connectorSourceList: []
        }
    },
    components: {schemaManageAddOrUpdate},
    mounted() {
        this.getHost()
    },
    methods: {
        viewSchemaHandle (row) {
            if (!this.dataForm.connectorSource) {
                this.$message({
                    message: '请选择集群信息！',
                    type: 'warning'
                })
            } else {
                console.log('viewSchemaHandle,row:' + JSON.stringify(row))
                this.viewSchemaVisible = true
                let subjectName = null
                if (row) {
                  subjectName = row.subjectName
                }
                this.$nextTick(() => {
                    this.$refs.schemaManageAddOrUpdate.init(subjectName, this.dataForm.connectorSource)
                })
            }
        },
        getDataList() {
            if (!this.dataForm.connectorSource) {
                this.$message({
                    message: '请选择集群信息！',
                    type: 'warning'
                })
            } else {
                console.log('this.dataForm.connectorSource:' + this.dataForm.connectorSource)
                let params = {
                    'connectorSource': this.dataForm.connectorSource,
                    'subjectName': this.dataForm.subjectName,
                    'currPage': this.currPage,
                    'pageSize': this.pageSize
                }
                schemaPageList(params).then(({data}) => {
                    if (data.code === 0 && data.data) {
                        this.dataList = data.data.list
                        this.totalPage = data.data.totalCount
                        this.dataListLoading = false
                    } else {
                        this.dataList = []
                        this.dataListLoading = false
                    }
                })
            }
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
        },
        deleteSchema(row) {
          this.$confirm(
            `确定对${row.name}操作?`,
            '提示',
            {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }
          ).then(() => {
            let params = {
              'connectorSource': this.dataForm.connectorSource,
              'subjectName': row.subjectName
            }
            deleteSchema(params).then(({data}) => {
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
          })
        },
        getHost() {
          getSchemaHost().then(({data}) => {
                if (data.code === 0 && data.data) {
                    this.connectorSourceList = data.data
                }
            })
        },
        // 每页数
        sizeChangeHandle(val) {
            this.pageSize = val
            this.getDataList()
        },
        // 当前页
        currentChangeHandle(val) {
            this.currPage = val
            this.getDataList()
        },
        searchData() {
            this.currPage = 1
            this.getDataList()
        }
    }
}
</script>
<style scoped>
.no-border {
    border: none !important; /* 移除边框 */
    background-color: transparent !important; /* 设置背景透明 */
}
</style>