<template>
  <el-dialog :title="!dataForm.id ? '新增' : '修改'"  @close="datano" :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="20%" v-if="type === 'mysql/oracle'">
      <el-form-item label="数据源名称" prop="datasourceName">
        <el-input v-model="dataForm.datasourceName" placeholder="数据源名称"/>
      </el-form-item>
      <el-form-item label="数据源类型" prop="datasourceType">
        <el-select filterable v-model="dataForm.datasourceType" placeholder="请选择"  disabled>
            <el-option v-for="item in typeList" :value="item.value" :key="item.value" :label="item.value"/>
          </el-select>
      </el-form-item>
      <el-form-item label="数据库URL" prop="url">
        <el-input v-model="dataForm.url" placeholder="数据库URL"/>
      </el-form-item>
      <el-form-item label="版本" prop="version">
          <el-select filterable v-model="dataForm.version" placeholder="请选择">
            <el-option v-for="item in versionList" :value="item.id" :key="item.value" :label="item.id"/>
          </el-select>
      </el-form-item>
      <el-form-item label="启用/禁用" prop="enable">
        <el-radio-group v-model="dataForm.enable">
          <el-radio :label="false">禁用</el-radio>
          <el-radio :label="true">启用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="dataForm.remark" placeholder="备注"/>
      </el-form-item>  
    </el-form>
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="20%" v-if="type === 'redis'">
      <el-form-item label="host" prop="host">
        <el-input v-model="dataForm.host" placeholder="host"/>
      </el-form-item>
      <el-form-item label="数据源类型" prop="datasourceType">
        <el-select filterable v-model="dataForm.datasourceType" placeholder="请选择" disabled>
            <el-option v-for="item in typeList" :value="item.value" :key="item.value" :label="item.value"/>
          </el-select>
      </el-form-item>
      <el-form-item label="端口" prop="port">
        <el-input v-model="dataForm.port" placeholder="端口"/>
      </el-form-item>
      <el-form-item label="版本" prop="version">
          <el-select filterable v-model="dataForm.version" placeholder="请选择">
            <el-option v-for="item in versionList" :value="item.id" :key="item.value" :label="item.id"/>
          </el-select>
      </el-form-item>
      <el-form-item label="启用/禁用" prop="enable">
        <el-radio-group v-model="dataForm.enable">
          <el-radio :label="false">禁用</el-radio>
          <el-radio :label="true">启用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="dataForm.remark" placeholder="备注"/>
      </el-form-item>  
    </el-form>
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="20%" v-if="type === 'cassandra'">
      <el-form-item label="数据库名字" prop="datasourceName">
        <el-input v-model="dataForm.datasourceName" placeholder="数据库名字"/>
      </el-form-item>
      <el-form-item label="数据源类型" prop="datasourceType">
        <el-select filterable v-model="dataForm.datasourceType" placeholder="请选择" disabled>
            <el-option v-for="item in typeList" :value="item.value" :key="item.value" :label="item.value"/>
          </el-select>
      </el-form-item>
      <el-form-item label="键空间名称" prop="keyspaceName">
        <el-input v-model="dataForm.keyspaceName" placeholder="键空间名称"/>
      </el-form-item>
      <el-form-item label="版本" prop="version">
          <el-select filterable v-model="dataForm.version" placeholder="请选择">
            <el-option v-for="item in versionList" :value="item.id" :key="item.value" :label="item.id"/>
          </el-select>
      </el-form-item>
      <el-form-item label="启用/禁用" prop="enable">
        <el-radio-group v-model="dataForm.enable">
          <el-radio :label="false">禁用</el-radio>
          <el-radio :label="true">启用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="dataForm.remark" placeholder="备注"/>
      </el-form-item>  
    </el-form>
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="20%" v-if="type === 'hbase'">
      <el-form-item label="zookeeper名称" prop="zookeeperName">
        <el-input v-model="dataForm.zookeeperName" placeholder="zookeeper名称"/>
      </el-form-item>
      <el-form-item label="数据源类型" prop="datasourceType">
        <el-select filterable v-model="dataForm.datasourceType" placeholder="请选择" @change="clickType" disabled>
            <el-option v-for="item in typeList" :value="item.value" :key="item.value" :label="item.value"/>
          </el-select>
      </el-form-item>
      <el-form-item label="zookeeper" prop="zookeeperQuorum">
        <el-input v-model="dataForm.zookeeperQuorum" placeholder="zookeeper"/>
      </el-form-item>
      <el-form-item label="版本" prop="version">
          <el-select filterable v-model="dataForm.version" placeholder="请选择">
            <el-option v-for="item in versionList" :value="item.id" :key="item.value" :label="item.id"/>
          </el-select>
      </el-form-item>
      <el-form-item label="启用/禁用" prop="enable">
        <el-radio-group v-model="dataForm.enable">
          <el-radio :label="false">禁用</el-radio>
          <el-radio :label="true">启用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="dataForm.remark" placeholder="备注"/>
      </el-form-item>  
    </el-form>
    <span slot="footer">
      <el-button @click="datano()">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { saveorupt } from '@/api/workerBee/ascription'
  import Filter from './filter'
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          datasourceName: '',
          datasourceType: '',
          url: '',
          enable: true,
          version: '',
          remark: '',
          host: '',
          port: '',
          zookeeperName: '',
          zookeeperQuorum: '',
          keyspaceName: ''
        },
        type: '',
        typeList: [
          {id: 1, value: 'mysql/oracle'},
          {id: 2, value: 'redis'},
          {id: 3, value: 'hbase'},
          {id: 4, value: 'cassandra'}
        ],
        dataRule: {
          datasourceName: [
            { required: true, message: '数据源名称不能为空', trigger: 'blur' },
            { required: true, validator: Filter.NullKongGeRule, trigger: 'change' }
          ],
          host: [
            { required: true, message: 'host不能为空', trigger: 'blur' },
            { required: true, validator: Filter.NullKongGeRule, trigger: 'change' }
          ],
          port: [
            { required: true, message: '端口不能为空', trigger: 'blur' },
            { required: true, validator: Filter.NullKongGeRule, trigger: 'change' }
          ],
          zookeeperName: [
            { required: true, message: 'zookeeper名称不能为空', trigger: 'blur' },
            { required: true, validator: Filter.NullKongGeRule, trigger: 'change' }
          ],
          zookeeperQuorum: [
            { required: true, message: 'zookeeperQuorum不能为空', trigger: 'blur' },
            { required: true, validator: Filter.NullKongGeRule, trigger: 'change' }
          ],
          keyspaceName: [
            { required: true, message: '键空间名称不能为空', trigger: 'blur' },
            { required: true, validator: Filter.NullKongGeRule, trigger: 'change' }
          ],
          datasourceType: [
            { required: true, message: '请选择数据源类型', trigger: 'blur' },
            { required: true, validator: Filter.NullKongGeRule, trigger: 'change' }
          ],
          url: [
            { required: true, message: '数据库URL不能为空', trigger: 'blur' },
            { required: true, validator: Filter.NullKongGeRule, trigger: 'change' }
          ],
          enable: [
            { required: true, message: '请选择启用/禁用', trigger: 'blur' },
            { required: true, validator: Filter.NullKongGeRule, trigger: 'change' }
          ],
          remark: [
            { required: true, message: '备注不能为空', trigger: 'blur' },
            { required: true, validator: Filter.NullKongGeRule, trigger: 'change' }
          ],
          version: [
            { required: true, message: '请选择版本', trigger: 'blur' },
            { required: true, validator: Filter.NullKongGeRule, trigger: 'change' }
          ]
        },
        versionList: [
          {id: '1.0', value: '1.0'}
        ]
      }
    },
    mounted () {
    },
    components: {
    },
    methods: {
      init (id, type) {
        this.type = type
        this.dataForm.datasourceType = type
        this.updateId = id
        this.dataForm.id = id || 0
        this.visible = true
        // this.$nextTick(() => {
        //   this.$refs['dataForm'].resetFields()
        //   if (this.dataForm.id) {
        //     console.log('调接口')
        //   }
        // })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            saveorupt(this.dataForm).then(({data}) => {
              if (data && data.message === 'success') {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 300,
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshDataList')
                  }
                })
              } else {
                this.$message({
                  message: data.message || '数据异常',
                  type: 'error'
                })
              }
            })
          }
        })
      },
      datano () {
        this.visible = false
        this.dataForm.description = ''
        this.dataForm.createdBy = ''
        this.dataForm.ownerApp = ''
      }
    }
  }
</script>
