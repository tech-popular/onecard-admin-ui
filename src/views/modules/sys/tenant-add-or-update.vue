<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    width="880px"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
      <el-form-item label="租户名" prop="name">
        <el-input v-model="dataForm.name" placeholder="租户名"></el-input>
      </el-form-item>
      <el-form-item label="租户状态" prop="status">
        <el-radio label="1" v-model="dataForm.status">正常</el-radio>
        <el-radio label="2" v-model="dataForm.status">冻结</el-radio>
      </el-form-item>
      <el-form-item label="备注" prop="mark">
        <el-input
          type="textarea"
          :rows="4"
          placeholder="请输入"
          maxlength="200"
          show-word-limit
          v-model="dataForm.mark">
        </el-input>
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
    data () {
      return {
        visible: false,
        roleList: [],
        menuList: [],
        dataForm: {
          id: '',
          name: '',
          status: '1',
          mark: ''
        },
        dataRule: {
          name: [
            { required: true, message: '请输入租户名', trigger: 'blur' }
          ],
          status: [
            { required: true, message: '请选择租户状态', trigger: 'change' }
          ]
        }
      }
    },
    methods: {
      init (val) {
        if (!val || !val.id) {
          this.dataForm.id = ''
          this.dataForm.name = ''
          this.dataForm.status = '1'
          this.dataForm.mark = ''
        } else {
          this.dataForm.id = val.id
        }
        this.visible = true
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            console.log(89)
          }
        })
      }
    }
  }
</script>
