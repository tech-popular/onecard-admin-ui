<template>
  <el-dialog
    :title="dataFormValue ? '查看' : dataForm.id ? '修改' : '新增'"
    :modal-append-to-body="false"
    :append-to-body="true"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="1000px"
  >
    <el-divider>请选择申请类别</el-divider>
    <el-tabs type="border-card">
      <el-tab-pane label="账号权限">
        <el-divider>请填写以下申请</el-divider>
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="160px">
          <el-form-item label="标题" prop="name">
            <el-input v-model="dataForm.name" placeholder="标题" />
          </el-form-item>
          <el-form-item label="申请系统" prop="system">
            <el-radio-group v-model="dataForm.system">
              <el-radio :label="item.id" :key="item.id" v-for="(item) in systemList">{{item.name}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="申请模块" prop="model">
            <el-cascader
              :props="props"
              v-model="dataForm.model"
              clearable
              :options="moduleList"
              @change="handleChange"
              ref="all"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="申请权限" prop="jurisdiction">
            <el-checkbox-group v-model="dataForm.jurisdiction">
              <el-checkbox
                v-for="(item, index) in applyAuthList"
                :label="item.id"
                :key="index"
              >{{item.name}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="申请人姓名" prop="userName">
            <el-input v-model="dataForm.userName" placeholder="申请人姓名" />
          </el-form-item>
          <el-form-item label="默认所属部门">
            <span>{{department}}</span>
          </el-form-item>
          <el-form-item label="申请人邮箱" prop="email">
            <el-input v-model="dataForm.email" placeholder="申请人邮箱" />
          </el-form-item>
          <el-form-item label="本次申请默认审批人" prop="approvalPeop">
            <el-tag
              style="margin-left:10px;"
              v-for="tag in defaultApproverList"
              :key="tag.name"
              :type="tag.name"
            >{{tag.name}}</el-tag>
          </el-form-item>
          <el-form-item label="申请理由" prop="reason">
            <el-input type="textarea" v-model="dataForm.reason"></el-input>
          </el-form-item>
        </el-form>
        <div class="foot">
          <el-button @click="visible = false">取消</el-button>
          <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane label="库表授权">
        <el-form
          :model="severDataForm"
          :rules="severDataRule"
          ref="severDataForm"
          label-width="160px"
        >
          <el-form-item label="标题" prop="name">
            <el-input
              v-model="severDataForm.name"
              onkeyup="this.value=this.value.replace(/\s+/g,'')"
              v-if="!dataFormValue"
              placeholder="任务"
            />
            <el-input v-model="severDataForm.name" v-else disabled placeholder="任务" />
          </el-form-item>
          <el-form-item label='选择要授权的库/表/字段'>
            <!-- <p>选择要授权的库/表/字段</p> -->
            <el-form :inline="true" :model="staffTemp" size="mini">
              <el-form-item>
                <el-select v-model="staffTemp.selectDbName" placeholder="请选择数据库">
                  <el-option>db</el-option>
                  <el-option>redis</el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-input v-model="staffTemp.inputDbName" placeholder="请输入名称"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="getStaffList">查找</el-button>
              </el-form-item>
            </el-form>
            <el-row :gutter="20">
              <el-col :span="11">
                <el-table
                  ref="staffTable"
                  v-loading="listLoading"
                  :key="tableKey"
                  :data="staffList"
                  fit
                  highlight-current-row
                  @selection-change="handleStaffChange"
                >
                  <el-table-column type="selection" :reserve-selection="true" width="55"></el-table-column>
                  <el-table-column label="数据库" align="center">
                    <template slot-scope="{row}">
                      <span>{{ row.db }}</span>
                    </template>
                  </el-table-column>

                  <el-table-column label="表名称" align="center">
                    <template slot-scope="{row}">
                      <span>{{ row.tableName }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="字段名称" align="center">
                    <template slot-scope="{row}">
                      <span>{{ row.keyName }}</span>
                    </template>
                  </el-table-column>
                </el-table>
                <!-- 分页 -->
                <el-pagination
                  @size-change="sizeChangeHandle"
                  @current-change="currentChangeHandle"
                  :current-page="pageNum"
                  :page-sizes="[5, 10, 15, 20]"
                  :page-size="pageSize"
                  :total="totalPage"
                  layout="total, sizes, prev, pager, next, jumper"
                />
              </el-col>
              <el-col :span="2" style="text-align:center;">
                <el-button @click="addStaff" type="primary" size="mini">添加</el-button>
                <el-button
                  @click="removeStaff"
                  type="danger"
                  size="mini"
                  style="margin-left: 0;margin-top: 10px;"
                >删除</el-button>
              </el-col>
              <el-col :span="11">
                <el-table
                  ref="selectedStaffTable"
                  v-loading="listLoading"
                  :key="tableKey"
                  :data="selectedStaffList"
                  fit
                  highlight-current-row
                  @selection-change="handleSelectedStaffChange"
                >
                  <el-table-column type="selection" :reserve-selection="true" width="55"></el-table-column>
                  <el-table-column label="数据库" align="center">
                    <template slot-scope="{row}">
                      <span>{{ row.db }}</span>
                    </template>
                  </el-table-column>

                  <el-table-column label="表名称" align="center">
                    <template slot-scope="{row}">
                      <span>{{ row.tableName }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="字段名称" align="center">
                    <template slot-scope="{row}">
                      <span>{{ row.keyName }}</span>
                    </template>
                  </el-table-column>
                </el-table>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="申请权限">
            <el-checkbox-group v-model="severDataForm.type">
              <el-checkbox label="新增" name="type"></el-checkbox>
              <el-checkbox label="修改" name="type"></el-checkbox>
              <el-checkbox label="删除" name="type"></el-checkbox>
              <el-checkbox label="查看" name="type"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="申请人姓名" prop="name">
            <el-input
              v-model="severDataForm.name"
              onkeyup="this.value=this.value.replace(/\s+/g,'')"
              v-if="!dataFormValue"
              placeholder="任务"
            />
            <el-input v-model="severDataForm.name" v-else disabled placeholder="任务" />
          </el-form-item>
          <el-form-item label="默认所属部门" prop="name">
            <el-input
              v-model="severDataForm.name"
              onkeyup="this.value=this.value.replace(/\s+/g,'')"
              v-if="!dataFormValue"
              placeholder="任务"
            />
            <el-input v-model="severDataForm.name" v-else disabled placeholder="任务" />
          </el-form-item>
          <!-- <el-form-item label="申请人手机" prop="name">
            <el-input v-model="dataForm.name" onkeyup="this.value=this.value.replace(/\s+/g,'')" v-if="!dataFormValue" placeholder="任务"/>
            <el-input v-model="dataForm.name" v-else disabled placeholder="任务"/>
          </el-form-item>-->
          <el-form-item label="申请人邮箱" prop="name">
            <el-input
              v-model="severDataForm.name"
              onkeyup="this.value=this.value.replace(/\s+/g,'')"
              v-if="!dataFormValue"
              placeholder="任务"
            />
            <el-input v-model="severDataForm.name" v-else disabled placeholder="任务" />
          </el-form-item>
          <el-form-item label="本次申请默认审批人" prop="name">
            <el-input
              v-model="severDataForm.name"
              onkeyup="this.value=this.value.replace(/\s+/g,'')"
              v-if="!dataFormValue"
              placeholder="任务"
            />
            <el-input v-model="severDataForm.name" v-else disabled placeholder="任务" />
          </el-form-item>
          <!-- <el-form-item label="抄送人" prop="name">
            <el-input v-model="severDataForm.name" onkeyup="this.value=this.value.replace(/\s+/g,'')" v-if="!dataFormValue" placeholder="任务"/>
            <el-input v-model="severDataForm.name" v-else disabled placeholder="任务"/>
          </el-form-item>-->
          <el-form-item label="申请理由">
            <el-input type="textarea" v-model="severDataForm.desc"></el-input>
          </el-form-item>
        </el-form>
        <!-- <div class="foot">
          <el-button @click="visible = false">取消</el-button>
          <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
        </div>-->
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script>
import { accoutAuthInitInfo } from '@/api/oa/apply'
import Filter from './filter'
export default {
  data () {
    return {
      pageNum: 1, // 当前页
      pageSize: 5, // 默认每页10条
      totalPage: 0,

      visible: false,
      systemList: [],
      applyAuthList: [],
      props: { multiple: true },
      moduleList: [
        {
          value: 'zhinan',
          label: '指南',
          children: [
            {
              value: 'shejiyuanze',
              label: '设计原则'
            }
          ]
        },
        {
          value: 'shijian',
          label: '时间',
          children: [
            {
              value: 'shijiandian',
              label: '时间点'
            }
          ]
        }
      ],
      defaultApproverList: [],
      department: '',
      dataForm: {
        // 账号权限form
        name: '', // 账号权限标题
        system: '',
        model: '',
        chileModel: '',
        jurisdiction: '',
        userName: '',
        email: '',
        approvalPeop: '',
        reason: ''
      },
      dataRule: {
        name: [{ required: true, message: '标题不能为空', trigger: 'blur' }],
        system: [
          { required: true, message: '请选择申请系统', trigger: 'blur' }
        ],
        model: [{ required: true, message: '请选择模块', trigger: 'blur' }],
        chileModel: [
          { required: true, message: '请选择子模块', trigger: 'blur' }
        ],
        jurisdiction: [
          { required: true, message: '请选择申请权限', trigger: 'blur' }
        ],
        userName: [
          { required: true, message: '申请人姓名不能为空', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '申请人邮箱不能为空', trigger: 'blur' }
        ],
        reason: [
          { required: true, message: '申请理由不能为空', trigger: 'blur' }
        ]
      },
      severDataForm: {
        // 账号权限form
        name: '', // 账号权限标题
        system: '',
        model: '',
        chileModel: '',
        jurisdiction: '',
        userName: '',
        email: '',
        approvalPeop: '',
        reason: ''
      },
      severDataRule: {
        name: [
          { required: true, message: '标题不能为空', trigger: 'blur' },
          {
            required: true,
            validator: Filter.NullKongGeRule,
            trigger: 'change'
          }
        ]
      },
      // tags: [
      //   { name: '标签一', type: '' },
      //   { name: '标签二', type: 'success' },
      //   { name: '标签三', type: 'info' },
      //   { name: '标签四', type: 'warning' },
      //   { name: '标签五', type: 'danger' }
      // ],
      dataFormValue: '',
      ruleTypeList: [],
      fatherData: {
        enable: true,
        enableCache: 1,
        parsTemplate: false,
        requestFieldType: 0,
        requestParamTemplateStatus: 0
      },
      listLoading: false,
      staffTemp: {
        phone: '',
        staffTypeId: '',
        selectDbName: '',
        inputDbName: ''
      },
      staffList: [
        {
          id: 1,
          db: '1',
          tableName: '1',
          keyName: '1'
        },
        {
          id: 2,
          db: '2',
          tableName: '2',
          keyName: '2'
        },
        {
          id: 3,
          db: '3',
          tableName: '3',
          keyName: '3'
        }
      ],
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
        this.$refs['dataForm'].resetFields()
        accoutAuthInitInfo().then(({ data }) => {
          this.systemList = data.data.systemList
          this.applyAuthList = data.data.applyAuthList
          // this.moduleList = data.data.moduleList
          this.defaultApproverList = data.data.defaultApproverList
          this.department = data.data.department
        })
      })
    },
    // 模块选择
    handleChange (value) {
      console.log(value)
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
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          console.log('准备提交了')
          // let newData = {
          //   'beeTaskDef': this.dataForm,
          //   ...data
          // }
          // beeTask(newData, `/beeTask/${!this.dataForm.id ? 'saveBeeTask' : 'updateBeeTask'}`).then(({data}) => {
          //   if (data && data.status === 0) {
          //     this.$message({
          //       message: '操作成功',
          //       type: 'success',
          //       duration: 1500,
          //       onClose: () => {
          //         this.visible = false
          //         this.$emit('refreshDataList')
          //         this.$refs['dataForm'].resetFields()
          //       }
          //     })
          //   } else {
          //     this.$message.error(data.msg)
          //   }
          // })
        }
      })
    },
    // 穿梭狂部分
    getStaffList () {
      // fetchStaffList(this.staffTemp).then(res => {
      //   if (res.value.staff.length === 0) {
      //     alert('查无此人')
      //   }
      //   this.staffList = res.value.staff
      // })
    },
    // 将左边表格选择项存入staffData中
    handleStaffChange (rows) {
      this.staffData = rows
      // if (rows) {
      //   rows.forEach(row => {
      //     if (row) {
      //       this.staffData.push(row)
      //     }
      //   })
      // }
    },
    // 左边表格选择项移到右边
    addStaff () {
      setTimeout(() => {
        this.$refs['staffTable'].clearSelection()
        this.$refs['selectedStaffTable'].clearSelection()
      }, 0)
      let repeat = false
      // this.selectedStaffList.forEach(item => {
      //   if (this.staffData[0] && item.phone === this.staffData[0].phone) {
      //     repeat = true
      //     alert('此员工已添加')
      //   }
      // })
      if (repeat === false) {
        this.selectedStaffList = [...this.selectedStaffList, ...this.staffData]
        this.staffList = this.staffList.filter((item) => {
          let list = this.staffData.map(v => v.id)
          return !list.includes(item.id)
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
      this.staffList = [...this.staffList, ...this.selectedStaffData]
      this.selectedStaffList = this.selectedStaffList.filter((item) => {
        let list = this.selectedStaffData.map(v => v.id)
        return !list.includes(item.id)
      })
      this.selectedStaffData = []
    },
    // 将右边表格选择项存入selectedStaffData中
    handleSelectedStaffChange (rows) {
      this.selectedStaffData = rows
      // this.selectedStaffData = []
      // if (rows) {
      //   rows.forEach(row => {
      //     if (row) {
      //       this.selectedStaffData.push(row)
      //     }
      //   })
      // }
    },
    // 提交
    modifyStaff () {
      let isEmpty = false
      this.selectedStaffList.forEach(item => {
        if (!item.staffTypeId) {
          alert('请选择类型')
          isEmpty = true
        }
      })
      if (isEmpty === false) {
        // editStaff(this.selectedStaffList, this.deviceQuery.id).then(res => {
        //   this.staffListVisible = false
        //   this.$notify({
        //     title: '成功',
        //     message: '修改成功',
        //     type: 'success',
        //     duration: 2000
        //   })
        // })
      }
    },
    sizeChangeHandle (val) {
      this.pageSize = val
      this.pageNum = 1
      this.getStaffList()
    },
      // 当前页
    currentChangeHandle (val) {
      this.pageNum = val
      this.getStaffList()
    }
  }
}
</script>
<style scoped>
.foot {
  text-align: right;
}
</style>>
