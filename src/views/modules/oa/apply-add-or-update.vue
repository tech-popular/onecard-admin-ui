<template>
  <el-dialog
    title="新增"
    :append-to-body="true"
    :visible.sync="visible"
    :show-close="false"
    width="1000px"
  >
    <el-divider>请选择申请类别</el-divider>
    <el-tabs type="border-card" @tab-click="tabClick" v-model="actoveTab">
      <!-- 账号 -->
      <el-tab-pane label="账号权限" name="账号权限">
        <el-divider>请填写以下申请</el-divider>
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="160px">
          <el-form-item label="标题" prop="name">
            <el-input v-model="dataForm.name" placeholder="标题" />
          </el-form-item>
          <el-form-item label="申请系统" prop="system">
            <el-radio-group v-model="dataForm.system" @change="testFunction">
              <el-radio :label="item.value" :key="item.value" v-for="(item) in systemList">{{item.label}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="申请系统模块" prop="systemmodel" v-if="isShow">
            <el-cascader
              style="width: 100%"
              :props="props"
              v-model="dataForm.systemmodel"
              clearable
              :options="systemmodelList">
            </el-cascader>
          </el-form-item>
          <el-form-item label="默认所属部门">
            <span v-for="(item, index) in departmentList" :key="index">{{item}}<br></span>
          </el-form-item>
          <el-form-item label="申请理由" prop="reason">
            <el-input type="textarea" v-model="dataForm.reason"></el-input>
          </el-form-item>
        </el-form>
        <div class="foot">
          <el-button @click="cancel()">取消</el-button>
          <el-button type="primary" @click="dataFormSubmit()" :loading="buttonloading">确定</el-button>
        </div>
      </el-tab-pane>
      <!-- 租户 -->
      <el-tab-pane label="租户申请" name="租户申请">
        <el-form :model="tenantForm" :rules="tenantRule" ref="tenantForm" label-width="160px">
          <el-form-item label="选择租户" prop="tenantIds">
            <el-select v-model="tenantForm.tenantIds" multiple placeholder="请选择" style="width:100%">
              <el-option
                v-for="item in tenantList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="申请理由" prop="authApplyReason">
            <el-input type="textarea" v-model="tenantForm.authApplyReason"></el-input>
          </el-form-item>
        </el-form>
        <div class="foot">
          <el-button @click="cancel()">取消</el-button>
          <el-button type="primary" @click="tenantFormSubmit()" :loading="buttonloading">确定</el-button>
        </div>
      </el-tab-pane>
      <!-- 库表 -->
      <el-tab-pane label="库表授权" name="库表授权">
        <el-form
          :model="severDataForm"
          :rules="severDataRule"
          ref="severDataForm"
          label-width="160px"
        >
          <el-form-item label="标题" prop="title">
            <el-input v-model="severDataForm.title" placeholder="标题" />
          </el-form-item>
          <el-form-item label="选择要授权的库/表/字段">
            <!-- <p>选择要授权的库/表/字段</p> -->
            <el-row :gutter="24">
              <el-col :span="10" style="border: 1px solid #DCDFE6; overflow: hidden;">
                <el-form :inline="true" :model="staffTemp" size="mini">
                  <el-row :gutter="24" style="padding:5px;">
                    <el-alert title="切换库后已选库表将会清空" show-icon type="warning" :closable="false" style="padding:0px;margin-bottom: 5px;padding-left:5px"></el-alert>
                    <el-col :span="10" style="padding:0;">
                      <el-form-item prop="selectDbName" style="margin: 0;">
                        <el-select v-model="staffTemp.project" placeholder="请选择数据库" @change="currentSel">
                          <el-option
                            v-for="item in touchActionlist"
                            :key="item.value"
                            :label="item.value"
                            :value="item.value"/>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="10" style="padding:0;">
                      <el-form-item style="margin: 0;">
                        <el-input v-model="staffTemp.name" placeholder="请输入名称"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="2" style="padding:0;">
                      <el-form-item style="margin: 0;">
                        <el-button type="primary" @click="getStaffList">查找</el-button>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
                <el-table
                  ref="staffTable"
                  v-loading="listLoading"
                  :data="staffList"
                  :row-key="getRowKey" 
                  fit
                  highlight-current-row
                  @selection-change="handleStaffChange"
                  style="min-height:300px"
                >
                  <el-table-column type="selection" :reserve-selection="true" width="55"></el-table-column>
                  <el-table-column label="数据库" align="center">
                    <template slot-scope="{row}">
                      <span>{{ row.project }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="表名称" align="center">
                    <template slot-scope="{row}">
                      <span>{{ row.name }}</span>
                    </template>
                  </el-table-column>
                </el-table>
                <!-- 分页 -->
                <el-pagination
                  @size-change="sizeChangeHandle"
                  @current-change="currentChangeHandle"
                  :current-page="staffTemp.pageNum"
                  :page-sizes="[5, 10, 15, 20]"
                  :page-size="staffTemp.pageSize"
                  :total="totalPage"
                  :small="true"
                  layout="total, prev, pager, next"
                />
              </el-col>
              <el-col :span="2" style="text-align:center;padding-top:10%">
                <el-button @click="addStaff" type="primary" size="mini" style="padding: 5px;">
                  添加
                  <i class="el-icon-arrow-right"></i>
                </el-button>
                <el-button
                  @click="removeStaff"
                  type="danger"
                  size="mini"
                  style="padding: 5px;margin-left: 0;margin-top: 10px;"
                >
                  <i class="el-icon-arrow-left"></i>删除
                </el-button>
              </el-col>
              <el-col :span="10" style="border: 1px solid #DCDFE6; overflow: hidden;">
                <p>已确认选择要授权的库/表/字段</p>
                <el-table
                  ref="selectedStaffTable"
                  v-loading="listLoading"
                  :data="selectedStaffList"
                  fit
                  :row-key="getRowKey" 
                  highlight-current-row
                  @selection-change="handleSelectedStaffChange"
                >
                  <el-table-column type="selection" :reserve-selection="true" width="55"></el-table-column>
                  <el-table-column label="数据库" align="center">
                    <template slot-scope="{row}">
                      <span>{{ row.project }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="表名称" align="center">
                    <template slot-scope="{row}">
                      <span>{{ row.name }}</span>
                    </template>
                  </el-table-column>
                </el-table>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="申请权限" prop="applyAuthTypeList">
            <el-checkbox-group v-model="severDataForm.applyAuthTypeList">
              <el-checkbox
                v-for="(item, index) in severApplyAuthList"
                :label="item"
                :key="index"
              >{{item.name}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="maxcomputer账号" prop="account">
            <el-input v-model="severDataForm.account" placeholder="maxcomputer账号" />
          </el-form-item>
          <el-form-item label="默认所属部门">
            <span v-for="(item, index) in departmentList" :key="index">{{item}}<br></span>
          </el-form-item>
          <el-form-item label="申请理由" prop="applyReason">
            <el-input type="textarea" v-model="severDataForm.applyReason" placeholder="申请理由"></el-input>
          </el-form-item>
        </el-form>
        <div class="foot">
          <el-button @click="cancel()">取消</el-button>
          <el-button type="primary" @click="severDataFormSubmit()" :loading="buttonloading">确定</el-button>
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>


<script>
import {
  getListOnPage,
  databaseInitInfo,
  accoutAuthInitInfo,
  saveAccountAuthApply,
  saveDatabaseAuthApply,
  tenantInif,
  saveTenant,
  mcCompute
} from '@/api/oa/apply'
export default {
  data () {
    return {
      totalPage: 0,
      visible: false,
      actoveTab: '账号权限',
      // 账号权限开始
      systemList: [], // 申请系统数据载体
      systemmodelList: [], // 申请系统模块数据载体
      props: {
        multiple: true
      }, // 可多选申请系统
      defaultApproverList: [], // 本次申请默认审批人数据载体
      departmentList: [], // 默认部门数据载体
      isShow: false, // 判断是否选择系统
      dataForm: {
        name: '', // 标题
        system: '', // 申请系统
        systemmodel: '', // 申请系统模块
        userName: '', // 申请人姓名
        phone: '', // 申请人手机号
        email: '', // 申请人邮箱
        reason: '' // 申请理由
      }, // 账号权限form
      dataRule: {
        name: [{ required: true, message: '标题不能为空', trigger: 'blur' }],
        system: [
          { required: true, message: '请选择申请系统', trigger: 'blur' }
        ],
        systemmodel: [
          { required: true, message: '请选择申请系统模块', trigger: 'blur' }
        ],
        reason: [
          { required: true, message: '申请理由不能为空', trigger: 'blur' }
        ]
      }, // 账号权限form 表单校验
      // 账号权限结束
      tenantList: [],
      // 租户申请开始
      tenantForm: {
        tenantIds: [], // 租户
        authApplyReason: '' // 申请理由
      }, // 租户form
      tenantRule: {
        tenantIds: [
          { required: true, message: '请选择租户', trigger: 'blur' }
        ],
        authApplyReason: [
          { required: true, message: '申请理由不能为空', trigger: 'blur' }
        ]
      }, // 租户form 表单校验
      // 租户申请结束
      // 库表授权开始
      severDataForm: {
        title: '', // 库表权限标题
        applyAuthTypeList: [], // 申请权限
        applicantName: '', // 申请人姓名
        account: '', // maxcomputer账号
        applyReason: '' // 申请理由
      },
      severDataRule: {
        title: [{ required: true, message: '标题不能为空', trigger: 'blur' }],
        applyAuthTypeList: [
          { required: true, message: '请选择申请权限', trigger: 'change' }
        ],
        applicantName: [
          { required: true, message: '申请人姓名不能为空', trigger: 'blur' }
        ],
        applyReason: [
          { required: true, message: '申请理由不能为空', trigger: 'blur' }
        ],
        account: [
          {required: true, message: 'maxcomputer不能为空', trigger: 'blur'}
        ]
      }, // 库表权限表单校验
      dataFormValue: '',
      buttonloading: false,
      ruleTypeList: [],
      severApplyAuthList: [], // 申请权限数据载体
      severdepartment: '', // 默认部门数据载体
      fatherData: {
        enable: true,
        enableCache: 1,
        parsTemplate: false,
        requestFieldType: 0,
        requestParamTemplateStatus: 0
      }, // 任务类型
      // 库表授权结束
      listLoading: false,
      touchActionlist: [],
      staffTemp: {
        project: '',
        pageSize: 5,
        pageNum: 1,
        name: ''
      },
      staffList: [],
      selectedStaffList: [],
      staffData: [],
      selectedStaffData: [],
      tableKey: 0,
      rowKey: 'rowKey',
      staffOptions: [
        { key: 28, display_name: '补货员' },
        { key: 29, display_name: '测试员' }
      ]
    }
  },
  components: {},
  methods: {
    init (id, value) {
      this.dataForm.id = id || ''
      this.dataFormValue = value
      this.visible = true
      this.$nextTick(() => {
        this.$refs['severDataForm'].resetFields()
        this.getStaffList()
        accoutAuthInitInfo().then(({ data }) => {
          this.systemList = data.data.systemList
          this.systemmodelList = data.data.systemList
          this.defaultApproverList = data.data.defaultApproverList
          this.departmentList = data.data.departmentList
          this.dataForm.userName = data.data.applicantName
          this.dataForm.phone = data.data.applicantTel
        })
        databaseInitInfo().then(({ data }) => {
          this.severApplyAuthList = data.data.applyAuthList
          this.severdepartment = data.data.department
          this.touchActionlist = data.data.touchActionList
          this.severDataForm.applicantEmail = data.data.applicantName
          this.severDataForm.applicantTel = data.data.applicantTel
        })
        tenantInif().then(({ data }) => {
          this.tenantList = data.data
        })
      })
    },
    // 选择库表
    tabClick () {
      if (this.actoveTab === '库表授权') {
        const newData = {
          userName: this.$store.state.user.name
        }
        mcCompute(newData).then(({ data }) => {
          if (data && data.status === '1') {
            this.severDataForm.account = data.data.mcAccount
          }
        })
      }
    },
    // 任务类型
    clickType () {
      this.fatherData = {
        enable: true,
        enableCache: 1,
        parsTemplate: false,
        requestFieldType: 0,
        requestParamTemplateStatus: 0
      }
    },
    // 校验是否通过
    fatherCheck () {
      let res = false
      this.$refs['dataForm'].validate(valid => {
        res = valid
      })
      return res
    },
    // 弹窗状态
    hideVisible (data) {
      this.fatherData = {
        enable: true,
        enableCache: 1,
        parsTemplate: false,
        requestFieldType: 0,
        requestParamTemplateStatus: 0
      }
      this.visible = data
    },
    dataFormSubmit (form) {
      // 账号权限提交
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.buttonloading = true
          let newData = {
            title: this.dataForm.name,
            applicantName: this.dataForm.userName,
            applicantEmail: this.dataForm.email,
            applicantTel: this.dataForm.phone,
            applyReason: this.dataForm.reason,
            systemId: this.dataForm.system,
            menuList: this.dataForm.systemmodel
          }
          saveAccountAuthApply(newData).then(({ data }) => {
            if (data && data.status === '1') {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.visible = false
                  this.$emit('refreshDataList')
                  this.$refs['dataForm'].resetFields()
                  this.buttonloading = false
                  this.isShow = false
                }
              })
            } else {
              this.$message.error(data.message)
              this.buttonloading = false
            }
          })
        }
      })
    },
    tenantFormSubmit (form) {
      // 租户提交
      this.$refs['tenantForm'].validate(valid => {
        if (valid) {
          this.buttonloading = true
          let newData = {
            tenantIds: this.tenantForm.tenantIds,
            authApplyReason: this.tenantForm.authApplyReason
          }
          saveTenant(newData).then(({ data }) => {
            if (data && data.status === '1') {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.visible = false
                  this.$emit('refreshDataList')
                  this.$refs['dataForm'].resetFields()
                  this.buttonloading = false
                  this.isShow = false
                }
              })
            } else {
              this.$message.error(data.message)
              this.buttonloading = false
            }
          })
        }
      })
    },
    // 账号选中系统数据处理
    testFunction (value) {
      this.systemmodelList = []
      if (value === 3) {
        this.isShow = false
      } else {
        this.isShow = true
      }
      accoutAuthInitInfo().then(({ data }) => {
        var a = [{value: value}]
        var b = data.data.systemList
        var arr = [...b].filter(x => [...a].some(y => y.value === x.value))
        this.systemmodelList = arr
      })
    },
    severDataFormSubmit (form) {
      // 库表授权提交
      this.$refs['severDataForm'].validate(valid => {
        if (valid) {
          this.buttonloading = true
          let newData = {
            title: this.severDataForm.title,
            applicantName: this.severDataForm.applicantName,
            applicantEmail: this.severDataForm.applicantEmail,
            applicantTel: this.severDataForm.applicantTel,
            applyReason: this.severDataForm.applyReason,
            info: {
              account: this.severDataForm.account,
              tables: this.selectedStaffList
            },
            applyAuthTypeList: this.severDataForm.applyAuthTypeList
          }
          saveDatabaseAuthApply(newData).then(({ data }) => {
            if (data && data.status === '1') {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.visible = false
                  this.$emit('refreshDataList')
                  this.$refs['severDataForm'].resetFields()
                  this.staffTemp.pageNum = 1
                  this.staffTemp.name = ''
                  this.selectedStaffList = []
                  this.$refs.staffTable.clearSelection()
                  this.buttonloading = false
                  this.actoveTab = '账号权限'
                }
              })
            } else {
              this.$message.error(data.message)
              this.buttonloading = false
            }
          })
        }
      })
    },
    // 穿梭狂部分
    getStaffList () {
      getListOnPage(this.staffTemp).then(({ data }) => {
        if (data.status == '1') {
          this.totalPage = data.data.total
          this.staffList = data.data.rows
        }
      })
    },
    // 重置库的时候清空表
    currentSel (value) {
      this.staffTemp.project = value
      this.staffTemp.pageNum = 1
      this.getStaffList()
      this.selectedStaffList = []
      this.$refs.staffTable.clearSelection()
    },
    // 将左边表格选择项存入staffData中
    handleStaffChange (rows) {
      this.staffData = rows
    },
    // 左边表格选择项移到右边
    addStaff () {
      setTimeout(() => {
        this.$refs['staffTable'].clearSelection()
        this.$refs['selectedStaffTable'].clearSelection()
      }, 0)
      let repeat = false
      if (repeat === false) {
        var arr = [...this.selectedStaffList, ...this.staffData]
        var hash = {}
        arr = arr.reduce(function (item, next) {
          // eslint-disable-next-line no-unused-expressions
          hash[next.name] ? '' : hash[next.name] = true && item.push(next)
          return item
        }, [])
        this.selectedStaffList = arr
        this.staffList = this.staffList.filter(item => {
          let list = this.staffData.map(v => v.name)
          return !list.includes(item.name)
        })
        this.staffData = []
      }
    },
    // 右边表格选择项移到左边
    removeStaff () {
      setTimeout(() => {
        this.$refs['staffTable'].clearSelection()
        this.$refs['selectedStaffTable'].clearSelection()
      }, 0)
      var arr = [...this.staffList, ...this.selectedStaffData]
      var hash = {}
      arr = arr.reduce(function (item, next) {
          // eslint-disable-next-line no-unused-expressions
        hash[next.name] ? '' : hash[next.name] = true && item.push(next)
        return item
      }, [])
      this.staffList = arr
      this.selectedStaffList = this.selectedStaffList.filter(item => {
        let list = this.selectedStaffData.map(v => v.name)
        return !list.includes(item.name)
      })
      this.selectedStaffData = []
    },
    // 将右边表格选择项存入selectedStaffData中
    handleSelectedStaffChange (rows) {
      this.selectedStaffData = rows
    },
    sizeChangeHandle (val) {
      this.staffTemp.pageSize = val
      this.staffTemp.pageNum = 1
      this.getStaffList()
    },
    // 库表取消
    // severDataFormCancel () {
    //   this.visible = false
    //   this.staffTemp.pageNum = 1
    //   this.staffTemp.name = ''
    //   this.selectedStaffList = []
    //   this.$refs.staffTable.clearSelection()
    //   this.actoveTab = '账号权限'
    // },
    // 取消
    cancel () {
      this.visible = false
      this.isShow = false
      this.staffTemp.pageNum = 1
      this.staffTemp.name = ''
      this.selectedStaffList = []
      this.$refs.staffTable.clearSelection()
      this.actoveTab = '账号权限'
      this.$refs['dataForm'].resetFields()
      this.$refs['tenantForm'].resetFields()
      this.$refs['severDataForm'].resetFields()
    },
    // 当前页
    currentChangeHandle (val) {
      this.staffTemp.pageNum = val
      this.getStaffList()
    },
    getRowKey (row) {
      return row.id
    }
  }
}
</script>
<style scoped>
.foot {
  text-align: right;
}
</style>>
