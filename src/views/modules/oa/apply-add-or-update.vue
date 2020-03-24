<template>
  <el-dialog :title="dataFormValue ? '查看' : dataForm.id ? '修改' : '新增'" :modal-append-to-body='false' :append-to-body="true" :close-on-click-modal="false" :visible.sync="visible">
    <el-divider>请选择申请类别</el-divider>
    <el-tabs type="border-card">
      <el-tab-pane label="用户管理">
        <el-divider>请填写以下申请</el-divider>
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="20%">
          <el-form-item label="标题" prop="name">
            <el-input v-model="dataForm.name" onkeyup="this.value=this.value.replace(/\s+/g,'')" v-if="!dataFormValue" placeholder="任务"/>
            <el-input v-model="dataForm.name" v-else disabled placeholder="任务"/>
          </el-form-item>
          <el-form-item label="申请系统">
            <el-radio-group v-model="dataForm.resource">
              <el-radio label="数据中台"></el-radio>
              <el-radio label="BI系统"></el-radio>
              <el-radio label="tableau"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="申请模块">
            <el-select v-model="dataForm.region" placeholder="请选择活动区域">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="子模块">
            <el-select v-model="dataForm.region" placeholder="请选择活动区域">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="已选模块">
            <el-tag
              style="margin-left:10px;"
              v-for="tag in tags"
              :key="tag.name"
              closable
              :type="tag.type">
              {{tag.name}}
            </el-tag>
          </el-form-item>
          <el-form-item label="申请权限">
            <el-checkbox-group v-model="dataForm.type">
              <el-checkbox label="新增" name="type"></el-checkbox>
              <el-checkbox label="修改" name="type"></el-checkbox>
              <el-checkbox label="删除" name="type"></el-checkbox>
              <el-checkbox label="查看" name="type"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="申请人姓名" prop="name">
            <el-input v-model="dataForm.name" onkeyup="this.value=this.value.replace(/\s+/g,'')" v-if="!dataFormValue" placeholder="任务"/>
            <el-input v-model="dataForm.name" v-else disabled placeholder="任务"/>
          </el-form-item>
          <el-form-item label="默认所属部门" prop="name">
            <el-input v-model="dataForm.name" onkeyup="this.value=this.value.replace(/\s+/g,'')" v-if="!dataFormValue" placeholder="任务"/>
            <el-input v-model="dataForm.name" v-else disabled placeholder="任务"/>
          </el-form-item>
          <el-form-item label="申请人手机" prop="name">
            <el-input v-model="dataForm.name" onkeyup="this.value=this.value.replace(/\s+/g,'')" v-if="!dataFormValue" placeholder="任务"/>
            <el-input v-model="dataForm.name" v-else disabled placeholder="任务"/>
          </el-form-item>
          <el-form-item label="申请人邮箱" prop="name">
            <el-input v-model="dataForm.name" onkeyup="this.value=this.value.replace(/\s+/g,'')" v-if="!dataFormValue" placeholder="任务"/>
            <el-input v-model="dataForm.name" v-else disabled placeholder="任务"/>
          </el-form-item>
          <el-form-item label="本次申请默认审批人" prop="name">
            <el-input v-model="dataForm.name" onkeyup="this.value=this.value.replace(/\s+/g,'')" v-if="!dataFormValue" placeholder="任务"/>
            <el-input v-model="dataForm.name" v-else disabled placeholder="任务"/>
          </el-form-item>
          <el-form-item label="抄送人" prop="name">
            <el-input v-model="dataForm.name" onkeyup="this.value=this.value.replace(/\s+/g,'')" v-if="!dataFormValue" placeholder="任务"/>
            <el-input v-model="dataForm.name" v-else disabled placeholder="任务"/>
          </el-form-item>
          <el-form-item label="申请理由">
            <el-input type="textarea" v-model="dataForm.desc"></el-input>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="配置管理">
         <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="20%">
          <el-form-item label="标题" prop="name">
            <el-input v-model="dataForm.name" onkeyup="this.value=this.value.replace(/\s+/g,'')" v-if="!dataFormValue" placeholder="任务"/>
            <el-input v-model="dataForm.name" v-else disabled placeholder="任务"/>
          </el-form-item>
          <el-form-item label="">
          <p>选择要授权的库/表/字段</p>
            <el-form :inline="true" :model="staffTemp">
                <el-form-item label="数据库">
                    <el-input v-model="staffTemp.phone"></el-input>
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
                      border
                      fit
                      highlight-current-row
                      @selection-change="handleStaffChange"
                  >
                      <el-table-column type="selection" :reserve-selection="true" width="55"></el-table-column>
                      <el-table-column label="手机" align="center">
                        <template slot-scope="{row}">
                          <span>{{ row.phone }}</span>
                        </template>
                      </el-table-column>

                      <el-table-column label="昵称" align="center">
                        <template slot-scope="{row}">
                          <span>{{ row.nickName }}</span>
                        </template>
                      </el-table-column>
                  </el-table>
              </el-col>
              <el-col :span="2" style="text-align:center;">
                  <el-button
                      @click="addStaff"
                      type="primary"
                  >添加</el-button>
                  <el-button
                      @click="removeStaff"
                      type="danger"
                      style="margin-left: 0;margin-top: 10px;"
                  >删除</el-button>
              </el-col>
              <el-col :span="11">
                  <el-table
                      ref="selectedStaffTable"
                      v-loading="listLoading"
                      :key="tableKey"
                      :data="selectedStaffList"
                      border
                      fit
                      highlight-current-row
                      @selection-change="handleSelectedStaffChange"
                    >
                      <el-table-column type="selection" :reserve-selection="true" width="55"></el-table-column>
                      <el-table-column label="手机" align="center">
                        <template slot-scope="{row}">
                          <span>{{ row.phone }}</span>
                        </template>
                      </el-table-column>

                      <el-table-column label="昵称" align="center">
                        <template slot-scope="{row}">
                          <span>{{ row.nickName }}</span>
                        </template>
                      </el-table-column>

                      <el-table-column label="类型" align="center">
                        <template slot-scope="{row}">
                          <el-select class="filter-item" placeholder="请选择" v-model="row.staffTypeId">
                            <el-option
                              v-for="item in staffOptions"
                              :key="item.key"
                              :label="item.display_name"
                              :value="item.key"
                            ></el-option>
                          </el-select>
                        </template>
                      </el-table-column>
                  </el-table>
              </el-col>
          </el-row>
          </el-form-item>
          <el-form-item label="申请权限">
            <el-checkbox-group v-model="dataForm.type">
              <el-checkbox label="新增" name="type"></el-checkbox>
              <el-checkbox label="修改" name="type"></el-checkbox>
              <el-checkbox label="删除" name="type"></el-checkbox>
              <el-checkbox label="查看" name="type"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="申请人姓名" prop="name">
            <el-input v-model="dataForm.name" onkeyup="this.value=this.value.replace(/\s+/g,'')" v-if="!dataFormValue" placeholder="任务"/>
            <el-input v-model="dataForm.name" v-else disabled placeholder="任务"/>
          </el-form-item>
          <el-form-item label="默认所属部门" prop="name">
            <el-input v-model="dataForm.name" onkeyup="this.value=this.value.replace(/\s+/g,'')" v-if="!dataFormValue" placeholder="任务"/>
            <el-input v-model="dataForm.name" v-else disabled placeholder="任务"/>
          </el-form-item>
          <el-form-item label="申请人手机" prop="name">
            <el-input v-model="dataForm.name" onkeyup="this.value=this.value.replace(/\s+/g,'')" v-if="!dataFormValue" placeholder="任务"/>
            <el-input v-model="dataForm.name" v-else disabled placeholder="任务"/>
          </el-form-item>
          <el-form-item label="申请人邮箱" prop="name">
            <el-input v-model="dataForm.name" onkeyup="this.value=this.value.replace(/\s+/g,'')" v-if="!dataFormValue" placeholder="任务"/>
            <el-input v-model="dataForm.name" v-else disabled placeholder="任务"/>
          </el-form-item>
          <el-form-item label="本次申请默认审批人" prop="name">
            <el-input v-model="dataForm.name" onkeyup="this.value=this.value.replace(/\s+/g,'')" v-if="!dataFormValue" placeholder="任务"/>
            <el-input v-model="dataForm.name" v-else disabled placeholder="任务"/>
          </el-form-item>
          <el-form-item label="抄送人" prop="name">
            <el-input v-model="dataForm.name" onkeyup="this.value=this.value.replace(/\s+/g,'')" v-if="!dataFormValue" placeholder="任务"/>
            <el-input v-model="dataForm.name" v-else disabled placeholder="任务"/>
          </el-form-item>
          <el-form-item label="申请理由">
            <el-input type="textarea" v-model="dataForm.desc"></el-input>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
   
    <div v-if="dataForm.type == 'DECISION' || dataForm.type == 'FORK_JOIN' || dataForm.type == 'JOIN' || dataForm.type == ''" slot="footer" class="foot">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  // import { getBeeTaskTypeList, infoBeeTask, beeTask } from '@/api/workerBee/metadata'
  // import Filter from './filter'
  export default {
    data () {
      var checkDecisionName = (rule, value, callback) => {
        const nullValue = /^[^\s]+$/
        if (!value) {
          callback(new Error('请输入任务定义名称'))
        }
        if (!nullValue.test(value)) {
          callback(new Error('不能输入含空格的任务定义名称'))
        }
        callback()
      }
      return {
        visible: false,
        dataForm: {
          id: '',
          name: '', // 任务定义名称
          region: '', // 模块
          type: '', // 任务类型
          description: '', // 任务描述
          owner: '', // 任务归属
          user: '', // 任务使用者
          inputParams: '', // 入参数据的key的ID集合
          outputParams: '', // 出参数据的key的ID集合
          ownerApp: '', // 所属系统
          remark: '' // 备注
        },
        staffTemp: {
  
        },
        tags: [
          { name: '标签一', type: '' },
          { name: '标签二', type: 'success' },
          { name: '标签三', type: 'info' },
          { name: '标签四', type: 'warning' },
          { name: '标签五', type: 'danger' }
        ],
        dataFormValue: '',
        ruleTypeList: [],
        dataRule: {
          name: [
            { required: true, validator: checkDecisionName, trigger: 'change' }
          ],
          type: [
            { required: true, message: '请选择任务类型', trigger: 'change' }
          ],
          description: [
          ],
          owner: [
          ],
          user: [
          ],
          inputParams: [
          ],
          outputParams: [
          ],
          ownerApp: [
          ]
        },
        fatherData: {
          enable: true,
          enableCache: 1,
          parsTemplate: false,
          requestFieldType: 0,
          requestParamTemplateStatus: 0
        },
        listLoading: true,
        staffTemp: {
          phone: '',
          nickName: '',
          staffTypeId: ''
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
    components: {
    },
    methods: {
      init (id, value) {
        this.dataForm.id = id || ''
        this.dataFormValue = value
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          // getBeeTaskTypeList().then(({data}) => {
          //   if (data && data.status === 0) {
          //     this.ruleTypeList = data.data
          //   }
          // })
          if (id) {
            // const dataBody = {
            //   utcParam: [id]
            // }
            // infoBeeTask(dataBody).then(({data}) => {
            //   if (data && data.status === 0) {
            //     this.dataForm.id = data.beeTaskDef.id
            //     this.dataForm.name = data.beeTaskDef.name
            //     this.dataForm.type = data.beeTaskDef.type
            //     this.dataForm.description = data.beeTaskDef.description
            //     this.dataForm.owner = data.beeTaskDef.owner
            //     this.dataForm.user = data.beeTaskDef.user
            //     this.dataForm.inputParams = data.beeTaskDef.inputParams
            //     this.dataForm.outputParams = data.beeTaskDef.outputParams
            //     this.dataForm.ownerApp = data.beeTaskDef.ownerApp
            //     this.dataForm.remark = data.beeTaskDef.remark
            //     this.fatherData = data[this.dataForm.type.toLowerCase()]
            //   }
            // })
          }
        })
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
        this.$refs['dataForm'].validate((valid) => {
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
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            let data = {
              'http': null,
              'jdbc': null,
              'kafka': null,
              'cassandra': null,
              'groovy': null,
              'aviator': null,
              'freemarker': null,
              'hbase': null
            }
            if (form) {
              for (let key in data) {
                if (this.dataForm.type.toLowerCase() == key) {
                  data[key] = form
                }
              }
            }
            this.dataForm = {
              ...this.dataForm,
              id: Number(this.dataForm.id)
            }
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
        fetchStaffList(this.staffTemp).then(res => {
          if (res.value.staff.length === 0) {
            alert('查无此人')
          }
          this.staffList = res.value.staff
        })
      },
    // 将左边表格选择项存入staffData中
      handleStaffChange (rows) {
        this.staffData = []
        if (rows) {
          rows.forEach(row => {
            if (row) {
              this.staffData.push(row)
            }
          })
        }
      },
    // 左边表格选择项移到右边
      addStaff () {
        setTimeout(() => {
          this.$refs['staffTable'].clearSelection()
          this.$refs['selectedStaffTable'].clearSelection()
        }, 0)
        let repeat = false
        this.selectedStaffList.forEach(item => {
          if (this.staffData[0] && item.phone === this.staffData[0].phone) {
            repeat = true
            alert('此员工已添加')
          }
        })
        if (repeat === false) {
          this.staffData.forEach(item => {
            this.selectedStaffList.push(item)
          })
          for (let i = 0; i < this.staffList.length; i++) {
            for (let j = 0; j < this.staffData.length; j++) {
              if (
              this.staffList[i] &&
              this.staffData[j] &&
              this.staffList[i].phone === this.staffData[j].phone
            ) {
                this.staffList.splice(i, 1)
              }
            }
          }
        }
      },
    // 右边表格选择项移到左边
      removeStaff () {
        setTimeout(() => {
          this.$refs['staffTable'].clearSelection()
          this.$refs['selectedStaffTable'].clearSelection()
        }, 0)
        this.selectedStaffData.forEach(item => {
          this.staffList.push(item)
        })
        for (let i = 0; i < this.selectedStaffList.length; i++) {
          for (let j = 0; j < this.selectedStaffData.length; j++) {
            if (
            this.selectedStaffList[i] &&
            this.selectedStaffData[j] &&
            this.selectedStaffList[i].phone === this.selectedStaffData[j].phone
          ) {
              this.selectedStaffList.splice(i, 1)
            }
          }
        }
      },
    // 将右边表格选择项存入selectedStaffData中
      handleSelectedStaffChange (rows) {
        this.selectedStaffData = []
        if (rows) {
          rows.forEach(row => {
            if (row) {
              this.selectedStaffData.push(row)
            }
          })
        }
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
      }
    }
  }
</script>
<style scoped>
</style>>
