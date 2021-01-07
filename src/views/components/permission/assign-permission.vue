<template>
	<el-dialog
    title="操作权限分配"
    :close-on-click-modal="false"
    :visible.sync="visible">
		<el-form :model="dataForm" ref="dataForm" label-width="80px">
			<el-form-item label="拥有者" prop="authOwner">
				<el-select 
         filterable 
			   v-model="dataForm.authOwner"
				 placeholder="请选择"
				 >
        <el-option v-for="item in userList" :value="item.id" :key="item.id" :label="item.name || item.username "></el-option>
			</el-select>
			</el-form-item>
			<el-form-item label="用户" prop="authOtherList">
				<el-select 
			   v-model="dataForm.authOtherList" 
				 filterable
				 multiple
				 size="medium"
				 placeholder="请选择"
				 >
        <el-option v-for="item in userList" :value="item.id" :key="item.id" :label="item.name || item.username "></el-option>
			</el-select>
			</el-form-item>
		</el-form>
		<span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
	</el-dialog>
</template>

<script>
import { getUsersList } from '@/api/commom/assignPermission'
  export default {
    props: {
      submitDataApis: { // 批量授权
        type: Function,
        required: true
      },
      submitDataApi: { // 授权
        type: Function,
        required: true
      }

    },
    data () {
      return {
        visible: false,
        id: '',
        ids: [],
        isMult: false,
        dataForm: {
          authOtherList: [],
          authOwner: ''
        },
        userList: []
      }
    },
    methods: {
      init (row, isMult) {
        this.visible = true
        isMult ? this.ids = row : this.id = row.id
        this.isMult = isMult
        this.userList = []
        this.$nextTick(() => {
           this.$refs['dataForm'].resetFields()
           let tenantId = sessionStorage.getItem('tenantId')
            // 获取同一租户下的用户
            getUsersList(tenantId).then(({ data }) => {
              if (data && data.code === 0) {
                if (!isMult) {
                  Number(row.authOwner) ? this.dataForm.authOwner = Number(row.authOwner) : this.dataForm.authOwner = data.data.filter(item => item.username === row.authOwner)[0].id
                    row.authOtherList && row.authOtherList.forEach(element => {
                    this.dataForm.authOtherList.push(
                      Number(element) ? Number(element) : data.data.filter(item => item.username === element)[0].id
                      )
                  })
                }
              this.userList = data.data
             }
          })
        })
      },
      // 表单提交
      dataFormSubmit () {
        let params = {
          authOwner: this.dataForm.authOwner,
          authOtherList: this.dataForm.authOtherList
        }
        if (this.isMult) {
          params.ids = this.ids
          this.submitDataApis(params).then(({ data }) => { // 提交数据
            if (data && (data.code === 0 || data.status === 0 || data.status === '1')) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 500,
                onClose: () => {
                  this.visible = false
                  this.$emit('refreshDataList')
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        } else {
          params.id = this.id
          this.submitDataApi(params).then(({ data }) => { // 提交数据
            if (data && (data.code === 0 || data.status === 0 || data.status === '1')) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 500,
                onClose: () => {
                  this.visible = false
                  this.$emit('refreshDataList')
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        }
      }
    }
  }
</script>