<template>
    <div>
    <el-dialog  :visible.sync="visible">
        <el-form :model="baseForm"  ref="baseForm">
          <el-form-item label="version" prop="version">
            <el-select v-model="baseForm.version" placeholder="version" filterable clearable>
              <el-option :label="item" :value="item" v-for="(item, index) in versions"
                         :key="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="searchData()">查询</el-button>
          </el-form-item>
            <el-form-item  prop="body">
                <el-input v-model="baseForm.body" type="textarea" :rows="20"></el-input>
                <div style="text-align: right;">
                    <el-button type="primary" @click="deleteHandle" size="small">删除</el-button>
                    <el-button type="default" @click="cancelHandle" size="small">取消</el-button>
                </div>
            </el-form-item>
        </el-form>
    </el-dialog>
    </div>
</template>
<script>
import {getSubjectsVersion, getSubjectsByVersion, deleteSubjectsByVersion} from '@/api/connector/connectorManage'

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
            subjectName: '',
            versions: [],
            baseForm: {
                name: '',
                body: '',
                subTaskList: []
            }
        }
    },
    methods: {
        searchData() {
          console.log('this.baseForm.version' + this.baseForm.version)
          let params = {
            'connectorSource': this.connectorSource,
            'subjectName': this.subjectName,
            'version': (this.baseForm.version === null || this.baseForm.version === undefined) ? 'latest' : this.baseForm.version
          }
          getSubjectsByVersion(params).then(({data}) => {
            if (data && data.code === 0) {
              this.baseForm.body = data.data.schema
            } else {
              this.$message({
                message: data.message || '数据异常',
                type: 'error'
              })
            }
          })
        },
        // 打开抽屉弹窗
        init(subjectName, connectorSource) {
            this.connectorSource = connectorSource
            this.subjectName = subjectName
            this.getSubjectsVersion()
            this.searchData()
            this.visible = true
        },
        getSubjectsVersion() {
          let params = {
            'connectorSource': this.connectorSource,
            'subjectName': this.subjectName
          }
          getSubjectsVersion(params).then(({data}) => {
            if (data && data.code === 0) {
              this.versions = data.data
            } else {
              this.$message({
                message: data.message || '数据异常',
                type: 'error'
              })
            }
          })
        },
      deleteHandle(row) {
        let params = {
          'connectorSource': this.connectorSource,
          'subjectName': this.subjectName,
          'version': this.baseForm.version
        }
        deleteSubjectsByVersion(params).then(({data}) => {
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
