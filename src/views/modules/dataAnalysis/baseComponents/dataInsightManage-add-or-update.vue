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
        >
          <el-form-item label="分群名称" prop="name">
            <el-input
              v-model.trim="baseForm.name"
              placeholder="分群名称"
              clearable
              class="base-pane-item"
            />
          </el-form-item>
          <el-form-item label="分群类型" prop="userType">
            <div class="type-radio-item type-radio-one">
              <el-radio
                label="indicator"
                v-model="baseForm.userType"
                @change="radioTypeChange"
                :disabled="!!id"
              >指标筛选</el-radio>
              <div v-if="baseForm.userType === 'indicator'" class="indicator-channel">
                用户所属渠道
                <el-select
                  v-model="baseForm.channelId"
                  @change="channelIdChange"
                  filterable
                  multiple
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
            label="用户所属渠道"
            prop="channelId"
            v-if="baseForm.userType === 'excel'"
            class="user-channel"
          >
            <el-select v-model="baseForm.channelId" :disabled="!!id" style="width: 300px">
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
          <el-form-item label="计算类型" prop="type">
            <el-radio-group
              v-model="baseForm.type"
              :disabled="!!id || baseForm.userType === 'excel'"
            >
              <el-radio label="static">静态（根据创建/修改分群的时间计算）</el-radio>
              <el-radio label="dynamic">动态（根据每次下发或调用的时间计算）</el-radio>
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
      <div v-if="baseForm.userType !== 'excel'" class="pane-rules-title"> <h3>满足如下条件的用户</h3> </div>
      <div class="pane-rules" v-if="baseForm.userType !== 'excel'">
          <div class="pane-rules-relation">
             <span @click="switchSymbol()">{{outMostExpressionTemplate === 'and' ? '且' : '或'}}</span>
          </div>
           <div style="flex: 1">
               <user-attr-rule-pane ref="userAttrRule" :id="id" @renderEnd="renderEnd"></user-attr-rule-pane>
               <user-action-rule-pane ref="userActionRule" :id="id" @renderEnd="renderEnd"></user-action-rule-pane>
           </div>
      </div>
      <div class="pane-reject">
        <h3>剔除用户名单</h3>
        <div>
          <el-form label-width="80px" :model="rejectForm" :rules="baseRule" ref="rejectForm">
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
        v-if="baseForm.userType !== 'excel'"
      >数据预览</el-button>
      <el-button
        type="primary"
        @click="copyHandle('save')"
        size="small"
        v-if="!!id && baseForm.userType !== 'excel'"
      >复制创建新分群</el-button>
      <el-button
        type="primary"
        @click="saveHandle('save')"
        size="small"
        v-if="tag !== 'view'"
        :disabled="loading"
      >保存</el-button>
      <el-button type="default" @click="cancelHandle" size="small">取消</el-button>
    </div>
    <data-preview-info
      v-if="isPreviewShow"
      ref="dataPreviewInfo"
      :vestPackCode="rejectForm.vestPackCode"
    ></data-preview-info>
  </el-drawer>
