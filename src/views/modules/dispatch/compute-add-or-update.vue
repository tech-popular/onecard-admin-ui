<template>
  <!-- <el-dialog
    :title="dataFormValue ? '查看' : dataForm.id ? '修改' : '新增/编辑计算任务'"
    :modal-append-to-body="false"
    :append-to-body="true"
    :close-on-click-modal="false"
    :visible.sync="visible"
  > -->
  <el-drawer
    :append-to-body="false"
    :visible.sync="visible"
    :show-close="false"
    :wrapperClosable="false"
    size="1000px"
    class="api-manage-drawer"
  >
    <div slot="title" class="drawer-title">{{dataFormValue ? '查看' : dataForm.id ? '修改' : '新增/编辑计算任务'}}<i class="el-icon-close drawer-close" @click="drawerClose"></i></div>
    <div class="wrap">
      <h3>作业信息<span>最近修改人：<i>admin</i> 最近修改时间：<i>2020-07-20</i></span></h3>
      <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="120px">
        <el-form-item label="任务名称" prop="taskName">
          <el-input v-model="dataForm.taskName" placeholder="超时时间" />
        </el-form-item>
        <el-form-item label="任务ID" prop="taskId">
          <el-input v-model="dataForm.taskId" placeholder="任务ID" disabled />
        </el-form-item>
        <el-form-item label="所属属性" prop="taskProperty">
          <el-select v-model="dataForm.taskProperty" placeholder="请选择偏移量重置机制">
            <el-option label="earliest" value="earliest"></el-option>
            <el-option label="latest" value="latest"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="任务描述" prop="remark">
          <el-input type="textarea" v-model="dataForm.remark" placeholder="kafka地址" />
        </el-form-item>
      </el-form>
      <div class="btn-code-continue">
        <el-button type="success">代码连贯模式</el-button>
      </div>
      <div class="work-content" v-for="(item, index) in workForm" :key="index">
        <el-form :model="item" :rules="dataRule" ref="workForm" label-width="120px">
          <el-form-item label="作业序号" prop="workIndex">
            <el-input v-model="item.workIndex" placeholder="作业序号" />
          </el-form-item>
          <el-form-item label="作业类型" prop="workType">
            <el-select v-model="item.workType" placeholder="请选择作业类型">
              <el-option label="earliest" value="earliest"></el-option>
              <el-option label="latest" value="latest"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="数据源" prop="dataSource">
            <el-select v-model="item.dataSource" placeholder="请选择数据源">
              <el-option label="earliest" value="earliest"></el-option>
              <el-option label="latest" value="latest"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="账户" prop="account">
            <el-select v-model="item.account" placeholder="请选择" @change="handleChange">
              <el-option-group v-for="group in options" :key="group.label" :label="group.label">
                <el-option
                  v-for="item in group.options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-option-group>
            </el-select>
            <span style="color:red;font-size:10px;">
              （如需配置账户/无账户信息，请前往
              <router-link :to="{name:'dispatch-dataSource'}">配置</router-link>）
            </span>
          </el-form-item>
          <el-form-item label="作业描述" prop="workDesc">
            <el-input type="textarea" v-model="workForm.workDesc" placeholder="kafka地址" />
          </el-form-item>
          <el-form-item prop="sql" label="作业语句">
            <codemirror
              ref="mycode"
              :value="workForm.sql"
              :options="cmOptions"
              @changes="changes"
              class="code"
              style="border:1px solid #dcdfe6; border-radius: 4px;"
            ></codemirror>
          </el-form-item>
          <div style="margin-bottom: 10px; text-align: right;">
            <el-button type="primary">新增</el-button>
            <el-button type="danger">删除</el-button>
          </div>
        </el-form>
      </div>
    </div>
    <div class="footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </div>
  </el-drawer>
</template>

<script>
import { infoBeeTask, saveorupt } from '@/api/workerBee/kafka'
import { codemirror } from 'vue-codemirror'
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
    codemirror
  },
  data () {
    return {
      visible: false,
      dataForm: {
        taskName: '',
        taskId: '',
        taskProperty: '',
        remark: ''
      },
      workForm: [
        {
          workIndex: 1,
          workType: '',
          dataSource: '',
          account: '',
          workDesc: '',
          sql: ''
        },
        {
          workIndex: 1,
          workType: '',
          dataSource: '',
          account: '',
          workDesc: '',
          sql: ''
        }
      ],
      dataFormValue: '',
      dataRule: {
        taskName: [
          { required: true, message: '请输入任务名称', trigger: 'blur' }
        ],
        taskProperty: [
          { required: true, message: '请选择任务属性', trigger: 'change' }
        ],
        workIndex: [
          { required: true, message: '请输入作业序号', trigger: 'blur' }
        ],
        workType: [
          { required: true, message: '请输入作业类型', trigger: 'change' }
        ],
        dataSource: [
          { required: true, message: '请选择数据源', trigger: 'change' }
        ],
        account: [
          { required: true, message: '请选择帐户', trigger: 'change' }
        ],
        sql: [
          { required: true, message: '请输入任务语句', trigger: 'blur' }
        ]
      },
      options: [{
        label: '个人账号',
        options: [{
          value: 'Shanghai',
          label: '个人一'
        }, {
          value: 'Beijing',
          label: '个人二'
        }]
      }, {
        label: '公共账号',
        options: [{
          value: 'Chengdu',
          label: '北京账号'
        }, {
          value: 'Shenzhen',
          label: '上海账号'
        }, {
          value: 'Guangzhou',
          label: '广州账号'
        }]
      }],
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
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init (id, value) {
      this.dataForm.id = id || ''
      this.dataFormValue = value
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (id) {
          const dataBody = this.dataForm.id
          infoBeeTask(dataBody).then(({ data }) => { })
        }
      })
    },
    drawerClose () { // 关闭抽屉弹窗
      this.visible = false
      this.$parent.computAddOrUpdateVisible = false
    },
    handleChange (val) {
      console.log(val)
    },
    changes (val) {
      console.log(val)
    },
    // 提交
    dataFormSubmit (form) {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const dataBody = this.dataForm
          const dataUpdateId = this.dataForm.id
          saveorupt(dataBody, dataUpdateId).then(({ data }) => {
            if (data && data.status === 0) {
              this.$message({
                message: '操作成功"',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.visible = false
                  this.$emit('refreshDataList')
                  this.$refs['dataForm'].resetFields()
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
<style scoped>
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
  .work-content {
    border: 1px #cccccc dashed;
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
</style>
