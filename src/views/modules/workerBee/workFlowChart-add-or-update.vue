<template>
  <el-dialog title="查看" :modal-append-to-body='false' :append-to-body="true" :close-on-click-modal="false" :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="20%">
    <el-form-item label="任务Id" prop="name">
      <el-input v-model="dataForm.name" disabled placeholder="任务Id"/>
    </el-form-item>
    <el-form-item label="任务别名" prop="description">
      <el-input v-model="dataForm.description" disabled placeholder="任务别名"/>
    </el-form-item>
    <el-form-item label="任务类型" prop="type">
        <el-select filterable v-model="dataForm.type" disabled placeholder="请选择" style="100%">
          <el-option v-for="item in ruleTypeList" :value="item.lable" :key="item.value" :label="item.value"/>
        </el-select>
      </el-form-item>
    <el-form-item label="备注" prop="description">
      <el-input v-model="dataForm.description" disabled placeholder="备注"/>
    </el-form-item>
    <el-form-item label="表达式" prop="description">
      <el-input v-model="dataForm.description" disabled placeholder="表达式"/>
    </el-form-item>
    <el-form-item label="决策参考" prop="description">
      <el-input v-model="dataForm.description" disabled placeholder="决策参考"/>
    </el-form-item>
    <el-form-item label="是否启用" prop="enable">
    <el-radio-group v-model="dataForm.enable" disabled>
      <el-radio :label="false">禁用</el-radio>
      <el-radio :label="true">正常</el-radio>
      </el-radio-group>
    </el-form-item>
    
    </el-form>
    <!-- <div v-if="dataForm.type == 'FORK_JOIN' || dataForm.type == 'JOIN' || dataForm.type == ''" slot="footer" class="foot">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </div> -->
  </el-dialog>
</template>

<script>
  import { } from '@/api/workerBee/metadata'
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          id: '',
          name: '', // 任务定义名称
          type: '', // 任务类型
          description: '' // 任务描
        },
        ruleTypeList: [
          {
            value: 'Fork',
            label: 1001
          }, {
            value: 'Join',
            label: 1002
          }, {
            value: 'Descision',
            label: 1003
          }
        ],
        dataRule: {
          name: [
            { required: true, message: '任务定义名称不能为空', trigger: 'blur' }
          ],
          type: [
            { required: true, message: '请选择任务类型', trigger: 'change' }
          ]
        }
      }
    },
    components: {

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
              }
            })
          }
        })
      }
    }
  }
</script>
