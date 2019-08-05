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
        <el-select v-model="dataForm.thresholdEntity.level" placeholder="请选择level级别">
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
                      }" :data="dataForm.allUsergroup" :filterable="true">
      </el-transfer>
      <hr>
      <!-- 通道 -->
      选择报警渠道
      <el-transfer v-model="dataForm.pipelieStr" :titles="['全部', '选中']" :props="{
                        key: 'id',
                        label: 'name'
                      }" :data="dataForm.allPipeline" :filterable="true">
      </el-transfer>
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
            level: '',
            thresholdExpression: '',
            mostConsecutiveLosses: '',
            incontinuity: '',
            tenantId: '',
            enable: ''
          },
          userGroupStr: [],
          pipelieStr: []
        },
        allUsergroup: [],
        allPipeline: [],
        leveloptions: [],
        projectServiceId: 0,
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        dataRule: {
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
        this.getAllUserAndPipe()
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
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/canary/canarybaseservicethreshold/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'serviceId': this.dataForm.serviceId,
                'level': this.dataForm.level,
                'thresholdExpression': this.dataForm.thresholdExpression,
                'mostConsecutiveLosses': this.dataForm.mostConsecutiveLosses,
                'incontinuity': this.dataForm.incontinuity,
                'tenantId': this.dataForm.tenantId,
                'enable': this.dataForm.enable
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.innerVisible = false
                    this.$emit('refreshDataList')
                  }
                })
              } else {
                this.$message.error(data.msg)
              }
            })
          }
        })
      },
      getAllUserAndPipe () {
        // 穿梭框左侧使用
        this.$http({
          url: this.$http.adornUrl(`/canary/canarybasetask/threshold/alluserandpipe`),
          method: 'post',
          data: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            console.log(data)
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
