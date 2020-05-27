<template>
  <el-dialog :title="renwuId ? '修改任务关系' : '新增任务关系'" @close="taskDialgClose" :visible.sync="visible">
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
        <el-select v-model="dataForm.type" placeholder="任务类型" style="width:100%" filterable  v-if="dataFormType === true" @change="renwu">
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
      <el-form-item label="判断case参数" prop="caseValueParam" v-if="zirenwucarent === 'DECISION'">
        <el-input v-model="dataForm.caseValueParam" placeholder="判断case参数"/>
      </el-form-item>
      <el-form-item label="判断表达式" prop="caseExpression" :rules="dataRule.caseExpression" v-if="zirenwucarent === 'DECISION'">
        <el-input v-model="dataForm.caseExpression" placeholder="判断表达式"/>
      </el-form-item>
      <el-form-item label="switch判断项集合" prop="caseSwitchList" :rules="dataRule.caseSwitchList" v-if="zirenwucarent === 'DECISION'">
        <el-input v-model="dataForm.caseSwitchList" placeholder="switch判断项集合"/>
      </el-form-item>
        <el-form-item label="join_on" prop="join_on" v-if="zirenwucarent === 'JOIN'">
        <el-input v-model="dataForm.join_on" placeholder="join_on"/>
      </el-form-item>
      <el-form-item label="任务入参" prop="inputParams">
        <el-input v-model="dataForm.inputParams" placeholder="例：{'inputName':'inputOtherName'}"/>
      </el-form-item>
       <el-form-item label="任务出参别名映射" prop="outputParams">
        <el-input v-model="dataForm.outputParams" placeholder="例：{'outputName':'outputOtherName'} "/>
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
      <el-form-item label="子流程ID" prop="subWorkFlow" v-if="zirenwucarent === 'SUB_WORKFLOW' || zirenwucarent === 'FOR_EACH'">
        <el-select v-model="dataForm.subWorkFlowName" filterable placeholder="子流程ID" style="width:100%" @change="ziliucheng">
          <el-option
            v-for="(item) in renwuindexlist"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="子流程ID" prop="subWorkFlow" v-else>
        <el-select v-model="dataForm.subWorkFlowName" filterable placeholder="子流程ID" style="width:100%" @change="ziliucheng">
          <el-option
            v-for="(item, index) in indexlist"
            :key="index"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
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
  import { saveWorkTaskFlow, getAllBeeTaskList, getNotBaseTypeList, getAllWorkFlow, workFlowTaskinfo } from '@/api/workerBee/workFlow'
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
          subWorkFlowName: '',
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
          // caseValueParam: [
          //   { required: true, message: '判断case参数不能为空', trigger: 'blur' }
          // ],
          caseExpression: [
            { required: true, message: '判断表达式不能为空', trigger: 'blur' },
            { required: false, validator: Filter.NullKongGeRule, trigger: 'change' }
          ],
          caseSwitchList: [
            { required: true, message: 'switch判断项集合不能为空', trigger: 'blur' },
            { required: false, validator: Filter.NullKongGeRule, trigger: 'change' }
          ],
          subWorkFlow: [
            { required: false, validator: Filter.NullKongGeRule, trigger: 'change' }
          ]
        },
        taskIdlist: [],
        preTasklist: [],
        parentTasklist: [],
        indexlist: [],
        renwuindexlist: [],
        zirenwucarent: '',
        renwuId: ''
      }
    },
    components: {
  
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
      init (id, value, flowId) {
        this.renwuId = id
        this.dataForm.flowId = flowId
        this.visible = true
        const dataBody = {}
        getAllWorkFlow(this.dataForm.flowId).then(({data}) => {
          if (data && data.message === 'success') {
            this.renwuindexlist = data.data
          }
        })
        if (id) {
          workFlowTaskinfo(id).then(({data}) => {
            if (data && data.message === 'success') {
              this.dataForm.taskId = data.data.taskId
              this.dataForm.index = data.data.index
              this.dataForm.preTask = data.data.preTask
              this.dataForm.parentTask = data.data.parentTask
              this.dataForm.taskReferenceName = data.data.taskReferenceName
              this.dataForm.remark = data.data.remark
              this.dataForm.type = data.data.type
              this.dataForm.caseValueParam = data.data.caseValueParam
              this.dataForm.caseExpression = data.data.caseExpression
              this.dataForm.caseSwitchList = data.data.caseSwitchList
              this.dataForm.inputParams = data.data.inputParams
              this.dataForm.outputParams = data.data.outputParams
              this.dataForm.subWorkFlowName = data.data.subWorkFlowName
              this.dataForm.subWorkFlow = data.data.subWorkFlow
              this.dataForm.caseExpressionParamType = data.data.caseExpressionParamType
              this.zirenwucarent = data.data.type
            }
          })
        }
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
  
        value && value.length > 0 && value.map(item => {
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
            saveWorkTaskFlow(dataBody, this.renwuId).then(({data}) => {
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
                    this.dataForm.subWorkFlowName = ''
                    this.dataForm.caseExpressionParamType = 0
                    this.zirenwucarent = ''
                  }
                })
              } else {
                this.$message.error(data.message ? data.message : data.msg)
              }
            })
          }
        })
      },
       // 获取子流程id
      ziliucheng (val) {
        this.dataForm.subWorkFlow = val
      },
      // 任务类型调用接口
      renwu (value) {
        this.zirenwucarent = value
        if (value === 'SUB_WORKFLOW' || value === 'FOR_EACH') {
          getAllWorkFlow(this.dataForm.flowId).then(({data}) => {
            if (data && data.message === 'success') {
              this.renwuindexlist = data.data
            }
          })
        }
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
        this.dataForm.subWorkFlowName = ''
        this.dataForm.caseExpressionParamType = 0
        this.preTasklist = []
        this.parentTasklist = []
        this.indexlist = []
        this.renwuindexlist = []
        this.zirenwucarent = ''
      }
    }
  }
</script>
