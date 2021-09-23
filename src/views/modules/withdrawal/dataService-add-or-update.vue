<template>
<el-drawer
    :append-to-body="false"
    :visible.sync="visible"
    :show-close="false"
    :wrapperClosable="false"
    size="1200px"
    class="data-transfer-manage-drawer"
  >
  <div slot="title" class="drawer-title">新建<i class="el-icon-close drawer-close" @click="drawerClose"></i></div>
    <div class="wrap">
      <el-form v-loading="loading" :model="baseForm" label-width="80px"  ref="baseForm" class="base-form" >
        <div class="base-pane">
          <div  class="step-title">提数申请</div>
					<div class="steps-horizontal">
						<div class="horizontal-one">
              <div class="el-icon-check success one-title" v-if="secendStepVisible"></div>
							<div class="one-title" v-else>进行中</div>
							<div style="padding-top:20px;">设置提数条件</div>
						</div>
						<div class="horizontal-line"></div>
						<div><i class="el-icon-caret-right horizontal-icon"></i></div>
						<div class="horizontal-one">
              <div class="three-title" v-if="secendStepVisible">进行中</div>
							<div class="two-title" v-else>未开始</div>
							<div style="padding-top:20px;">数据下载设置</div>
						</div>
 					</div>
           <div v-if="!secendStepVisible">
            <el-form-item label="选择提数方式" prop="withdrawalMethod" label-width="120px" style="width:50%" >
                <el-radio v-model="baseForm.withdrawalMethod"  @change="withdrawalTypeChange" label="0">自定义SQL</el-radio>
                <el-radio v-model="baseForm.withdrawalMethod"  @change="withdrawalTypeChange" label="1"  style="margin-left:5px;">FTP</el-radio>
            </el-form-item>
            <div style="display:flex" v-if="baseForm.withdrawalMethod === '0'">
              <div>
                <el-form-item prop="serviceId"  label="服务器">
                  <el-select
                  filterable
                  v-model="baseForm.serviceId"
                  placeholder="请选择"
                  >
                  <el-option
                    v-for="item in serviceIdList"
                    :key="item.value"
                    :label="item.text"
                    :value="item.value">
                  </el-option>
                </el-select>
                </el-form-item>
                <el-form-item prop="databaseId" label="数据库">
                  <el-select
                  filterable
                  v-model="baseForm.databaseId"
                  placeholder="请选择"
                  >
                  <el-option
                    v-for="item in databaseIdList"
                    :key="item.value"
                    :label="item.text"
                    :value="item.value">
                  </el-option>
                </el-select>
                </el-form-item>
              </div>
              <el-form-item prop="serviceSql" label="SQL：" ref="serviceBeginSqlForm" style="width:70%">
                <div style="border:1px solid #dcdfe6; border-radius: 4px; position:relative;">
                  <codemirror
                    ref="serviceBeginSql"
                    v-model="baseForm.serviceSql"
                    :options="cmOptions"
                    @changes="cm => workItemChanges(cm, acquisitionTask.serviceSql, 'serviceBeginSqlForm', 'serviceBeginSql')"
                    @keydown.native="e => workItemKeyDown(e, 'serviceBeginSql')"
                    class="code"
                    style="padding-bottom: 0px;"
                  ></codemirror>
                </div>
                <div style="margin-top:10px;display:flex">
                  <el-button type="primary">执行验证</el-button>
                  <el-button type="text" v-if="isInnerIP">数据预览</el-button>
                </div>
            </el-form-item>
            </div>
            <el-row :gutter="24" v-if="baseForm.withdrawalMethod === '1'">
              <!-- <el-col :span="8" style="border: 2px solid #97999e"> -->
              <el-col :span="8">
                <el-tree :data="data" :props="defaultProps" default-expand-all>
                  <span slot-scope="{ node, data }">
                    <i :class="data.icon" style="color:blue"></i>
                    <span style="padding-left: 4px;">{{node.label}}</span>
                  </span>
                </el-tree>
              </el-col>
              <el-col :span="16">
              <el-table
                  :data="dataList"
                  border
                  v-loading="dataListLoading"
                  height="300"
                  @selection-change="handleSelectionChange">
                  <el-table-column
                    type="selection"
                    width="55">
                  </el-table-column>
                  <el-table-column prop="id" header-align="center" align="center" label="序号"></el-table-column>
                  <el-table-column prop="name" header-align="center" align="center" label="文件名称"></el-table-column>
                  <el-table-column prop="ipAddress" header-align="center" align="center" label="文件格式"></el-table-column>
                  <el-table-column prop="inDatasourceName" header-align="center" align="center" label="修改时间"></el-table-column>
                </el-table>
              </el-col>
            </el-row>
           </div>
           <div v-else>
             <el-form-item label="申请原因" prop="applyReason">
               <el-input v-model="baseForm.applyReason"></el-input>
             </el-form-item>
             <el-form-item label="提数类型" prop="withdrawalType" label-width="120px" style="width:50%" >
                <el-radio v-model="baseForm.withdrawalType"  @change="withdrawalTypeChange" label="0">自定义SQL</el-radio>
                <el-radio v-model="baseForm.withdrawalType"  @change="withdrawalTypeChange" label="1"  style="margin-left:5px;">FTP</el-radio>
            </el-form-item>
           </div>
        </div>
      </el-form>
    </div>
    <div class="footer">
      <el-button type="primary" @click="cancelHandle" size="small" v-if="secendStepVisible">立即申请</el-button>
      <el-button type="default" @click="cancelHandle" size="small" v-if="secendStepVisible">取消</el-button>
			<el-button type="primary" @click="nextStep" size="small" v-else>下一步</el-button>
    </div>
  </el-drawer>