</template>
<script>
import userAttrRulePane from './userAttr-rule-pane'
import userActionRulePane from './userAction-rule-pane'
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
  collisionUpdate
} from '@/api/dataAnalysis/dataInsightManage'
import Treeselect, { LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  data () {
    return {
      isPreviewShow: true,
      loading: false,
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
        channelId: ['2001'],
        desc: ''
      },
      rejectForm: {
        rejectGroupPackageIds: [],
        vestPackCode: [],
        collisionPackId: ''
      },
      collisionPackText: '',
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
          { required: true, message: '请选择用户所属渠道', trigger: 'change' }
        ]
      },
      channelList: []
    }
  },
  components: {
    userAttrRulePane,
    userActionRulePane,
    Treeselect,
    dataPreviewInfo,
    InputTag
  },
  methods: {
    init (row, tag) {
      this.id = 0
      this.tag = ''
      this.flowId = ''
      this.loading = true
      this.visible = true
      // this.isRequired = false // 默认为false,不设置的话，保存后再进入会变
      this.getVestPackAvailable()
      this.getChannelsList()
      this.getCusterList()
      this.getCollisionList()
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
        this.drawerTitle = tag === 'view' ? '查看' : '编辑'
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
        channelId: ['2001'],
        desc: ''
      }
      this.$nextTick(() => {
        console.log(this.$refs)
        this.$refs.userAttrRule.init()
        this.$refs.userActionRule.init()
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
          this.outMostExpressionTemplate = JSON.parse(data.data.configJson).outMostExpressionTemplate
          this.baseForm = {
            name: data.data.name,
            desc: data.data.desc,
            userType: data.data.userType,
            type: data.data.type
          }
          this.rejectForm.rejectGroupPackageIds =
            data.data.rejectGroupPackageIds || []
          if (!data.data.vestPackCode || data.data.vestPackCode === null) {
            this.rejectForm.vestPackCode = []
          } else {
            this.rejectForm.vestPackCode = data.data.vestPackCode
              .split(',')
              .filter(item => item != '')
          }
          if (data.data.userType === 'excel') {
            this.excelFile = data.data.excelFile
            this.baseForm.channelId = data.data.channelId
            this.loading = false
            return
          }
          this.baseForm.channelId = data.data.channelId
            .split(',')
            .filter(item => item != '')
          if (!data.data.configJson) { // 在真实掉接口时用 || 关系进行数据验证
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
          this.$refs.userActionRule.renderData( // 真实调接口时数据重现
            data.data.configJson,
            this.baseForm.channelId
          )
        }
      })
    },
    renderEnd () {
      this.loading = false
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
          item.disabled = false
        })
      }
      if (this.baseForm.channelId.length === 1) {
        this.channelList.forEach(item => {
          if (this.baseForm.channelId[0] === '0000') {
            if (item.value === '0000') {
              item.disabled = false
            } else {
              item.disabled = true
            }
          } else {
            if (item.value === '0000') {
              item.disabled = true
            } else {
              item.disabled = false
            }
          }
        })
      }
      this.$refs.userAttrRule.channelIdChangeUpdate()
      this.$refs.userActionRule.channelIdChangeUpdate()
      this.rejectForm.rejectGroupPackageIds = []
    },
    getVestPackAvailable () {
      vestPackAvailable({
        channelCode: this.baseForm.channelId
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
    getCusterList () {
      custerAvailable().then(({ data }) => {
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
      // 上传文件变化时
      if (fileList.length > 0) {
        this.fileData.fileList = [fileList[fileList.length - 1]] // 这一步，是展示最后一次选择的文件
        this.excelFile = this.fileData.fileList[0].name
      }
    },
    beforeUpload (file) {
      // 上传文件之前的事件
      let that = this
      let fileName = file.name.substring(file.name.lastIndexOf('.') + 1) // 文件类型
      if (fileName != 'xls' && fileName != 'xlsx') {
        that.$message({
          type: 'error',
          message: '文件类型不是.xls文件!'
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
      if (this.baseForm.userType === 'excel') {
        if (!this.excelFile) {
          this.$message({
            type: 'error',
            message: '请选择要上传的文件'
          })
          return
        }
        let flag = true
        this.$refs.baseForm.validate((valid) => {
          if (!valid) {
            flag = false
          }
        })
        this.$refs.rejectForm.validate((valid) => {
          if (!valid) {
            flag = false
          }
        })
        if (flag) {
          let data = new FormData() // 上传文件使用new formData();可以实现表单提交;
          data.append('file', this.fileData.fileList.length ? this.fileData.fileList[0].raw : {})
          data.append('name', this.baseForm.name)
          data.append('type', this.baseForm.type)
          data.append('userType', this.baseForm.userType)
          data.append('desc', this.baseForm.desc)
          data.append('channelId', this.baseForm.channelId)
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
          })
        }
        return
      }
      // 用户属性 用户行为 数据校验
      this.$refs.userAttrRule.ruleValidate()
      this.$refs.userActionRule.ruleValidate()
      this.$refs.userAttrRule.isRequired = true
      this.$refs.userActionRule.isRequired = true
      let ruleFormArr = this.$refs.userAttrRule.getRuleForm()
      let actionRuleFormArr = this.$refs.userActionRule.getRuleForm()
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
        ruleFormArr.forEach(item => {
          item.validate(valid => {
            if (!valid) {
              flag = false
            }
          })
        })
        actionRuleFormArr.forEach(item => {
          item.validate(valid => {
            if (!valid) {
              flag = false
            }
          })
        })
        if (!flag || actionRuleFormArr.length === 0) {
          this.$refs.userAttrRule.isRequired = false
          this.$refs.userActionRule.isRequired = false
        } else {
          // 全部校验通过后，可保存数据
          this.$refs.userAttrRule.uneffectIndexValidate()
          this.$refs.userActionRule.uneffectIndexValidate()
          let code = 0
          if (this.rejectForm.rejectGroupPackageIds.length) {
            code = 1
          }
          let params = {
            ...this.baseForm,
            ...this.$refs.userAttrRule.lastSubmitRuleConfig,
            ...this.$refs.userActionRule.lastSubmitRuleConfig,
            ...this.rejectForm,
            outMostExpressionTemplate: this.outMostExpressionTemplate,
            rejectGroupPackCode: code
          }
          params.channelId = params.channelId.join(',')
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
</style>
