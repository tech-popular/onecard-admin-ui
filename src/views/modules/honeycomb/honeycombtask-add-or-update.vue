<template>
  <div>
    <el-dialog
      :title="!dataForm.id ? '新增' : '修改'"
      :close-on-click-modal="false"
      :visible.sync="visible"
    >
      <el-form
        :model="dataForm"
        :rules="dataRule"
        ref="dataForm"
        @keyup.enter.native="dataFormSubmit()"
        label-width="150px"
      >
        <el-form-item label="任务名称" prop="name">
          <el-input v-model="dataForm.name" placeholder="任务名称"></el-input>
        </el-form-item>
        <el-form-item label="输入数据源" prop="inDatasource">
          <el-select v-model="dataForm.inDatasource" placeholder="请选择">
            <el-option
              v-for="item in datasourceoptions"
              :key="item.id"
              :label="item.datasourceName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="计算类型" prop="computeType">
          <el-select v-model="dataForm.computeType" placeholder="请选择">
            <el-option
              v-for="item in computeTypeoptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          v-for="(outdata, index) in dataForm.honeycombOutDatasourceEntitys"
          :label="'输出数据源' + index"
          :key="outdata.key"
        >
          <el-row :gutter="24">
            <el-col :span="7">
              <div class="grid-content bg-purple">
                <el-select
                  v-model="outdata.outDatasource"
                  @change="selectOutData(index)"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in datasourceoptions"
                    :key="item.id"
                    :label="item.datasourceName"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </div>
            </el-col>
            <el-col :span="9" v-if="!redisListData[index] || !redisListData[index].show">
              <div class="grid-content bg-purple">
                <el-input v-model="outdata.outTableName"></el-input>
              </div>
            </el-col>
            <el-col :span="4">
              <div class="grid-content bg-purple">
                <el-button @click.prevent="removeDomain(outdata, index)">删除</el-button>
              </div>
            </el-col>
          </el-row>
          <div v-if="redisListData[index] && redisListData[index].show" class='redis-config' style="marginLeft: -130px">
            <el-form-item class="el-redis-item" label="redis数据格式">
              <el-select v-model="redisListData[index].name" placeholder="redis数据格式" clearable>
                <el-option
                  v-for="item in redisNames"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="el-redis-item" label="redisKey">
              <el-input v-model="redisListData[index].key" placeholder="redisKey" clearable></el-input>
            </el-form-item>
            <el-form-item class="el-redis-item" label="key拼接时间">
              <el-select v-model="redisListData[index].type" placeholder="key拼接时间" clearable>
                <el-option v-for="item in redisTypes" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="el-redis-item" label="key失效时间">
              <el-input
                v-model="redisListData[index].time"
                placeholder="key失效时间"
                clearable
                @input="redisListData[index].time = redisListData[index].time.replace(/[^\d]/g,'')"
              >
                <el-select v-model="redisListData[index].unit" slot="append">
                  <el-option
                    v-for="item in redisUnits"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-input>
            </el-form-item>
          </div>
        </el-form-item>

        <el-form-item>
          <el-button @click="addDomain">新增输出数据源</el-button>
        </el-form-item>
        <el-form-item label="SQL列" prop="sqlColumn">
          <el-input v-model="dataForm.sqlColumn" placeholder="必须和SQL对应"></el-input>
        </el-form-item>
        <el-form-item label="SQL" prop="sql">
          <el-input type="textarea" v-model="dataForm.sql" placeholder="SQL" :rows="10"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="testSQL">测试一下SQL</el-button>
        </el-form-item>
        <el-form-item label="周期" prop="period">
          <el-input v-model="dataForm.period" placeholder="周期" type="number"></el-input>
        </el-form-item>
        <!--<el-form-item label="转换配置" prop="transformerConfig">-->
        <!--<el-input v-model="dataForm.transformerConfig" placeholder="转换配置"></el-input>-->
        <!--</el-form-item>-->
        <!-- <el-input v-model="dataForm.cron" placeholder="cron表达式"></el-input> -->
        <el-form-item style="margin-top: -10px; margin-bottom:0px;">
          <cron v-if="showCronBox" v-model="dataForm.cron"></cron>
        </el-form-item>
        <el-form-item label="cron表达式" prop="cron">
          <el-input v-model="dataForm.cron" auto-complete="off">
            <el-button
              slot="append"
              v-if="!showCronBox"
              icon="el-icon-arrow-up"
              @click="showCronBox = true"
              title="打开图形配置"
            ></el-button>
            <el-button
              slot="append"
              v-else
              icon="el-icon-arrow-down"
              @click="showCronBox = false"
              title="关闭图形配置"
            ></el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="数据权限" prop="tenantId">
          <el-select v-model="dataForm.tenantId" placeholder="请选择,默认为所有人查看">
            <el-option
              v-for="item in tenantoptions"
              :key="item.tenantId"
              :label="item.name"
              :value="item.tenantId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否启用" prop="enable">
          <el-radio-group v-model="dataForm.enable">
            <el-radio :label="0">禁用</el-radio>
            <el-radio :label="1">正常</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-collapse v-model="activeNames">
          <el-collapse-item title="高级选项" name="1">
            <el-form-item label="id规则" prop="idRule">
              <el-select v-model="dataForm.idRule" placeholder="请选择">
                <el-option
                  v-for="item in idRuleoptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="增加task字段" prop="addFieldTask">
              <el-select v-model="dataForm.addFieldTask" placeholder="请选择">
                <el-option
                  v-for="item in tureOrFalseoptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="增加timestamp字段" prop="addFieldTimestamp">
              <el-select v-model="dataForm.addFieldTimestamp" placeholder="请选择">
                <el-option
                  v-for="item in tureOrFalseoptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="重写规则" prop="overwriteKey">
              <el-input v-model="dataForm.overwriteKey" placeholder="overwriteKey"></el-input>
            </el-form-item>
            <el-form-item label="服务名称字段" prop="serviceNameFiled">
              <el-input v-model="dataForm.serviceNameFiled" placeholder="serviceNameFiled"></el-input>
            </el-form-item>
            <el-form-item label="健康检查任务" prop="isHealthcheck">
              <el-select v-model="dataForm.isHealthcheck" placeholder="请选择">
                <el-option
                  v-for="item in tureOrFalseoptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="是否为业务监控任务" prop="isBusinessDataCheck">
              <el-select v-model="dataForm.isBusinessDataCheck" placeholder="请选择">
                <el-option
                  v-for="item in tureOrFalseoptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="是否是合并任务" prop="isMergeTask">
              <el-select v-model="dataForm.isMergeTask" placeholder="请选择">
                <el-option
                  v-for="item in tureOrFalseoptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="版本号" prop="version">
              <el-input v-model="dataForm.version" placeholder="版本号" disabled></el-input>
            </el-form-item>
            <el-form-item label="标签" prop="tags">
              <el-input v-model="dataForm.tags" placeholder="标签"></el-input>
            </el-form-item>
          </el-collapse-item>
          <el-collapse-item name="2"></el-collapse-item>
        </el-collapse>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button style="margin-top: 12px;" v-show="dataForm.id" @click="startTask()">启动任务</el-button>
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
      </span>
    </el-dialog>
    <!-- 测试 sql -->
    <el-dialog :visible.sync="sqlVisible" width="800px">
      <el-form :model="dataSql" ref="dataSql" :rules="sqlRule">
        <el-form-item label="任务列表">
          <el-input v-model="dataSql.taskId" placeholder="周期" type="text" disabled></el-input>
        </el-form-item>
        <el-form-item prop="datasourceId" label="数据源">
          <el-input v-model="dataSql.datasourceId" placeholder="周期" type="text" disabled></el-input>
        </el-form-item>
        <el-form-item prop="sql">
          <!-- <textarea
            ref="mycode"
            class="codesql"
            v-model="dataSql.sql"
            style="height:200px;width:100%"
          ></textarea>-->
          <codemirror
            ref="mycode"
            :value="dataSql.sql"
            :options="cmOptions"
            @changes="changes"
            class="code"
          ></codemirror>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="dataSqlSubmit()">执行</el-button>
          <el-button type="primary" @click="stopMaxcomputepreview()">停止</el-button>
        </el-form-item>
      </el-form>
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="执行状态" name="first">
          <el-input type="textarea" ref="returnData" v-model="returnStatus" autosize min="4"></el-input>
        </el-tab-pane>
        <el-tab-pane label="执行结果" name="second">
          <el-input type="textarea" ref="returnData" v-model="returnData" autosize min="4"></el-input>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script>
