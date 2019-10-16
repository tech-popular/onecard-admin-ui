<template>
  <el-dialog
    title="配置阈值"
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
          <el-button  type="primary" @click="addNewThreshold()">新增</el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="dataList"
        border
        v-loading="dataListLoading"
        style="width: 100%;">
        <el-table-column
          prop="id"
          header-align="center"
          align="center"
          label="主键Id">
        </el-table-column>
        <el-table-column
          prop="levelId"
          header-align="center"
          align="center"
          label="level级别">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.levelId === 1" size="small" type="warning">轻</el-tag>
            <el-tag v-if="scope.row.levelId === 2" size="small" type="info">中</el-tag>
            <el-tag v-if="scope.row.levelId === 3" size="small" type="danger" >重</el-tag>
          </template>
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
            <el-button type="text" size="small" @click="getThreshold(scope.row.id)">加载</el-button>
            <el-button type="text" size="small" @click="deleteThreshold(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--表单-->
    <br>
    <hr>
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
      <el-form-item label="level级别" prop="level">
        <el-select v-model="dataForm.thresholdEntity.levelId" placeholder="请选择level级别">
          <el-option v-for="item in leveloptions" :key="Number(item.value)" :label="item.label" :value="Number(item.value)">
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
      配置用户群组
      <el-transfer v-model="dataForm.userGroupStr" :titles="['全部', '选中']" :props="{
                        key: 'id',
                        label: 'name'
                      }" :data="allUsergroupOptions" :filterable="true">
      </el-transfer>
      <hr>
      <!-- 通道 -->
      <el-form-item label="配置模板和通道关系"></el-form-item>
      <el-form-item
        v-for="(outdata, index) in dataForm.templateAndpipe"
        :label="'通道和模板'+index"
        :key="outdata.key"
        :rules="{
      required: true, message: '不能为空', trigger: 'blur'}">
        <el-row :gutter="24">
          <el-col :span="2">
            <div class="grid-content bg-purple">
              模板
            </div>
          </el-col>
          <el-col :span="7">
            <div class="grid-content bg-purple">
              <el-select v-model="outdata.templateId" placeholder="请选择">
                <el-option
                  v-for="item in allTemplateOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :span="2">
            <div class="grid-content bg-purple">
              通道
            </div>
          </el-col>
          <el-col :span="7" >
            <div class="grid-content bg-purple">
              <el-select v-model="outdata.pipeLineId" placeholder="请选择">
                <el-option
                  v-for="item in allPipelineOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </div>
          </el-col>

          <el-col :span="4">
            <div class="grid-content bg-purple">
            <el-button @click.prevent="removeDomain(outdata)">删除</el-button>
          </div>
          </el-col>
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
<style>
  .el-transfer-panel {
    width: 300px;
  }
</style>

<script>
  export default {
    data () {
      return {
        innerVisible: false,
        dataForm: {
          thresholdEntity: {
            id: '',
            levelId: '',
            thresholdExpression: '',
            mostConsecutiveLosses: '',
            incontinuity: '',
            tenantId: 1,
            enable: 1
          },
          userGroupStr: [],
          templateAndpipe: [],
          projectServiceId: 0
        },
        allUsergroupOptions: [],
        allPipelineOptions: [],
        allTemplateOptions: [],
        leveloptions: [],
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
        this.dataForm.projectServiceId = projectServiceId
        this.clearDataForm()
        // level下拉框选型
        this.getAllLevel()
        this.getAllUserGroup()
        this.getAllTemplateAndPip()
        this.innerVisible = true
        this.dataListLoading = true
        this.getListData()
        this.dataListLoading = false
      },
      getListData () {
        this.$http({
          url: this.$http.adornUrl('/canary/canarybasetask/threshold/list'),
          method: 'get',
          params: this.$http.adornParams({
            'key': this.dataForm.key,
            'projectServiceId': this.dataForm.projectServiceId
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.page
          } else {
            this.dataList = []
          }
        })
      },
      getThreshold (id) {
        this.clearDataForm()
        this.getAllUserGroup()
        this.getAllTemplateAndPip()
        this.$http({
          url: this.$http.adornUrl('/canary/canarybasetask/threshold/info/' + id),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataForm = data.baseThresHoldDTO
          } else {
            this.clearDataForm()
          }
        })
        this.getAllLevel()
      },
      clearDataForm () {
        this.dataForm.thresholdEntity.id = ''
        this.dataForm.thresholdEntity.levelId = ''
        this.dataForm.thresholdEntity.thresholdExpression = ''
        this.dataForm.thresholdEntity.mostConsecutiveLosses = ''
        this.dataForm.thresholdEntity.incontinuity = ''
        this.dataForm.thresholdEntity.tenantId = 1
        this.dataForm.thresholdEntity.enable = 1
        this.dataForm.userGroupStr = []
        this.dataForm.templateAndpipe = []
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
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/canary/canarybasetask/threshold/${!this.dataForm.thresholdEntity.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData(this.dataForm
              )
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message('保存成功')
                this.getListData()
                this.clearDataForm()
                alert('保存成功')
              } else {
                this.$message.error(data.msg)
                alert('操作失败')
              }
            })
          }
        })
      },
      addNewThreshold () {
        this.clearDataForm()
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
      getAllLevel () {
        this.$http({
          url: this.$http.adornUrl(`/sys/sysdictitem/selectbydictypes`),
          method: 'post',
          data: this.$http.adornData(['threshold_level'], false)
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.leveloptions = data.dicMap.threshold_level
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
      deleteThreshold (id) {
        this.$http({
          url: this.$http.adornUrl('/canary/canarybasetask/threshold/delete/' + id),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500
            })
            this.getListData()
          } else {
            this.clearDataForm()
          }
        })
      }
    }
  }
</script>
