<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm">
     <el-form-item label="系统类型: ">
        <el-select v-model="dataForm.type" clearable>
          <el-option label="新BI_PC端" value="0"></el-option>
          <el-option label="新BI_移动端端" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态: ">
        <el-select v-model="dataForm.status" clearable>
          <el-option label="启用" value="0"></el-option>
          <el-option label="禁用" value="1"></el-option>
        </el-select>
      </el-form-item>
        <el-button @click="searchData()">查询</el-button>
				<el-button  type="primary"  @click="addOrUpdateHandle()">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;">
      <el-table-column prop="id" header-align="center" align="center" label="ID"></el-table-column>
      <el-table-column prop="typeDesc" header-align="center" align="center" label="类型">
        <template slot-scope="scope">
         {{scope.row.systemId === 8 ? '新BI_PC端' : '新BI_移动端'}}
        </template>
      </el-table-column>
      <el-table-column prop="menuList" header-align="center" align="center" label="系统模块"></el-table-column>
      <el-table-column prop="receiveTypeDesc" header-align="center" align="center" label="接收方式">
        <template slot-scope="scope">
         {{scope.row.notifyType === '1' ? '钉钉消息' : '邮件'}}
        </template>
      </el-table-column>
      <el-table-column prop="createTime" header-align="center" align="center" label="申请时间"></el-table-column>
      <el-table-column prop="createUser" header-align="center" align="center" label="申请人"></el-table-column>
      <el-table-column prop="status" header-align="center" align="center" label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 0" size="small" type="danger">禁用</el-tag>
          <el-tag v-else size="small">启用</el-tag>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" width="150" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small"  @click="addOrUpdateHandle(scope.row.id)">查看</el-button>
					<el-button type="text" size="small"  @click="upOrDownHandle(scope.row.id)">{{scope.row.status === 0 ? '启用' :'禁用' }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="currPage"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper"
    ></el-pagination>
    <addOrUpdate v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></addOrUpdate>
  </div>
</template>
<style>
.input-with-select {
  width: 180px;
}
</style>
<script>
import { getList, subscriptionUpAndDown } from '@/api/dataGovernance/reportSubscribe'
import addOrUpdate from './reportSubscribe-add'
export default {
  data () {
    return {
      dataList: [],
      currPage: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      addOrUpdateVisible: false,
      dataForm: {
        status: '',
        type: ''
      },
      userid: sessionStorage.getItem('id'),
      username: sessionStorage.getItem('username'),
      isAdmin: sessionStorage.getItem('username') === 'admin'
    }
  },
  components: { addOrUpdate },
  activated () {
    this.getDataList()
  },
  mounted () {
  },
  methods: {
    // 获取数据列表
    getDataList () {
      this.dataListLoading = true
      let params = {
        'type': this.dataForm.type,
        'status': this.dataForm.status ? Number(this.dataForm.status) : '',
        'currPage': this.currPage,
        'pageSize': this.pageSize
      }
      getList(params).then(({ data }) => {
        if (data.code === 0 && data.data) {
          this.dataList = data.data.list
          this.totalPage = data.data.totalCount
          this.dataListLoading = false
        } else {
          this.dataList = []
          this.dataListLoading = false
          return this.$message.error(data.msg)
        }
      })
    },
    // 每页数
    sizeChangeHandle (val) {
      this.pageSize = val
      this.currPage = 1
      this.getDataList()
    },
    // 当前页
    currentChangeHandle (val) {
      this.currPage = val
      this.getDataList()
    },
    searchData () {
      this.currPage = 1
      this.getDataList()
    },
    // 新增 / 修改
    addOrUpdateHandle (id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    // 启用禁用
    upOrDownHandle (id) {
      subscriptionUpAndDown(id).then(({ data }) => {
        if (data && data.code === 0) {
          this.$message({
            message: '成功',
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
    }
  }
}
</script>
