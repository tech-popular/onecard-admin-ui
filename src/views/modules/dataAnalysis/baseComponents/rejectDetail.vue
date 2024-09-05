<template>
  <div>
    <el-dialog title="剔除明细查询" :close-on-click-modal="false" :visible.sync="visible" width="50%">
      <el-form :inline="true" :model="dataForm" ref="dataForm">
        <el-form-item label="剔除分群筛选" prop="rejectTemplateId">
          <el-select  v-model="dataForm.rejectTemplateId" clearable>
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
        <el-form-item prop="expression">
          <el-input v-model="dataForm.expression" placeholder="请输入名称" style="width: 500px" disabled></el-input>
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
        <el-table-column prop="count" header-align="center" align="center" width="100" label="剩余人数"/>
        <el-table-column prop="hitCount" header-align="center" align="center" width="100" label="命中人数"/>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { pickConditionCount, getRejectGroupList, queryExpression } from '@/api/dataAnalysis/dataInsightManage'

export default {
  data () {
    return {
      visible: false,
      dataList: [],
      rejectGroupList: [],
      dataForm: {
        rejectTemplateId: '',
        templateId: '',
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
      this.dataForm.expression = ''
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
        pickConditionCount(this.dataForm.templateId, this.dataForm.rejectTemplateId).then(({ data }) => {
          if (!data || (data && (data.status !== '1' || !data.data))) {
            this.dataList = []
            this.dataListLoading = false
            return this.$message({
              type: 'error',
              message: data.message
            })
          } else {
            this.dataList = data.data
          }
          this.dataListLoading = false
        })
      }
    },
    handleChange(value) {
      this.queryExpression(value)
    },
    queryExpression (id) {
      queryExpression(id).then(({data}) => {
        this.dataForm.expression = data.data
      })
    },
    queryRejectGroupList (id) {
      getRejectGroupList(id).then(({data}) => {
        this.rejectGroupList = data.data
      })
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
