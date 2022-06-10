<template>
  <el-drawer
    :append-to-body="false"
    :visible.sync="visible"
    :show-close="false"
    :wrapperClosable="false"
    size="1350px"
    class="insight-manage-drawer"
  >
    <div slot="title" class="drawer-title">
      {{drawerTitle}}
      <i class="el-icon-close drawer-close" @click="drawerClose"></i>
    </div>
    <div class="wrap" v-loading="loading">
      <div class="base-pane">
        <h3 ref="baseTitle">基本信息</h3>
        <el-form
          label-width="120px"
          :model="baseForm"
          ref="baseForm"
          :rules="baseRule"
          class="base-form"
          :disabled="!canUpdate"
        >
          <el-form-item label="分群名称" prop="name">
            <el-input
              v-model.trim="baseForm.name"
              placeholder="分群名称"
              clearable
              class="base-pane-item"
            />
          </el-form-item>
          <el-form-item label="分群类型" prop="userType" :class="baseForm.userType === 'excel' ? 'type-radio-item-userType-active' : 'type-radio-item-userType'">
            <div class="type-radio-item type-radio-one">
              <el-radio
                label="indicator"
                v-model="baseForm.userType"
                @change="radioTypeChange"
                :disabled="!!id"
              >指标筛选</el-radio>
              <div v-if="baseForm.userType === 'indicator'" class="indicator-channel">
                <el-form-item label="所属业务线" prop="channelId" :rules="{ required: true, message: '请选择用户所属业务线', trigger: 'blur' }">
                <!-- multiple
                  :multiple-limit = "channelLimit" -->
                <el-select
                  v-model="baseForm.channelId"
                  @change="channelIdChange"
                  filterable
                  :disabled="!!id"
                  style="width: 400px"
                >
                  <template v-for="(item, index) in channelList">
                    <el-option
                      :key="index"
                      :label="item.text"
                      :value="item.value"
                      :disabled="item.disabled"
                    ></el-option>
                  </template>
                </el-select>
                </el-form-item>
              </div>
            </div>
            <div class="type-radio-item type-radio-two">
              <el-radio
                label="excel"
                v-model="baseForm.userType"
                @change="radioTypeChange"
                :disabled="!!id"
              >excel文件导入</el-radio>
            </div>
          </el-form-item>
          <el-form-item
            label="所属业务线"
            prop="channelId"
            v-if="baseForm.userType === 'excel'"
            class="user-channel"
          >
            <el-select v-model="baseForm.channelId" :disabled="!!id" style="width: 300px" @change="channelIdChange" filterable>
              <template v-for="(item, index) in channelList">
                <el-option :key="index" :label="item.text" :value="item.value"></el-option>
              </template>
            </el-select>
            <span v-if="excelFile" class="upload-name">{{excelFile}}</span>
            <el-upload
              v-if="baseForm.userType === 'excel'"
              class="upload-excel"
              ref="upload"
              action="aaa"
              accept=".xlsx, .xls"
              :file-list="fileData.fileList"
              :on-change="handleChange"
              :before-upload="beforeUpload"
              :show-file-list="false"
              :auto-upload="false"
            >
              <el-button slot="trigger" size="small" type="default" icon="el-icon-document">选择文件</el-button>
            </el-upload>
            <el-button
              v-if="baseForm.userType === 'excel'"
              class="btn-download"
              size="small"
              type="primary"
              icon="el-icon-download"
            >
              <a :href="templateUrl">下载模板</a>
            </el-button>
          </el-form-item>
          <el-form-item>
            <div class="type-radio-item type-radio-three">
              <el-radio
                label="sql"
                v-model="baseForm.userType"
                @change="radioTypeChange"
                :disabled="!!id"
              >SQL</el-radio>
            </div>
          </el-form-item>
           <el-form-item
            label="所属业务线"
            prop="channelId"
            v-if="baseForm.userType === 'sql'"
            label-width="110px;"
            class="user-channel"
          >
            <el-select v-model="baseForm.channelId" :disabled="!!id" style="width: 300px" @change="channelIdChange" filterable>
              <template v-for="(item, index) in channelList">
                <el-option :key="index" :label="item.text" :value="item.value" :disabled="item.disabled"></el-option>
              </template>
            </el-select>
          </el-form-item>
          <div  v-if="baseForm.userType === 'sql'" class="work-type-pane-source">
            <el-form-item prop="datasourceType" label="数据来源">
              <el-select v-model="baseForm.datasourceType" style="width:300px;">
                <el-option label="maxComputer" value="maxComputer">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="tableSpace" label="表空间">
            <el-select v-model="baseForm.tableSpace" style="width:300px;">
              <el-option 
                v-for="(item,index) in tableSpaceList"
                :key="index"
                :label="item.value"
                :value="item.value"
                >
              </el-option>
            </el-select>
            </el-form-item>
          </div>
          <el-form-item class="user-channel" v-if="baseForm.userType === 'sql'" prop="sql" label="SQL：" label-width="70px" ref="workBeginSqlForm">
            <div style="border:1px solid #dcdfe6; border-radius: 4px; position:relative">
              <codemirror
                ref="workBeginSql"
                v-model="baseForm.sql"
                :options="cmOptions"
                @changes="cm => workItemChanges(cm, baseForm.sql, 'workBeginSqlForm', 'workBeginSql')"
                @keydown.native="e => workItemKeyDown(e, 'workBeginSql')"
                class="code"
                style="padding-bottom: 0px"
              ></codemirror>
            </div>
            <p class="data-description-tips">
             默认选中sql语句中输出的第一个字段作为映射字段
            </p>
          </el-form-item>
          <el-form-item v-if="baseForm.userType === 'sql'" prop="outParam" label="输出数据" style="margin-left:80px;">
            <el-radio  v-model="baseForm.outParam" label="uuid">uuid</el-radio>
            <el-radio  v-model="baseForm.outParam" label="user_id" >user_id</el-radio>
            <el-radio  v-model="baseForm.outParam" label="cert_id">cert_id</el-radio>
            <el-radio  v-model="baseForm.outParam" label="mobile">mobile</el-radio>
          </el-form-item>
          <el-form-item label="计算类型" prop="type">
            <el-radio-group
              v-model="baseForm.type"
              :disabled="!!id || baseForm.userType === 'excel'|| baseForm.userType === 'sql'"
            >
              <el-radio label="dynamic">动态（根据每次下发或调用的时间计算）</el-radio>
              <el-radio label="static">静态（根据创建/修改分群的时间计算）</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="分群描述">
            <el-input
              type="textarea"
              class="base-pane-item"
              v-model="baseForm.desc"
              placeholder="最多输入100个字符"
              maxlength="100"
              :autosize="{ minRows: 3, maxRows: 5}"
            />
            <p class="data-description-tips">
              最多输入100个字符，您还可以输入
              <span v-text="100 - baseForm.desc.length"></span>个字符
            </p>
          </el-form-item>
        </el-form>

      </div>
      <div class="pane-rules-title"> <h3>满足如下条件的用户</h3> </div>
      <div class="pane-rules">
          <div class="pane-rules-relation" v-if="showActionRule && showAtterRule">
             <span @click="switchSymbol()">{{outMostExpressionTemplate === 'and' ? '且' : '或'}}</span>
          </div>
           <div style="flex: 1">
               <user-attr-rule-pane ref="userAttrRule" :id="id" :canUpdate="canUpdate" @renderEnd="renderEnd" @isShowAttrRule="isShowAttrRule"></user-attr-rule-pane>
               <!-- 暂时隐藏用户行为 -->
               <!-- <user-action-rule-pane ref="userActionRule" :id="id" @renderEnd="renderEnd" @isShowActionRule="isShowActionRule"></user-action-rule-pane> -->
           </div>
      </div>
      <div class="pane-reject">
        <h3>剔除用户名单</h3>
        <div>
          <el-form label-width="80px" :model="rejectForm" :rules="baseRule" ref="rejectForm" :disabled="!canUpdate">
            <el-form-item label="分群包">
              <el-select v-model="rejectForm.rejectGroupPackageIds" filterable multiple placeholder="请选择分群包" class="reject-pane-item">
                <el-option
                  v-for="item in custerNameList"
                  :key="item.value"
                  :label="item.text"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="风控包">
              <el-select v-model="rejectForm.vestPackCode" filterable multiple placeholder="请选择风控包" class="reject-pane-item">
                <el-option
                  v-for="item in vestPackList"
                  :key="item.value"
                  :label="item.text"
                  :value="item.value"
                ></el-option>
              </el-select>
              <el-tooltip placement="top">
                <div slot="content">因风控包需调用第三方接口，当判断指定用户是否在此分群时，不进行风控包过滤</div>
                <i class="el-icon-warning cursor-pointer"></i>
              </el-tooltip>
            </el-form-item>
            <el-form-item label="撞库包">
              <el-select v-model="rejectForm.collisionPackId" filterable clearable @clear="collisionPackIdClear" @change="collisionPackIdChange" placeholder="请选择撞库包" class="reject-pane-item">
                <el-option
                  v-for="item in collisionList"
                  :key="item.value"
                  :label="item.text"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <div style="display:flex;width:100%" v-if="collisionData.length">
              <div style="width:160px;text-align:right;padding-right:10px;">{{collisionPackText}}</div>
              <el-card class="box-card" shadow="never" style="width:560px">
                <el-form-item :label="item.paramTitle" :prop="item.paramName" v-for="(item, index) in collisionData" :key="index" :rules="{ required: true, message: item.allowMulti && !item.isEnum ? `请输入${item.paramTitle}，可用回车输入多条` : '请选择' + item.paramTitle, trigger: 'change' }">
                  <input-tag v-model="rejectForm[item.paramName]" v-if="item.allowMulti && !item.isEnum" :tag-tips=[] :add-tag-on-blur="true" :allow-duplicates="true" class="inputTag reject-pane-item1" :placeholder="`请输入${item.paramTitle}，可用回车输入多条`"></input-tag>
                  <el-select v-model="rejectForm[item.paramName]" v-if="item.isEnum" :multiple="item.allowMulti" filterable :placeholder="'请选择' + item.paramTitle"  class="reject-pane-item1">
                    <el-option
                      v-for="citem in item.options"
                      :key="citem.value"
                      :label="citem.text"
                      :value="citem.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-card>
            </div>
          </el-form>
        </div>
      </div>
    </div>
    <div class="footer">
      <el-button
        type="success"
        @click="saveHandle('preview')"
        size="small"
        v-if="baseForm.userType !== 'excel' && baseForm.userType !== 'sql'"
      >数据预览</el-button>
      <el-button
        type="primary"
        @click="copyHandle('save')"
        size="small"
        v-if="!!id && baseForm.userType !== 'excel'"
      >复制创建新分群</el-button>
      <!-- <el-button
        type="primary"
        @click="saveHandle('save')"
        size="small"
        v-if="tag !== 'view'"
        :disabled="loading"
      >保存</el-button> -->
      <el-button
        type="primary"
        @click="saveHandle('save')"
        size="small"
        v-if="canUpdate"
        :disabled="loading"
      >保存</el-button>
      <el-button type="default" @click="cancelHandle" size="small">取消</el-button>
    </div>
    <data-preview-info
      v-if="isPreviewShow"
      ref="dataPreviewInfo"
      :vestPackCode="rejectForm.vestPackCode"
    ></data-preview-info>
    <taskDependencies v-if="taskDependenciesVisible" ref="taskDependencies" :dataList = 'taskDependenciesList'></taskDependencies>
  </el-drawer>
