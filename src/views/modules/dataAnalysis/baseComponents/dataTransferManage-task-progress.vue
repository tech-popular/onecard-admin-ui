<template>
  <el-dialog title="任务执行进度" :close-on-click-modal="false" :visible.sync="visible">
    <el-form :model="dataForm" ref="dataForm" label-width="80px" :inline="true">
      <el-form-item label="平均值">
        <span>{{dataForm.metricRound}}</span>
        <el-tooltip placement="top">
          <div slot="content">平均值默认为前7次下发数量平均值（异常数据除外）</div>
          <i class="el-icon-info cursor-pointer" style="color:#409eff"></i>
        </el-tooltip>
        <!-- <el-input   v-model="dataForm.metricRound" disabled style="width: 200px">
        </el-input>-->
      </el-form-item>
      <el-form-item label="浮动比例">
        <el-input-number :min="0" :precision="0" :max="100" :step="1" v-model="dataForm.percent" style="width: 200px" @blur="rateBlur"></el-input-number>&nbsp;%
      </el-form-item>
    </el-form>
    <el-table :data="dataList" border>
      <el-table-column prop="transferId" header-align="center" align="center" label="流转ID"></el-table-column>
      <el-table-column prop="createTime" header-align="center" align="center" label="执行时间"></el-table-column>
      <el-table-column prop="count" header-align="center" align="center" label="分群下发数量"></el-table-column>
      <!-- <el-table-column prop="smsCount" header-align="center" align="center"  v-if="transferType.includes('sms')" label="短信(推送数/成功数/失败数) "></el-table-column> -->
      <!-- <el-table-column prop="pushCount" header-align="center" align="center" v-if="transferType.includes('push')" label="push(推送数/成功数/失败数) "></el-table-column> -->
      <el-table-column prop="enable" header-align="center" align="center" label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.enable === 1" size="small">正常</el-tag>
          <el-tag v-else size="small" type="danger">异常</el-tag>
        </template>
      </el-table-column>
    </el-table>
    <div slot="footer" class="foot">
      <el-button type="primary" @click="submitData">保存</el-button>
      <el-button @click="visible = false">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { dataTransferManageTaskProgress, dataTransferManageExecutionMetric } from '@/api/dataAnalysis/dataTransferManage'
export default {
  data () {
    return {
      visible: false,
      id: '',
      dataList: [],
      transferType: [],
      dataForm: {
        percent: '',
        metricRound: 30
      }
    }
  },
  methods: {
    init (row) {
      this.transferType = row.transferType.split(',')
      this.dataList = []
      this.id = row.id
      this.getTableData(row.id)
      this.visible = true
    },
    getTableData (id) {
      dataTransferManageTaskProgress(id).then(({ data }) => {
        if (data.status === '1') {
          this.dataList = data.data.transferHistoryCounts
          this.dataForm.percent = data.data.percent ? data.data.percent * 100 : 30
          this.dataForm.metricRound = data.data.metricRound
        } else {
          this.$message.error(data.message || '数据异常')
        }
      })
    },
    rateBlur () {
      this.dataForm.percent = this.dataForm.percent.replace(/^0(0+)|[^\d]+/g, '')
    },
    submitData () {
      let params = {
        percent: this.dataForm.percent / 100
      }
      dataTransferManageExecutionMetric(this.id, params).then(({ data }) => {
        if (data.status === '1') {
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 500,
            onClose: () => {
              this.visible = false
            }
          })
        }
      })
    }
  }
}
</script>