import cron from '@/components/cron'
import { codemirror } from 'vue-codemirror'
import { getDate } from '@/utils'
import 'codemirror/theme/ambiance.css'
import 'codemirror/lib/codemirror.css'
import 'codemirror/addon/hint/show-hint.css'
require('codemirror/addon/edit/matchbrackets')
require('codemirror/addon/selection/active-line')
require('codemirror/mode/sql/sql')
require('codemirror/addon/hint/show-hint')
require('codemirror/addon/hint/sql-hint')
export default {
  name: 'codeMirror',
  components: {
    cron,
    codemirror
  },
  data () {
    const validateNull = (rule, value, callback) => {
      value = (value + '').trim()
      if (!value) {
        callback(new Error(rule.message))
      } else {
        callback()
      }
    }
    return {
      showCronBox: false,
      visible: false,
      sqlVisible: false,
      activeNames: 2,
      dataForm: {
        id: 0,
        name: '',
        inDatasource: '',
        computeType: '',
        sqlColumn: '',
        sql: '',
        period: 0,
        transformerConfig: '',
        outDatasource: '',
        cron: '',
        version: 1,
        dependTask: '',
        tenantId: '',
        tags: '',
        enable: 1,
        idRule: 'none',
        addFieldTask: 'false',
        addFieldTimestamp: 'false',
        overwriteKey: '',
        serviceNameFiled: '',
        isHealthcheck: 'false',
        isBusinessDataCheck: 'false',
        isMergeTask: 'false',
        userType: null,
        operatorId: null,
        userDesc: null,
        increModel: 0,
        allowRepeatTrigger: 0,
        startTime: null,
        endTime: null,
        notifyFlag: 0,
        taskSource: '',
        targetSql: null,
        honeycombOutDatasourceEntitys: [
          {
            outTableName: '',
            outDatasource: 1,
            enable: 1,
            taskId: 0
          }
        ]
      },
      datasourceoptions: [],
      tenantoptions: [],
      computeTypeoptions: [],
      idRuleoptions: [],
      tureOrFalseoptions: [
        {
          value: true,
          label: 'true'
        },
        {
          value: false,
          label: 'false'
        }
      ],
      dataRule: {
        name: [
          { required: true, message: '任务名称不能为空', trigger: 'blur', validator: validateNull }
        ],
        inDatasource: [
          { required: true, message: '输入数据源不能为空', trigger: 'change' }
        ],
        computeType: [
          {
            required: true,
            message: '计算类型:1 简单 2 复杂不能为空',
            trigger: 'change'
          }
        ],
        period: [{ required: true, message: '周期不能为空', trigger: 'blur' }],
        cron: [{ required: true, message: 'cron不能为空', trigger: 'blur', validator: validateNull }],
        sqlColumn: [
          { required: true, message: 'SQL列不能为空，且必须和SQL对应', trigger: 'blur', validator: validateNull }
        ]
      },
      dataSql: {
        datasourceId: '',
        sql: '',
        taskId: ''
      },
      instanceId: '',
      returnData: '',
      returnStatus: '',
      activeName: 'first',
      sqlRule: {
        datasourceId: [
          { required: true, message: '输入数据源不能为空', trigger: 'blur' }
        ],
        sql: [{ required: true, message: 'sql不能为空', trigger: 'blur' }]
      },
      cmOptions: {
        mode: 'text/x-mariadb',
        indentWithTabs: true,
        smartIndent: true,
        lineNumbers: true,
        matchBrackets: true,
        // autofocus: true,
        extraKeys: { Ctrl: 'autocomplete' }, // 自定义快捷键
        hintOptions: {
          tables: {}
        }
      },
      redis: {
        name: '',
        key: '',
        type: '',
        time: '',
        unit: ''
      },
      redisListData: [],
      redisNames: [
        {
          value: 'redisTypeString',
          label: 'string'
        },
        {
          value: 'redisTypeList',
          label: 'list'
        },
        {
          value: 'redisTypeSet',
          label: 'set'
        },
        {
          value: 'redisTypeZSet',
          label: 'zSet'
        },
        {
          value: 'redisTypeHash',
          label: 'hash'
        }
      ],
      redisTypes: [
        'yyyy-MM-dd HH:mm:ss',
        'yyyyMMdd',
        'yyyy-MM-dd',
        'yyyy_MM_dd',
        'yyyy',
        'MM',
        'dd'
      ],
      redisUnits: [
        {
          value: '1',
          label: '秒'
        },
        {
          value: '2',
          label: '分钟'
        },
        {
          value: '3',
          label: '小时'
        },
        {
          value: '4',
          label: '天'
        }
      ]
    }
  },
  computed: {
    codemirror () {
      return this.$refs.mycode.codemirror
    }
  },
  methods: {
    addDomain () {
      this.dataForm.honeycombOutDatasourceEntitys.push({
        outTableName: '',
        key: Date.now()
      })
    },
    testSQL () {
      this.sqlVisible = true
      this.returnData = ''
      this.returnStatus = ''
      this.dataSql = {
        datasourceId: this.dataForm.inDatasource,
        sql: this.dataForm.sql,
        taskId: this.dataForm.id
      }
    },
    removeDomain (item, i) {
      var index = this.dataForm.honeycombOutDatasourceEntitys.indexOf(item)
      if (index !== -1) {
        this.dataForm.honeycombOutDatasourceEntitys.splice(index, 1)
      }
      this.redisListData.splice(i, 1)
    },
    init (id) {
      this.redisListData = []
      // 数据源权限tenant
      this.$http({
        url: this.$http.adornUrl(`/sys/systenant/getTenantInfoByUser`),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.tenantoptions = data.sysTenantEntities
        }
      })
      // 数据源下拉框
      this.$http({
        url: this.$http.adornUrl(`/honeycomb/honeycombdatasourceconfig/select`),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.datasourceoptions = data.honeycombDatasourceConfigEntities
        }
      })
      this.$http({
        url: this.$http.adornUrl(`/sys/sysdictitem/selectalltaskpage`),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.computeTypeoptions = data.taskDicts.task_compute_type
          this.computeTypeoptions.map(item => {
            item.label = item.label == 'simple' ? '简单类型' : '复杂类型'
          })
          this.idRuleoptions = data.taskDicts.task_id_rule
        }
      })
      this.dataForm.id = id || 0
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl(
              `/honeycomb/honeycombtask/info/${this.dataForm.id}`
            ),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataForm.notifyFlag = data.honeycombTask.notifyFlag
              this.dataForm.taskSource = data.honeycombTask.taskSource
              this.dataForm.targetSql = data.honeycombTask.targetSql
              this.dataForm.userType = data.honeycombTask.userType
              this.dataForm.operatorId = data.honeycombTask.operatorId
              this.dataForm.userDesc = data.honeycombTask.userDesc
              this.dataForm.increModel = data.honeycombTask.increModel
              this.dataForm.allowRepeatTrigger = data.honeycombTask.allowRepeatTrigger
              this.dataForm.startTime = data.honeycombTask.startTime
              this.dataForm.endTime = data.honeycombTask.endTime
              this.dataForm.name = data.honeycombTask.name
              this.dataForm.inDatasource = data.honeycombTask.inDatasource
              this.dataForm.computeType =
                data.honeycombTask.computeType == 'simple' ? '0' : '1'
              this.dataForm.sql = data.honeycombTask.sql
              this.dataForm.period = data.honeycombTask.period
              this.dataForm.transformerConfig =
                data.honeycombTask.transformerConfig
              this.dataForm.cron = data.honeycombTask.cron
              this.dataForm.version = data.honeycombTask.version
              this.dataForm.tenantId = data.honeycombTask.tenantId
              this.dataForm.dependTask = data.honeycombTask.dependTask
              this.dataForm.tags = data.honeycombTask.tags
              this.dataForm.enable = data.honeycombTask.enable
              this.dataForm.idRule = data.honeycombTask.idRule
              this.dataForm.addFieldTask = data.honeycombTask.addFieldTask
              this.dataForm.addFieldTimestamp =
                data.honeycombTask.addFieldTimestamp
              this.dataForm.overwriteKey = data.honeycombTask.overwriteKey
              this.dataForm.serviceNameFiled =
                data.honeycombTask.serviceNameFiled
              this.dataForm.isHealthcheck = data.honeycombTask.isHealthcheck
              this.dataForm.isBusinessDataCheck =
                data.honeycombTask.isBusinessDataCheck
              this.dataForm.isMergeTask = data.honeycombTask.isMergeTask
              this.dataForm.honeycombOutDatasourceEntitys =
                data.honeycombTask.honeycombOutDatasourceEntitys
              this.dataForm.honeycombOutDatasourceEntitys.forEach((val, i) => {
                this.$set(this.redisListData, i, {
                  name: '',
                  key: '',
                  time: '',
                  type: '',
                  unit: '1'
                })
                let id = val.outDatasource
                let datasource = this.datasourceoptions.filter(
                  item => item.id == id
                )
                if (datasource[0].datasourceType == 'redis' || datasource[0].datasourceType == 'singleRedis') {
                  let arr = val.outTableName.split('#')
                  this.$set(this.redisListData, i, {
                    show: true,
                    name: arr[0],
                    key: arr[1],
                    type: arr[2] || '',
                    time: arr[3] || '',
                    unit: '1'
                  })
                } else {
                  this.$set(this.redisListData, i, {
                    show: false
                  })
                }
              })
            }
          })
        } else {
          this.dataForm.honeycombOutDatasourceEntitys = []
        }
      })
    },
    /**
     * 启动任务
     */
    startTask () {
      return this.$http({
        url: this.$http.adornUrl(
          `/honeycomb/honeycombtask/starttask/${this.dataForm.id}`
        ),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.visible = false
              this.$emit('closeUpdateBox')
              this.$emit('refreshDataList')
            }
          })
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 表单提交
    dataFormSubmit () {
      if (!this.checkRedisList()) {
        return false
      }
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.showCronBox = false
          this.$http({
            url: this.$http.adornUrl(
              `/honeycomb/honeycombtask/${
                !this.dataForm.id ? 'save' : 'update'
              }`
            ),
            method: 'post',
            data: this.$http.adornData({
              id: this.dataForm.id || undefined,
              name: this.dataForm.name,
              inDatasource: this.dataForm.inDatasource,
              computeType: this.dataForm.computeType,
              sqlColumn: this.dataForm.sqlColumn,
              sql: this.dataForm.sql,
              period: this.dataForm.period,
              transformerConfig: this.dataForm.transformerConfig,
              outDatasource: this.dataForm.outDatasource,
              cron: this.dataForm.cron,
              version: this.dataForm.version,
              tenantId: this.dataForm.tenantId,
              tags: this.dataForm.tags,
              enable: this.dataForm.enable,
              dependTask: this.dataForm.dependTask,
              idRule: this.dataForm.idRule,
              addFieldTimestamp: this.dataForm.addFieldTimestamp,
              addFieldTask: this.dataForm.addFieldTask,
              overwriteKey: this.dataForm.overwriteKey,
              serviceNameFiled: this.dataForm.serviceNameFiled,
              isHealthcheck: this.dataForm.isHealthcheck,
              isBusinessDataCheck: this.dataForm.isBusinessDataCheck,
              isMergeTask: this.dataForm.isMergeTask,
              userType: this.dataForm.userType,
              operatorId: this.dataForm.operatorId,
              userDesc: this.dataForm.userDesc,
              increModel: this.dataForm.increModel,
              allowRepeatTrigger: this.dataForm.allowRepeatTrigger,
              startTime: this.dataForm.startTime,
              endTime: this.dataForm.endTime,
              notifyFlag: this.dataForm.notifyFlag,
              taskSource: this.dataForm.taskSource,
              targetSql: this.dataForm.targetSql,
              honeycombOutDatasourceEntitys: this.dataForm
                .honeycombOutDatasourceEntitys
            })
          }).then(({ data }) => {
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
    },
    changes (value) {
      this.dataSql.sql = this.codemirror.getValue()
    },
    // sql表单提交
    dataSqlSubmit () {
      this.$refs['dataSql'].validate(valid => {
        if (valid) {
          this.returnData = ''
          this.returnStatus = ''
          this.$http({
            url: this.$http.adornUrl(
              `/honeycomb/honeycombtaskpreview/preview/sql`
            ),
            method: 'post',
            data: this.$http.adornData(this.dataSql)
          }).then(({ data }) => {
            if (data && data.code === 0) {
              const time = getDate(data.resultBean.timestamp, 'year')
              this.returnStatus =
                time + ' ' + JSON.stringify({ status: data.resultBean.status })
              this.returnData = JSON.stringify({
                data: data.resultBean.data,
                message: data.resultBean.message
              })
              if (data.resultBean.status === '2') {
                this.instanceId = data.resultBean.traceId
                this.returnData += '\n继续执行'
                this.continueMaxcomputepreview()
              } else {
                clearInterval(window.clearnum)
                this.instanceId = ''
              }
            } else {
              this.returnData += JSON.stringify(data, null, 1)
            }
          })
        }
      })
    },
    continueMaxcomputepreview () {
      this.$refs['dataSql'].validate(valid => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(
              `/honeycomb/honeycombtaskpreview/preview/maxcompute`
            ),
            method: 'post',
            data: this.$http.adornData({
              instanceId: this.instanceId || undefined,
              datasourceId: this.dataSql.datasourceId
            })
          }).then(({ data }) => {
            if (data && data.code === 0) {
              const time = getDate(data.resultBean.timestamp, 'year')
              this.returnStatus += `\n${time} ${JSON.stringify({
                status: data.resultBean.status
              })}`
              this.returnData += JSON.stringify({
                data: data.resultBean.data,
                message: data.resultBean.message
              })
              if (data.resultBean.status === '2') {
                this.returnData += '\n继续执行'
                clearInterval(window.clearnum)
                window.clearnum = setTimeout(() => {
                  this.continueMaxcomputepreview()
                }, 3000)
              } else {
                this.instanceId = ''
                clearInterval(window.clearnum)
              }
            } else {
              this.returnData += JSON.stringify(data)
            }
          })
        }
      })
    },
    stopMaxcomputepreview () {
      this.$refs['dataSql'].validate(valid => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(
              `/honeycomb/honeycombtaskpreview/preview/stopmaxcompute`
            ),
            method: 'post',
            data: this.$http.adornData({
              instanceId: this.instanceId || undefined,
              datasourceId: this.dataSql.datasourceId
            })
          }).then(({ data }) => {
            if (data && data.code === 0) {
              const time = getDate(data.resultBean.timestamp, 'year')
              clearInterval(window.clearnum)
              this.returnStatus += `\n${time} ${JSON.stringify({
                status: data.resultBean.status
              })}`
              this.returnData += '\n停止执行'
            } else {
              this.$message.error(data.msg)
              alert('操作失败')
            }
          })
        }
      })
    },
    // 输出源
    selectOutData (index) {
      this.$set(this.redisListData, index, {
        name: '',
        key: '',
        time: '',
        type: '',
        unit: '1'
      })
      let id = this.dataForm.honeycombOutDatasourceEntitys[index].outDatasource
      let datasource = this.datasourceoptions.filter(item => item.id == id)
      if (datasource[0].datasourceType == 'redis' || datasource[0].datasourceType == 'singleRedis') {
        this.$set(this.redisListData, index, {
          show: true,
          unit: '1'
        })
      } else {
        this.$set(this.redisListData, index, {
          show: false
        })
      }
    },
    checkRedisList () {
      for (let i = 0; i < this.redisListData.length; i++) {
        if (this.redisListData[i].show && !this.redisListData[i].name) {
          this.$message({
            type: 'warning',
            message: '请输入redis数据格式'
          })
          return false
        }
        // if (this.redisListData[i].show && !this.redisListData[i].key) {
        //   this.$message({
        //     type: 'warning',
        //     message: '请输入redis key'
        //   })
        //   return false
        // }
      }
      return true
    }
  },
  watch: {
    redisListData: {
      handler (newVal, oldVal) {
        let unitCount = {
          '1': 1,
          '2': 60,
          '3': 60 * 60,
          '4': 60 * 60 * 24
        }
        newVal.forEach((item, index) => {
          if (item.show) {
            let time = 0
            for (let key in unitCount) {
              if (item.unit == key) {
                time = item.time ? Number(item.time) * unitCount[key] : ''
              }
            }
            let outTableName =
              item.name +
              '#' +
              (item.key ? item.key : ' ') +
              '#' +
              (item.type ? item.type : ' ') +
              '#' +
              (time || ' ') +
              '#'
            this.$set(
              this.dataForm.honeycombOutDatasourceEntitys[index],
              'outTableName',
              outTableName
            )
          }
        })
      },
      immediate: true,
      deep: true
    }
  }
}
</script>
<style lang="scss">
.el-redis-item {
  margin-top: 20px !important;
}
.redis-config .el-input-group__append {
  width: 80px;
}
</style>
