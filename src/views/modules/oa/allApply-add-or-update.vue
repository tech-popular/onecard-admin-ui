<template>
  <el-dialog
      title="审批记录"
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="handleClose">
      <el-form label-width="100px">
        <el-form-item label="标题">
          <span>{{detalList.title}}</span>
        </el-form-item>
        <el-form-item label="申请人姓名">
          <span>{{detalList.applicantName}}</span>
        </el-form-item>
        <!-- <el-form-item label="默认所属部门">
          <span>{{detalList.department}}</span>
        </el-form-item> -->
        <!-- <el-form-item label="申请系统">
          <span>{{detalList.department}}</span>
        </el-form-item>
        <el-form-item label="申请模块">
          <span>{{detalList.department}}</span>
        </el-form-item> -->
        <el-form-item label="申请库表字段">
          <el-table
            :data="detalList.tables"
            style="width: 100%">
            <el-table-column
              prop="name"
              label="数据库名称"
              width="180">
            </el-table-column>
            <el-table-column
              prop="name"
              label="表名称"
              width="180">
            </el-table-column>
            <el-table-column
              prop="project"
              label="字段名称">
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="申请权限">
          <el-checkbox-group v-model="checkedCities">
            <el-checkbox
              disabled
              v-for="(item) in detalList.applyAuthTypeList"
              :label="item.name"
              :key="item.id"
            >{{item.name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="申请事由">
          <span>{{detalList.applyReason}}</span>
        </el-form-item>
        <el-form-item label="审批流">
          <el-button 
           class="el-icon--right"
           size="small"
           v-for="tag in detalList.defaultApproverList" 
           :key="tag.name"
           :type="tag.status === '审批通过' ? 'success' : tag.status === '审批失败' ? 'danger' : 'warning'" 
           :icon="tag.status === '审批通过' ? 'el-icon-circle-check' : tag.status === '审批失败' ? 'el-icon-circle-close' : 'el-icon-remove-outline'">
            {{tag.name}}
          </el-button>
        </el-form-item>
        <el-form-item label="驳回理由">
          <span>{{detalList.refuseReason}}</span>
        </el-form-item>
      </el-form>
    </el-dialog>
</template>

<script>
import {lookAccout} from '@/api/oa/apply'
export default {
  data () {
    return {
      dialogVisible: false,
      detalList: {},
      checkedCities: []
    }
  },
  components: {
  },
  methods: {
    init (val) {
      this.dialogVisible = true
      lookAccout(val.id).then(({data}) => {
        this.detalList = data.data
        this.detalList.applyAuthTypeList.map(item => {
          this.checkedCities.push(item.name)
        })
      })
    },

    // 弹窗状态
    handleClose () {
      this.dialogVisible = false
    }
  }
}
</script>
<style scoped>
</style>>
