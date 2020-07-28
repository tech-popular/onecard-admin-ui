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
      <el-form-item label="租户状态" prop="flag">
        <el-radio label="0" v-model="dataForm.flag">正常</el-radio>
        <el-radio label="1" v-model="dataForm.flag">冻结</el-radio>
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
  import { getTenantManageInfo, updateTenantManage, addTenantManage } from '@/api/sys/tenant'
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          id: '',
          name: '',
          flag: '0',
          mark: ''
        },
        dataRule: {
          name: [
            { required: true, message: '请输入租户名', trigger: 'blur' }
          ],
          flag: [
            { required: true, message: '请选择租户状态', trigger: 'change' }
          ]
        }
      }
    },
    methods: {
      init (val) {
        this.dataForm.id = ''
        this.dataForm.name = ''
        this.dataForm.flag = '0'
        this.dataForm.mark = ''
        if (val && val.id) {
          this.dataForm.id = val.id
          this.getTenantManageInfo()
        }
        this.visible = true
      },
      getTenantManageInfo () {
        getTenantManageInfo(this.dataForm.id).then(({data}) => {
          if (data && data.code === 0) {
            if (!data.data) {
              return this.$message.error('数据获取异常')
            }
            this.dataForm.name = data.data.name
            this.dataForm.flag = data.data.flag
            this.dataForm.mark = data.data.mark
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            let url = addTenantManage
            let params = {
              name: this.dataForm.name,
              flag: this.dataForm.flag,
              mark: this.dataForm.mark
            }
            if (this.dataForm.id) {
              url = updateTenantManage
              params.id = this.dataForm.id
            }
            url(params).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: data.msg || '操作成功',
                  type: 'success',
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
        })
      }
    }
  }
</script>
