<template>
  <el-drawer
    :append-to-body="false"
    :visible.sync="visible"
    :show-close="false"
    :wrapperClosable="false"
    size="1100px"
    class="api-manage-drawer"
  >
    <div slot="title" class="drawer-title">{{!!id ? '编辑同步任务' : '新增同步任务'}}<i class="el-icon-close drawer-close" @click="drawerClose"></i></div>
    <div class="wrap" v-loading="loading">
      <h3 id="title">作业信息<span v-if="!!id">最近修改人：<i>{{updateUser}}</i> 最近修改时间：<i>{{updateTime}}</i></span></h3>
      <el-form :model="dataForm" :rules="dataRule" ref="dataForm1" label-width="120px">
        <div class="work-type-pane">
          <el-form-item label="任务名称" prop="taskName">
            <el-input v-model="dataForm.taskName" placeholder="任务名称" style="width: 400px">
              <template slot="prepend">{{formDs}}_to_{{toDs}}_</template>
            </el-input>
          </el-form-item>
          <el-form-item label="任务ID" prop="id">
            <el-input v-model="dataForm.id" placeholder="任务ID" disabled  style="width: 300px" />
          </el-form-item>
        </div>
        <el-form-item label="所属系统" prop="projectId">
          <el-select v-model="dataForm.projectId" placeholder="所属系统" style="width: 400px" filterable>
            <el-option :label="item.projectSystemName" :value="item.id" v-for="(item, index) in allSystemList" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="任务描述" prop="taskDescribe">
          <el-input type="textarea" v-model="dataForm.taskDescribe" placeholder="任务描述" />
        </el-form-item>
      </el-form>
      <div class="work-content-1">
        <el-form :model="acquisitionTask" :rules="dataRule" ref="acquisitionTask">
          <div class="work-type-pane">
            <el-form-item label="数据来源" prop="inDatasourceType" label-width="120px">
              <el-select v-model="acquisitionTask.inDatasourceType" placeholder="请选择数据源类型" @change="val => dataSourceTypeChange('in', val)" filterable>
                <el-option :label="item.name" :value="item.name" v-for="(item, index) in getAllinDatasourceList" :key="index"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="inDatasourceId" label-width="10px">
              <el-select v-model="acquisitionTask.inDatasourceId" placeholder="请选择数据源名称" @change="val => dataSourceNameChange('in', val)" filterable>
                <el-option :label="item.dataSourceName" :value="item.id" v-for="(item, index) in getAllinDatasourceNameList" :key="index"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="inAccountId" label-width="10px" v-if="acquisitionTask.inDatasourceType !== 'KAFKA' && acquisitionTask.inDatasourceType !== 'REDIS'">
              <el-select v-model="acquisitionTask.inAccountId" placeholder="请选择账户" filterable>
                <el-option-group v-for="(val, key, i) in allinAccountList" :key="i" :label="key * 1 === 0 ? '公共账号' : '个人帐号'">
                  <el-option
                    v-for="item in val"
                    :key="item.id"
                    :label="item.datasourceUser"
                    :value="item.id"
                  ></el-option>
                </el-option-group>
              </el-select>
              <span style="color:red;font-size:10px;" v-if="acquisitionTask.inDatasourceId && Object.keys(allinAccountList).length">
                （如需配置账户，请<i style="font-style: normal;color:blue;cursor:pointer" @click="gotoDataSource">点击</i>）
              </span>
              <span style="color:red;font-size:10px;" v-if="acquisitionTask.inDatasourceId && !Object.keys(allinAccountList).length">
                （无账户信息，请前往<i style="font-style: normal;color:blue;cursor:pointer" @click="gotoDataSource">配置</i>）
              </span>
            </el-form-item>
          </div>
          <el-form-item prop="inDataSql" label="作业开始前SQL：" label-width="120px" ref="workBeginSqlForm">
            <div style="border:1px solid #dcdfe6; border-radius: 4px; position:relative">
              <codemirror
                ref="workBeginSql"
                v-model="acquisitionTask.inDataSql"
                :options="cmOptions"
                @changes="cm => workItemChanges(cm, acquisitionTask.inDataSql, 'workBeginSqlForm', 'workBeginSql')"
                @keydown.native="e => workItemKeyDown(e, 'workBeginSql')"
                class="code"
                style="padding-bottom: 0px"
              ></codemirror>
            </div>
          </el-form-item>
          <el-form-item prop="sqlField" label-width="120px" label="输出字段" ref="sqlFieldEl">
            <input-tag v-model="acquisitionTask.sqlField" @change="inputTagChange" :tag-tips=[] :add-tag-on-blur="true" :allow-duplicates="true" class="itemIput inputTag" style="display: inline-block;" placeholder="可用回车输入多条，字段顺序请与SQL保持一致"></input-tag>
            <el-button type="primary" size="mini" @click="sqlParseClick">SQL解析</el-button>
          </el-form-item>
          <div class="work-type-pane">
            <el-form-item label="数据去向" prop="outDatasourceType" label-width="120px">
              <el-select v-model="acquisitionTask.outDatasourceType" placeholder="请选择数据源类型" @change="val => dataSourceTypeChange('out', val)" filterable>
                <el-option :label="item.name" :value="item.name" v-for="(item, index) in getAlloutDatasourceList" :key="index"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="outDatasourceId" label-width="10px">
              <el-select v-model="acquisitionTask.outDatasourceId" placeholder="请选择数据源名称" @change="val => dataSourceNameChange('out', val)" filterable>
                <el-option :label="item.dataSourceName" :value="item.id" v-for="(item, index) in getAlloutDatasourceNameList" :key="index"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="outAccountId" label-width="10px" v-if="acquisitionTask.outDatasourceType !== 'KAFKA' && acquisitionTask.outDatasourceType !== 'REDIS'">
              <el-select v-model="acquisitionTask.outAccountId" placeholder="请选择账户" filterable>
                <el-option-group v-for="(val, key, i) in alloutAccountList" :key="i" :label="key * 1 === 0 ? '公共账号' : '个人帐号'">
                  <el-option
                    v-for="item in val"
                    :key="item.id"
                    :label="item.datasourceUser"
                    :value="item.id"
                  ></el-option>
                </el-option-group>
              </el-select>
              <span style="color:red;font-size:10px;" v-if="acquisitionTask.outDatasourceId && Object.keys(alloutAccountList).length">
                （如需配置账户，请<i style="font-style: normal;color:blue;cursor:pointer" @click="gotoDataSource">点击</i>）
              </span>
              <span style="color:red;font-size:10px;" v-if="acquisitionTask.outDatasourceId && !Object.keys(alloutAccountList).length">
                （无账户信息，请前往<i style="font-style: normal;color:blue;cursor:pointer" @click="gotoDataSource">配置</i>）
              </span>
            </el-form-item>
          </div>
          <!--redis-->
          <div v-if="acquisitionTask.outDatasourceType==='REDIS'" style="marginLeft: 120px">
            <el-form :model="redisData" :rules="dataRule" ref="redisForm" label-width="120px">
              <el-form-item class="el-redis-item" label="redis数据格式" prop="redisName">
                <el-select v-model="redisData.redisName" placeholder="redis数据格式" clearable @change="redisNameChange">
                  <el-option
                    v-for="item in redisNames"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item class="el-redis-item" label="redisKey" prop="redisKey">
                <el-input v-model="redisData.redisKey" placeholder="参考示例：前缀{redisKey列索引}后缀" clearable></el-input>
              </el-form-item>
              <el-form-item class="el-redis-item" :label="redisData.redisLabel + 'Value'" prop="redisValue" v-if="!!redisData.redisName && redisData.redisName !== 'redisTypeHash'">
                <el-input v-model="redisData.redisValue" placeholder="{redisValue列索引}" clearable></el-input>
              </el-form-item>
              <el-form-item class="el-redis-item" label="score" v-if="redisData.redisName === 'redisTypeZSet'">
                <el-input v-model="redisData.zSetScore" placeholder="{score列索引}" clearable></el-input>
              </el-form-item>
              <el-form-item class="el-redis-item" label="key拼接时间" prop="redisJoinType">
                <el-select v-model="redisData.redisJoinType" placeholder="key拼接时间" clearable>
                  <el-option v-for="item in redisTypes" :key="item" :label="item" :value="item"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item class="el-redis-item" label="key失效时间" prop="redisUneffectTime">
                <el-input
                  v-model="redisData.redisUneffectTime"
                  placeholder="key失效时间"
                  clearable
                  @input="redisData.redisUneffectTime = redisData.redisUneffectTime.replace(/[^\d]/g,'')"
                >
                  <el-select v-model="redisData.redisUnit" slot="append" style="width:100px">
                    <el-option
                      v-for="item in redisUnits"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-input>
              </el-form-item>
            </el-form>
          </div>
          <!---->
          <!--elasticsearch-->
          <div v-if="acquisitionTask.outDatasourceType==='ES'" style="marginLeft: 120px">
            <el-form :model="elasticData" :rules="dataRule" ref="elasticForm" label-width="160px">
              <el-form-item class="el-redis-item" label="type">
                <el-input v-model="elasticData.type" placeholder="type" clearable></el-input>
              </el-form-item>
              <el-form-item class="el-redis-item" label="ID列" prop="idColumn">
                <el-input v-model="elasticData.idColumn" placeholder="ID列索引下标" clearable></el-input>
              </el-form-item>
            </el-form>
          </div>
          <!---->
          <!--mc-->
          <div v-if="acquisitionTask.outDatasourceType==='MAXCOMPUTE'" style="marginLeft: 120px">
            <el-form :model="mcData" :rules="dataRule" ref="mcForm" label-width="160px">
              <el-form-item class="el-redis-item" label="分区列">
                <el-input v-model="mcData.mcColumn" placeholder="分区列, 若是分区表则必填" clearable></el-input>
              </el-form-item>
            </el-form>
          </div>
          <!---->
          <el-form-item prop="outDataTable" label="输入数据表/topic名称" v-if="acquisitionTask.outDatasourceType!='REDIS'" label-width="160px" :style="{marginLeft: acquisitionTask.outDatasourceType==='ES' || acquisitionTask.outDatasourceType==='MAXCOMPUTE' ? '120px' : ''}">
            <el-input v-model="acquisitionTask.outDataTable" placeholder="输入数据表/topic名称" />
          </el-form-item>
          <el-form-item prop="outBeforeSql" label="目标库前置处理SQL：" label-width="120px" ref="workBeginSqlForm2">
            <div style="border:1px solid #dcdfe6; border-radius: 4px; position:relative">
              <codemirror
                ref="workBeginSql2"
                v-model="acquisitionTask.outBeforeSql"
                :options="cmOptions"
                @changes="cm => workItemChanges(cm, acquisitionTask.outBeforeSql, 'workBeginSqlForm2', 'workBeginSql2')"
                @keydown.native="e => workItemKeyDown(e, 'workBeginSql2')"
                class="code"
                style="padding-bottom: 0px"
              ></codemirror>
            </div>
          </el-form-item>
          <el-form-item prop="outAfterSql" label="目标库后置处理SQL：" label-width="120px" ref="workBeginSqlForm3">
            <div style="border:1px solid #dcdfe6; border-radius: 4px; position:relative">
              <codemirror
                ref="workBeginSql3"
                v-model="acquisitionTask.outAfterSql"
                :options="cmOptions"
                @changes="cm => workItemChanges(cm, acquisitionTask.outAfterSql, 'workBeginSqlForm3', 'workBeginSql3')"
                @keydown.native="e => workItemKeyDown(e, 'workBeginSql3')"
                class="code"
                style="padding-bottom: 0px"
              ></codemirror>
            </div>
          </el-form-item>
          <!-- <div class="work-type-pane">
            <el-form-item label="下发类型：" prop="addDataRule" label-width="120px">
              <el-radio-group v-model="acquisitionTask.addDataRule">
                <el-radio label="all">全量</el-radio>
                <el-radio label="add">增量</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="增量规则：" prop="addRuleFields" label-width="200px" v-if="acquisitionTask.addDataRule === 'add'">
              <el-input v-model="acquisitionTask.addRuleFields" placeholder="增量规则" style="width: 300px" />
            </el-form-item>
          </div> -->
        </el-form>
      </div>
      <el-form :model="dataForm" :rules="dataRule" ref="dataForm2" label-width="120px">
        <div class="work-type-pane">
          <el-form-item label="失败重跑：" prop="isRunAgain">
            <el-radio-group v-model="dataForm.isRunAgain">
              <el-radio :label="0">是</el-radio>
              <el-radio :label="1">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="failRepeatTrigger" label-width="120px" v-if="dataForm.isRunAgain === 0">
            重跑：<el-input-number v-model="dataForm.failRepeatTrigger" style="width:160px;margin: 0 10px" :min="1" />次
          </el-form-item>
        </div>
        <div class="work-type-pane">
          <el-form-item label="状态：" prop="taskDisable" label-width="120px">
            <el-radio-group v-model="dataForm.taskDisable">
              <el-radio :label="0">有效</el-radio>
              <el-radio :label="1">无效</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="任务需求人：" prop="requestedUser" label-width="200px">
            <el-input v-model="dataForm.requestedUser" placeholder="任务需求人" />
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </div>
  </el-drawer>
