<template>
  <div>
    <el-dialog title="剔除明细查询" :close-on-click-modal="false" :visible.sync="visible" width="50%">
      <el-form :inline="true" :model="dataForm" ref="dataForm">
        <el-form-item label="剔除分群" prop="rejectTemplateId">
          <el-select  v-model="dataForm.rejectTemplateId" clearable @change="queryConditionCountGenerationTime">
            <el-option
                v-for="(item, index) in rejectGroupList"
                :label="item.label"
                :value="item.value"
                :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchHandle()">查询</el-button>
        </el-form-item>
        <el-form-item prop="executeTime" label="上次执行时间">
          <el-input v-model="dataForm.executeTime" style="width: 200px" disabled></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="executeHandle()">执行</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="refreshHandle()">刷新执行时间</el-button>
        </el-form-item>
      </el-form>
      <el-form :inline="true" :model="dataForm1" ref="dataForm1">
        <el-form-item prop="expression" label="表达式">
          <el-input v-model="dataForm1.expression" style="width: 700px" disabled></el-input>
        </el-form-item>
      </el-form>
      <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;">
        <el-table-column prop="tag" width="100" header-align="center" align="center" label="标记"/>
        <el-table-column prop="condition" header-align="center" align="center" width="600" label="逻辑条件">
          <template slot-scope="scope">
            <div>
              <template v-if="scope.row.condition.split('-').length === 1">
                <el-tag>{{ scope.row.condition.split('-')[0] }}</el-tag>
              </template>
              <template v-else-if="scope.row.condition.split('-').length === 2">
                <el-tag v-model="scope.row.condition.split('-')[0]" disabled></el-tag>
                <el-tag v-model="scope.row.condition.split('-')[1]" disabled></el-tag>
              </template>
              <template v-else>
                <el-tag>{{ scope.row.condition.split('-')[0] }}</el-tag>
                <el-tag type="info">{{ scope.row.condition.split('-')[1] }}</el-tag>
                <el-tag type="success">{{ scope.row.condition.split('-')[2] }}</el-tag>
              </template>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="hitCount" header-align="center" align="center" width="100" label="命中人数"/>
        <el-table-column prop="count" header-align="center" align="center" width="100" label="剩余人数"/>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { queryConditionCount, getRejectGroupList, queryExpression, queryConditionCountGenerationTime, executeSqlConditionCount } from '@/api/dataAnalysis/dataInsightManage'

export default {
  data () {
    return {
      visible: false,
      dataList: [],
      rejectGroupList: [],
      dataForm: {
        rejectTemplateId: '',
        templateId: '',
        executeTime: ''
      },
      dataForm1: {
        expression: ''
      },
      dataListLoading: false,
      canUpdate: []
    }
  },
  components: {
  },
  methods: {
    init (id) {
      this.visible = true
      this.dataForm.templateId = id
      console.log('templateId: ' + id)
      this.dataList = []
      this.dataForm1.expression = ''
      this.dataForm.executeTime = ''
      this.dataForm.rejectTemplateId = ''
      this.rejectGroupList = []
      this.queryRejectGroupList(id)
      // this.queryData()
    },
    queryData () {
      if (this.dataForm.rejectTemplateId) {
        this.handleChange(this.dataForm.rejectTemplateId)
        this.dataListLoading = true
        console.log('templateId: ' + this.dataForm.templateId)
        console.log('rejectTemplateId: ' + this.dataForm.rejectTemplateId)
        queryConditionCount(this.dataForm.templateId, this.dataForm.rejectTemplateId).then(({ data }) => {
          if (!data || (data && (data.status !== '1' || !data.data))) {
            this.dataList = []
            this.dataListLoading = false
            return this.$message({
              type: 'error',
              message: data.message
            })
          } else {
            this.dataList = data.data
            this.refreshHandle()
          }
          this.dataListLoading = false
        })
      }
    },
    handleChange(id) {
      queryExpression(id).then(({data}) => {
        this.dataForm1.expression = data.data
      })
    },
    queryConditionCountGenerationTime (value) {
      queryConditionCountGenerationTime(this.dataForm.templateId, value).then(({data}) => {
        this.dataForm.executeTime = data.data
      })
    },
    refreshHandle () {
      queryConditionCountGenerationTime(this.dataForm.templateId, this.dataForm.rejectTemplateId).then(({data}) => {
        this.dataForm.executeTime = data.data
      })
    },
    queryRejectGroupList (id) {
      getRejectGroupList(id).then(({data}) => {
        this.rejectGroupList = data.data
      })
    },
    executeHandle() {
      if (!this.dataForm.rejectTemplateId) {
        this.$message({
          message: '请选择剔除分群后进行执行操作！',
          type: 'warning'
        })
      } else {
        this.$confirm('是否确认生成剔除明细数据', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          executeSqlConditionCount(this.dataForm.templateId, this.dataForm.rejectTemplateId).then(({ data }) => {
            console.log('执行生成剔除明细数据返回结果 data:', JSON.stringify(data))
            // 这里的逻辑调整为根据接口返回的 message 和 status 来判断
            if (data && data.status === '1') {
              this.$message.success(data.message || '执行成功')
            } else {
              this.$message.error(data ? data.message : '执行失败')
            }
          }).catch(err => {
            console.error('执行过程中出现错误', err)
            this.$message.error('执行失败')
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
      }
    },
    searchHandle () {
      this.queryData()
    }
  }
}
</script>
<style scoped>
.el-button+.el-button{
  margin: 0 !important;
}
.el-table .cell{
  white-space: pre-line;
}
</style>
