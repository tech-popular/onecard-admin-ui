<template>
  <el-dialog title="审批记录" :modal-append-to-body='false' :append-to-body="true" :close-on-click-modal="false" :visible.sync="visible">
    <div><strong>标题：</strong><span>数据中台账号申请</span></div>
    <div><strong>申请人姓名：</strong><span>数据中台账号申请</span></div>
    <div><strong>默认所属部门：</strong><span>数据中台账号申请</span></div>
    <div><strong>申请系统：</strong><span>数据中台账号申请</span></div>
    <div><strong>申请模块：</strong><span>数据中台账号申请</span></div>
    <div><strong>申请权限：</strong><span>数据中台账号申请</span></div>
    <div><strong>申请事由：</strong><span>数据中台账号申请</span></div>
    <div>
      <strong>审批流：</strong>
      <el-steps :space="200" :active="1" finish-status="success">
        <el-step title="丛宁"></el-step>
        <el-step title="欧阳波"></el-step>
        <el-step title="成天华"></el-step>
      </el-steps>
    </div>
    <div><strong>驳回理由：</strong><span>数据中台账号申请</span></div>
    <div v-if="dataForm.type == 'DECISION' || dataForm.type == 'FORK_JOIN' || dataForm.type == 'JOIN' || dataForm.type == ''" slot="footer" class="foot">
      <!-- <el-button @click="visible = false">取消</el-button> -->
      <el-button @click="visible = false">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  // import { getBeeTaskTypeList, infoBeeTask, beeTask } from '@/api/workerBee/metadata'
  // import Filter from './filter'
  export default {
    data () {
      return {
        visible: false,
        dataFormValue: '',
        ruleTypeList: [],
        fatherData: {
          enable: true,
          enableCache: 1,
          parsTemplate: false,
          requestFieldType: 0,
          requestParamTemplateStatus: 0
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
          // getBeeTaskTypeList().then(({data}) => {
          //   if (data && data.status === 0) {
          //     this.ruleTypeList = data.data
          //   }
          // })
          if (id) {
            // const dataBody = {
            //   utcParam: [id]
            // }
            // infoBeeTask(dataBody).then(({data}) => {
            //   if (data && data.status === 0) {
            //     this.dataForm.id = data.beeTaskDef.id
            //     this.dataForm.name = data.beeTaskDef.name
            //     this.dataForm.type = data.beeTaskDef.type
            //     this.dataForm.description = data.beeTaskDef.description
            //     this.dataForm.owner = data.beeTaskDef.owner
            //     this.dataForm.user = data.beeTaskDef.user
            //     this.dataForm.inputParams = data.beeTaskDef.inputParams
            //     this.dataForm.outputParams = data.beeTaskDef.outputParams
            //     this.dataForm.ownerApp = data.beeTaskDef.ownerApp
            //     this.dataForm.remark = data.beeTaskDef.remark
            //     this.fatherData = data[this.dataForm.type.toLowerCase()]
            //   }
            // })
          }
        })
      },
      // 任务类型
      clickType () {
        this.fatherData = {
          enable: true,
          enableCache: 1,
          parsTemplate: false,
          requestFieldType: 0,
          requestParamTemplateStatus: 0
        }
      },
      // 校验是否通过
      fatherCheck () {
        let res = false
        this.$refs['dataForm'].validate((valid) => {
          res = valid
        })
        return res
      },
      // 弹窗状态
      hideVisible (data) {
        this.fatherData = {
          enable: true,
          enableCache: 1,
          parsTemplate: false,
          requestFieldType: 0,
          requestParamTemplateStatus: 0
        }
        this.visible = data
      }
    }
  }
</script>
<style scoped>
</style>>
