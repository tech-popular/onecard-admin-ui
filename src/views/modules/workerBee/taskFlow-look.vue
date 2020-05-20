<template>
  <el-dialog title="查看任务关系" @close="taskDialgClose" :visible.sync="visible">
    <el-form :model="dataForm" ref="dataForm" label-width="20%">
      <el-form-item label="工作流Id">
        <span>{{dataForm.flowId}}</span>
      </el-form-item>
      <el-form-item label="任务Id">
        <span>{{dataForm.taskId}}</span>
      </el-form-item>
      <el-form-item label="任务类型">
        <span>{{dataForm.type}}</span>
      </el-form-item>
      <el-form-item label="表达式参数类型">
        <span>{{dataForm.caseExpressionParamType}}</span>
      </el-form-item>
      <el-form-item label="父级名称">
        <span>{{dataForm.parentTask}}</span>
      </el-form-item>
      <el-form-item label="执行下标">
        <span>{{dataForm.index}}</span>
      </el-form-item>
      <el-form-item label="参考名称">
        <span>{{dataForm.taskReferenceName}}</span>
      </el-form-item>
      <el-form-item label="判断case参数" v-if="dataForm.type === 'DECISION'">
        <span>{{dataForm.caseValueParam}}</span>
      </el-form-item>
      <el-form-item label="判断表达式" v-if="dataForm.type === 'DECISION'">
        <span>{{dataForm.caseExpression}}</span>
      </el-form-item>
      <el-form-item label="switch判断项集合" v-if="dataForm.type === 'DECISION'">
        <span>{{dataForm.caseSwitchList}}</span>
      </el-form-item>
      <el-form-item label="任务入参">
        <span>{{dataForm.inputParams}}</span>
      </el-form-item>
       <el-form-item label="任务出参别名映射">
        <span>{{dataForm.outputParams}}</span>
      </el-form-item>
      <el-form-item label="任务加入任务Id">
        <span>{{dataForm.preTask}}</span>
      </el-form-item>
      <el-form-item label="子流程ID">
        <span>{{dataForm.subWorkFlow}}</span>
      </el-form-item>
      <el-form-item label="备注">
        <span>{{dataForm.remark}}</span>
      </el-form-item>
      <!-- HTTP 类型1 -->
      <taskFlow-http v-if="dataForm.type == 'HTTP'" :fatherData='fatherData' ref="taskFlowHttp"/>
      <!-- JDBC 类型2 -->
      <taskFlow-jdbc v-if="dataForm.type == 'JDBC'" :fatherData='fatherData' ref="taskFlowJdbc"/>
      <!-- KAFKA 类型3 -->
      <taskFlow-kafka v-if="dataForm.type == 'KAFKA'" :fatherData='fatherData' ref="taskFlowKafka"/>
      <!-- CASSANDRA 类型4 -->
      <taskFlow-cassandra v-if="dataForm.type == 'CASSANDRA'" :fatherData='fatherData' ref="taskFlowCassandra"/>
      <!-- GROOVY 类型5 -->
      <taskFlow-groovy v-if="dataForm.type == 'GROOVY'" :fatherData='fatherData' ref="taskFlowGroovy"/>
      <!-- AVIATOR 类型6 -->
      <taskFlow-aviator v-if="dataForm.type == 'AVIATOR'" :fatherData='fatherData' ref="taskFlowAviator"/>
      <!-- FREEMARKER 类型7 -->
      <taskFlow-freemarke v-if="dataForm.type == 'FREEMARKER'" :fatherData='fatherData' ref="taskFlowFreemarke"/>
      <!-- HBASE 类型8 -->
      <taskFlow-Hbase v-if="dataForm.type == 'HBASE'" :fatherData='fatherData' ref="taskFlowHbase"/>
      <!-- REDIS 类型9 -->
      <taskFlow-redis v-if="dataForm.type == 'REDIS'" :fatherData='fatherData' ref="taskFlowRedis"/>
    </el-form>
    <span slot="footer">
      <el-button @click="taskDialgClose">取消</el-button>
      <el-button type="primary" @click="taskDialgClose">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { workFlowTaskshow } from '@/api/workerBee/workFlow'
  import taskFlowRedis from './flowLook/flowLook-redis'
  import taskFlowHttp from './flowLook/flowLook-http'
  import taskFlowCassandra from './flowLook/flowLook-cassandra'
  import taskFlowJdbc from './flowLook/flowLook-jdbc'
  import taskFlowKafka from './flowLook/flowLook-kafka'
  import taskFlowGroovy from './flowLook/flowLook-groovy'
  import taskFlowAviator from './flowLook/flowLook-aviator'
  import taskFlowFreemarke from './flowLook/flowLook-freemarke'
  import taskFlowHbase from './flowLook/flowLook-hbase'

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
        fatherData: []
      }
    },
    components: {
      taskFlowRedis,
      taskFlowHttp,
      taskFlowCassandra,
      taskFlowJdbc,
      taskFlowKafka,
      taskFlowGroovy,
      taskFlowAviator,
      taskFlowFreemarke,
      taskFlowHbase
    },

    methods: {
      init (id, flowId) {
        this.dataForm.flowId = flowId
        this.visible = true
        workFlowTaskshow(id).then(({data}) => {
          if (data && data.message === 'success') {
            this.dataForm = data.data.beeWorkFlowTaskVo
            if (this.dataForm.type == 'HTTP') {
              this.fatherData = data.data.beeTaskVo.http
            }
            if (this.dataForm.type == 'JDBC') {
              this.fatherData = data.data.beeTaskVo.jdbc
            }
            if (this.dataForm.type == 'KAFKA') {
              this.fatherData = data.data.beeTaskVo.kafka
            }
            if (this.dataForm.type == 'CASSANDRA') {
              this.fatherData = data.data.beeTaskVo.cassandra
            }
            if (this.dataForm.type == 'GROOVY') {
              this.fatherData = data.data.beeTaskVo.groovy
            }
            if (this.dataForm.type == 'AVIATOR') {
              this.fatherData = data.data.beeTaskVo.aviator
            }
            if (this.dataForm.type == 'FREEMARKER') {
              this.fatherData = data.data.beeTaskVo.freemarker
            }
            if (this.dataForm.type == 'HBASE') {
              this.fatherData = data.data.beeTaskVo.hbase
            }
            if (this.dataForm.type == 'REDIS') {
              this.fatherData = data.data.beeTaskVo.redis
            }
            console.log(this.fatherData, 'sha')
          }
        })
      },
      taskDialgClose () {
        this.visible = false
        this.dataFormType = true
        this.isDecision = false
      }
    }
  }
</script>
