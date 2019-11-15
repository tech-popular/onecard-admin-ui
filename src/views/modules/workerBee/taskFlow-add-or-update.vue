<template>
  <el-dialog title="新增任务关系" :close-on-click-modal="false" :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="20%">
    <el-form-item label="工作流Id" prop="flowId">
      <el-select v-model="dataForm.flowId" placeholder="工作流Id" style="width:100%">
        <el-option
          v-for="item in flowIdlist"
          :key="item.value"
          :label="item.id"
          :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="任务Id" prop="taskId">
      <el-select v-model="dataForm.taskId" placeholder="任务Id" style="width:100%">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.id"
          :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
     <el-form-item label="任务加入任务Id" prop="preTask">
        <el-select v-model="dataForm.preTask" placeholder="任务加入任务Id" style="width:100%">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="父级Id" prop="parentTask">
      <el-select v-model="dataForm.parentTask" placeholder="父级Id" style="width:100%">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="执行下标" prop="index">
      <el-input v-model="dataForm.index" placeholder="执行下标"/>
    </el-form-item>
    <el-form-item label="参考名称" prop="taskReferenceName">
      <el-input v-model="dataForm.taskReferenceName" placeholder="参考名称"/>
    </el-form-item>
    <el-form-item label="备注" prop="inputParameters">
      <el-input v-model="dataForm.inputParameters" placeholder="备注"/>
    </el-form-item>
   
    </el-form>
    <span slot="footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { saveWorkTaskFlow } from '@/api/workerBee/workFlow'
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          flowId: -1,
          taskId: -1,
          index: -1,
          parentTask: -1,
          preTask: -1,
          taskReferenceName: '',
          inputParameters: ''
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
          inputParameters: [
            { required: true, message: '备注不能为空', trigger: 'blur' }
          ],
          preTask: [
            { required: true, message: '请选择任务加入任务Id', trigger: 'blur' }
          ]
        },
        flowIdlist: [{
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }]
      }
    },
    components: {
  
    },
    mounted () {
      this.init()
    },
    methods: {
      init (value) {
        console.log(value, '携带参数')
        this.visible = true
        value.map()
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            const dataBody = this.dataForm
            saveWorkTaskFlow(dataBody).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1000,
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
