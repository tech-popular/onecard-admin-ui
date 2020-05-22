<template>
  <div>
    <el-form :inline="true" :model="dataForm" ref="dataForm">
      <el-form-item label="数据源类型">
        <el-select filterable v-model="dataForm.type" placeholder="请选择数据源类型" @change='clickType'>
          <el-option v-for="item in typeList" :value="item.value" :key="item.value" :label="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item>
        <!-- <el-button type="primary" @click="searchHandle()">查询</el-button> -->
        <!-- <el-button @click="resetHandle()">重置</el-button> -->
        <el-button type="primary" @click="addOrUpdateHandle()">新增</el-button>
      </el-form-item>
    </el-form>
    <!-- mysqlTable -->
    <mysql-table v-if="dataForm.type === 'mysql/oracle'" @addOrUpdateHandle="addOrUpdateHandle" @deleteddialog="deleteddialog" :dataList='dataList'/>
    <!-- redisTable -->
    <redis-table v-if="dataForm.type === 'redis'" @addOrUpdateHandle="addOrUpdateHandle" @deleteddialog="deleteddialog" :dataList='dataList'/>
    <!-- redisTable -->
    <cassandra-table v-if="dataForm.type === 'cassandra'" @addOrUpdateHandle="addOrUpdateHandle" @deleteddialog="deleteddialog" :dataList='dataList'/>
    <!-- hbase -->
    <hbase-table v-if="dataForm.type === 'hbase'" @addOrUpdateHandle="addOrUpdateHandle" @deleteddialog="deleteddialog" :dataList='dataList'/>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageNum"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper"/>
    <!-- 删除弹窗 -->
    <el-dialog
      title="删除"
      :visible.sync="deleteVisible"
      width="30%">
      <span>确定删除吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleted()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"/>
  </div>
</template>

<script>
  import AddOrUpdate from './dataType-add-or-update'
  import MysqlTable from './dataTypeChailTable/dataType-mysql'
  import RedisTable from './dataTypeChailTable/dataType-redis'
  import CassandraTable from './dataTypeChailTable/dataType-cassandra'
  import HbaseTable from './dataTypeChailTable/dataType-hbase'
  import { dataTypeList, deleteDatdType } from '@/api/workerBee/dataType'

  export default {
    data () {
      return {
        visible: false,
        deleteVisible: false,
        dataForm: {
          type: 'mysql/oracle'
        },
        typeList: [
          {id: 1, value: 'mysql/oracle'},
          {id: 2, value: 'redis'},
          {id: 3, value: 'hbase'},
          {id: 4, value: 'cassandra'}
        ],
        dataList: [],
        pageNum: 1, // 当前页
        pageSize: 10, // 默认每页10条
        totalPage: 0,
        addOrUpdateVisible: false,
        deletedId: ''
      }
    },
    components: {
      AddOrUpdate,
      MysqlTable,
      RedisTable,
      CassandraTable,
      HbaseTable
    },
    mounted () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.dataListLoading = true
            const dataBody = {
              'pageNum': this.pageNum,
              'pageSize': this.pageSize,
              'type': this.dataForm.type
            }
            dataTypeList(dataBody, false).then(({data}) => {
              if (data && data.message === 'success') {
                this.dataList = data.data.list
                this.totalPage = data.data.totalCount
              } else {
                this.dataList = []
                this.totalPage = 0
              }
              this.dataListLoading = false
            })
          }
        })
      },
      // 新增 / 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id, this.dataForm.type)
        })
      },
      // 删除弹窗获取值
      deleteddialog (value) {
        this.deletedId = value
        this.deleteVisible = true
      },
      // 删除
      deleted () {
        const dataBody = {
          id: this.deletedId,
          type: this.dataForm.type
        }
        deleteDatdType(dataBody, false).then(({data}) => {
          if (data && data.message === 'success') {
            this.deleteVisible = false
            this.getDataList()
          }
        })
      },
      // 改变类型
      clickType (value) {
        console.log(value)
  
        this.dataForm.type = value
        this.getDataList()
      },
      /** 查询 */
      // searchHandle () {
      //   this.pageNum = 1
      //   this.getDataList()
      // },
      /** 重置 */
      // resetHandle () {
      //   this.pageNum = 1
      //   this.dataForm.type = ''
      //   this.getDataList()
      // },
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
      }
    }
  }
</script>
<style scoped>
  .el-button+.el-button{
    margin: 0 !important;
  }
  .toZhi {
    line-height: 36px;
    margin-right: 8px;
  }
  .goback{
    position: absolute;
    right: 50px;
    top:20px;
    font-size: 25px;
    cursor:pointer;
  }
</style>