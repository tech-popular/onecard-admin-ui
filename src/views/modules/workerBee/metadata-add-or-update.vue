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
    <el-form-item label="是否启用" prop="enable">
      <el-radio-group v-model="dataForm.enable">
          <el-radio :label="0">禁用</el-radio>
          <el-radio :label="1">正常</el-radio>
        </el-radio-group>
    </el-form-item>
    <!-- aviator_类型1 -->
    <metadata-aviator v-if="dataForm.type == '0'" ref="metadataAviator"/>
    <!-- cassandra_类型2 -->
    <metadata-cassandra v-if="dataForm.type == '1'" ref="metadataCassandra"/>
    <!-- decision_类型3 -->
    <metadata-decision v-if="dataForm.type == '2'" ref="metadataDecision"/>
    </el-form>
    <span slot="footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import metadataAviator from './metadata-aviator'
  import metadataCassandra from './metadata-cassandra'
  import metadataDecision from './metadata-decision'
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          id: 0,
          name: '', // 任务定义名称
          type: '', // 任务类型
          description: '', // 任务描述
          enable: 1
        },
        ruleTypeList: [
          {
            value: '0',
            label: '类型1'
          },
          {
            value: '1',
            label: '类型2'
          },
          {
            value: '2',
            label: '类型3'
          },
          {
            value: '3',
            label: '类型4'
          },
          {
            value: '4',
            label: '类型5'
          },
          {
            value: '5',
            label: '类型6'
          },
          {
            value: '6',
            label: '类型7'
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
          ],
          enable: [
            { required: true, message: '是否启用不能为空', trigger: 'blur' }
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
              url: this.$http.adornUrl(`/canary/canaryproject/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.name = data.canaryProject.name
                this.dataForm.type = data.canaryProject.type
                this.dataForm.description = data.canaryProject.description
                this.dataForm.enable = data.canaryProject.enable
              }
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/canary/canaryproject/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'name': this.dataForm.name,
                'type': this.dataForm.type,
                'description': this.dataForm.description,
                'enable': this.dataForm.enable
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshDataList')
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
