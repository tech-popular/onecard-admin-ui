<template>
  <el-dialog :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="20%">
    <el-form-item label="任务定义名称" prop="name">
      <el-input v-model="dataForm.name" placeholder="任务"/>
    </el-form-item>
    <el-form-item label="任务类型" prop="type">
        <el-select filterable v-model="dataForm.type" placeholder="请选择">
          <el-option v-for="item in ruleTypeList" :value="item.value" :key="item.value" :label="item.label"/>
        </el-select>
      </el-form-item>
    <el-form-item label="任务描述" prop="description">
      <el-input v-model="dataForm.description" placeholder="任务"/>
    </el-form-item>
    <!-- HTTP 类型1 -->
    <metadata-http
    v-if="dataForm.type == 'HTTP'" :fatherData='dataForm' 
    @hideVisibleClick="hideVisible" ref="metadataHttp"/>
    <!-- GDBC 类型2 -->
    <metadata-jdbc
    v-if="dataForm.type == 'GDBC'" :fatherData='dataForm' 
    @hideVisibleClick="hideVisible" ref="metadataJdbc"/>
    <!-- KAFKA 类型3 -->
    <metadata-kafka
    v-if="dataForm.type == 'KAFKA'" :fatherData='dataForm' 
    @hideVisibleClick="hideVisible" ref="metadataKafka"/>
    <!-- CASSANDRA 类型4 -->
    <metadata-cassandra
    v-if="dataForm.type == 'CASSANDRA'" :fatherData='dataForm' 
    @hideVisibleClick="hideVisible" ref="metadataCassandra"/>
    <!-- GROOVY 类型5 -->
    <metadata-groovy
    v-if="dataForm.type == 'GROOVY'" :fatherData='dataForm' 
    @hideVisibleClick="hideVisible" ref="metadataGroovy"/>
    <!-- AVIATOR 类型6 -->
    <metadata-aviator
    v-if="dataForm.type == 'AVIATOR'" :fatherData='dataForm' 
    @hideVisibleClick="hideVisible" ref="metadataAviator"/>
    <!-- DECISION 类型7 -->
    <metadata-decision
    v-if="dataForm.type == 'DECISION'" :fatherData='dataForm' 
    @hideVisibleClick="hideVisible" ref="metadataDecision"/>
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
          id: 0,
          name: '', // 任务定义名称
          type: 'HTTP', // 任务类型
          description: '' // 任务描述
        },
        ruleTypeList: [
          {
            value: 'HTTP',
            label: 'HTTP'
          },
          {
            value: 'GDBC',
            label: 'GDBC'
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
            { required: true, message: '请选择任务类型', trigger: 'blur' }
          ],
          description: [
            { required: true, message: '任务描述不能为空', trigger: 'blur' }
          ]
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
    activated () {
      // ...
    },
    methods: {
      init (id) {
        this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(() => {
          // this.$refs['dataForm'].resetFields()
        })
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
        this.visible = data
      }
    }
  }
</script>
