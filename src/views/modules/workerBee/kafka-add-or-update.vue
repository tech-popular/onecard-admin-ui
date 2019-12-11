<template>
  <el-dialog :title="dataFormValue ? '查看' : dataForm.id ? '修改' : '新增'" :modal-append-to-body='false' :append-to-body="true" :close-on-click-modal="false" :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="20%">
    <el-form-item label="1234" prop="name">
      <el-input v-model="dataForm.name" onkeyup="this.value=this.value.replace(/\s+/g,'')" v-if="!dataFormValue" placeholder="任务"/>
      <el-input v-model="dataForm.name" v-else disabled placeholder="任务"/>
    </el-form-item>
    <el-form-item label="任务类型" prop="type">
        <el-select filterable v-model="dataForm.type" placeholder="请选择">
          <el-option v-for="item in ruleTypeList" :value="item.baseValue" :key="item.value" :label="item.baseName"/>
        </el-select>
      </el-form-item>
    <el-form-item label="任务描述" prop="description">
      <el-input v-model="dataForm.description" placeholder="任务"/>
    </el-form-item>
    <el-form-item label="任务归属" prop="owner">
      <el-input v-model="dataForm.owner" placeholder="任务归属"/>
    </el-form-item>
    <el-form-item label="任务使用者" prop="user">
      <el-input v-model="dataForm.user" placeholder="任务使用者"/>
    </el-form-item>
    <el-form-item label="入参数据的key的ID集合" prop="inputParams">
      <el-input v-model="dataForm.inputParams" placeholder="多个参数用英文逗号隔开"/>
    </el-form-item>
    <el-form-item label="出参数据的key的ID集合" prop="outputParams">
      <el-input v-model="dataForm.outputParams" placeholder="出参数据的key的ID集合"/>
    </el-form-item>
    <el-form-item label="所属系统" prop="ownerApp">
      <el-input v-model="dataForm.ownerApp" placeholder="所属系统"/>
    </el-form-item>
    <el-form-item label="备注" prop="remark">
      <el-input v-model="dataForm.remark" placeholder="备注"/>
    </el-form-item>
    </el-form>
   
    <div slot="footer" class="foot">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { getBeeTaskTypeList, infoBeeTask, beeTask } from '@/api/workerBee/metadata'
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          id: '',
          name: '', // 任务定义名称
          type: '', // 任务类型
          description: '', // 任务描述
          owner: '', // 任务归属
          user: '', // 任务使用者
          inputParams: '', // 入参数据的key的ID集合
          outputParams: '', // 出参数据的key的ID集合
          ownerApp: '', // 所属系统
          remark: '' // 备注
        },
        dataFormValue: '',
        ruleTypeList: [],
        dataRule: {
          name: [
            { required: true, message: '任务定义名称不能为空', trigger: 'blur' }
          ],
          type: [
            { required: true, message: '请选择任务类型', trigger: 'change' }
          ]
        },
        fatherData: {
          enable: true,
          enableCache: 1,
          parsTemplate: false
        }
      }
    },
    components: {
  
    },
    methods: {
      init (id, value) {
        this.dataForm.id = id || ''
        this.dataFormValue = value
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          getBeeTaskTypeList().then(({data}) => {
            if (data && data.status === 0) {
              this.ruleTypeList = data.data
            }
          })
          if (id) {
            const dataBody = {
              utcParam: [id]
            }
            infoBeeTask(dataBody).then(({data}) => {
              if (data && data.status === 0) {
  
              }
            })
          }
        })
      },
      // 弹窗状态
  
      dataFormSubmit (form) {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            let newData = {
              'beeTaskDef': this.dataForm
            }
            beeTask(newData, `/beeTask/${!this.dataForm.id ? 'saveBeeTask' : 'updateBeeTask'}`).then(({data}) => {
              if (data && data.status === 0) {
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
      }
    }
  }
</script>
