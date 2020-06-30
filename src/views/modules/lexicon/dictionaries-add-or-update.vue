<template>
  <el-dialog :title="dataFormValue ? '查看字典' : dataForm.id ? '修改字典' : '新增字典'" :modal-append-to-body='false' :append-to-body="true" :close-on-click-modal="false" :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="10%" :disabled="dataFormValue">
      <el-form-item label="字典名称" prop="dictionariesName">
        <el-input v-model="dataForm.dictionariesName" placeholder="字典名称"/>
      </el-form-item>
      <el-form-item label="字典值" prop="dictionariesValue">
        <el-input v-model="dataForm.dictionariesValue" placeholder="字典值"/>
      </el-form-item>
      <el-form-item label="字典类型" prop="dictionariesType">
        <el-input v-model="dataForm.dictionariesType" placeholder="字典类型" :disabled='typeDisabled'/>
      </el-form-item>
      <el-form-item label="层级" prop="dictionariesFlow">
        <el-input v-model="dataForm.dictionariesFlow" placeholder="层级" :disabled='flowDisabled'/>
      </el-form-item>
      <el-form-item label="排序" prop="dictionariesSlot">
        <el-input v-model="dataForm.dictionariesSlot" placeholder="排序"/>
      </el-form-item>
      <el-form-item label="状态">
      <el-radio-group v-model="dataForm.status">
        <el-radio :label="true">启用</el-radio>
        <el-radio :label="false">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div slot="footer" class="foot">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { infoBeeTask, saveorupt } from '@/api/workerBee/kafka'
  export default {
    data () {
      var nullandnumber = (rule, value, callback) => {
        const nullValue = /^[^\s]+$/
        if (!value) {
          callback(new Error('请输入'))
        }
        if (!nullValue.test(value)) {
          callback(new Error('不能输入含空格'))
        }
        if (!Number(value)) {
          callback(new Error('请输入数字类型'))
        }
        callback()
      }
      var nullkongge = (rule, value, callback) => {
        const nullValue = /^[^\s]+$/
        if (!value) {
          callback(new Error('请输入'))
        }
        if (!nullValue.test(value)) {
          callback(new Error('不能输入含空格'))
        }
        callback()
      }
      var nullkonggeselect = (rule, value, callback) => {
        const nullValue = /^[^\s]+$/
        if (!value) {
          callback(new Error('请选择'))
        }
        if (!nullValue.test(value)) {
          callback(new Error('不能输入含空格'))
        }
        callback()
      }
      return {
        visible: false,
        dataForm: {
          dictionariesName: '',
          dictionariesValue: '',
          dictionariesType: '',
          dictionariesFlow: 1,
          dictionariesSlot: '',
          status: true
        },
        dataFormValue: '',
        ruleTypeList: [],
        dataRule: {
          dictionariesName: [
            { required: true, validator: nullkongge, trigger: 'blur' }
          ],
          dictionariesValue: [
            { required: true, validator: nullkongge, trigger: 'blur' }
          ],
          dictionariesType: [
            { required: true, validator: nullkongge, trigger: 'blur' }
          ],
          dictionariesFlow: [
            { required: true, validator: nullandnumber, trigger: 'blur' }
          ],
          dictionariesSlot: [
            { required: true, validator: nullandnumber, trigger: 'blur' }
          ],
          status: [
            { required: true, validator: nullkonggeselect, trigger: 'change' }
          ]
        },
        flowDisabled: true,
        typeDisabled: false
      }
    },
    components: {
  
    },
    mounted () {
      this.init()
    },
    methods: {
      init (id, value) {
        this.dataForm.id = id || ''
        this.dataFormValue = value
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (id) {
            this.typeDisabled = true
            this.flowDisabled = false
            const dataBody = this.dataForm.id
            infoBeeTask(dataBody).then(({data}) => {
              this.dataForm = data.data
            })
          }
        })
      },
      // 弹窗状态
      dataFormSubmit (form) {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            const dataBody = this.dataForm
            const dataUpdateId = this.dataForm.id
            saveorupt(dataBody, dataUpdateId).then(({data}) => {
              if (data && data.status === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshDataList')
                    this.$refs['dataForm'].resetFields()
                    this.typeDisabled = false
                    this.flowDisabled = true
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
