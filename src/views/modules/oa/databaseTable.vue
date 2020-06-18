<template>
  <div>
    <el-form :inline="true">
      <el-form-item label="空间显示状态">
        <el-select placeholder="请选择" v-model="flag">
          <el-option v-for="item in flagList" :value="item.id" :key="item.id" :label="item.name"/>
        </el-select>
      </el-form-item>
      <el-form-item label="空间名">
        <el-input v-model="name" placeholder="空间名" clearable />
      </el-form-item>
      <el-form-item label="负责部门">
        <el-input v-model="departmentName" placeholder="负责部门" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchHandle()">查询</el-button>
        <el-button @click="resetHandle()">重置</el-button>
        <el-button type="success" @click="addOrUpdateHandle()">新增</el-button>
        <!-- <el-button type="info" @click="sureEfiltHandle()">确认修改</el-button> -->
      </el-form-item>
    </el-form>
    <el-table
      :data="newList" border
      v-loading="dataListLoading"
      style="width: 100%;"
      ref="multipleTable"
      @selection-change="handleSelectionChange"
      >
      <!-- <el-table-column
        type="selection"
        width="55">
      </el-table-column> -->
      <el-table-column
        prop="id"
        header-align="center"
        align="center"
        label="空间ID"/>
      <el-table-column
        prop="name"
        header-align="center"
        align="center"
        label="空间名"/>
      <el-table-column
        prop="flag"
        header-align="center"
        align="center"
        label="空间状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.flag === false" size="small" >启用</el-tag>
          <el-tag v-else size="small" type="warning">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="departmentName"
        header-align="center"
        align="center"
        label="负责部门"/>
      <el-table-column
        prop="headName"
        header-align="center"
        align="center"
        label="负责人"/>
      <el-table-column
        prop="createUser"
        header-align="center"
        align="center"
        label="创建人"/>
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        label="创建时间"/>
      <el-table-column header-align="center" align="center" width="200" label="操作">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="修改空间状态" placement="top">
            <el-button type="primary" size="mini" icon="el-icon-edit" circle @click="sureEfiltHandle(scope.row)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageNum"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper"/>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"/>
  </div>
</template>
<script>
import AddOrUpdate from './databaseTable-add-or-update'
import { databaseTableList, updatedatabase } from '@/api/oa/apply'

export default {
  data () {
    return {
      applyType: [],
      applyTypeId: '',
      applyTypeValue: '',
      flagList: [
        {id: 0, name: '启用'},
        {id: 1, name: '禁用'}
      ],
      flag: '',
      name: '',
      departmentName: '',
      dataList: [],
      pageNum: 1, // 当前页
      pageSize: 10, // 默认每页10条
      totalPage: 0,
      dataListLoading: false,
      addOrUpdateVisible: false,
      newList: [],
      dialogVisible: false,
      multipleSelection: [], // 存放表格选中项信息
      ids: ''
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
        flag: this.flag,
        name: this.name,
        departmentName: this.departmentName,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      databaseTableList(dataBody).then(({data}) => {
        this.totalPage = data.data.total
        this.newList = data.data.rows
        this.dataListLoading = false
        data.data.rows.forEach((row, index) => {
          if (row.flag != false) {
            setTimeout(() => {
              this.$refs.multipleTable.toggleRowSelection(this.newList[index])
            }, 1)
          }
        })
      })
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
      // var idArr = []
      // val.forEach((item) => {
      //   idArr.push(item.id)
      // })
      // this.ids = idArr.join(',')
    },
    // sureEfiltHandle () {
    //   const dataBody = {
    //     id: this.ids,
    //     flag: this.name
    //   }
    //   updatedatabase(dataBody).then(({data}) => {
    //     console.log(data, 'ppp')
    //   })
    // },
    sureEfiltHandle (val) {
      var falgType = ''
      if (val.flag === true) {
        falgType = false
      }
      if (val.flag === false) {
        falgType = true
      }
      this.$confirm(`确定修改表空间状态?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const dataBody = {
          id: val.id,
          flag: falgType
        }
        updatedatabase(dataBody).then(({data}) => {
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
      this.pageNum = 1
      this.getDataList()
    },
    // 当前页
    currentChangeHandle (val) {
      this.pageNum = val
      this.getDataList()
    },
    /** 查询 */
    searchHandle () {
      this.pageNum = 1
      this.getDataList()
    },
    /** 重置 */
    resetHandle () {
      this.pageNum = 1
      this.flag = ''
      this.spaceName = ''
      this.departmentName = ''
      this.getDataList()
    },
    // 新增 / 修改
    addOrUpdateHandle (id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    }
  }
}
</script>
<style scoped>
</style>