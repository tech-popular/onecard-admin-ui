<template>
  <el-dialog title="新增任务关系" @close="taskDialgClose" :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="20%">
    <el-form-item label="工作流Id" prop="flowId">
      <el-input v-model="dataForm.flowId" placeholder="工作流Id" disabled/>
    </el-form-item>
    <el-form-item label="任务Id" prop="taskId">
      <el-select v-model="dataForm.taskId" placeholder="任务Id" style="width:100%" filterable>
        <el-option
          v-for="item in taskIdlist"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
    </el-form-item>
     <el-form-item label="任务加入任务Id" prop="preTask">
        <el-select v-model="dataForm.preTask" placeholder="任务加入任务Id" style="width:100%">
        <el-option
          v-for="item in preTasklist"
          :key="item"
          :label="item"
          :value="item">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="父级Id" prop="parentTask">
      <el-select v-model="dataForm.parentTask" placeholder="父级Id" style="width:100%">
        <el-option
          v-for="item in parentTasklist"
          :key="item"
          :label="item"
          :value="item">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="执行下标" prop="index">
      <el-select v-model="dataForm.index" placeholder="执行下标" style="width:100%">
        <el-option
          v-for="item in indexlist"
          :key="item"
          :label="item"
          :value="item">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="参考名称" prop="taskReferenceName">
      <el-input v-model="dataForm.taskReferenceName" placeholder="参考名称"/>
    </el-form-item>
    <el-form-item label="备注" prop="remark">
      <el-input v-model="dataForm.remark" placeholder="备注"/>
    </el-form-item>
   
    </el-form>
    <span slot="footer">
      <el-button @click="taskDialgClose">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { saveWorkTaskFlow, getAllBeeTaskList } from '@/api/workerBee/workFlow'
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          flowId: '',
          taskId: -1,
          index: -1,
          parentTask: -1,
          preTask: -1,
          taskReferenceName: '',
          remark: ''
        },
        dataRule: {
          flowId: [
            { required: true, message: '工作流Id不能为空', trigger: 'blur' }
          ],
          taskId: [
            { required: true, message: '请选择任务Id', trigger: 'blur' }
          ],
          index: [
            { required: true, message: '请选择任务Id', trigger: 'blur' }
          ],
          parentTask: [
            { required: true, message: '请选择父级Id', trigger: 'blur' }
          ],
          taskReferenceName: [
            { required: true, message: '参考名称不能为空', trigger: 'blur' }
          ],
          remark: [
            { required: true, message: '备注不能为空', trigger: 'blur' }
          ],
          preTask: [
            { required: true, message: '请选择任务加入任务Id', trigger: 'blur' }
          ]
        },
        taskIdlist: [],
        preTasklist: [],
        parentTasklist: [],
        indexlist: []
      }
    },
    components: {
  
    },
    mounted () {
      this.init()
    },
    methods: {
      init (value, flowId) {
        this.dataForm.flowId = flowId
        this.visible = true
        value.map(item => {
          this.preTasklist.push(item.preTask)
          this.parentTasklist.push(item.parentTask)
          this.indexlist.push(item.index)
        })
        const dataBody = {}
        getAllBeeTaskList(dataBody, false).then(({data}) => {
          if (data && data.message === 'success') {
            this.taskIdlist = data.data
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            const dataBody = this.dataForm
            saveWorkTaskFlow(dataBody).then(({data}) => {
              if (data && data.message === 'success') {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 200,
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshDataList')
                    this.dataForm.taskReferenceName = ''
                    this.dataForm.remark = ''
                  }
                })
              } else {
                this.$message.error(data.msg)
              }
            })
          }
        })
      },
      taskDialgClose () {
        this.visible = false
        this.dataForm.taskId = -1
        this.dataForm.index = -1
        this.dataForm.parentTask = -1
        this.dataForm.preTask = -1
        this.dataForm.taskReferenceName = ''
        this.dataForm.remark = ''
        this.preTasklist = []
        this.parentTasklist = []
        this.indexlist = []
      }
    }
  }
</script>
