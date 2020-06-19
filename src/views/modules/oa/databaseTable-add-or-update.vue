<template>
    <el-dialog title="新增" :append-to-body="true" :visible.sync="visible" :show-close="false" width="1000px" >
      <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="160px">
        <el-form-item label="空间名称" prop="name">
          <el-input v-model="dataForm.name" placeholder="空间名称" />
        </el-form-item>
        <el-form-item label="负责部门" prop="departmentName">
          <el-input v-model="dataForm.departmentName" placeholder="负责部门" />
        </el-form-item>
        <el-form-item label="负责人" prop="headName">
          <el-input v-model="dataForm.headName" placeholder="负责人" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="foot">
        <el-button @click="dataFormCancel()">取消</el-button>
        <el-button type="primary" @click="dataFormSubmit()" :loading="buttonloading">确定</el-button>
      </div>
  </el-dialog>
</template>


<script>
import { savaOadatabase } from '@/api/oa/apply'
export default {
  data () {
    return {
      totalPage: 0,
      visible: false,
      // 账号权限开始
      dataForm: {
        name: '',
        departmentName: '',
        headName: ''
      }, // 账号权限form
      dataRule: {
        name: [
          { required: true, message: '空间名称不能为空', trigger: 'blur' }
        ],
        departmentName: [
          { required: true, message: '负责部门不能为空', trigger: 'blur' }
        ],
        headName: [
          { required: true, message: '负责人不能为空', trigger: 'blur' }
        ]
      },
      systemmodelList: [],
      peopListType: [
        {id: 1, name: 'lzm'}
      ]
    }
  },
  components: {},
  methods: {
    init (id, value) {
      this.dataForm.id = id || ''
      this.visible = true
      this.$nextTick(() => { this.$refs['dataForm'].resetFields() })
    },
    dataFormSubmit (form) {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          let newData = {
            name: this.dataForm.name,
            departmentName: this.dataForm.departmentName,
            headName: this.dataForm.headName
          }
          savaOadatabase(newData).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.visible = false
                  this.$emit('refreshDataList')
                  this.$refs['dataForm'].resetFields()
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        }
      })
    },
    // 账号取消
    dataFormCancel () {
      this.visible = false
      this.$refs['dataForm'].resetFields()
    }
  }
}
</script>
<style scoped>
.foot {
  text-align: right;
}
</style>>
