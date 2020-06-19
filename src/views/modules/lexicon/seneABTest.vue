<template>
  <div>
    <el-form :inline="true" :model="dataForm" :rules="dataRule" ref="dataForm">
      <el-form-item label="实验场景" prop="type">
        <el-cascader
          @change="testSech"
          style="width: 100%"
          :props="props"
          v-model="dataForm.type"
          :options="typeList">
        </el-cascader>
      </el-form-item>
      <el-form-item label="策略类型" prop="strategyType">
        <el-select filterable v-model="dataForm.strategyType" placeholder="请选择策略类型" style="width:100%">
          <el-option v-for="item in strategyTypeList" :value="item.baseValue" :key="item.baseValue" :label="item.baseName"/>
        </el-select>
      </el-form-item>
      <el-form-item label="实验状态">
        <el-select filterable v-model="dataForm.testStatus" placeholder="请选择实验状态" style="width:100%" clearable>
          <el-option v-for="item in testStatusTypeList" :value="item.id" :key="item.id" :label="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="实验名称">
        <el-input v-model="dataForm.testName" placeholder="请选择实验名称" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchHandle()">查询</el-button>
        <el-button @click="resetHandle()">重置</el-button>
        <el-button type="primary" @click="addOrUpdateHandle()">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList" border
      v-loading="dataListLoading"
      style="width: 100%;">
      <el-table-column
        prop="id"
        header-align="center"
        align="center"
        label="实验ID"/>
      <el-table-column
        prop="experimentName"
        header-align="center"
        align="center"
        label="实验名称"
        width="150px"/>
      <el-table-column
        prop="experimentSceneId"
        header-align="center"
        align="center"
        label="实验场景"
        width="150px"/>
       <el-table-column
        prop="strategyType"
        header-align="center"
        align="center"
        label="策略类型"
        width="150px"/>
      <el-table-column
        prop="enable"
        header-align="center"
        align="center"
        label="实验状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.experimentStatus === '开启'" size="small" >启用</el-tag>
          <el-tag v-else size="small" type="danger">停用</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="onlineTime"
        header-align="center"
        align="center"
        label="实验启用时间"/>
      <el-table-column
        prop="offlineTime"
        header-align="center"
        align="center"
        label="实验停用时间"/>
      <el-table-column
        prop="createUser"
        header-align="center"
        align="center"
        label="创建人"
        width="150px"/>
      <el-table-column header-align="center" align="center" width="200" label="操作">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="查看" placement="top">
            <el-button type="success" size="mini" icon="el-icon-view" circle @click="lookHandle(scope.row.id,'look', scope.row.type)"></el-button>
          </el-tooltip>
          <!-- <el-tooltip class="item" effect="dark" content="查看数据报表" placement="top">
            <el-button type="primary" size="mini" icon="el-icon-document" circle @click="lookHandle(scope.row.id)"></el-button>
          </el-tooltip> -->
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageNo"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper"/>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"/>
  </div>
</template>

<script>
  import AddOrUpdate from './seneABTest-add-or-update'
  import { beeTaskList, getSceneDropDown, showStrategyDropDown } from '@/api/lexicon/ABTest'
  export default {
    data () {
      return {
        props: {
          multiple: false,
          checkStrictly: false,
          label: 'sceneName',
          value: 'sceneType'
        },
        dataForm: {
          type: [],
          strategyType: '',
          testStatus: '',
          testName: '',
          experimentSceneId: ''
        },
        dataRule: {
          type: [
            { required: true, message: '请选择实验场景', trigger: 'blur' }
          ],
          strategyType: [
            { required: true, message: '请选择策略类型', trigger: 'blur' }
          ]
        },
        strategyTypeList: [
          {id: 0, value: 'leixing1'},
          {id: 1, value: 'leixing2'}
        ],
        testStatusTypeList: [
          {id: 0, value: '停用'},
          {id: 1, value: '启用'}
        ],
        typeList: [],
        dataList: [],
        pageNo: 1, // 当前页
        pageSize: 10, // 默认每页10条
        totalPage: 0,
        dataListLoading: false,
        addOrUpdateVisible: false
      }
    },
    components: {
      AddOrUpdate
    },
    activated () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        const dataBody = {
          'pageNo': this.pageNo,
          'pageSize': this.pageSize,
          'experimentName': this.dataForm.testName,
          'experimentSceneId': this.dataForm.experimentSceneId,
          'experimentStatus': this.dataForm.testStatu,
          'strategyType': this.dataForm.strategyType
        }
        beeTaskList(dataBody).then(({data}) => {
          if (data && data.code === 0) {
            this.dataListLoading = false
            this.dataList = data.data.list
            this.totalPage = data.data.totalCount
          } else {
            this.dataList = []
            this.totalPage = 0
            this.$message.error(data.msg)
          }
        })
        getSceneDropDown().then(({data}) => {
          this.typeList = data.data
        })
        showStrategyDropDown().then(({data}) => {
          this.strategyTypeList = data.data.strategyScenes
        })
      },
      testSech (val) {
        this.dataForm.experimentSceneId = val[1]
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageNo = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageNo = val
        this.getDataList()
      },
       /** 查询 */
      searchHandle () {
        this.pageNo = 1
        this.getDataList()
      },
      /** 重置 */
      resetHandle () {
        this.pageNo = 1
        this.dataForm.type = []
        this.dataForm.testName = ''
        this.dataForm.experimentSceneId = ''
        this.dataForm.testStatus = ''
        this.getDataList()
      },
      // 新增 / 修改
      addOrUpdateHandle (id, val, type) {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.addOrUpdateVisible = true
            this.$nextTick(() => {
              this.$refs.addOrUpdate.init(id, val, type, this.dataForm.type, this.dataForm.strategyType)
            })
          }
        })
      },
      // 查看
      lookHandle (id, val, type) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id, val, type, this.dataForm.type)
        })
      }
    }
  }
</script>
<style scoped>
  .el-button+.el-button{
    margin: 0 !important;
  }
</style>