</template>
<script>
import userAttrRulePane from './userAttr-rule-pane'
import userActionRulePane from './userAction-rule-pane'
import taskDependencies from './task-dependencies'
// import userBehaviorRulePane from './userBehavior-rule-pane'
import dataPreviewInfo from './data-preview-info'
import { getQueryString } from '@/utils'
import InputTag from '../components/InputTag'
import {
  savaDataInfo,
  updateDataInfo,
  viewDataInfo,
  importExcelFile,
  templateDownload,
  vestPackAvailable,
  channelsList,
  custerAvailable,
  collisionList,
  collisionParams,
  collisionSave,
  collisionUpdate,
  databaseInitInfo,
  importSqlInfo
} from '@/api/dataAnalysis/dataInsightManage'
import Treeselect, { LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
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
  data () {
    return {
      // channelLimit: 1,
      isPreviewShow: true,
      loading: false,
      showActionRule: false,
      showAtterRule: false,
      id: 0,
      flowId: '',
      tag: '',
      drawerTitle: '',
      visible: false,
      fileData: {
        fileList: []
      },
      excelFile: '',
      templateUrl: templateDownload,
      vestPackList: [],
      custerNameList: [],
      outMostExpressionTemplate: 'and', // 用户属性与用户行为外层关系
      collisionData: [],
      collisionList: [],
      // allCusterNameList: [],
      baseForm: {
        name: '',
        userType: 'indicator',
        type: 'dynamic',
        channelId: '',
        desc: '',
        sql: '',
        datasourceType: '',
        tableSpace: '',
        outParam: ''
      },
      rejectForm: {
        rejectGroupPackageIds: [],
        vestPackCode: [],
        collisionPackId: ''
      },
      collisionPackText: '',
      taskDependenciesList: [],
      taskDependenciesVisible: false,
      baseRule: { // 基本信息校验规则
        name: [
          { required: true, message: '请输入分群名称', trigger: 'blur' }
        ],
        userType: [
          { required: true, message: '请选择分群类型', trigger: 'change' }
        ],
        type: [
          { required: true, message: '请选择计算类型', trigger: 'change' }
        ],
        channelId: [
          { required: true, message: '请选择用户所属业务线', trigger: 'change' }
        ],
        sql: [
          { required: true, message: '请输入SQL', trigger: 'change' }
        ],
        datasourceType: [
          { required: true, message: '请选择数据来源', trigger: 'change' }
        ],
        // tableSpace: [
        //   { required: true, message: '请选择数据来源', trigger: 'change' }
        // ],
        outParam: [
          { required: true, message: '请选择输出数据', trigger: 'change' }
        ]
      },
      channelList: [],
      tableSpaceList: [],
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
      rowData: { // 修改时authOwner数据内容
        authOwner: '',
        authOtherList: [],
        authOthers: ''
      },
      canUpdate: true // 可编辑
    }
  },
  components: {
    userAttrRulePane,
    userActionRulePane,
    Treeselect,
    dataPreviewInfo,
    InputTag,
    codemirror,
    taskDependencies
  },
  methods: {
    init (row, tag, canUpdate) {
      this.id = 0
      this.tag = ''
      this.flowId = ''
      this.rowData.authOwner = ''
      this.canUpdate = canUpdate
      this.rowData.authOtherList = []
      this.rowData.authOthers = ''
      this.loading = true
      this.visible = true
      // this.isRequired = false // 默认为false,不设置的话，保存后再进入会变
      this.getVestPackAvailable('')
      this.getChannelsList()
      this.getCusterList('')
      this.getCollisionList()
      this.getSqlImport()
      // this.getCollisionParams()
      this.$nextTick(() => { // 默认将基本信息的错误提示消除
        this.$refs.baseForm.clearValidate()
      })
      this.tag = tag
      if (!tag) {
        this.loading = false
        this.drawerTitle = '新增'
        this.initEmptyData()
      } else {
        this.id = row.id
        if (canUpdate) {
          this.rowData.authOwner = row.authOwner
          this.rowData.authOtherList = row.authOtherList
          this.rowData.authOthers = row.authOthers
        }
        this.drawerTitle = tag === canUpdate ? '查看' : '编辑'
        // this.drawerTitle = tag === 'view' ? '查看' : '编辑'
        this.getDataInfo(row.id)
      }
    },
    async loadOptions ({ action, parentNode, callback }) {
      if (action === LOAD_CHILDREN_OPTIONS) {
        callback()
      }
    },
    initEmptyData () {
      // 当数据异常时，初始化数据
      this.baseForm = {
        name: '',
        userType: 'indicator',
        type: 'dynamic',
        channelId: '',
        desc: ''
      }
      this.$nextTick(() => {
        console.log(this.$refs)
        this.$refs.userAttrRule.init()
        // this.$refs.userActionRule.init() // 用户行为暂时隐藏
      })
    },
    getDataInfo (id) {
      // 查看及编辑时请求数据
      viewDataInfo(id).then(({ data }) => {
        if (data.status !== '1') {
          this.initEmptyData()
          this.loading = false
          return this.$message({
            message: data.message,
            type: 'error'
          })
        } else {
          this.flowId = data.data.flowId
          this.outMostExpressionTemplate = data.data.configJson && JSON.parse(data.data.configJson).outMostExpressionTemplate ? JSON.parse(data.data.configJson).outMostExpressionTemplate : 'and'
          this.baseForm = {
            name: data.data.name,
            desc: data.data.desc,
            userType: data.data.userType,
            type: data.data.type,
            sql: data.data.userType === 'sql' ? data.data.sqlImportParam.sql : '',
            datasourceType: data.data.userType === 'sql' ? data.data.sqlImportParam.datasourceType : '',
            tableSpace: data.data.userType === 'sql' ? data.data.sqlImportParam.tableSpace : '',
            outParam: data.data.userType === 'sql' ? data.data.sqlImportParam.outParam : ''
            // sql: data.data.sqlImportParam.sql,
            // datasourceType: data.data.sqlImportParam.datasourceType,
            // tableSpace: data.data.sqlImportParam.tableSpace,
            // outParam: data.data.sqlImportParam.outParam
          }
          // if (data.data.userType === 'sql') {
          //   this.baseForm.sql = data.data.sqlImportParam.sql
          //   this.baseForm.datasourceType = data.data.sqlImportParam.datasourceType
          //   this.baseForm.tableSpace = data.data.sqlImportParam.tableSpace
          //   this.baseForm.outParam = data.data.sqlImportParam.outParam
          // }
          this.rejectForm.rejectGroupPackageIds =
            data.data.rejectGroupPackageIds || []
          if (!data.data.vestPackCode || data.data.vestPackCode === null) {
            this.rejectForm.vestPackCode = []
          } else {
            this.rejectForm.vestPackCode = data.data.vestPackCode
              .split(',')
              .filter(item => item != '')
          }
          this.baseForm.channelId = data.data.channelId

          this.getVestPackAvailable(this.baseForm.channelId)
          if (data.data.userType === 'excel') {
            this.excelFile = data.data.excelFile
          }
          if (!data.data.configJson && data.data.userType !== 'excel') { // 在真实掉接口时用 || 关系进行数据验证
            this.initEmptyData()
            this.loading = false
            return this.$message({
              message: '数据异常',
              type: 'error'
            })
          }
          this.$refs.userAttrRule.renderData(
            data.data.configJson,
            this.baseForm.channelId
          )
          // 用户行为暂时隐藏
          // this.$refs.userActionRule.renderData( // 真实调接口时数据重现
          //   data.data.configJson,
          //   this.baseForm.channelId
          // )
        }
      })
    },
    renderEnd () {
      this.loading = false
    },
    getSqlImport () {
      databaseInitInfo().then(({data}) => {
        if (data.status !== '1') {
          this.tableSpaceList = []
          return this.$message({
            type: 'error',
            message: data.message || '数据异常'
          })
        }
        this.tableSpaceList = data.data.touchActionList
      })
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
    isShowActionRule (val) {
      if (val) {
        this.outMostExpressionTemplate = this.outMostExpressionTemplate
      } else {
        this.outMostExpressionTemplate = 'and'
      }
      this.showActionRule = val
    },
    isShowAttrRule (val) {
      if (val) {
        this.outMostExpressionTemplate = this.outMostExpressionTemplate
      } else {
        this.outMostExpressionTemplate = 'and'
      }
      this.showAtterRule = val
    },
    getChannelsList () {
      channelsList().then(res => {
        if (res.data.status * 1 !== 1) {
          this.channelList = []
          return
        }
        this.channelList = res.data.data.map(item => {
          if (item.value === '0000') {
            item.disabled = true
          } else {
            item.disabled = false
          }
          return item
        })
      })
    },
    channelIdChange () {
      // 用户渠道改变时，重新过滤指标数据
      if (this.baseForm.channelId.length === 0) {
        this.channelList.forEach(item => {
          if (item.value === '0000') {
            item.disabled = true
          } else {
            item.disabled = false
          }
        })
      }
      // if (this.baseForm.channelId.length === 1) {
      //   if (this.baseForm.channelId[0] === '2001' || this.baseForm.channelId[0] === '6001') {
      //     this.channelLimit = 2
      //     this.channelList.forEach(item => {
      //       if (item.value === '2001' || item.value === '6001') {
      //         item.disabled = false
      //       } else {
      //         item.disabled = true
      //       }
      //     })
      //   } else {
      //     this.channelLimit = 1
      //   }
      // }
      this.rejectForm.rejectGroupPackageIds = []
      this.getCusterList(this.baseForm.channelId)
      this.getVestPackAvailable(this.baseForm.channelId)
      this.$refs.userAttrRule.channelIdChangeUpdate(this.baseForm.channelId)
      // this.$refs.userActionRule.channelIdChangeUpdate(this.baseForm.channelId) // 用户行为暂时隐藏
      this.rejectForm.rejectGroupPackageIds = []
    },
    getVestPackAvailable (channelId) {
      vestPackAvailable({
        channelCode: channelId
      }).then(res => {
        if (res.data.status * 1 !== 1) {
          this.vestPackList = []
          return this.$message({
            type: 'error',
            message: res.message || '数据异常'
          })
        }
        this.vestPackList = res.data.data
      })
    },
    // 切换用户行为和用户属性外层关系
    switchSymbol () {
      this.outMostExpressionTemplate = this.outMostExpressionTemplate === 'and' ? 'or' : 'and'
    },
    // 获取分群名称
    getCusterList (code) {
      custerAvailable(code).then(({ data }) => {
        if (data.status !== '1') {
          this.custerNameList = []
          return this.$message({
            type: 'error',
            message: data.message || '数据异常'
          })
        }
        this.custerNameList = data.data
      })
    },
    getCollisionList () {
      collisionList().then(({data}) => {
        this.collisionList = data.data || []
        if (this.id) {
          this.getCollisionParams()
        }
      })
    },
    collisionPackIdClear () {
      this.collisionData = []
    },
    collisionPackIdChange (val) {
      if (val) {
        this.collisionPackText = this.collisionList.filter(item => item.value === val)[0].text
        this.getCollisionParams()
      }
    },
    getCollisionParams () {
      collisionParams(this.rejectForm.collisionPackId, this.id).then(({data}) => {
        if (data && data.status * 1 === 1) {
          if (!data.data.length) return
          this.collisionData = data.data
          this.rejectForm.collisionPackId = data.data[0].collisionPackId
          this.collisionPackText = this.collisionList.filter(item => item.value === this.rejectForm.collisionPackId)[0].text
          data.data.forEach(item => {
            if (item.allowMulti && !item.isEnum) {
              this.$set(this.rejectForm, item.paramName, item.value ? item.value.split(',') : '')
            } else {
              this.$set(this.rejectForm, item.paramName, item.value || '')
            }
          })
        }
      })
    },
    radioTypeChange (val) { // 当选择指标筛选时，上传文件置空
      if (val === 'indicator') {
        this.fileData.fileList = []
        this.excelFile = ''
        this.baseForm.type = 'dynamic'
      } else {
        this.baseForm.type = 'static'
      }
    },
    handleChange (file, fileList) {
      let that = this
      let fileName = file.name.substring(file.name.lastIndexOf('.') + 1) // 文件类型
      let size = file.size / 1024 / 1024
      if (fileName != 'xls' && fileName != 'xlsx') {
        that.$message({
          type: 'error',
          message: '文件类型不是.xls文件!'
        })
        return false
      }
      if (size > 10) {
        that.$message({
          type: 'error',
          message: '文件大小不能超过10M!'
        })
        return false
      }
      // 上传文件变化时
      if (fileList.length > 0) {
        this.fileData.fileList = [fileList[fileList.length - 1]] // 这一步，是展示最后一次选择的文件
        this.excelFile = this.fileData.fileList[0].name
      }
    },
    beforeUpload (file) {
      // 由于auto-upload被设置为false，beforeUpload时间没有被触发，需要交验的内容在on-change时间完成
      // 上传文件之前的事件
      let that = this
      let fileName = file.name.substring(file.name.lastIndexOf('.') + 1) // 文件类型
      let size = file.size / 1024 / 1024
      if (fileName != 'xls' && fileName != 'xlsx') {
        that.$message({
          type: 'error',
          message: '文件类型不是.xls文件!'
        })
        return false
      }
      if (size > 2) {
        that.$message({
          type: 'error',
          message: '文件大小不能超过10M!'
        })
        return false
      }
    },
    previewHandle () {
      this.isPreviewShow = true
      this.$nextTick(() => {
        this.$refs.dataPreviewInfo.init()
      })
    },
    getQueryParams (name) {
      let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
      let params =
        window.location.search.substr(1) || window.location.href.split('?')[1]
      let r = params && params.match(reg)
      if (r != null) {
        return decodeURI(r[2])
      }
      return null
    },
    copyHandle () { // 复制功能
      this.$confirm('分群已复制，点击“确定”开始编辑新分群', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => { // 确认创建分群时的操作
        this.drawerTitle = '新建'
        this.baseForm.name = '复制' + this.baseForm.name
        this.id = 0
        this.canUpdate = true
        this.rowData.authOwner = ''
        this.rowData.authOtherList = []
        this.rowData.authOthers = ''
        this.$refs.baseTitle.scrollIntoView() // 滚动到页面最上面
      }).catch(() => {
        console.log('cancel')
      })
        // .then(() => {
        //   // 确认创建分群时的操作
        //   this.drawerTitle = '新建'
        //   this.baseForm.name = '复制' + this.baseForm.name
        //   this.id = 0
        //   this.$refs.baseTitle.scrollIntoView() // 滚动到页面最上面
        // })
        // .catch(() => {
        //   console.log('cancel')
        // })
    },
    saveCollision () {
      let url = collisionSave
      let params = this.collisionData
      params.forEach(item => {
        item.collisionPackId = this.rejectForm.collisionPackId
        if (item.allowMulti && !item.isEnum) {
          item.value_bk = this.rejectForm[item.paramName]
          item.value = this.rejectForm[item.paramName].join(',')
        } else {
          item.value = this.rejectForm[item.paramName]
        }
      })
      if (this.id) {
        url = collisionUpdate
      }
      url(params, this.rejectForm.collisionPackId, this.id).then(({data}) => {
        this.loading = false
        if ((data && data.status * 1 !== 1) || (data.code && data.code === 500)) {
          return this.$message.error(data.message || data.msg || '提交失败')
        }
        this.$message.success(data.message)
        this.visible = false
        this.$parent.addOrUpdateVisible = false
        this.$nextTick(() => {
          this.$parent.getDataList()
        })
      })
    },
    saveHandle (type) {
      if (type === 'save') {
            this.taskDependenciesVisible = true
            this.$nextTick(() => {
              this.$refs.taskDependencies.init()
            })
          }
          return
      if (this.baseForm.userType === 'excel' && !this.excelFile) {
          this.$message({
            type: 'error',
            message: '请选择要上传的文件'
          })
          return
      }
      // 用户属性 用户行为 数据校验
      this.$refs.userAttrRule.isRequired = true
      // this.$refs.userActionRule.isRequired = true // 用户行为暂时隐藏
      let ruleFormArr = this.$refs.userAttrRule.getRuleForm()
      // let actionRuleFormArr = this.$refs.userActionRule.getRuleForm() // 用户行为暂时隐藏
      this.$nextTick(() => {
        // 待页面中的isRequired = true后再执行校验
        let flag = true
        this.$refs.baseForm.validate(valid => {
          if (!valid) {
            flag = false
          }
        })
        this.$refs.rejectForm.validate((valid) => {
          if (!valid) {
            flag = false
          }
        })
        console.log(ruleFormArr)
        ruleFormArr.forEach(item => {
          item.validate(valid => {
            if (!valid) {
              flag = false
            }
          })
        })
        // actionRuleFormArr.forEach(item => { // 用户行为暂时隐藏
        //   item.validate(valid => {
        //     if (!valid) {
        //       flag = false
        //     }
        //   })
        // })
        if (ruleFormArr.length === 0 && this.baseForm.userType !== 'excel' && this.baseForm.userType !== 'sql') {
        // if (ruleFormArr.length === 0 && actionRuleFormArr.length === 0) { // 用户行为暂时隐藏
          return this.$message({
            message: '请配置用户规则信息',
            type: 'error',
            center: true
          })
        }
        if (!flag) {
          this.$refs.userAttrRule.isRequired = false
          // this.$refs.userActionRule.isRequired = false // 用户行为暂时隐藏
        } else {
          // 全部校验通过后，可保存数据
          this.$refs.userAttrRule.uneffectIndexValidate()
          // this.$refs.userActionRule.uneffectIndexValidate() // 用户行为暂时隐藏
          if (this.$refs.userAttrRule.isSelectedUneffectIndex.length > 0) { // （后续）校验需要加上用户行为
            return false
          }
      
          if (this.baseForm.userType === 'excel') { // excel方式
            this.excelSaveData()
          } else if (this.baseForm.userType === 'sql') {
            this.saveSql()
          } else {
            this.indexSaveData(type)
          }
        }
      })
    },
    indexSaveData (type) {
      let code = 0
      if (this.rejectForm.rejectGroupPackageIds.length) {
        code = 1
      }
      let params = {
        ...this.rowData,
        ...this.baseForm,
        ...this.$refs.userAttrRule.lastSubmitRuleConfig,
        // ...this.$refs.userActionRule.lastSubmitRuleConfig, //用户行为
        ...this.rejectForm,
        outMostExpressionTemplate: this.showActionRule && this.showAtterRule ? this.outMostExpressionTemplate : 'and',
        rejectGroupPackCode: code
      }
      // params.channelId = params.channelId.length > 1 ? params.channelId.join(',') : params.channelId[0]
      if (type === 'preview') {
        this.isPreviewShow = true
        this.$nextTick(() => {
          this.$refs.dataPreviewInfo.init(params)
        })
        return
      }
      params.vestPackCode = params.vestPackCode.join(',')
      let url = savaDataInfo
      if (this.id) {
        url = updateDataInfo
        params.id = this.id
        params.flowId = this.flowId
      }
      let sysUuid = getQueryString('system_uuid')
      let sysArr = [
        'ecf36297-37ea-489e-a350-045b1ab49f75', // 统一后台uuid
        '95dd8c99-8c51-4394-b2f4-95ba472c2ef4' // 小鱼福卡uuid
      ]
      if (sysUuid && sysArr.includes(sysUuid)) {
        params.username = this.getQueryParams('username') || ''
      }
      this.loading = true
      url(params).then(({ data }) => {
        if (data.status !== '1') {
          this.loading = false
          return this.$message({
            type: 'error',
            message: data.message || '数据异常'
          })
        } else {
          this.id = data.data
          this.saveCollision()
        }
      })
    },
    excelSaveData () {
      let data = new FormData() // 上传文件使用new formData();可以实现表单提交;
      data.append('file', this.fileData.fileList.length ? this.fileData.fileList[0].raw : {})
      data.append('name', this.baseForm.name)
      data.append('type', this.baseForm.type)
      data.append('userType', this.baseForm.userType)
      data.append('desc', this.baseForm.desc)
      data.append('channelId', this.baseForm.channelId)
      data.append('ruleConfig', JSON.stringify(this.$refs.userAttrRule.lastSubmitRuleConfig.ruleConfig))
      data.append('expression', this.$refs.userAttrRule.lastSubmitRuleConfig.expression)
      data.append('expressionTemplate', this.$refs.userAttrRule.lastSubmitRuleConfig.expressionTemplate)
      data.append('vestPackCode', this.rejectForm.vestPackCode.join(','))
      this.rejectForm.rejectGroupPackageIds.forEach(item => {
        data.append('rejectGroupPackageIds', item)
      })
      let flag = 0
      if (this.rejectForm.rejectGroupPackageIds.length) {
        flag = 1
      }
      data.append('rejectGroupPackCode', flag)
      if (this.id) {
        data.append('id', this.id)
      }
      this.loading = true
      importExcelFile(data).then(res => {
        if (res.data.status * 1 !== 1) {
          this.$message({
            type: 'error',
            message: res.data.message || '保存失败'
          })
          this.loading = false
        } else {
          this.id = res.data.data
          this.saveCollision()
        }
      }).catch((e) => {
        this.$message({
          type: 'error',
          message: e.message || '保存失败'
        })
      })
    },
    saveSql () {
      let code = 0
      if (this.rejectForm.rejectGroupPackageIds.length) {
        code = 1
      }
      let sqlImportParam = {
        'datasourceType': this.baseForm.datasourceType,
        'tableSpace': this.baseForm.tableSpace,
        'sql': this.baseForm.sql,
        'outParam': this.baseForm.outParam
      }
      let params = {
        ...this.rowData,
        name: this.baseForm.name,
        userType: this.baseForm.userType,
        type: this.baseForm.type,
        channelId: this.baseForm.channelId,
        desc: this.baseForm.desc,
        ...this.$refs.userAttrRule.lastSubmitRuleConfig,
        // ...this.$refs.userActionRule.lastSubmitRuleConfig, //用户行为
        ...this.rejectForm,
        sqlImportParam: sqlImportParam,
        outMostExpressionTemplate: this.showActionRule && this.showAtterRule ? this.outMostExpressionTemplate : 'and',
        rejectGroupPackCode: code
      }
      params.vestPackCode = params.vestPackCode.join(',')
      if (this.id) {
        params.id = this.id
      }
      this.loading = true
      console.log('params: ', params)
      importSqlInfo(params).then(res => {
        if (res.data.status * 1 !== 1) {
          this.$message({
            type: 'error',
            message: res.data.message || '保存失败'
          })
          this.loading = false
        } else {
          this.id = res.data.data
          this.saveCollision()
        }
      })
    },
    drawerClose () {
      this.visible = false
      this.$parent.addOrUpdateVisible = false
    },
    cancelHandle () {
      this.visible = false
      this.$parent.addOrUpdateVisible = false
    }
  }
}
</script>
<style>
.insight-manage-drawer .wrap {
  padding: 0 20px 20px;
  margin-top: -12px;
  width: 100%;
  overflow-y: auto;
  position: absolute;
  top: 75px;
  bottom: 55px;
}
.insight-manage-drawer .drawer-title {
  padding: 15px;
  background: #333;
  color: #fff;
  font-size: 15px;
  margin: -20px -20px 0 -20px;
  position: relative;
}
.insight-manage-drawer .drawer-close {
  position: absolute;
  right: 20px;
}
.insight-manage-drawer .item-inline {
  display: inline-block;
}
.insight-manage-drawer .item-code {
  margin-left: -70px;
}
.insight-manage-drawer .item-code-name {
  width: 300px;
}
.insight-manage-drawer .item-button {
  margin-left: -60px;
}
.insight-manage-drawer .copy-code {
  margin-left: 15px;
}
.insight-manage-drawer .footer {
  position: absolute;
  bottom: 0;
  background: #fff;
  padding: 10px 22px 10px 10px;
  width: 100%;
  height: 55px;
  text-align: right;
  box-shadow: 0 -2px 9px 0 rgba(153, 169, 191, 0.17);
  z-index: 500;
}
.insight-manage-drawer .cursor-pointer {
  cursor: pointer;
}
.insight-manage-drawer .base-pane-item {
  width: 80%;
}
.insight-manage-drawer .vue-treeselect {
  line-height: 24px;
}
.insight-manage-drawer .data-description-tips {
  color: #999;
  margin-top: 0;
}
.insight-manage-drawer .data-description-tips span {
  color: red;
}
.insight-manage-drawer .type-radio-group {
  margin-top: 12px;
}
.insight-manage-drawer .type-radio-two {
  margin-top: 10px;
}
.insight-manage-drawer .type-radio-three {
  margin-top: 10px;
}
.insight-manage-drawer .upload-excel {
  display: inline-block;
  margin-left: 20px;
}
.insight-manage-drawer .btn-upload {
  display: inline-block;
  font-size: 14px;
  padding-left: 15px;
}
.insight-manage-drawer .upload-name {
  font-size: 14px;
  padding-left: 15px;
}
.insight-manage-drawer .btn-upload button {
  margin-left: 10px;
}
.insight-manage-drawer .btn-download {
  margin-left: 10px;
}
.insight-manage-drawer .btn-download a {
  color: #fff;
}
.insight-manage-drawer .el-list-enter-active,
.insight-manage-drawer .el-list-leave-active {
  transition: none;
}
.insight-manage-drawer .el-list-enter,
.insight-manage-drawer .el-list-leave-active {
  opacity: 0;
}
.insight-manage-drawer .pane-rules {
  position: relative;
  display: flex;
}
/* .pane-rules-data {

} */
.pane-rules-relation {
  left: 0;
  top: -8px;
  bottom: 0;
  position: relative;
  margin-right: 8px;
  margin-bottom: 20px;
}
.pane-rules-relation:before {
  content: " ";
  position: absolute;
  top: 0;
  left: 50%;
  width: 2px;
  height: 100%;
  overflow: hidden;
  background: #d0e2f5;
}
.pane-rules-relation span {
  position: relative;
  display: block;
  top: 50%;
  left: 0;
  right: 0;
  width: 25px;
  height: 25px;
  transform: translateY(-50%);
  border-radius: 3px;
  background: #d0e2f5;
  color: #409eff;
  font-size: 14px;
  font-weight: 700;
  line-height: 25px;
  text-align: center;
  cursor: pointer;
  user-select: none;
}
.insight-manage-drawer .pane-rules-title, .insight-manage-drawer .pane-reject {
  border-top: 1px dashed #ccc;
}
.insight-manage-drawer .user-channel {
  margin-left: 110px;
}
.insight-manage-drawer .indicator-channel {
  display: inline-block;
  margin-left: 20px;
}
.insight-manage-drawer .pane-reject {
  margin-top: 20px;
}
.insight-manage-drawer .reject-pane-item {
  width: 50%;
}
.insight-manage-drawer .reject-pane-item1 {
  width:80%
}
.inputTag {
  display: inline-block;
  border-radius: 4px;
  width: 340px;
  line-height: 22px;
  border: 1px solid #dcdfe6
}
.work-type-pane-source {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
  margin-left: 70px;
}
.type-radio-item-userType {
  margin-bottom: 0 !important;
}
.type-radio-item-userType-active {
  margin-bottom: 22px !important;
}
</style>
