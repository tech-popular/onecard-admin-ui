<template>
  <el-dialog
      title="查看"
      :visible.sync="dialogVisible"
      width="900px"
      :before-close="handleClose">
      <el-form label-width="160px" v-if="quanxian === '账号权限'">
        <el-form-item label="标题">
          <span>{{detalList.title}}</span>
        </el-form-item>
        <el-form-item label="申请系统">
          <el-radio-group  v-model="systemListcarrent">
            <el-radio :label="item.value" :key="item.value" v-for="(item) in detalList.systemList" disabled style="margin-left:0">{{item.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="用户组" v-if="detalList.userGroupName">
          <span>{{detalList.userGroupName }}</span>
        </el-form-item>
        <el-form-item label="申请模块">
          <el-table
            :data="detalList.modelList"
            style="width: 100%">
            <el-table-column
              prop="modelName"
              label="模块名称"
              width="180">
            </el-table-column>
            <el-table-column
              prop="sonModelName"
              label="子模块"
              width="180">
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="申请人姓名">
          <span>{{detalList.applicantName}}</span>
        </el-form-item>
        <el-form-item label="默认所属部门">
          <span >{{detalList.department}}</span>
        </el-form-item>
        <el-form-item label="申请人手机号">
          <span>{{detalList.applicantTel}}</span>
        </el-form-item>
        <el-form-item label="申请人邮箱">
          <span>{{detalList.applicantEmail}}</span>
        </el-form-item>
        <el-form-item label="申请理由">
          <span>{{detalList.applyReason}}</span>
        </el-form-item>
      </el-form>

      <el-form label-width="160px" :model="detalList" v-else-if="quanxian === '租户授权'">
          <el-form-item label="选择租户" prop="tenantIds">
            <el-select v-model="detalList.tenantIds" multiple placeholder="请选择" style="width:100%" disabled>
              <el-option
                v-for="item in tenantList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="申请理由" prop="reason">
            <el-input type="textarea" v-model="detalList.reason" disabled></el-input>
          </el-form-item>
      </el-form>
      <el-form label-width="160px" v-else>
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
        <!-- <el-form-item label="accessKeyId">
          <span>{{detalList.accessKeyId}}</span>
        </el-form-item>
        <el-form-item label="accessKeySecert">
          <span>{{detalList.accessKeySecert}}</span>
        </el-form-item> -->
        <el-form-item label="申请人姓名">
          <span>{{detalList.applicantName}}</span>
        </el-form-item>
        <el-form-item label="申请人手机号">
          <span>{{detalList.applicantTel}}</span>
        </el-form-item>
        <el-form-item label="申请人邮箱">
          <span>{{detalList.applicantEmail}}</span>
        </el-form-item>
        <el-form-item label="申请理由">
          <span>{{detalList.applyReason}}</span>
        </el-form-item>
      </el-form>
    </el-dialog>
</template>

<script>
import {lookAccout, tenantInif} from '@/api/oa/apply'
export default {
  data () {
    return {
      dialogVisible: false,
      detalList: {},
      checkedCities: [],
      quanxian: '',
      sysment: [],
      systemListcarrent: '',
      tenantList: []
    }
  },
  components: {},
  methods: {
    init (val) {
      this.quanxian = val.applyType
      this.dialogVisible = true
      lookAccout(val.id).then(({data}) => {
        this.detalList = {}
        if (data.status * 1 !== 1) {
          return this.$message({
            type: 'error',
            message: data.message
          })
        }
        if (this.quanxian === '账号权限') {
          this.detalList = data.data
          let a = [{selected: true}]
          let b = this.detalList.systemList
          let arr = [...b].filter(x => [...a].some(y => y.selected === x.selected))
          this.sysment = arr
          this.sysment.map(item => {
            this.systemListcarrent = item.value
          })
        } else if (this.quanxian === '租户授权') {
          this.detalList = data.data
        } else {
          this.detalList = data.data
          let c = [{selected: true}]
          let d = this.detalList.applyAuthTypeList
          let arr2 = [...d].filter(x => [...c].some(y => y.selected === x.selected))
          this.checkedCities = arr2
          this.checkedCities.map(item => {
            this.checkedCities.push(item.name)
          })
        }
      })
      this.getTenantList()
    },

    getTenantList () {
      tenantInif().then(({ data }) => {
        this.tenantList = data.data
      })
    },
    // 弹窗状态
    handleClose () {
      this.dialogVisible = false
      this.tenantList = []
    }
  }
}
</script>
<style scoped>
.foot {
  text-align: right;
}
</style>>
