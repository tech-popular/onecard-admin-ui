<template>
  <el-drawer
    :append-to-body="false"
    :visible.sync="visible"
    :show-close="false"
    :wrapperClosable="false"
    size="1100px"
    class="api-manage-drawer"
  >
    <div slot="title" class="drawer-title">{{canUpdate ? dataForm.id ? '编辑DBT任务' : '新增DBT任务' : '查看DBT任务'}}<i class="el-icon-close drawer-close" @click="drawerClose"></i></div>
    <div class="wrap">
      <h3 id="title">任务信息<span v-if="!!dataForm.id">最近修改人：<i>{{updateUser}}</i> 最近修改时间：<i>{{updateTime}}</i></span></h3>
      <el-form :model="dataForm" :rules="dataRule" ref="dataForm1" label-width="120px" :disabled="!canUpdate">
        <div class="work-type-pane">
          <el-form-item label="任务名称" prop="taskName">
            <el-input v-model="dataForm.taskName" placeholder="任务名称" style="width: 400px">
              <template slot="prepend">{{formDs}}_</template>
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
        <el-form-item label="Tag" prop="tag">
          <el-select v-model="dataForm.tag" placeholder="Tag" style="width: 400px" filterable>
            <el-option :label="item" :value="item" v-for="(item, index) in tagList" :key="index"></el-option>
          </el-select>
        </el-form-item>
  
        <el-form-item label="任务描述" prop="taskDescribe">
          <el-input type="textarea" v-model="dataForm.taskDescribe" placeholder="任务描述" />
        </el-form-item>
        <el-form-item label="目录" prop="gitlabProjectId">
          <el-select v-model="dataForm.gitlabProjectId" @change="getGitLabDetail"  style="width: 400px" filterable>
            <el-option :label="item.projectName" :value="item.projectId" v-for="(item, index) in gitLabList" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="目录层级" prop="gitlabFileCode">
          <el-cascader style="width: 100%" clearable ref="gitLabList" v-model="dataForm.gitlabFileCode" :options="gitLabDetialList" :props="menuListTreeProps" @change="parentTreeChange"></el-cascader>
        </el-form-item>
        <!-- <el-form-item label="目录层级" prop="gitlabFileCode">
          <el-select v-model="dataForm.gitlabFileCode" style="width: 400px" filterable>
            <el-option :label="item.name" :value="item.id" v-for="(item, index) in gitLabDetialList" :key="index"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item prop="script">
          <codemirror
            ref="mycode"
            :value="script"
            :options="cmOptions"
            @changes="changes"
            class="code"
          ></codemirror>
        </el-form-item>
      </el-form>
      <!-- <div class="work-content" v-for="(item, index) in calculateTasks" :key="index">
        <el-form :model="item" :rules="dataRule" ref="calculateTasks" :disabled="!canUpdate"> 
          <el-form-item label="作业序号" prop="jobNo" label-width="120px">
            <el-input-number v-model="item.jobNo" placeholder="作业序号" :min="1"></el-input-number>
          </el-form-item>
          <el-form-item label="作业描述" prop="jobDescribe" label-width="120px">
            <el-input type="textarea" v-model="item.jobDescribe" placeholder="作业描述" />
          </el-form-item>
          <el-form-item prop="jobSql" label="作业语句" :ref="'mycode-' + index" label-width="120px">
            <div style="border:1px solid #dcdfe6; border-radius: 4px; position:relative">
              <codemirror
                :ref="'code-' + index"
                v-model="item.jobSql"
                :options="cmOptions"
                @changes="cm => workItemChanges(cm, item, 'mycode-' + index, index)"
                @keydown.native="e => workItemKeyDown(e, index)"
                class="code"
                style="padding-bottom: 0px"
              ></codemirror>
              <span style="color:#6da7ff; position:absolute;left: 40px;top:4px;">{{item.placeholder}}</span>
            </div>
          </el-form-item>
          <div style="margin-bottom: 10px; text-align: right;">
            <el-button type="primary" @click="addWork">新增</el-button>
            <el-button type="danger" @click="deleteWork(index)">删除</el-button>
          </div>
        </el-form>
      </div> -->
      <el-form :model="dataForm" :rules="dataRule" ref="dataForm2" label-width="120px" :disabled="!canUpdate">
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
        </div>
      </el-form>
    </div>
    <div class="footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" v-if="canUpdate" @click="dataFormSubmit()">确定</el-button>
    </div>
  </el-drawer>
</template>

