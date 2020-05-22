<template>
  <el-dialog :title="!updateId ? '新增' : '修改'"  @close="datano" :visible.sync="visible">
    <el-form :model="mysqldataForm" :rules="mysqldataRule" ref="mysqldataForm" label-width="20%" v-if="type === 'mysql/oracle'">
      <el-form-item label="数据源名称" prop="datasourceName">
        <el-input v-model="mysqldataForm.datasourceName" placeholder="数据源名称"/>
      </el-form-item>
      <el-form-item label="数据源类型" prop="datasourceType">
        <el-select filterable v-model="mysqldataForm.datasourceType" placeholder="请选择">
            <el-option v-for="item in datasourceTypeList" :value="item.value" :key="item.value" :label="item.value"/>
          </el-select>
      </el-form-item>
      <el-form-item label="数据库驱动" prop="driver">
        <el-input v-model="mysqldataForm.driver" placeholder="数据库驱动"/>
      </el-form-item>
      <el-form-item label="数据库用户名" prop="user">
        <el-input v-model="mysqldataForm.user" placeholder="数据库用户名"/>
      </el-form-item>
      <el-form-item label="数据库密码" prop="passwd">
        <el-input v-model="mysqldataForm.passwd" placeholder="数据库密码"/>
      </el-form-item>
      <el-form-item label="数据库URL" prop="url">
        <el-input v-model="mysqldataForm.url" placeholder="数据库URL"/>
      </el-form-item>
      <el-form-item label="版本" prop="version">
          <el-select filterable v-model="mysqldataForm.version" placeholder="请选择">
            <el-option v-for="item in versionList" :value="item.id" :key="item.value" :label="item.id"/>
          </el-select>
      </el-form-item>
      <el-form-item label="启用/禁用" prop="enable">
        <el-radio-group v-model="mysqldataForm.enable">
          <el-radio :label="false">禁用</el-radio>
          <el-radio :label="true">启用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="mysqldataForm.remark" placeholder="备注"/>
      </el-form-item>  
    </el-form>
    <el-form :model="redisdataForm" :rules="redisdataRule" ref="redisdataForm" label-width="20%" v-if="type === 'redis'">
      <el-form-item label="host" prop="host">
        <el-input v-model="redisdataForm.host" placeholder="host"/>
      </el-form-item>
      <el-form-item label="端口" prop="port">
        <el-input v-model="redisdataForm.port" placeholder="端口"/>
      </el-form-item>
      <el-form-item label="密码" prop="passwd">
        <el-input v-model="redisdataForm.passwd" placeholder="数据库密码"/>
      </el-form-item>
      <el-form-item label="最大闲置" prop="idle">
        <el-input v-model="redisdataForm.idle" placeholder="最大闲置"/>
      </el-form-item>
      <el-form-item label="最大连接数" prop="total">
        <el-input v-model="redisdataForm.total" placeholder="最大连接数"/>
      </el-form-item>
      <el-form-item label="最大等待时长(毫秒)" prop="waitmillis">
        <el-input v-model="redisdataForm.waitmillis" placeholder="最大等待时长(毫秒)"/>
      </el-form-item>
      <el-form-item label="版本" prop="version">
          <el-select filterable v-model="redisdataForm.version" placeholder="请选择">
            <el-option v-for="item in versionList" :value="item.id" :key="item.value" :label="item.id"/>
          </el-select>
      </el-form-item>
      <el-form-item label="启用/禁用" prop="enable">
        <el-radio-group v-model="redisdataForm.enable">
          <el-radio :label="false">禁用</el-radio>
          <el-radio :label="true">启用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="redisdataForm.remark" placeholder="备注"/>
      </el-form-item>  
    </el-form>
     <!-- REDIS 类型9 -->
    <!-- <dataTYpeFormRedis
     v-if="type === 'redis'" :fatherData='fatherData'
    @hideVisibleClick="hideVisible" @dataFormSubmit="dataFormSubmit" ref="dataTYpeFormRedis"/> -->
    <el-form :model="cassandradataForm" :rules="cassandradataRule" ref="cassandradataForm" label-width="20%" v-if="type === 'cassandra'">
      <el-form-item label="数据源名字" prop="datasourceName">
        <el-input v-model="cassandradataForm.datasourceName" placeholder="数据库名字"/>
      </el-form-item>
      <el-form-item label="集群节点地址" prop="contactPoints">
        <el-input v-model="cassandradataForm.contactPoints" placeholder="集群节点地址"/>
      </el-form-item>
      <el-form-item label="键空间名称" prop="keyspaceName">
        <el-input v-model="cassandradataForm.keyspaceName" placeholder="键空间名称"/>
      </el-form-item>
      <el-form-item label="端口" prop="port">
        <el-input v-model="cassandradataForm.port" placeholder="端口"/>
      </el-form-item>
       <el-form-item label="用户名" prop="user">
        <el-input v-model="cassandradataForm.user" placeholder="用户名"/>
      </el-form-item>
      <el-form-item label="密码" prop="passwd">
        <el-input v-model="cassandradataForm.passwd" placeholder="密码"/>
      </el-form-item>
      <el-form-item label="版本" prop="version">
          <el-select filterable v-model="cassandradataForm.version" placeholder="请选择">
            <el-option v-for="item in versionList" :value="item.id" :key="item.value" :label="item.id"/>
          </el-select>
      </el-form-item>
      <el-form-item label="启用/禁用" prop="enable">
        <el-radio-group v-model="cassandradataForm.enable">
          <el-radio :label="false">禁用</el-radio>
          <el-radio :label="true">启用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="cassandradataForm.remark" placeholder="备注"/>
      </el-form-item>  
    </el-form>
    <el-form :model="hbasedataForm" :rules="hbasedataRule" ref="hbasedataForm" label-width="20%" v-if="type === 'hbase'">
      <el-form-item label="zookeeper名称" prop="zookeeperName">
        <el-input v-model="hbasedataForm.zookeeperName" placeholder="zookeeper名称"/>
      </el-form-item>
      <el-form-item label="zookeeper" prop="zookeeperQuorum">
        <el-input v-model="hbasedataForm.zookeeperQuorum" placeholder="zookeeper"/>
      </el-form-item>
      <el-form-item label="启用/禁用" prop="enable">
        <el-radio-group v-model="hbasedataForm.enable">
          <el-radio :label="false">禁用</el-radio>
          <el-radio :label="true">启用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="hbasedataForm.remark" placeholder="备注"/>
      </el-form-item>  
    </el-form>
    <span slot="footer">
      <el-button @click="datano()">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { saveorupt, infoDatdType } from '@/api/workerBee/dataType'
  // import DataTYpeFormRedis from './dataTypeChailTable/dataType-form-redis'

  import Filter from './filter'
  export default {
    data () {
      return {
        visible: false,
        mysqldataForm: {
          datasourceName: '',
          datasourceType: '',
          driver: '',
          user: '',
          passwd: '',
          url: '',
          enable: true,
          version: '',
          remark: '',
          type: ''
        },
        // fatherData: {},
        redisdataForm: {
          host: '',
          passwd: '',
          port: '',
          idle: '',
          total: '',
          waitmillis: '',
          version: '',
          remark: '',
          type: '',
          enable: true
        },
        cassandradataForm: {
          datasourceName: '',
          type: '',
          contactPoints: '',
          keyspaceName: '',
          port: '',
          user: '',
          passwd: '',
          enable: true,
          version: '',
          remark: ''
        },
        hbasedataForm: {
          type: '',
          enable: true,
          remark: '',
          zookeeperName: '',
          zookeeperQuorum: ''
        },
        type: '',
        typeList: [
          {id: 1, value: 'mysql/oracle'},
          {id: 2, value: 'redis'},
          {id: 3, value: 'hbase'},
          {id: 4, value: 'cassandra'}
        ],
        mysqldataRule: {
          datasourceName: [
            { required: true, message: '数据源名称不能为空', trigger: 'blur' },
            { required: true, validator: Filter.NullKongGeRule, trigger: 'change' }
          ],
          driver: [
            { required: true, message: '数据库驱动不能为空', trigger: 'blur' },
            { required: true, validator: Filter.NullKongGeRule, trigger: 'change' }
          ],
          user: [
            { required: true, message: '数据库用户名不能为空', trigger: 'blur' },
            { required: true, validator: Filter.NullKongGeRule, trigger: 'change' }
          ],
          passwd: [
            { required: true, message: '数据库密码不能为空', trigger: 'blur' },
            { required: true, validator: Filter.NullKongGeRule, trigger: 'change' }
          ],
          url: [
            { required: true, message: '数据库url不能为空', trigger: 'blur' },
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
        redisdataRule: {
          host: [
            { required: true, message: 'host不能为空', trigger: 'blur' },
            { required: true, validator: Filter.NullKongGeRule, trigger: 'change' }
          ],
          passwd: [
            { required: true, message: '密码不能为空', trigger: 'blur' },
            { required: true, validator: Filter.NullKongGeRule, trigger: 'change' }
          ],
          port: [
            { required: true, message: '端口不能为空', trigger: 'blur' },
            { required: true, validator: Filter.NullKongGeRule, trigger: 'change' }
          ],
          idle: [
            { required: true, message: '最大闲置不能为空', trigger: 'blur' },
            { required: true, validator: Filter.NullKongGeRule, trigger: 'change' }
          ],
          total: [
            { required: true, message: '最大连接数不能为空', trigger: 'blur' },
            { required: true, validator: Filter.NullKongGeRule, trigger: 'change' }
          ],
          waitmillis: [
            { required: true, message: '最大等待时长(毫秒)不能为空', trigger: 'blur' },
            { required: true, validator: Filter.NullKongGeRule, trigger: 'change' }
          ],
          type: [
            { required: true, message: '类型不能为空', trigger: 'blur' },
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
        cassandradataRule: {
          datasourceName: [
            { required: true, message: '数据源名称不能为空', trigger: 'blur' },
            { required: true, validator: Filter.NullKongGeRule, trigger: 'change' }
          ],
          contactPoints: [
            { required: true, message: '集群节点地址不能为空', trigger: 'blur' },
            { required: true, validator: Filter.NullKongGeRule, trigger: 'change' }
          ],
          keyspaceName: [
            { required: true, message: '键空间名称不能为空', trigger: 'blur' },
            { required: true, validator: Filter.NullKongGeRule, trigger: 'change' }
          ],
          port: [
            { required: true, message: '端口不能为空', trigger: 'blur' },
            { required: true, validator: Filter.NullKongGeRule, trigger: 'change' }
          ],
          user: [
            { required: true, message: '用户名不能为空', trigger: 'blur' },
            { required: true, validator: Filter.NullKongGeRule, trigger: 'change' }
          ],
          passwd: [
            { required: true, message: '密码不能为空', trigger: 'blur' },
            { required: true, validator: Filter.NullKongGeRule, trigger: 'change' }
          ],
          type: [
            { required: true, message: '请选择数据源类型', trigger: 'blur' },
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
        hbasedataRule: {
          zookeeperName: [
            { required: true, message: 'zookeeper名称不能为空', trigger: 'blur' },
            { required: true, validator: Filter.NullKongGeRule, trigger: 'change' }
          ],
          zookeeperQuorum: [
            { required: true, message: 'zookeeperQuorum不能为空', trigger: 'blur' },
            { required: true, validator: Filter.NullKongGeRule, trigger: 'change' }
          ],
          type: [
            { required: true, message: '请选择类型', trigger: 'blur' },
            { required: true, validator: Filter.NullKongGeRule, trigger: 'change' }
          ],
          enable: [
            { required: true, message: '请选择启用/禁用', trigger: 'blur' },
            { required: true, validator: Filter.NullKongGeRule, trigger: 'change' }
          ],
          remark: [
            { required: true, message: '备注不能为空', trigger: 'blur' },
            { required: true, validator: Filter.NullKongGeRule, trigger: 'change' }
          ]
        },
        versionList: [
          {id: 1, value: 1}
        ],
        datasourceTypeList: [
          { id: 'mysql', value: 'mysql' },
          { id: 'oracle', value: 'oracle' },
          { id: 'postgre', value: 'postgre' },
          { id: 'maxCompute', value: 'maxCompute' },
          { id: 'kafka', value: 'kafka' },
          { id: 'ftp', value: 'ftp' },
          { id: 'canary', value: 'canary' },
          { id: 'es', value: 'es' }
        ]
      }
    },
    mounted () {
    },
    components: {
      // DataTYpeFormRedis
    },
    methods: {
      init (id, type) {
        this.type = type
        this.mysqldataForm.type = type
        this.redisdataForm.type = type
        this.cassandradataForm.type = type
        this.hbasedataForm.type = type
        this.mysqldataForm.datasourceType = type
        this.updateId = id
        this.mysqldataForm.id = id || 0
        this.visible = true
        if (id) {
          const dataBody = {
            id: id,
            type: type
          }
          infoDatdType(dataBody).then(({data}) => {
            if (data && data.message === 'success') {
              this.mysqldataForm = data.data
              this.redisdataForm = data.data
              this.hbasedataForm = data.data
              this.cassandradataForm = data.data
            } else {
              this.$message({
                message: data.message || '数据异常',
                type: 'error'
              })
            }
          })
        }
      },
      // 表单提交
      dataFormSubmit () {
        var data = ''
        if (this.type === 'mysql/oracle') {
          data = 'mysqldataForm'
        }
        if (this.type === 'redis') {
          data = 'redisdataForm'
        }
        if (this.type === 'hbase') {
          data = 'hbasedataForm'
        }
        if (this.type === 'cassandra') {
          data = 'cassandradataForm'
        }
        this.$refs[data].validate((valid) => {
          if (valid) {
            var dataBody = {}
            if (this.type === 'mysql/oracle') {
              dataBody = this.mysqldataForm
            }
            if (this.type === 'redis') {
              dataBody = this.redisdataForm
            }
            if (this.type === 'hbase') {
              dataBody = this.hbasedataForm
            }
            if (this.type === 'cassandra') {
              dataBody = this.cassandradataForm
            }
            saveorupt(dataBody, this.updateId).then(({data}) => {
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
        this.$refs.form.resetFields()
      }
    }
  }
</script>