</template>

<script>
import { deepClone } from '@/utils'
import { info, save, update, projectAll, dataSourceAll, accountAll, sqlParse } from '@/api/dispatch/taskManag'
import InputTag from '../dataAnalysis/components/InputTag'
import { codemirror } from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/idea.css'
import 'codemirror/addon/hint/show-hint.css'
import 'codemirror/addon/hint/anyword-hint.js'
require('codemirror/addon/edit/matchbrackets')
require('codemirror/addon/selection/active-line')
require('codemirror/mode/sql/sql.js')
require('codemirror/addon/hint/show-hint.js')
require('codemirror/addon/hint/sql-hint.js')
export default {
  name: 'codeMirror',
  components: {
    codemirror,
    InputTag
  },
  data () {
    return {
      visible: false,
      loading: false,
      id: '',
      formDs: '',
      toDs: '',
      updateUser: '',
      updateTime: '',
      dataForm: {},
      tempDataForm: {
        taskName: '',
        id: '',
        projectId: '',
        taskDescribe: '',
        taskDisable: 0,
        requestedUser: '',
        failRepeatTrigger: 3,
        isRunAgain: 0
      },
      acquisitionTask: {
        inDatasourceType: '',
        inDatasourceId: '',
        inAccountId: '',
        inDataSql: '',
        sqlField: [], // 输入sql所对应的字段
        outDatasourceType: '',
        outDatasourceId: '', // 输出数据源Id
        outAccountId: '', // 输出数据源对应帐户Id
        outDataTable: '', // 输出数据表
        outBeforeSql: '', // 输出前处理sql
        outAfterSql: '', // 输出后处理sql
        addDataRule: 'all', // 采集规则（ALL-全量，ADD-增量）
        addRuleFields: ''
      },
      redisData: {
        redisName: '',
        redisKey: '',
        redisLabel: '',
        redisValue: '',
        zSetScore: '',
        redisJoinType: '',
        redisUneffectTime: '',
        redisUnit: '1'
      },
      outTableName: '',
      elasticData: {
        type: '',
        idColumn: ''
      },
      mcData: {
        mcColumn: ''
      },
      dataRule: {
        taskName: [
          { required: true, message: '请输入任务名称', trigger: 'blur' }
        ],
        projectId: [
          { required: true, message: '请选择所属系统', trigger: 'change' }
        ],
        inDatasourceType: [
          { required: true, message: '请选择数据源类型', trigger: 'change' }
        ],
        inDatasourceId: [
          { required: true, message: '请选择数据源名称', trigger: 'change' }
        ],
        inAccountId: [
          { required: true, message: '请选择帐户', trigger: 'change' }
        ],
        inDataSql: [
          { required: true, message: '请输入作业开始前SQL', trigger: 'change' }
        ],
        sqlField: [
          { required: true, message: '请选择输出字段', trigger: 'change' }
        ],
        outAccountId: [
          { required: true, message: '请选择帐户', trigger: 'change' }
        ],
        outDatasourceType: [
          { required: true, message: '请选择数据源类型', trigger: 'change' }
        ],
        outDatasourceId: [
          { required: true, message: '请选择数据源名称', trigger: 'change' }
        ],
        outDataTable: [
          { required: true, message: '请输入输出数据表', trigger: 'blur' }
        ],
        addDataRule: [
          { required: true, message: '请选择下发类型', trigger: 'change' }
        ],
        taskDisable: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        requestedUser: [
          { required: true, message: '请输入需求提出人', trigger: 'blur' }
        ],
        addRuleFields: [
           { required: true, message: '请输入增量规则', trigger: 'blur' }
        ],
        isRunAgain: [
          {required: true, message: '请选择', trigger: 'change'}
        ],
        failRepeatTrigger: [
          {required: true, message: '请输入重跑次数', trigger: 'change'}
        ],
        //
        redisName: [
          { required: true, message: '请选择redis数据格式', trigger: 'change' }
        ],
        redisKey: [
          { required: true, message: '请输入redisKey', trigger: 'change' }
        ],
        redisValue: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        redisJoinType: [
          {required: true, message: '请选择key拼接时间', trigger: 'change'}
        ],
        redisUneffectTime: [
          {required: true, message: '请输入key失效时间', trigger: 'blur'}
        ],
        idColumn: [
          {required: true, message: '请输入ID列', trigger: 'blur'}
        ]
      },
      allSystemList: [],
      getAllinDatasourceList: [],
      getAllinDatasourceNameList: [],
      getAlloutDatasourceList: [],
      getAlloutDatasourceNameList: [],
      allAccountList: [],
      allinAccountList: [],
      alloutAccountList: '',
      cmOptions: {
        theme: 'idea',
        mode: 'text/x-sparksql',
        lineWrapping: true,
        lineNumbers: true,
        autofocus: false,
        smartIndent: false,
        autocorrect: true,
        spellcheck: true,
        extraKeys: {
          Tab: 'autocomplete'
        },
        lint: true,
        gutters: [
          'CodeMirror-lint-markers',
          'CodeMirror-linenumbers',
          'CodeMirror-foldgutter'
        ],
        foldGutter: true,
        autoCloseBrackets: true,
        autoCloseTags: true,
        matchTags: { bothTags: true },
        matchBrackets: true,
        styleActiveLine: true,
        autoRefresh: true,
        highlightSelectionMatches: {
          minChars: 2,
          style: 'matchhighlight',
          showToken: true
        },
        styleSelectedText: true
      },
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
    previreCodemirror () {
      return this.$refs.previewSql.codemirror
    }
  },
  watch: {
    redisData: {
      handler (newVal, oldVal) {
        let unitCount = {
          '1': 1,
          '2': 60,
          '3': 60 * 60,
          '4': 60 * 60 * 24
        }
        let time = 0
        for (let key in unitCount) {
          if (newVal.redisUnit == key) {
            time = newVal.redisUneffectTime ? Number(newVal.redisUneffectTime) * unitCount[key] : ''
          }
        }
        let outTableName =
          newVal.redisName +
          '#' +
          (newVal.redisKey ? newVal.redisKey : ' ') +
          '#' +
          (newVal.redisJoinType ? newVal.redisJoinType : ' ') +
          '#' +
          (time || ' ') +
          '#' +
          newVal.redisValue +
          '#' +
          (newVal.zSetScore ? newVal.zSetScore : ' ') +
          '#'
        this.outTableName = outTableName
      },
      immediate: true,
      deep: true
    },
    elasticData: {
      handler (newVal, oldVal) {
        let outTableName =
          (newVal.type ? newVal.type : ' ') +
          '#' +
          newVal.idColumn +
          '#'
        this.outTableName = outTableName
      },
      immediate: true,
      deep: true
    },
    mcData: {
      handler (newVal, oldVal) {
        let outTableName =
          (newVal.mcColumn ? newVal.mcColumn : ' ') +
          '#'
        this.outTableName = outTableName
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    init (id) {
      this.id = id ? id.id : ''
      this.dataForm = deepClone(this.tempDataForm)
      this.acquisitionTask.outDataTable = ''
      this.redisData = {
        redisName: '',
        redisKey: '',
        redisLabel: '',
        redisValue: '',
        zSetScore: '',
        redisJoinType: '',
        redisUneffectTime: '',
        redisUnit: '1'
      }
      this.elasticData = {
        type: '',
        idColumn: ''
      }
      this.mcData = {
        mcColumn: ''
      }
      this.getAllSystem()
      this.getAllDatasource('ACQUISITION', 'IN')
      this.getAllDatasource('ACQUISITION', 'OUT')
      this.visible = true
      this.$nextTick(() => {
        document.getElementById('title').scrollIntoView()
        if (id) {
          setTimeout(() => {
            this.getInfo()
          }, 500)
        }
        this.$refs['dataForm1'].resetFields()
        this.$refs['dataForm2'].resetFields()
        this.$refs['acquisitionTask'].resetFields()
        this.loading = false
      })
    },
    getInfo () {
      this.loading = true
      info(this.id).then(({data}) => {
        if (data.code !== 0) {
          this.loading = false
          return this.$message.error(data.msg || '获取数据异常')
        }
        if (!data.data.acquisitionTask) {
          this.loading = false
          return this.$message.error('获取数据异常')
        }
        this.updateUser = data.data.updateUser
        this.updateTime = data.data.updateTime
        this.dataForm.id = data.data.id
        this.dataForm.projectId = data.data.projectId
        this.dataForm.taskDescribe = data.data.taskDescribe
        this.dataForm.taskDisable = data.data.taskDisable
        this.dataForm.requestedUser = data.data.requestedUser
        this.acquisitionTask = data.data.acquisitionTask
        if (this.acquisitionTask.outDataTable.indexOf('#') > 0) {
          let arr = this.acquisitionTask.outDataTable.split('#')
          console.log(arr)
          if (this.acquisitionTask.outDatasourceType === 'REDIS') {
            let label = this.redisNames.filter(item => item.value === arr[0])[0].label
            this.redisData = {
              redisName: arr[0],
              redisKey: arr[1],
              redisJoinType: arr[2] || '',
              redisUneffectTime: arr[3] || '',
              redisLabel: label,
              redisValue: arr[4],
              zSetScore: arr[5] || '',
              redisUnit: '1'
            }
          } else if (this.acquisitionTask.outDatasourceType === 'ES') {
            this.elasticData = {
              type: arr[1],
              idColumn: arr[2]
            }
            this.acquisitionTask.outDataTable = arr[0]
          } else {
            console.log(arr, arr[1])
            this.mcData = {
              mcColumn: arr[1]
            }
            this.acquisitionTask.outDataTable = arr[0]
          }
        }
        // 是否重跑判断
        if (data.data.failRepeatTrigger !== 0) {
          this.dataForm.isRunAgain = 0
          this.dataForm.failRepeatTrigger = data.data.failRepeatTrigger
        } else {
          this.dataForm.isRunAgain = 1
          this.dataForm.failRepeatTrigger = 3
        }
        this.acquisitionTask.sqlField = this.acquisitionTask.sqlField.split(',')
        let filterInArr = this.getAllinDatasourceList.filter(item => item.name === this.acquisitionTask.inDatasourceType)[0]
        let filterOutArr = this.getAlloutDatasourceList.filter(item => item.name === this.acquisitionTask.outDatasourceType)[0]
        this.getAllinDatasourceNameList = filterInArr.source
        this.getAlloutDatasourceNameList = filterOutArr.source
        this.formDs = filterInArr.alias
        this.toDs = filterOutArr.alias
        let strLen = this.formDs.length + this.toDs.length + 5
        this.dataForm.taskName = data.data.taskName.substr(strLen)
        this.getAllAccount('in', data.data.acquisitionTask.inDatasourceId)
        this.getAllAccount('out', data.data.acquisitionTask.outDatasourceId)
        this.loading = false
      })
    },
    getAllSystem () {
      projectAll().then(({data}) => {
        this.allSystemList = data.data
      })
    },
    getAllDatasource (type, flow) {
      dataSourceAll(type, flow).then(({data}) => {
        console.log(data)
        if (flow === 'IN') {
          this.getAllinDatasourceList = data.data
        } else {
          this.getAlloutDatasourceList = data.data
        }
      })
    },
    dataSourceTypeChange (type, val) {
      this.acquisitionTask[`${type}DatasourceId`] = ''
      let filterArr = this[`getAll${type}DatasourceList`].filter(item => item.name === val)[0]
      this[`getAll${type}DatasourceNameList`] = filterArr.source
      if (type === 'in') { // 根据数据源类型，决定任务名称的前缀
        this.formDs = filterArr.alias
      } else {
        this.toDs = filterArr.alias
      }
    },
    dataSourceNameChange (type, val) {
      this.acquisitionTask[`${type}AccountId`] = ''
      this.getAllAccount(type, val)
    },
    getAllAccount (type, id) {
      accountAll({
        id: id
      }).then(({data}) => {
        this[`all${type}AccountList`] = data.data
      })
    },
    redisNameChange (val, index) {
      let label = this.redisNames.filter(item => item.value === val)[0].label
      this.redisData.redisLabel = label
    },
    sqlParseClick () {
      if (!this.acquisitionTask.inDatasourceType) {
        return this.$message.error('数据源类型不能为空！')
      }
      if (!this.acquisitionTask.inDataSql) {
        return this.$message.error('作业开始前SQL不能为空！')
      }
      let data = new FormData()
      data.append('sql', this.acquisitionTask.inDataSql)
      data.append('dataSourceType', this.acquisitionTask.inDatasourceType)
      sqlParse(data).then(({data}) => {
        if (data && data.code === 0) {
          if (!data.data.length) {
            return this.$message.error('解析失败')
          }
          this.acquisitionTask.sqlField = data.data
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    gotoDataSource () {
      this.visible = false
      this.$parent.addOrUpdateVisible = false
      this.$router.push({ name: 'dispatch-dataSource' })
    },
    drawerClose () { // 关闭抽屉弹窗
      this.visible = false
      this.$parent.addOrUpdateVisible = false
    },
    inputTagChange () {
      if (this.acquisitionTask.sqlField.length) { // 如果已经有输入的值则清空报错提示
        this.$refs.sqlFieldEl.clearValidate()
      }
    },
    workItemChanges (cm, sql, refForm, selfRef) { // 内容更新时，不为空时将报错信息去除
      if (sql !== '') {
        this.$refs[refForm].clearValidate()
      }
      if (!sql) {
        this.$nextTick(() => {
          this.$refs[selfRef].codemirror.setOption('lint', false)
        })
      } else {
        this.$refs[selfRef].codemirror.setOption('lint', false)
        this.$nextTick(() => {
          this.$refs[selfRef].codemirror.setOption('lint', true)
        })
      }
    },
    // 按下键盘事件处理函数
    workItemKeyDown (event, ref) {
      const keyCode = event.keyCode || event.which || event.charCode
      const keyCombination = event.ctrlKey || event.altKey || event.metaKey
      if (!keyCombination && keyCode > 64 && keyCode < 123) {
        this.$refs[ref].codemirror.showHint({ completeSingle: false })
      }
    },
    // 提交
    dataFormSubmit (form) {
      let flag = true
      this.$refs['dataForm1'].validate((valid) => {
        if (!valid) {
          flag = false
        }
      })
      this.$refs['dataForm2'].validate((valid) => {
        if (!valid) {
          flag = false
        }
      })
      this.$refs['acquisitionTask'].validate((valid) => {
        if (!valid) {
          flag = false
        }
      })
      if (flag) {
        console.log(this.dataForm, this.acquisitionTask)
        let url = save
        if (this.dataForm.id) {
          url = update
        }
        let params = {
          ...this.dataForm,
          taskName: `${this.formDs}_to_${this.toDs}_${this.dataForm.taskName}`,
          taskType: 'ACQUISITION',
          acquisitionTask: { ...this.acquisitionTask, sqlField: this.acquisitionTask.sqlField.join(',') }
        }
        console.log(this.outTableName, this.outTableName.length)
        if (this.outTableName.length > 2 && this.acquisitionTask.outDatasourceType !== 'REDIS') {
          params.acquisitionTask.outDataTable = params.acquisitionTask.outDataTable + '#' + this.outTableName
        }
        if (this.outTableName.length > 2 && this.acquisitionTask.outDatasourceType === 'REDIS') {
          params.acquisitionTask.outDataTable = this.outTableName
        }
        if (params.isRunAgain === 0) {
          params.failRepeatTrigger = params.failRepeatTrigger
        } else {
          params.failRepeatTrigger = 0
        }
        url(params).then(({data}) => {
          if (data && data.code === 0) {
            this.$message({
              message: data.msg || '操作成功',
              type: 'success',
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
    }
  }
}
</script>
<style>
.api-manage-drawer .wrap {
    padding: 0 20px 20px;
    margin-top: -12px;
    width: 100%;
    overflow-y: auto;
    position: absolute;
    top: 75px;
    bottom: 55px;
  }
  .wrap h3 span  {
    float: right;
    font-size: 12px;
    font-weight: normal;
  }
  .wrap h3 span i {
    font-style: normal;
    padding-right: 10px;
    color: #000;
  }
  .drawer-title {
    padding: 15px;
    background: #333;
    color: #fff;
    font-size: 15px;
    margin: -20px -20px 0 -20px;
    position: relative;
  }
  .drawer-close {
    position: absolute;
    right: 20px;
  }
  .codesql {
    font-size: 11pt;
    font-family: Consolas, Menlo, Monaco, Lucida Console, Liberation Mono,
      DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace, serif;
  }
  .btn-code-continue {
    text-align: right;
  }
  .work-content-1 {
    border-top: 1px #cccccc dashed;
    padding: 20px 20px 10px 0;
    margin-top: 20px;
  }
  .footer {
    position: absolute;
    bottom: 0;
    background: #fff;
    padding: 10px 22px 10px 10px;
    width: 100%;
    height: 55px;
    text-align: right;
    box-shadow: 0 -2px 9px 0 rgba(153,169,191,.17);
    z-index: 500;
  }
  .CodeMirror {
    height: 260px
  }
  .styled-background {
    color: red
  }
  .work-type-pane {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
  }
  .CodeMirror-hints.xq-light, .CodeMirror-hints.idea {
    position: absolute;
    z-index: 9999;
    display: block;
  }
  .inputTag {
    border-radius: 4px;
    width: 600px;
    line-height: 22px;
    border: 1px solid #dcdfe6
  }
</style>
