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
          <el-select v-model="dataForm.tag" placeholder="Tag" style="width: 400px" filterable allow-create>
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
        <el-form-item label="目录层级" prop="gitlabFilePaths">
          <el-cascader style="width: 100%" clearable ref="gitLabList" v-model="dataForm.gitlabFilePaths" :options="gitLabDetialList" :props="menuListTreeProps" @change="parentTreeChange"></el-cascader>
        </el-form-item>
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
      <el-form :model="dataForm" :rules="dataRule" ref="dataForm2" label-width="120px" :disabled="!canUpdate">
        <div class="work-type-pane">
          <el-form-item label="失败重跑：" prop="isRunAgain">
            <el-radio-group v-model="dataForm.isRunAgain">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="failRepeatTrigger" label-width="120px" v-if="dataForm.isRunAgain === 1">
            重跑：<el-input-number v-model="dataForm.failRepeatTrigger" style="width:160px;margin: 0 10px" :min="1" />次
          </el-form-item>
        </div>
        <div class="work-type-pane">
          <el-form-item label="状态：" prop="taskDisable" label-width="120px">
            <el-radio-group v-model="dataForm.taskDisable">
              <el-radio :label="1">上线</el-radio>
              <el-radio :label="0">下线</el-radio>
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
  name: 'addDBT',
  components: {
    codemirror
  },
  data () {
    return {
      script: '',
      visible: false,
      id: '',
      rowData: { // 修改时数据内容
        authOwner: '',
        authOtherList: [],
        authOthers: ''
      },
      menuListTreeProps: { // 目录层级的树形结构配置
        label: 'name',
        value: 'path',
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
        taskDisable: 1,
        failRepeatTrigger: 3,
        isRunAgain: 1
      },
      dataRule: {
        taskName: [
          { required: true, message: '请输入任务名称', trigger: 'blur' }
        ],
        projectId: [
          { required: true, message: '请选择所属系统', trigger: 'change' }
        ],
        // tag: [
        //   { required: true, message: '请选择Tag', trigger: 'change' }
        // ],
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
      cmOptions: {
        theme: 'idea',
        mode: 'text/x-sparksql',
        readOnly: 'nocursor',
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
      this.script = ''
      this.getAllSystem()
      this.getGitLabList()
      this.getTags()
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
            this.updateUser = data.data.updateUser
            this.updateTime = data.data.updateTime
            this.dataForm.id = data.data.id
            this.dataForm.taskDescribe = data.data.taskDescribe
            this.dataForm.projectId = data.data.projectId
            this.dataForm.tag = data.data.tag
            this.dataForm.taskDisable = data.data.taskDisable
            this.dataForm.gitlabProjectId = data.data.gitlabProjectId
            this.getGitLabDetail(this.dataForm.gitlabProjectId)
            this.dataForm.gitlabFilePaths = data.data.gitlabFilePaths
            this.parentTreeChange(this.dataForm.gitlabFilePaths)
            // this.dataForm.requestedUser = data.data.requestedUser
            // 是否重跑判断
            if (data.data.failRepeatTrigger !== 0) {
                this.dataForm.isRunAgain = 1
                this.dataForm.failRepeatTrigger = 3
            } else {
                this.dataForm.isRunAgain = 0
                this.dataForm.failRepeatTrigger = data.data.failRepeatTrigger
            }
              this.dataForm.taskName = data.data.taskName.substr(this.formDs.length + 1)
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
      const filePath = item.at(-1)
      getRawBlobContent({filePath, projectId: this.dataForm.gitlabProjectId}).then(({data}) => {
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
      if (flag) {
        let indexArr = []
        let uniqueIndexArr = Array.from(new Set(indexArr))
        if (uniqueIndexArr.length < indexArr.length) {
          return this.$message.error('作业序号不可重复，请重新填写后再操作')
        }
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
          taskType: 'DBT'
        }
        if (params.isRunAgain === 1) {
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
