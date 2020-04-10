<template>
  <el-dialog
      title="查看"
      :visible.sync="dialogVisible"
      width="60%"
      :before-close="handleClose">
      <el-form label-width="160px">
        <el-form-item label="标题">
          <span>{{detalList.title}}</span>
        </el-form-item>
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
        <el-form-item label="maxcomputer账号">
          <span>{{detalList.account}}</span>
        </el-form-item>
        <el-form-item label="申请人姓名">
          <span>{{detalList.applicantName}}</span>
        </el-form-item>
        <!-- <el-form-item label="默认所属部门">
          <span>{{detalList.department}}</span>
        </el-form-item> -->
        <el-form-item label="申请人手机号">
          <span>{{detalList.applicantTel}}</span>
        </el-form-item>
        <el-form-item label="申请人邮箱">
          <span>{{detalList.applicantEmail}}</span>
        </el-form-item>
        <el-form-item label="本次申请默认审批人">
          <el-tag
            style="margin-left:10px;"
            v-for="tag in detalList.defaultApproverList"
            :key="tag.name"
            :type="tag.name"
          >{{tag.name}}</el-tag>
        </el-form-item>
        <el-form-item label="申请理由">
          <span>{{detalList.applyReason}}</span>
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
  components: {},
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
.foot {
  text-align: right;
}
</style>>
