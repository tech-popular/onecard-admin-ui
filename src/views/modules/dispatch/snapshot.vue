<template>
  <el-dialog
    :title="dataFormValue ? '查看' : dataForm.id ? '修改' : '新增/编辑计算任务'"
    :modal-append-to-body="false"
    :append-to-body="true"
    :close-on-click-modal="false"
    :visible.sync="visible"
  >
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="23%">
      <el-form-item label="任务名称" prop="autoCommitIntervalMs">
        <el-input v-model="dataForm.autoCommitIntervalMs" placeholder="超时时间" />
      </el-form-item>
      <el-form-item label="任务ID" prop="autoCommitIntervalMs">
        <el-input v-model="dataForm.autoCommitIntervalMs" placeholder="超时时间" disabled />
      </el-form-item>
      <el-form-item label="所属属性" prop="autoOffsetReset">
        <el-select v-model="dataForm.autoOffsetReset" placeholder="请选择偏移量重置机制">
          <el-option label="earliest" value="earliest"></el-option>
          <el-option label="latest" value="latest"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="任务描述" prop="bootstrapServers">
        <el-input type="textarea" v-model="dataForm.bootstrapServers" placeholder="kafka地址" />
      </el-form-item>
      <div style="margin-bottom: 10px; text-align: right;">
        <el-button type="primary">代码连贯模式</el-button>
      </div>
      <div style="border: 1px #cccccc dashed; padding:10px">
        <el-form-item label="作业序号" prop="consumerName">
          <el-input v-model="dataForm.consumerName" placeholder="消费者名字" />
        </el-form-item>
        <el-form-item label="数据源" prop="autoOffsetReset">
          <el-select v-model="dataForm.autoOffsetReset" placeholder="请选择选择数据源">
            <el-option label="earliest" value="earliest"></el-option>
            <el-option label="latest" value="latest"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="账户" prop="account">
          <el-select v-model="newValue" placeholder="请选择" @change="handleChange">
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
        <el-form-item label="作业描述" prop="bootstrapServers">
          <el-input type="textarea" v-model="dataForm.bootstrapServers" placeholder="kafka地址" />
        </el-form-item>
        <el-form-item prop="sql" label="作业语句">
          <codemirror
            ref="mycode"
            :value="dataForm.sql"
            :options="cmOptions"
            @changes="changes"
            class="code"
          ></codemirror>
        </el-form-item>
        <div style="margin-bottom: 10px; text-align: right;">
          <el-button type="primary">新增</el-button>
          <el-button type="danger">删除</el-button>
        </div>
      </div>
    </el-form>

    <div slot="footer" class="foot">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </div>
  </el-dialog>
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
        autoCommitIntervalMs: '',
        autoOffsetReset: '',
        bootstrapServers: '',
        consumerName: '',
        flowId: '',
        groupId: '',
        topic: '',
        version: '',
        sql: '',
        enableAutoCommit: true
      },
      dataFormValue: '',
      ruleTypeList: [],
      dataRule: {},
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
<style>
.codesql {
  font-size: 11pt;
  font-family: Consolas, Menlo, Monaco, Lucida Console, Liberation Mono,
    DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace, serif;
}
</style>
