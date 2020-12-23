<template>
	<el-dialog
    title="操作权限分配"
    :close-on-click-modal="false"
    :visible.sync="visible">
		<el-form :model="dataForm" :rules="dataRule" label-width="80px">
			<el-form-item label="拥有者">
				<el-select 
			   v-model="dataForm.user" 
				 filterable
				 multiple
				 size="medium"
				 placeholder="请选择"
				 >
        <!-- <el-option></el-option> -->
			</el-select>
			</el-form-item>
			<el-form-item label="用户">
				<el-select 
			   v-model="dataForm.userList" 
				 filterable
				 multiple
				 size="medium"
				 placeholder="请选择"
				 >
        <!-- <el-option></el-option> -->
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
  export default {
    props: {
      getUserListApi: {
        type: Function
        // required: true
      },
      submitDataApi: {
        type: Function
        // required: true
      }
    },
    data () {
      return {
        visible: false,
        dataForm: {
          userList: [],
          user: ''
        },
        dataRule: {
          user: [
            { required: true, message: '拥有者不能为空', trigger: 'blur' }
          ],
          userList: [
            { required: true, message: '用户不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (row) {
        this.visible = true
      },
      // 表单提交
      dataFormSubmit () {
        // 提交数据
      },
      closed () {
        this.visible = false
        }
    }
  }
</script>