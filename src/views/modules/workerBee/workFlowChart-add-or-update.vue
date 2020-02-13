<template>
  <el-dialog title="查看" :modal-append-to-body='false' :append-to-body="true" @close="showClisk" :visible.sync="visible">
    <el-form :model="dataForm" ref="dataForm" label-width="20%">
    <el-form-item label="任务Id">
      <el-input v-model="dataForm.taskId" disabled placeholder="任务Id"/>
    </el-form-item>
    <el-form-item label="任务别名">
      <el-input v-model="dataForm.taskReferenceName" disabled placeholder="任务别名"/>
    </el-form-item>
    <el-form-item label="任务类型">
      <el-input v-model="dataForm.type" disabled placeholder="任务类型"/>
    </el-form-item>
    <el-form-item label="表达式参数类型:" v-show="isDecision">
        <el-select filterable v-model="dataForm.caseExpressionParamType" placeholder="请选择" style="width:100%" disabled>
          <el-option v-for="(item, index) in caseExpressionParamType" :value="item.id" :key="index" :label="item.name"/>
        </el-select>
      </el-form-item>
    <el-form-item label="备注">
      <el-input v-model="dataForm.remark" disabled placeholder="备注"/>
    </el-form-item>
    <el-form-item label="表达式">
      <el-input v-model="dataForm.caseExpression" disabled placeholder="表达式"/>
    </el-form-item>
    <el-form-item label="决策参考" prop="description">
      <el-input v-model="dataForm.caseValueParam" disabled placeholder="决策参考"/>
    </el-form-item>
    <el-form-item label="入参" prop="inputParams">
      <el-input v-model="dataForm.inputParams " disabled placeholder="出参"/>
    </el-form-item>
    <el-form-item label="出参" prop="outputParams">
      <el-input v-model="dataForm.outputParams" disabled placeholder="入参"/>
    </el-form-item>
    
    </el-form>
    <!-- <div v-if="dataForm.type == 'FORK_JOIN' || dataForm.type == 'JOIN' || dataForm.type == ''" slot="footer" class="foot">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </div> -->
  </el-dialog>
</template>

<script>
  import { getTaskDefWithWorkFlowTask } from '@/api/workerBee/workFlow'
  export default {
    data () {
      return {
        visible: false,
        isDecision: false,
        dataForm: {
          taskId: '',
          taskReferenceName: '',
          type: '',
          remark: '',
          caseExpression: '',
          caseValueParam: '',
          caseExpressionParamType: 0
        },
        caseExpressionParamType: [
          {id: 1, name: '集合类型'},
          {id: 0, name: '普通类型'}
        ]
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
      init (id) {
        this.dataForm.id = id || ''
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (id) {
            const dataBody = id
            getTaskDefWithWorkFlowTask(dataBody).then(({data}) => {
              if (data && data.status === 0) {
                this.dataForm = data.data
              }
            })
          }
        })
      },
      showClisk () {
        this.visible = false
      }
    }
  }
</script>