</template>
<script>
import {isInnerIPFn} from '@/utils/validate'
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
    data () {
      return {
        loading: false,
        visible: true,
        isInnerIP: false,
        secendStepVisible: false,
        baseForm: {
          id: '',
          withdrawalMethod: '0',
          serviceId: '',
          databaseId: '',
          serviceSql: '',
          applyReason: '',
          withdrawalType: '0'
        },
        serviceIdList: [],
        databaseIdList: [],
        dataList: [],
        multipleSelection: [], // 多选数据
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
        // 树形结构的数据
        data: [
          {
            'menuId': 1,
            'menuName': '系统管理',
            'icon': 'el-icon-folder',
            'children': [
              {
              'menuId': 100,
              'menuName': '用户管理',
              'icon': 'el-icon-folder',
              'children': [
                {
                  'menuId': 1000,
                  'menuName': '用户查询',
                  'icon': 'el-icon-folder'
                },
                {
                  'menuId': 1001,
                  'menuName': '用户新增',
                  'icon': 'el-icon-folder'
                },
                {
                  'menuId': 1002,
                  'menuName': '用户修改',
                  'icon': 'el-icon-folder'
                },
                {
                  'menuId': 1003,
                  'menuName': '用户删除',
                  'icon': 'el-icon-folder'
                }
              ]
            },
            {
              'menuId': 101,
              'menuName': '角色管理',
              'icon': 'el-icon-folder',
              'children': [
                {
                  'menuId': 1006,
                  'menuName': '角色查询',
                  'icon': 'el-icon-folder'
                },
                {
                  'menuId': 1007,
                  'menuName': '角色新增',
                  'icon': 'el-icon-folder'
                },
                {
                  'menuId': 1008,
                  'menuName': '角色修改',
                  'icon': 'el-icon-folder'
                },
                {
                  'menuId': 1011,
                  'menuName': '删除角色',
                  'icon': 'el-icon-folder'
                }
            ]
          }]
        }],
        defaultProps: {
          children: 'children',
          label: 'menuName'
        }
      }
    },
    mounted () {
      this.isInnerIP = isInnerIPFn()
      console.log('1112', isInnerIPFn())
    },
    components: {codemirror},
    methods: {
      // 打开抽屉弹窗
      init () {
        this.visible = true
      },
      // 提数方式改变
      withdrawalTypeChange () {

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
      handleSelectionChange (val) { // 表格多选
        this.multipleSelection = val
      },
      nextStep () {
        this.secendStepVisible = true
      },
      // 关闭抽屉弹窗
      drawerClose () {
        this.visible = false
        this.$parent.addOrUpdateVisible = false
      },
      // 关闭
      cancelHandle () {
        this.visible = false
        this.$parent.addOrUpdateVisible = false
      }
    }
  }
</script>
<style lang="scss">
  .data-transfer-manage-drawer  {
    & .wrap{
      padding: 0 20px 20px;
      margin-top: -12px;
      width: 100%;
      overflow-y: auto;
      position: absolute;
      top: 75px;
      bottom: 55px;
		 .step-title {
			 height: 30px;
			 background: #e8e2e2;
			 line-height: 30px;
			 padding-left: 20px;
			}
			.steps-horizontal {
				height: 200px;
				display: flex;
				align-items: center;
				padding-left: 100px;
				border-bottom: 2px solid #97999e;
				font-weight: bolder;
				color: #333;
				.horizontal-one {
					height: 120px;
				}
				.one-title {
					width: 90px;
					height: 90px;
					border-radius: 50%;
          border: 4px solid;
          border-color: #67c23a;
					color: #47ca6f;
					line-height: 90px;
					text-align: center;
				}
				.horizontal-line {
					height: 4px;
					width: 350px;
					background-color: #9b9c9e;
				  margin-top: -10px;
				}
				.horizontal-icon {
				  font-size: 28px;
					color: #9b9c9e;
					margin-left: -10px;
					margin-top: -10px;
				}
				.two-title {
					width: 90px;
					height: 90px;
					border-radius: 50%;
          border: 4px solid;
          color:  #303133;
					border-color:#ced3de;
					font-weight: bolder;
					line-height: 90px;
					text-align: center;
				}
        .three-title {
					width: 90px;
					height: 90px;
					border-radius: 50%;
          border: 4px solid;
          color: #47ca6f;
					border-color:#ced3de;
					font-weight: bolder;
					line-height: 90px;
					text-align: center;          
        }
			}
    }
    & .drawer-title {
      padding: 15px;
      background: #333;
      color: #fff;
      font-size: 15px;
      margin: -20px -20px 0 -20px;
      position: relative;
    }
    & .drawer-close {
      position: absolute;
      right: 20px;
    }
    & .footer {
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
    & .data-description-tips {
      color: #999;
      margin-top: 0;
      & span {
        color: red
      }
    }
    & .vue-treeselect {
      min-height: 38px;
      line-height: 24px;
      max-width: 100%;
    }
    & .base-pane {
      // border-bottom: 1px dashed #ccc;
      & .label-remove-margin{
        & .el-form-item__content{
          margin-left: 0px !important;
        }
      }
    }
    & .base-pane-item {
      width: 80%;
    }
    & .base-select{
      width: 40%;
    }
    & .base-form{
      & .pane-rules{
        & .el-form-item__content{
          margin-left: 0px !important;
        }
      }
    }
    & .radio-item {
      margin-right: 15px;
    }
    & .radio-passive {
      margin-left: 30px
    }
    & .radio-incremodel {
      margin-right: 15px;
    }
    & .transfer-log {
      margin-left: 20px;
    }
  }
</style>
