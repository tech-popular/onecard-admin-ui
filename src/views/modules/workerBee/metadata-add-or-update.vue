<template>
  <el-dialog :title="!dataForm.id ? '新增' : '修改'" :modal-append-to-body='false' :append-to-body="true" :close-on-click-modal="false" :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="20%">
    <el-form-item label="任务定义名称" prop="name">
      <el-input v-model="dataForm.name" placeholder="任务"/>
    </el-form-item>
    <el-form-item label="任务类型" prop="type">
        <el-select filterable v-model="dataForm.type" placeholder="请选择" @change='clickType()'>
          <el-option v-for="item in ruleTypeList" :value="item.value" :key="item.value" :label="item.label"/>
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
    <!-- <el-form-item label="重试次数" prop="retryCount">
      <el-input v-model="dataForm.retryCount" placeholder="重试次数"/>
    </el-form-item>
    <el-form-item label="任务执行超时时间" prop="timeoutSeconds">
      <el-input v-model="dataForm.timeoutSeconds" placeholder="任务执行超时时间"/>
    </el-form-item> -->
    <el-form-item label="入参数据的key的ID集合" prop="inputParams">
      <el-input v-model="dataForm.inputParams" placeholder="入参数据的key的ID集合"/>
    </el-form-item>
    <el-form-item label="出参数据的key的ID集合" prop="outputParams">
      <el-input v-model="dataForm.outputParams" placeholder="出参数据的key的ID集合"/>
    </el-form-item>
    <!-- <el-form-item label="并发执行限制" prop="concurrentExeclimit">
      <el-input v-model="dataForm.concurrentExeclimit" placeholder="并发执行限制"/>
    </el-form-item>
    <el-form-item label="输入模板" prop="inputTemplate">
      <el-input v-model="dataForm.inputTemplate" placeholder="输入模板"/>
    </el-form-item>
    <el-form-item label="频率限制" prop="rateLimitPerFrequency">
      <el-input v-model="dataForm.rateLimitPerFrequency" placeholder="频率限制"/>
    </el-form-item>
    <el-form-item label="隔离组ID" prop="isolationGroupId">
      <el-input v-model="dataForm.isolationGroupId" placeholder="隔离组ID"/>
    </el-form-item>
    <el-form-item label="执行命名空间" prop="executionNameSpace">
      <el-input v-model="dataForm.executionNameSpace" placeholder="执行命名空间"/>
    </el-form-item> -->
    <el-form-item label="所属系统" prop="ownerApp">
      <el-input v-model="dataForm.ownerApp" placeholder="所属系统"/>
    </el-form-item>
    <el-form-item label="备注" prop="remark">
      <el-input v-model="dataForm.remark" placeholder="备注"/>
    </el-form-item>
    <!-- HTTP 类型1 -->
    <metadata-http
    v-if="dataForm.type == 'HTTP'" :fatherData='fatherData' 
    @hideVisibleClick="hideVisible" @dataFormSumbit="dataFormSumbit" ref="metadataHttp"/>
    <!-- JDBC 类型2 -->
    <metadata-jdbc
    v-if="dataForm.type == 'JDBC'" :fatherData='fatherData' 
    @hideVisibleClick="hideVisible" @dataFormSumbit="dataFormSumbit" ref="metadataJdbc"/>
    <!-- KAFKA 类型3 -->
    <metadata-kafka
    v-if="dataForm.type == 'KAFKA'" :fatherData='fatherData' 
    @hideVisibleClick="hideVisible" @dataFormSumbit="dataFormSumbit" ref="metadataKafka"/>
    <!-- CASSANDRA 类型4 -->
    <metadata-cassandra
    v-if="dataForm.type == 'CASSANDRA'" :fatherData='fatherData' 
    @hideVisibleClick="hideVisible" @dataFormSumbit="dataFormSumbit" ref="metadataCassandra"/>
    <!-- GROOVY 类型5 -->
    <metadata-groovy
    v-if="dataForm.type == 'GROOVY'" :fatherData='fatherData' 
    @hideVisibleClick="hideVisible" @dataFormSumbit="dataFormSumbit" ref="metadataGroovy"/>
    <!-- AVIATOR 类型6 -->
    <metadata-aviator
    v-if="dataForm.type == 'AVIATOR'" :fatherData='fatherData' 
    @hideVisibleClick="hideVisible" @dataFormSumbit="dataFormSumbit" ref="metadataAviator"/>
    <!-- DECISION 类型7 -->
    <metadata-decision
    v-if="dataForm.type == 'DECISION'" :fatherData='fatherData' 
    @hideVisibleClick="hideVisible" @dataFormSumbit="dataFormSumbit" ref="metadataDecision"/>
    </el-form>
  </el-dialog>
