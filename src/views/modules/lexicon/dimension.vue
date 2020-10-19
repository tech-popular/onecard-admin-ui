<template>
  <div>
    <el-form :inline="true" :model="dataForm" ref="dataForm">
      <el-form-item>
        <el-button type="primary" @click="searchHandle()">查询</el-button>
        <el-button @click="updateToRedisHandle()">一键更新到redis</el-button>
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
        label="来源ID"/>
      <el-table-column
        prop="dimensionName"
        header-align="center"
        align="center"
        label="召回源名称"
        width="150px"/>
      <el-table-column
        prop="dimensionEnglishName"
        header-align="center"
        align="center"
        label="召回源英文名称"/>
      <el-table-column
        prop="dimensionType"
        header-align="center"
        align="center"
        label="类型">
      <template slot-scope="scope">
        <el-tag v-if="scope.row.dimensionType === 0" >召回</el-tag>
        <el-tag v-else="scope.row.dimensionType === 1" >排序</el-tag>
      </template>
      </el-table-column>
      <el-table-column
        prop="recSourceType"
        header-align="center"
        align="center"
        label="召回源类型">
      <template slot-scope="scope">
        <el-tag v-if="scope.row.recSourceType == 0" >算法</el-tag>
        <el-tag v-if="scope.row.recSourceType == 1" >非算法</el-tag>
      </template>
      </el-table-column>
      <el-table-column
        prop="prefixKey"
        header-align="center"
        align="center"
        label="常量部分 前缀"/>
      <el-table-column
        prop="suffixKeys"
        header-align="center"
        align="center"
        label="后缀"/>
      <el-table-column
        prop="serviceParams"
        header-align="center"
        align="center"
        label="service服务入参"/>
      <el-table-column
        prop="expressions"
        header-align="center"
        align="center"
        label="维度变量表达式"/>
      <el-table-column
        prop="type"
        header-align="center"
        align="center"
        label="后缀的生成类型"/>
      <el-table-column
      prop="status"
      header-align="center"
      align="center"
      label="状态">
      <template slot-scope="scope">
        <el-tag v-if="scope.row.status === 1" >启用</el-tag>
        <el-tag v-if="scope.row.status === 0" >非启用</el-tag>
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
         <el-tooltip class="item" effect="dark" content="修改" placement="top">
            <el-button type="success" size="mini" icon="el-icon-edit" circle @click="addOrUpdateHandle(scope.row.id,'edit')"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top" >
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
  import AddOrUpdate from './dimension-add-or-update'
  import { beeTaskList, deleteBeeTask, updateToRedis } from '@/api/lexicon/dimension'
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
      /** 更新到redis */
      updateToRedisHandle() {
        updateToRedis().then(({data}) => {
          if (data && data.code === 0) {
            this.$message.info(data.msg)
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      // 新增 / 修改
      addOrUpdateHandle (id, val) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id, val)
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
