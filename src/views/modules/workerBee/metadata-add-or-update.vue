<template>
  <el-dialog :title="dataFormValue ? '查看' : dataForm.id ? '修改' : '新增'" :modal-append-to-body='false' :append-to-body="true" :close-on-click-modal="false" :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="20%">
    <el-form-item label="任务定义名称" prop="name">
      <el-input v-model="dataForm.name" onkeyup="this.value=this.value.replace(/\s+/g,'')" v-if="!dataFormValue" placeholder="任务"/>
      <el-input v-model="dataForm.name" v-else disabled placeholder="任务"/>
    </el-form-item>
    <el-form-item label="任务类型" prop="type" v-if="dataForm.id">
      <el-select filterable v-model="dataForm.type" placeholder="请选择" @change='clickType()' disabled>
        <el-option v-for="item in ruleTypeList" :value="item.baseValue" :key="item.value" :label="item.baseName"/>
      </el-select>
    </el-form-item>
    <el-form-item label="任务类型" prop="type" v-else>
      <el-select filterable v-model="dataForm.type" placeholder="请选择" @change='clickType()'>
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
      <el-input v-model="dataForm.inputParams" placeholder="param1,param2(多个参数逗号隔开)"/>
    </el-form-item>
    <el-form-item label="出参数据的key的ID集合" prop="outputParams">
      <el-input v-model="dataForm.outputParams" placeholder="result1,result2(多个结果逗号隔开)"/>
    </el-form-item>
    <el-form-item label="所属系统" prop="ownerApp">
      <el-input v-model="dataForm.ownerApp" placeholder="所属系统"/>
    </el-form-item>
    <el-form-item label="备注" prop="remark">
      <el-input v-model="dataForm.remark" placeholder="备注"/>
    </el-form-item>
    <!-- HTTP 类型1 -->
    <metadata-http
    v-if="dataForm.type == 'HTTP'" :fatherData='fatherData'
    @hideVisibleClick="hideVisible" @dataFormSubmit="dataFormSubmit" ref="metadataHttp"/>
    <!-- JDBC 类型2 -->
    <metadata-jdbc
    v-if="dataForm.type == 'JDBC'" :fatherData='fatherData'
    @hideVisibleClick="hideVisible" @dataFormSubmit="dataFormSubmit" ref="metadataJdbc"/>
    <!-- KAFKA 类型3 -->
    <metadata-kafka
    v-if="dataForm.type == 'KAFKA'" :fatherData='fatherData'
    @hideVisibleClick="hideVisible" @dataFormSubmit="dataFormSubmit" ref="metadataKafka"/>
    <!-- CASSANDRA 类型4 -->
    <metadata-cassandra
    v-if="dataForm.type == 'CASSANDRA'" :fatherData='fatherData'
    @hideVisibleClick="hideVisible" @dataFormSubmit="dataFormSubmit" ref="metadataCassandra"/>
    <!-- GROOVY 类型5 -->
    <metadata-groovy
    v-if="dataForm.type == 'GROOVY'" :fatherData='fatherData'
    @hideVisibleClick="hideVisible" @dataFormSubmit="dataFormSubmit" ref="metadataGroovy"/>
    <!-- AVIATOR 类型6 -->
    <metadata-aviator
    v-if="dataForm.type == 'AVIATOR'" :fatherData='fatherData'
    @hideVisibleClick="hideVisible" @dataFormSubmit="dataFormSubmit" ref="metadataAviator"/>
     <!-- FREEMARKER 类型7 -->
    <metadata-freemarke
    v-if="dataForm.type == 'FREEMARKER'" :fatherData='fatherData'
    @hideVisibleClick="hideVisible" @dataFormSubmit="dataFormSubmit" ref="metadataFreemarke"/>
    <!-- HBASE 类型8 -->
    <metadataHbase
    v-if="dataForm.type == 'HBASE'" :fatherData='fatherData'
    @hideVisibleClick="hideVisible" @dataFormSubmit="dataFormSubmit" ref="metadataHbase"/>
    <!-- REDIS 类型9 -->
    <metadataRedis
    v-if="dataForm.type == 'REDIS'" :fatherData='fatherData'
    @hideVisibleClick="hideVisible" @dataFormSubmit="dataFormSubmit" ref="metadataRedis"/>
    </el-form>
   
    <div v-if="dataForm.type == 'DECISION' || dataForm.type == 'FORK_JOIN' || dataForm.type == 'JOIN' || dataForm.type == ''" slot="footer" class="foot">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import metadataHttp from './metadataSon/metadata-http'
  import metadataJdbc from './metadataSon/metadata-jdbc'
  import metadataKafka from './metadataSon/metadata-kafka'
  import metadataCassandra from './metadataSon/metadata-cassandra'
  import metadataGroovy from './metadataSon/metadata-groovy'
  import metadataAviator from './metadataSon/metadata-aviator'
  import metadataFreemarke from './metadataSon/metadata-freemarke'
  import metadataHbase from './metadataSon/metadata-hbase'
  import metadataRedis from './metadataSon/metadata-redis'

  import { getBeeTaskTypeList, infoBeeTask, beeTask } from '@/api/workerBee/metadata'
  import Filter from './filter'
  export default {
    data () {
      var checkDecisionName = (rule, value, callback) => {
        const nullValue = /^[^\s]+$/
        if (!value) {
          callback(new Error('请输入任务定义名称'))
        }
        if (!nullValue.test(value)) {
          callback(new Error('不能输入含空格的任务定义名称'))
        }
        callback()
      }
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
            { required: true, validator: checkDecisionName, trigger: 'change' },
            { required: true, validator: Filter.NullKongGeRule, trigger: 'change' }
          ],
          type: [
            { required: true, message: '请选择任务类型', trigger: 'change' }
          ],
          description: [
            { required: false, validator: Filter.NullKongGeRule, trigger: 'change' }
          ],
          owner: [
            { required: false, validator: Filter.NullKongGeRule, trigger: 'change' }
          ],
          user: [
            { required: false, validator: Filter.NullKongGeRule, trigger: 'change' }
          ],
          inputParams: [
            { required: false, validator: Filter.NullKongGeRule, trigger: 'change' }
          ],
          outputParams: [
            { required: false, validator: Filter.NullKongGeRule, trigger: 'change' }
          ],
          ownerApp: [
            { required: false, validator: Filter.NullKongGeRule, trigger: 'change' }
          ]
        },
        fatherData: {
          enable: true,
          enableCache: 1,
          parsTemplate: false,
          requestFieldType: 0,
          isQuery: 1,
          requestParamTemplateStatus: 0,
          type: ''
        }
      }
    },
    components: {
      metadataHttp, // HTTP
      metadataJdbc, // JDBC
      metadataKafka, // KAFKA
      metadataCassandra, // CASSANDRA
      metadataGroovy, // GROOVY
      metadataAviator, // AVIATOR
      metadataFreemarke, // Freemarke
      metadataHbase, // Hbase
      metadataRedis // Redis
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
                this.dataForm.id = data.beeTaskDef.id
                this.dataForm.name = data.beeTaskDef.name
                this.dataForm.type = data.beeTaskDef.type
                this.dataForm.description = data.beeTaskDef.description
                this.dataForm.owner = data.beeTaskDef.owner
                this.dataForm.user = data.beeTaskDef.user
                this.dataForm.inputParams = data.beeTaskDef.inputParams
                this.dataForm.outputParams = data.beeTaskDef.outputParams
                this.dataForm.ownerApp = data.beeTaskDef.ownerApp
                this.dataForm.remark = data.beeTaskDef.remark
                this.fatherData = data[this.dataForm.type.toLowerCase()]
              }
            })
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
          isQuery: 1,
          type: this.dataForm.type,
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
      },
      dataFormSubmit (form) {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            let data = {
              'http': null,
              'jdbc': null,
              'kafka': null,
              'cassandra': null,
              'groovy': null,
              'aviator': null,
              'freemarker': null,
              'hbase': null,
              'redis': null
            }
            if (form) {
              for (let key in data) {
                if (this.dataForm.type.toLowerCase() == key) {
                  data[key] = form
                }
              }
            }
            this.dataForm = {
              ...this.dataForm,
              id: Number(this.dataForm.id)
            }
            let newData = {
              'beeTaskDef': this.dataForm,
              ...data
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
