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
    <!-- aviator --- 类型1 -->
    <metadata-aviator v-if="dataForm.type == 'HTTP'" :fatherData='dataForm' @hideVisibleClick="hideVisible" ref="metadataAviator"/>
    <!-- cassandra --- 类型2 -->
    <metadata-cassandra v-if="dataForm.type == 'GDBC'" :fatherData='dataForm' @hideVisibleClick="hideVisible" ref="metadataCassandra"/>
    <!-- decision --- 类型3 -->
    <metadata-decision v-if="dataForm.type == 'KAFKA'" :fatherData='dataForm' @hideVisibleClick="hideVisible" ref="metadataDecision"/>
    </el-form>
  </el-dialog>
</template>

<script>
  import metadataAviator from './metadataSon/metadata-aviator'
  import metadataCassandra from './metadataSon/metadata-cassandra'
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
      metadataAviator, // 类型1
      metadataCassandra, // 类型2
      metadataDecision // 类型3
    },
    activated () {
      // ...
    },
    methods: {
      init (id) {
        this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/gongFeng/beeTask/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.name = data.beeTaskDef.name
                this.dataForm.type = data.beeTaskDef.type
                this.dataForm.description = data.beeTaskDef.description
              }
            })
          }
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