</template>

<script>
  import metadataHttp from './metadataSon/metadata-http'
  import metadataJdbc from './metadataSon/metadata-jdbc'
  import metadataKafka from './metadataSon/metadata-kafka'
  import metadataCassandra from './metadataSon/metadata-cassandra'
  import metadataGroovy from './metadataSon/metadata-groovy'
  import metadataAviator from './metadataSon/metadata-aviator'
  import metadataDecision from './metadataSon/metadata-decision'
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          id: '',
          name: '', // 任务定义名称
          type: 'HTTP', // 任务类型
          description: '', // 任务描述
          owner: '', // 任务归属
          user: '', // 任务使用者
          // retryCount: 0, // 重试次数
          // timeoutSeconds: 0, // 任务执行超时时间
          inputParams: '', // 入参数据的key的ID集合
          outputParams: '', // 出参数据的key的ID集合
          // concurrentExeclimit: 0, // 并发执行限制
          // inputTemplate: '', // 输入模板
          // rateLimitPerFrequency: 0, // 频率限制
          // isolationGroupId: 0, // 隔离组ID
          // executionNameSpace: '', // 执行命名空间
          ownerApp: '', // 所属系统
          remark: '' // 备注
        },
        ruleTypeList: [
          {
            value: 'HTTP',
            label: 'HTTP'
          },
          {
            value: 'JDBC',
            label: 'JDBC'
          },
          {
            value: 'KAFKA',
            label: 'KAFKA'
          },
          {
            value: 'CASSANDRA',
            label: 'CASSANDRA'
          },
          {
            value: 'GROOVY',
            label: 'GROOVY'
          },
          {
            value: 'AVIATOR',
            label: 'AVIATOR'
          },
          {
            value: 'DECISION',
            label: 'DECISION'
          }
        ],
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
          enableCache: 1
        }
      }
    },
    components: {
      metadataHttp, // 类型1
      metadataJdbc, // 类型2
      metadataKafka, // 类型3
      metadataCassandra, // 类型4
      metadataGroovy, // 类型5
      metadataAviator, // 类型6
      metadataDecision // 类型7
    },
    methods: {
      init (id) {
        this.dataForm.id = id || ''
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (id) {
            this.$http({
              url: this.$http.adornUrl(`/gongFeng/beeTask/info/${id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
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
          enableCache: 1
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
          enableCache: 1
        }
        this.visible = data
      },
      dataFormSumbit (form) {
        let data = {
          'http': null,
          'gdbc': null,
          'kafka': null,
          'cassandra': null,
          'groovy': null,
          'aviator': null,
          'decision': null
        }
        for (let key in data) {
          if (this.dataForm.type.toLowerCase() == key) {
            data[key] = form
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
        this.$http({
          url: this.$http.adornUrl(`/gongFeng/beeTask/${!this.dataForm.id ? 'saveBeeTask' : 'updateBeeTask'}`),
          method: 'post',
          data: this.$http.adornData(newData)
        }).then(({data}) => {
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
    }
  }
</script>