<script>
import { deepClone } from '@/utils'
import { info, save, update, getGitLabCatalog, getGitLabProjects, getRawBlobContent, getTagsAPI, projectAll } from '@/api/dispatch/taskManag'
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
    codemirror
  },
  data () {
    return {
      script: '',
      visible: false,
      mergeCodeVisible: false,
      id: '',
      rowData: { // 修改时数据内容
        authOwner: '',
        authOtherList: [],
        authOthers: ''
      },
      menuListTreeProps: {
        label: 'name',
        value: 'id',
        children: 'gitLabDirectoryList'
      },
      formDs: 'DBT',
      updateUser: '',
      updateTime: '',
      dataForm: {},
      tempDataForm: {
        taskName: '',
        id: '',
        projectId: '',
        tag: '',
        taskDescribe: '',
        taskDisable: 0,
        failRepeatTrigger: 3,
        isRunAgain: 0
      },
      calculateTasks: [],
      tempCalculateTasks: [
        {
          jobNo: 1,
          jobDescribe: '',
          jobSql: '',
          placeholder: '请勿在第一行添加注释，否则脚本运行有误！MaxComputer脚本只能有一个SQL语句，且以分号分割！'
        }
      ],
      dataRule: {
        taskName: [
          { required: true, message: '请输入任务名称', trigger: 'blur' }
        ],
        projectId: [
          { required: true, message: '请选择所属系统', trigger: 'change' }
        ],
        tag: [
          { required: true, message: '请选择Tag', trigger: 'change' }
        ],
        jobNo: [
          { required: true, message: '请输入作业序号', trigger: 'blur' }
        ],
        jobSql: [
          { required: true, message: '请输入任务语句', trigger: 'change' }
        ],
        taskDisable: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        isRunAgain: [
          {required: true, message: '请选择', trigger: 'change'}
        ],
        failRepeatTrigger: [
          {required: true, message: '请输入重跑次数', trigger: 'change'}
        ]
      },
      allSystemList: [],
      tagList: [],
      gitLabList: [],
      gitLabDetialList: [],

      // allDatasourceList: [],
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
      canUpdate: true,
      updateRowNum: 0,
      originpreviewSql: '', // 保留一份原始的连贯数据，用于做对比
      previewSql: '',
      sqlLineDist: [], // 保存连贯代码时的各作业title
      sqlLineWorkIndex: [] // 保存连贯排序后的作业序号，用来处理重新渲染时查找元素用
    }
  },
  computed: {
    previreCodemirror () {
      return this.$refs.mycode.codemirror
    }
  },
  methods: {
    init (id, canUpdate) {
      this.id = id ? id.id : ''
      this.rowData = {
        authOwner: '',
        authOtherList: [],
        authOthers: ''
      }
      this.rowData = id ? deepClone(id) : this.rowData
      this.canUpdate = canUpdate
      this.dataForm = deepClone(this.tempDataForm)
      this.calculateTasks = deepClone(this.tempCalculateTasks)
      this.getAllSystem()
      this.getGitLabList()
      this.getTags()
      // this.getAllDatasource()
      this.visible = true
      this.$nextTick(() => {
        document.getElementById('title').scrollIntoView()
        this.$refs['dataForm1'].resetFields()
        this.$refs['dataForm2'].resetFields()
        if (id) {
          info(this.id).then(({data}) => {
            if (data.code !== 0) {
              return this.$message.error(data.msg || '获取数据异常')
            }
            if (!data.data.calculateTasks.length) {
              return this.$message.error('获取数据异常')
            }
            this.updateUser = data.data.updateUser
            this.updateTime = data.data.updateTime
            this.dataForm.id = data.data.id
            this.dataForm.taskDescribe = data.data.taskDescribe
            this.dataForm.projectId = data.data.projectId
            this.dataForm.tag = data.data.tag
            this.dataForm.taskDisable = data.data.taskDisable
            // this.dataForm.requestedUser = data.data.requestedUser
            // 是否重跑判断
            if (data.data.failRepeatTrigger !== 0) {
              this.dataForm.isRunAgain = 0
              this.dataForm.failRepeatTrigger = data.data.failRepeatTrigger
            } else {
              this.dataForm.isRunAgain = 1
              this.dataForm.failRepeatTrigger = 3
            }
            this.calculateTasks = data.data.calculateTasks
          })
        }
      })
    },
    changes (value) {
      this.script = this.previreCodemirror.getValue()
    },
    getGitLabDetail (item) {
      console.log(item)
      getGitLabCatalog(item).then(({data}) => {
        this.gitLabDetialList = data.data
      })
    },
    getGitLabList () {
      getGitLabProjects().then(({data}) => {
        this.gitLabList = data.data
      })
    },
    parentTreeChange (item) {
      const blobHashCode = item.at(-1)
      getRawBlobContent({blobHashCode, projectId: this.dataForm.gitlabProjectId}).then(({data}) => {
        console.log(data)
        this.script = data.data
      })
    },
    getTags () {
      getTagsAPI().then(({data}) => {
        this.tagList = data.data
      })
    },
    getAllSystem () {
      projectAll().then(({data}) => {
        this.allSystemList = data.data
      })
    },
    drawerClose () { // 关闭抽屉弹窗
      this.visible = false
      this.$parent.computAddOrUpdateVisible = false
    },
    handleChange (val) {
      console.log(val)
    },
    findIndex (n) {
      let i = 0
      this.calculateTasks.forEach((item, index) => {
        if (item.jobNo * 1 === n * 1) {
          i = index
        }
      })
      return i
    },
    workItemChanges (cm, item, ref, index) { // 内容更新时，不为空时将报错信息去除
      let curSql = item.jobSql
      if (curSql !== '') {
        this.$refs[ref][0].clearValidate()
        this.calculateTasks.splice(index, 1, { ...item, placeholder: '' })
      } else {
        this.calculateTasks.splice(index, 1, { ...item, placeholder: '请勿在第一行添加注释，否则脚本运行有误！MaxComputer脚本只能有一个SQL语句，且以分号分割！' })
      }
      if (!curSql) {
        this.$nextTick(() => {
          this.$refs['code-' + index][0].codemirror.setOption('lint', false)
        })
      } else {
        this.$refs['code-' + index][0].codemirror.setOption('lint', false)
        this.$nextTick(() => {
          this.$refs['code-' + index][0].codemirror.setOption('lint', true)
        })
      }
    },
    // 按下键盘事件处理函数
    workItemKeyDown (event, index) {
      const keyCode = event.keyCode || event.which || event.charCode
      const keyCombination = event.ctrlKey || event.altKey || event.metaKey
      if (!keyCombination && keyCode > 64 && keyCode < 123) {
        this.$refs['code-' + index][0].codemirror.showHint({ completeSingle: false })
      }
    },

    addWork () { // 增加一条作业内容
      this.calculateTasks.push({
        jobNo: '',
        jobDescribe: '',
        jobSql: '',
        placeholder: '请勿在第一行添加注释，否则脚本运行有误！MaxComputer脚本只能有一个SQL语句，且以分号分割！'
      })
      this.updateWorkIndex()
    },
    deleteWork (index) { // 删除作业内容
      this.calculateTasks.splice(index, 1)
      this.updateWorkIndex()
    },
    updateWorkIndex () { // 增加或删除时重新排序
      this.calculateTasks.forEach((item, index) => {
        item.jobNo = index + 1
      })
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
      this.$refs['calculateTasks'].forEach(item => {
        item.validate((valid) => {
          if (!valid) {
            flag = false
          }
        })
      })
      console.log(1, this.dataForm, this.calculateTasks)
      if (flag) {
        let indexArr = []
        this.calculateTasks.forEach(item => {
          indexArr.push(item.jobNo * 1)
        })
        let uniqueIndexArr = Array.from(new Set(indexArr))
        if (uniqueIndexArr.length < indexArr.length) {
          return this.$message.error('作业序号不可重复，请重新填写后再操作')
        }
        console.log(this.dataForm, this.calculateTasks)
        // this.calculateTasks.forEach(item => {
        //   item.allDatasourceNameList = []
        //   item.allAccountList = []
        // })
        let url = save
        if (this.dataForm.id) {
          url = update
        }
        let params = {
          ...this.dataForm,
          authOwner: this.rowData.authOwner,
          authOtherList: this.rowData.authOtherList,
          authOthers: this.rowData.authOthers,
          tenantId: sessionStorage.getItem('tenantId'),
          taskName: `${this.formDs}_${this.dataForm.taskName}`,
          taskType: 'CALCULATE',
          calculateTasks: this.calculateTasks
        }
        if (params.isRunAgain === 0) {
          params.failRepeatTrigger = params.failRepeatTrigger
        } else {
          params.failRepeatTrigger = 0
        }
        url(params).then(({data}) => {
          if (data && data.code === 0) {
            this.$message({
              message: data.msg || '操作成功"',
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
 
  .work-content {
    border: 1px #cccccc dashed;
    padding: 20px 20px 10px 0;
    margin: 20px 0;
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
</style>
