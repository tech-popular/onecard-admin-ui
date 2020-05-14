<template>
  <el-dialog :title="!dataForm.id ? '新增' : '修改'"  @close="datano" :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="20%">
    <el-form-item label="归属系统名称" prop="sysName">
      <el-input v-model="dataForm.sysName" placeholder="归属系统名称"/>
    </el-form-item>
     <el-form-item label="归属系统编码" prop="sysCode">
      <el-input v-model="dataForm.sysCode" placeholder="归属系统编码"/>
    </el-form-item>
    <el-form-item label="创建者" prop="creator">
      <el-input v-model="dataForm.creator" placeholder="创建者"/>
    </el-form-item>
    <el-form-item label="更新者" prop="update">
      <el-input v-model="dataForm.update" placeholder="更新者"/>
    </el-form-item>
    <el-form-item label="备注" prop="remark">
      <el-input v-model="dataForm.remark" placeholder="备注"/>
    </el-form-item>
    
    </el-form>
    <span slot="footer">
      <el-button @click="datano()">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { saveWorkFlow } from '@/api/workerBee/workFlow'
  import Filter from './filter'
  export default {
    data () {
      return {
        visible: false,
        dataForm: {},
        dataRule: {
          sysName: [
            { required: true, message: '归属系统名称不能为空', trigger: 'blur' },
            { required: true, validator: Filter.NullKongGeRule, trigger: 'change' }
          ],
          sysCode: [
            { required: true, message: '归属系统编码不能为空', trigger: 'blur' },
            { required: true, validator: Filter.NullKongGeRule, trigger: 'change' }
          ],
          creator: [
            { required: true, message: '创建者不能为空', trigger: 'blur' },
            { required: true, validator: Filter.NullKongGeRule, trigger: 'change' }
          ],
          update: [
            { required: true, message: '更新者不能为空', trigger: 'blur' },
            { required: true, validator: Filter.NullKongGeRule, trigger: 'change' }
          ],
          remark: [
            { required: true, message: '更新者不能为空', trigger: 'blur' },
            { required: true, validator: Filter.NullKongGeRule, trigger: 'change' }
          ]
        }
      }
    },
    components: {},
    methods: {
      init (id) {
        this.updateId = id
        this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            console.log('调接口')
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            saveWorkFlow(this.dataForm).then(({data}) => {
              if (data && data.message === 'success') {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 300,
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshDataList')
                    this.dataForm.description = ''
                    this.dataForm.createdBy = ''
                    this.dataForm.ownerApp = ''
                  }
                })
              } else {
                this.$message({
                  message: data.message || '数据异常',
                  type: 'error'
                })
              }
            })
          }
        })
      },
      datano () {
        this.visible = false
        this.dataForm.description = ''
        this.dataForm.createdBy = ''
        this.dataForm.ownerApp = ''
      }
    }
  }
</script>
