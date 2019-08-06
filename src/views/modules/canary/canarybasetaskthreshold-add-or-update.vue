<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    append-to-body
    :visible.sync="innerVisible">

    <!---列表--->
    <div class="mod-config">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item>
          <el-input v-model="dataForm.key" placeholder="参数名" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()">查询</el-button>
          <el-button  type="primary" @click="addOrUpdateHandle()">新增</el-button>
          <el-button v-if="isAuth('canary:canarybasethreshold:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="dataList"
        border
        v-loading="dataListLoading"
        @selection-change="selectionChangeHandle"
        style="width: 100%;">
        <el-table-column
          type="selection"
          header-align="center"
          align="center"
          width="50">
        </el-table-column>
        <el-table-column
          prop="id"
          header-align="center"
          align="center"
          label="主键Id">
        </el-table-column>
        <el-table-column
          prop="serviceId"
          header-align="center"
          align="center"
          label="应用Id">
        </el-table-column>
        <el-table-column
          prop="level"
          header-align="center"
          align="center"
          label="level级别">
        </el-table-column>
        <el-table-column
          prop="thresholdExpression"
          header-align="center"
          align="center"
          show-overflow-tooltip
          label="阈值表达式">
        </el-table-column>
        <el-table-column
          prop="mostConsecutiveLosses"
          header-align="center"
          align="center"
          label="错误连续次数">
        </el-table-column>
        <el-table-column
          prop="incontinuity"
          header-align="center"
          align="center"
          label="检查点内错误次数">
        </el-table-column>
        <el-table-column
          fixed="right"
          header-align="center"
          align="center"
          width="150"
          label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
            <el-button type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="pageIndex"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        :total="totalPage"
        layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
      <!-- 弹窗, 新增 / 修改 -->
      <!--<add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>-->
    </div>
    <!--表单-->
    <br>
    <hr>
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="level级别" prop="level">
        <el-select v-model="dataForm.thresholdEntity.levelId" placeholder="请选择level级别">
          <el-option v-for="item in leveloptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="阈值表达式" prop="thresholdExpression">
        <el-input type="textarea" v-model="dataForm.thresholdEntity.thresholdExpression" placeholder="阈值表达式"></el-input>
      </el-form-item>
      <el-form-item label="错误连续次数" prop="mostConsecutiveLosses">
        <el-input-number v-model="dataForm.thresholdEntity.mostConsecutiveLosses" :min="1" :max="10" label="错误连续次数"></el-input-number>
        <el-tooltip class="item" effect="dark" content="连续错误多少次触发报警" placement="top">
          <i class="el-icon-warning"></i>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="检查点内错误次数" prop="incontinuity">
        <el-input-number v-model="dataForm.thresholdEntity.incontinuity" :min="1" :max="10" label="错误连续次数"></el-input-number>
        <el-tooltip class="item" effect="dark" content="检查点内错误次数" placement="top">
          <i class="el-icon-warning"></i>
        </el-tooltip>
      </el-form-item>

      <hr>
      选择用户群组
      <el-transfer v-model="dataForm.userGroupStr" :titles="['全部', '选中']" :props="{
                        key: 'id',
                        label: 'name'
                      }" :data="allUsergroupOptions" :filterable="true">
      </el-transfer>
      <hr>
      <!-- 通道 -->
      <el-form-item
        v-for="(outdata, index) in dataForm.templateAndpipe"
        :label="'模板'+index"
        :key="outdata.key"
        :rules="{
      required: true, message: '不能为空', trigger: 'blur'}">
        <el-row :gutter="24">
          <el-col :span="9"><div class="grid-content bg-purple">
            <el-select v-model="outdata.pipeLineId" placeholder="请选择">
              <el-option
                v-for="item in allPipelineOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </div></el-col>
          <el-col :span="9"><div class="grid-content bg-purple">
            <el-select v-model="outdata.templateId" placeholder="请选择">
              <el-option
                v-for="item in allTemplateOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </div></el-col>
          <el-col :span="4"><div class="grid-content bg-purple">

            <el-button @click.prevent="removeDomain(outdata)">删除</el-button>
          </div></el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
        <el-button @click="addDomain">新增</el-button>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="innerVisible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>

  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        innerVisible: false,
        dataForm: {
          thresholdEntity: {
            id: 0,
            levelId: '',
            thresholdExpression: '',
            mostConsecutiveLosses: '',
            incontinuity: '',
            tenantId: 1,
            enable: 1
          },
          userGroupStr: [],
          templateAndpipe: []
        },
        allUsergroupOptions: [],
        allPipelineOptions: [],
        allTemplateOptions: [],
        leveloptions: [],
        projectServiceId: 0,
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        dataRule: {
          thresholdEntity: {
            level: [
              { required: true, message: 'level级别不能为空', trigger: 'blur' }
            ],
            thresholdExpression: [
              { required: true, message: '阈值表达式不能为空', trigger: 'blur' }
            ],
            mostConsecutiveLosses: [
              { required: true, message: '错误连续次数不能为空', trigger: 'blur' }
            ],
            incontinuity: [
              { required: true, message: '检查点内错误次数不能为空', trigger: 'blur' }
            ]
          }
        }
      }
    },
    methods: {
      // 初始化列表
      init (projectServiceId) {
        // level下拉框选型
        this.$http({
          url: this.$http.adornUrl(`/sys/sysdictitem/selectbydictypes`),
          method: 'post',
          data: this.$http.adornData(['threshold_level'], false)
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.leveloptions = data.dicMap.threshold_level
          }
        })
        this.getAllUserGroup()
        this.getAllTemplateAndPip()
        this.projectServiceId = projectServiceId || 0
        this.innerVisible = true
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/canary/canarybasetask/threshold/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'key': this.dataForm.key,
            'projectServiceId': this.projectServiceId
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.page.list
            this.totalPage = data.page.totalCount
          } else {
            this.dataList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
        })
      },
      addDomain () {
        this.dataForm.templateAndpipe.push({
          key: Date.now()
        })
      },
      removeDomain (item) {
        const index = this.dataForm.templateAndpipe.indexOf(item)
        if (index !== -1) {
          this.dataForm.templateAndpipe.splice(index, 1)
        }
      },
      // 表单提交
      dataFormSubmit () {
        console.log(this.dataForm)
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/canary/canarybasetask/threshold/${!this.dataForm.thresholdEntity.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData(this.dataForm
              )
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500
                  // onClose: () => {
                  //   this.innerVisible = false
                  //   this.$emit('refreshDataList')
                  // }
                })
              } else {
                this.$message.error(data.msg)
              }
            })
          }
        })
      },
      getAllUserGroup () {
        // 穿梭框左侧使用
        this.$http({
          url: this.$http.adornUrl(`/canary/canarybasetask/threshold/allusergroup`),
          method: 'post',
          data: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.allUsergroupOptions = data.allUserGroup
          }
        })
      },
      getAllTemplateAndPip () {
        this.$http({
          url: this.$http.adornUrl(`/canary/canarybasetask/threshold/alltemplateAndPipe`),
          method: 'post',
          data: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.allPipelineOptions = data.allPipelineEntities
            this.allTemplateOptions = data.allTemplateEntities
          }
        })
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getDataList()
      },
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      }
    }
  }
</script>
