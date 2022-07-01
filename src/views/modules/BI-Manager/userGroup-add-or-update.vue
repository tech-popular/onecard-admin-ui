<template>
  <el-dialog :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="120px" size="small">
      <el-form-item label="用户组名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="用户组名称"></el-input>
      </el-form-item>
      <el-form-item label="用户组归属部门" prop="department">
        <el-input v-model="dataForm.department" placeholder="用户组归属部门"></el-input>
      </el-form-item>
      <el-form-item label="用户组申请人" prop="creater">
        <!-- <el-input v-model="dataForm.creater" placeholder="用户组申请人"></el-input> -->
        <el-select v-model="dataForm.creater" placeholder="请输入关键字" style="width:100%" remote :remote-method="getUserSelectList" :loading="loading" filterable>
          <el-option v-for="item in userIdList" :key="item.id" :label="item.name" :value="item.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="用户组说明" prop="remark">
        <el-input v-model="dataForm.remark" placeholder="用户组说明"></el-input>
      </el-form-item>
      <!-- <el-form-item label="用户组所属租户" prop="tenantId">
      <el-select v-model="dataForm.tenantId"  placeholder="请选择" style="width:100%" filterable @change="getUserSelectList">
        <el-option
          v-for="item in tenantIdList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
          >
        </el-option>
      </el-select>
      </el-form-item>-->
      <el-form-item label="用户组成员" prop="userIds">
        <el-select v-model="dataForm.userIds" multiple placeholder="请输入关键字" style="width:100%" remote :remote-method="getUserSelectList" :loading="loading" filterable>
          <el-option v-for="item in userIdList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否失效" prop="flag">
        <el-radio-group v-model="dataForm.flag">
          <el-radio :label="0">否</el-radio>
          <el-radio :label="1">是</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { savaUserGroupInfo, updateUserGroupInfo, lookDataInfo, getUsersList } from '@/api/BI-Manager/userGroup'
export default {
  data () {
    return {
      loading: false,
      visible: false,
      dataForm: {
        id: 0,
        name: '',
        department: '',
        creater: '',
        remark: '',
        flag: 1,
        // tenantId: '',
        userIds: []
      },
      // tenantIdList: [],
      userIdList: [],
      dataRule: {
        name: [{
          required: true,
          message: '用户组名称不能为空',
          trigger: 'blur'
        }],
        department: [{
          required: true,
          message: '用户组归属部门不能为空',
          trigger: 'blur'
        }],
        creater: [{
          required: true,
          message: '用户组申请人不能为空',
          trigger: 'blur'
        }],
        remark: [{
          required: true,
          message: '用户组说明不能为空',
          trigger: 'blur'
        }],
        userIds: [{
          required: true,
          message: '请选择用户组成员',
          trigger: 'blur'
        }],
        // tenantId: [{
        //   required: true,
        //   message: '请选择用户组所属租户',
        //   trigger: 'blur'
        // }],
        flag: [{
          required: true,
          message: '是否失效不能为空',
          trigger: 'blur'
        }]
      }
    }
  },
  methods: {
    init (row) {
      // this.SelectTenantDown()
      this.visible = true
      if (row) {
        this.getDataInfo(row.id)
      } else {
        this.$nextTick(() => {
          this.dataForm.id = 0
          this.$refs['dataForm'].resetFields()
        })
      }
    },
    getDataInfo (id) {
      lookDataInfo(id).then(({ data }) => {
        if (data && data.code === 0) {
          let userIdsData = data.data.userIds.split(',')
          this.dataForm.id = data.data.id
          this.dataForm.name = data.data.name
          this.dataForm.flag = data.data.flag
          this.dataForm.department = data.data.department
          this.dataForm.creater = data.data.creater
          this.dataForm.remark = data.data.remark
          // this.dataForm.tenantId = data.data.tenantId
          this.getUserSelectList()
          this.dataForm.userIds = userIdsData.map(item => { return +item })
          this.userIdList = data.data.nameList
        }
      })
    },
    // 获取租户list
    // SelectTenantDown () {
    //   getSelectTenantDown().then(({ data }) => {
    //     if (data && data.code === 0) {
    //       this.tenantIdList = data.data
    //     } else {
    //       this.tenantIdList = []
    //     }
    //   })
    // },
    getUserSelectList (query) {
      if (query !== '') {
        this.loading = true
        let params = {
          name: query
        }
        getUsersList(params).then(({ data }) => {
          if (data && data.code === 0) {
            this.userIdList = data.dataList
          } else {
            this.userIdList = []
          }
          this.loading = false
        }).finally(() => {
          this.loading = false
        })
      } else {
        this.userIdList = []
      }
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          let params = {
            'name': this.dataForm.name,
            'department': this.dataForm.department,
            'creater': this.dataForm.creater,
            'remark': this.dataForm.remark,
            // 'tenantId': this.dataForm.tenantId,
            'flag': this.dataForm.flag,
            'userIds': this.dataForm.userIds.join(',')
          }
          console.log('params: ', params)
          if (!this.dataForm.id) {
            savaUserGroupInfo(params).then(({ data }) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.$emit('refreshDataList')
                    this.visible = false
                  }
                })
              } else {
                this.$message.error(data.msg || '数据异常')
              }
            })
          } else {
            params.id = this.dataForm.id
            updateUserGroupInfo(params).then(({ data }) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.$emit('refreshDataList')
                    this.visible = false
                  }
                })
              } else {
                this.$message.error(data.msg || '数据异常')
              }
            })
          }
        }
      })
    }
  }
}
</script>
