<template>
  <el-dialog title="新增任务关系" @close="taskDialgClose" :visible.sync="visible">
    <el-form :model="dataForm" ref="dataForm" label-width="20%">
      <el-form-item label="工作流Id">
        <el-input v-model="dataForm.flowId" placeholder="工作流Id" disabled/>
      </el-form-item>
      <el-form-item label="任务Id">
        <el-select v-model="dataForm.taskId" placeholder="任务Id" style="width:100%" filterable @change="onSelectedDrug">
          <el-option
            v-for="item in taskIdlist"
            :key="item.id"
            :label="item.name"
            :value="item.name">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="任务类型">
        <el-select v-model="dataForm.type" placeholder="任务类型" style="width:100%" filterable  v-if="dataFormType === true">
          <el-option
            v-for="item in dataForm.ruleTypeList"
            :key="item.value"
            :label="item.value"
            :value="item.value">
          </el-option>
        </el-select>
        <el-select v-model="dataForm.type" disabled placeholder="任务类型" style="width:100%" filterable v-else>
          <el-option
            v-for="item in dataForm.ruleTypeList"
            :key="item.value"
            :label="item.value"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="父级Id">
        <el-select v-model="dataForm.parentTask" placeholder="父级Id" style="width:100%">
          <el-option
            v-for="item in parentTasklist"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="执行下标">
        <el-select v-model="dataForm.index" placeholder="执行下标" style="width:100%">
          <el-option
            v-for="item in indexlist"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="参考名称">
        <el-input v-model="dataForm.taskReferenceName" placeholder="参考名称"/>
      </el-form-item>
      <el-form-item label="判断case参数">
        <el-input v-model="dataForm.caseValueParam" placeholder="判断case参数"/>
      </el-form-item>
      <el-form-item label="判断表达式">
        <el-input v-model="dataForm.caseExpression" placeholder="判断表达式"/>
      </el-form-item>
      <el-form-item label="switch判断项集合">
        <el-input v-model="dataForm.caseSwitchList" placeholder="switch判断项集合"/>
      </el-form-item>
      <el-form-item label="任务入参">
        <el-input v-model="dataForm.inputParams" placeholder="任务入参"/>
      </el-form-item>
      <el-form-item label="任务出参别名映射">
        <el-input v-model="dataForm.outputParams" placeholder="任务出参别名映射"/>
      </el-form-item>
      <el-form-item label="子流程ID">
        <el-input v-model="dataForm.subWorkFlow" placeholder="子流程i"/>
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
        dataFormType: true,
        dataForm: {
          flowId: '',
          taskId: -1,
          index: 1,
          parentTask: -1,
          taskReferenceName: '',
          remark: '',
          ruleTypeList: [
            {
              value: 'Fork',
              label: 'Fork'
            }, {
              value: 'Join',
              label: 'Join'
            }, {
              value: 'Descision',
              label: 'Descision'
            }
          ],
          type: '',
          caseValueParam: '',
          caseExpression: '',
          caseSwitchList: '',
          inputParams: '',
          outputParams: '',
          subWorkFlow: ''
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
        const dataBody = {}
        getAllBeeTaskList(dataBody, false).then(({data}) => {
          if (data && data.message === 'success') {
            this.taskIdlist = data.data
          }
        })
        value && value.map(item => {
          this.parentTasklist.push(item.id)
          this.indexlist.push(item.index)
        })
        var max = this.indexlist.reduce(function (a, b) {
          return b > a ? b : a
        })
        this.dataForm.index = max + 1
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
                    this.dataForm.type = ''
                    this.dataForm.caseValueParam = ''
                    this.dataForm.caseExpression = ''
                    this.dataForm.caseSwitchList = ''
                    this.dataForm.inputParams = ''
                    this.dataForm.outputParams = ''
                    this.dataForm.subWorkFlow = ''
                  }
                })
              } else {
                this.$message.error(data.message)
              }
            })
          }
        })
      },
      onSelectedDrug (selVal) {
        var findVal = this.taskIdlist.find(item => {
          return item.name === selVal
        })
        this.dataForm.type = findVal.type
        this.dataFormType = false
      },
      taskDialgClose () {
        this.visible = false
        this.dataForm.taskId = -1
        this.dataForm.index = 1
        this.dataForm.parentTask = -1
        this.dataForm.taskReferenceName = ''
        this.dataForm.remark = ''
        this.dataForm.type = ''
        this.dataForm.caseValueParam = ''
        this.dataForm.caseExpression = ''
        this.dataForm.caseSwitchList = ''
        this.dataForm.inputParams = ''
        this.dataForm.outputParams = ''
        this.dataForm.subWorkFlow = ''
        this.preTasklist = []
        this.parentTasklist = []
        this.indexlist = []
      }
    }
  }
</script>
