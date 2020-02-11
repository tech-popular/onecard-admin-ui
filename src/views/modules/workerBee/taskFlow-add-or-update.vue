<template>
  <el-dialog title="新增任务关系" @close="taskDialgClose" :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="20%">
      <el-form-item label="工作流Id">
        <el-input v-model="dataForm.flowId" placeholder="工作流Id" disabled/>
      </el-form-item>
      <el-form-item label="任务Id">
        <el-select v-model="dataForm.taskId" placeholder="任务Id" style="width:100%" filterable @change="onSelectedDrug">
          <el-option
            v-for="item in taskIdlist"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="任务类型">
        <el-select v-model="dataForm.type" placeholder="任务类型" style="width:100%" filterable  v-if="dataFormType === true">
          <el-option
            v-for="item in dataForm.ruleTypeList"
            :key="item.baseName"
            :label="item.baseName"
            :value="item.baseName">
          </el-option>
        </el-select>
        <el-select v-model="dataForm.type" disabled placeholder="任务类型" style="width:100%" filterable v-else>
          <el-option
            v-for="item in dataForm.ruleTypeList"
            :key="item.baseName"
            :label="item.baseName"
            :value="item.baseName">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="表达式参数类型:" prop="caseExpressionParamType" v-show="isDecision">
        <el-select filterable v-model="dataForm.caseExpressionParamType" placeholder="请选择" style="width:100%">
          <el-option v-for="(item, index) in caseExpressionParamType" :value="item.id" :key="index" :label="item.name"/>
        </el-select>
      </el-form-item>
      <el-form-item label="父级名称">
        <el-select v-model="dataForm.parentTask" placeholder="父级名称" style="width:100%">
          <el-option
            v-for="(item, index) in parentTasklist"
            :key="index"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="执行下标">
        <el-select v-model="dataForm.index" placeholder="执行下标" style="width:100%">
          <el-option
            v-for="(item, index) in indexlist"
            :key="index"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="参考名称" prop="taskReferenceName" :rules="dataRule.taskReferenceName">
        <el-input v-model="dataForm.taskReferenceName" placeholder="参考名称"/>
      </el-form-item>
      <el-form-item label="判断case参数" prop="caseValueParam">
        <el-input v-model="dataForm.caseValueParam" placeholder="判断case参数"/>
      </el-form-item>
      <el-form-item label="判断表达式">
        <el-input v-model="dataForm.caseExpression" placeholder="判断表达式"/>
      </el-form-item>
      <el-form-item label="switch判断项集合">
        <el-input v-model="dataForm.caseSwitchList" placeholder="switch判断项集合"/>
      </el-form-item>
      <el-form-item label="任务入参" prop="inputParams">
        <el-input v-model="dataForm.inputParams" placeholder="任务入参"/>
      </el-form-item>
       <el-form-item label="任务出参别名映射" prop="outputParams">
        <el-input v-model="dataForm.outputParams" placeholder="任务出参别名映射"/>
      </el-form-item>
      <el-form-item label="任务加入任务Id">
        <el-select v-model="dataForm.preTask" placeholder="任务加入任务Id" style="width:100%">
          <el-option
            v-for="(item, index) in preTasklist"
            :key="index"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="子流程ID" prop="subWorkFlow">
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
  import { saveWorkTaskFlow, getAllBeeTaskList, getNotBaseTypeList } from '@/api/workerBee/workFlow'
  import Filter from './filter'
  export default {
    data () {
      return {
        visible: false,
        dataFormType: true,
        isDecision: false, // 决策任务
        dataForm: {
          flowId: '',
          taskId: -1,
          index: 1,
          preTask: -1,
          parentTask: -1,
          taskReferenceName: '',
          remark: '',
          ruleTypeList: [],
          type: '',
          caseValueParam: '',
          caseExpression: '',
          caseSwitchList: '',
          inputParams: '',
          outputParams: '',
          subWorkFlow: '',
          caseExpressionParamType: 0
        },
        caseExpressionParamType: [
          {id: 1, name: '集合类型'},
          {id: 0, name: '普通类型'}
        ],
        dataRule: {
          inputParams: [
            { required: true, message: '任务入参不能为空', trigger: 'blur' },
            { required: true, validator: Filter.NullKongGeRule, trigger: 'change' }
          ],
          outputParams: [
            { required: true, message: '任务出参别名映射不能为空', trigger: 'blur' },
            { required: true, validator: Filter.NullKongGeRule, trigger: 'change' }
          ],
          taskReferenceName: [
            { required: true, message: '参考名称不能为空', trigger: 'blur' },
            { required: true, validator: Filter.NullKongGeRule, trigger: 'change' }
          ],
          caseValueParam: [
            { required: false, validator: Filter.NullKongGeRule, trigger: 'change' }
          ],
          subWorkFlow: [
            { required: false, validator: Filter.NullKongGeRule, trigger: 'change' }
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

    watch: {
      'dataForm.type': {
        handler (newVal, oldVal) {
          if (newVal == 'DECISION') {
            this.isDecision = true
          } else {
            this.isDecision = false
          }
        },
        deep: true,
        immediate: true
      }
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
        getNotBaseTypeList().then(({data}) => {
          if (data && data.message === 'success') {
            this.dataForm.ruleTypeList = data.data
          }
        })
        value && value.map(item => {
          this.preTasklist.push(item.index)
          this.parentTasklist.push({name: item.taskReferenceName, id: item.id})
          this.indexlist.push(item.index)
        })
        var max = 0
        if (this.indexlist.length > 0) {
          max = this.indexlist.reduce(function (a, b) {
            return b > a ? b : a
          })
        } else {
          max = 0
        }
        this.dataForm.index = max + 1
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            let dataBody = this.dataForm
            if (dataBody.type !== 'DECISION') {
              delete dataBody.caseExpressionParamType
            }
            saveWorkTaskFlow(dataBody).then(({data}) => {
              if (data && data.message === 'success') {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 200,
                  onClose: () => {
                    this.visible = false
                    this.dataFormType = true
                    this.isDecision = false
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
                    this.dataForm.caseExpressionParamType = 0
                  }
                })
              } else {
                this.$message.error(data.message ? data.message : data.msg)
              }
            })
          }
        })
      },
      onSelectedDrug (event, item) {
        var findVal = this.taskIdlist.find(item => {
          return item.id === event
        })
        this.dataForm.type = findVal.type
        this.dataFormType = false
      },
      taskDialgClose () {
        this.visible = false
        this.dataFormType = true
        this.isDecision = false
        this.dataForm.taskId = -1
        this.dataForm.index = 1
        this.dataForm.preTask = -1
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
        this.dataForm.caseExpressionParamType = 0
        this.preTasklist = []
        this.parentTasklist = []
        this.indexlist = []
      }
    }
  }
</script>
