<template>
  <div>
    <el-form :inline="true" :model="dataForm" ref="dataForm">
      <el-form-item label="策略ID">
        <el-input v-model="dataForm.sacherId" placeholder="策略ID" clearable />
      </el-form-item>
      <el-form-item label="策略名称">
        <el-input v-model="dataForm.sacherName" placeholder="策略名称" clearable />
      </el-form-item>
      <el-form-item label="策略场景">
        <el-cascader
          style="width: 100%"
          :props="props"
          v-model="dataForm.type"
          clearable
          :options="typeList">
        </el-cascader>
        <!-- <el-select filterable v-model="dataForm.type" placeholder="请选择策略场景" clearable>
          <el-option v-for="item in typeList" :value="item.baseValue" :key="item.baseValue" :label="item.baseName"/>
        </el-select> -->
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
        label="策略ID"/>
      <el-table-column
        prop="strategyName"
        header-align="center"
        align="center"
        label="策略名称"
        width="150px"/>
      <el-table-column
        prop="strategyScene"
        header-align="center"
        align="center"
        label="策略场景"/>
      <el-table-column
        prop="strategyLevel"
        header-align="center"
        align="center"
        label="策略层级"/>
      <el-table-column
        prop="strategyType"
        header-align="center"
        align="center"
        label="策略类型"/>
      <el-table-column
        prop="enable"
        header-align="center"
        align="center"
        label="登陆状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.loginStatus === '已登录'" size="small" >已登录</el-tag>
          <el-tag v-else size="small" type="danger">未登录</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="createUser"
        header-align="center"
        align="center"
        label="创建人"
        width="150px"/>
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        label="创建时间"/>
      <el-table-column header-align="center" align="center" width="200" label="操作">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="复制" placement="top">
            <el-button type="primary" size="mini" icon="el-icon-document-copy" circle @click="addOrUpdateHandle(scope.row.id)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="查看" placement="top">
            <el-button type="success" size="mini" icon="el-icon-view" circle @click="addOrUpdateHandle(scope.row.id,'look', scope.row.strategyType)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button type="danger" size="mini" icon="el-icon-delete" circle @click="deleteHandle(scope.row.id)"></el-button>
          </el-tooltip>
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
  import AddOrUpdate from './strategy-add-or-update'
  import { beeTaskList, deleteBeeTask, getSceneDropDown } from '@/api/lexicon/strategy'
  export default {
    data () {
      return {
        props: {
          multiple: false,
          checkStrictly: true,
          label: 'sceneName',
          value: 'sceneType',
          children: ''
        },
        dataForm: {
          sacherId: '',
          sacherName: '',
          type: []
        },
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
          'id': this.dataForm.sacherId,
          'strategyName': this.dataForm.sacherName,
          'strategyScene': this.dataForm.type
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
      },
      // 删除
      deleteHandle (id) {
        this.$confirm(`确定删除操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const dataBody = id
          deleteBeeTask(dataBody).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getDataList()
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        })
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
        this.dataForm = []
        this.getDataList()
      },
      // 新增 / 修改
      addOrUpdateHandle (id, val, type) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id, val, type)
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