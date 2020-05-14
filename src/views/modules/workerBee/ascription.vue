<template>
  <div>
    <el-form :inline="true" :model="dataForm" ref="dataForm">
      <el-form-item label="归属系统名称">
        <el-input v-model.trim="dataForm.sysName" placeholder="归属系统名称"
        onbeforepaste="clipboardData.setData('text',clipboardData.getData('text').replace(/\s/g,''))" clearable />
      </el-form-item>
      <el-form-item label="归属系统编码">
        <el-input v-model.trim="dataForm.sysCode" placeholder="归属系统编码"
        onbeforepaste="clipboardData.setData('text',clipboardData.getData('text').replace(/\s/g,''))" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchHandle()">查询</el-button>
        <el-button @click="resetHandle()">重置</el-button>
        <el-button type="primary" @click="addOrUpdateHandle()">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;">
      <el-table-column prop="sysName" header-align="center" align="center" label="归属系统名称"/>
      <el-table-column prop="sysCode" header-align="center" align="center" label="归属系统编码"/>

      <el-table-column prop="creator" header-align="center" align="center" label="创建者"/>
      <el-table-column prop="update" header-align="center" align="center" label="最近更新"/>
      <el-table-column prop="createTime" header-align="center" align="center" label="创建时间"/>
      <el-table-column prop="updateTime" header-align="center" align="center" label="最近更新时间"/>
      <el-table-column prop="remark" header-align="center" align="center" label="备注"/>
      <!-- <el-table-column header-align="center" align="center" width="200" label="操作" class="but">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit" circle @click="addOrUpdateHandle(scope.row.id)"></el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete" circle @click="deleteddialog(scope.row.id)"></el-button>
        </template>
      </el-table-column> -->
    </el-table>
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
  import AddOrUpdate from './ascription-add-or-update'
  import { workFlowList, deleteWorkFlow } from '@/api/workerBee/workFlow'

  export default {
    data () {
      return {
        visible: false,
        deleteVisible: false,
        visibleEdit: false,
        flowTaskFlowVisible: false,
        flowTaskFlow: false,
        dataForm: {
          workerBee: '',
          id: '',
          flowCode: ''
        },
        dataList: [],
        workerBee: '',
        list: '',
        pageNum: 1, // 当前页
        pageSize: 10, // 默认每页10条
        totalPage: 0,
        dataListLoading: false,
        sketchMap: false,
        addOrUpdateVisible: false,
        deletedId: ''
      }
    },
    components: {
      AddOrUpdate
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
              'name': this.dataForm.workerBee,
              'id': this.dataForm.id,
              'flowCode': this.dataForm.flowCode
            }
            workFlowList(dataBody, false).then(({data}) => {
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
          this.$refs.addOrUpdate.init(id)
        })
      },
      // 删除弹窗获取值
      deleteddialog (value) {
        this.deletedId = value
        this.deleteVisible = true
      },
      // 删除
      deleted () {
        const dataBody = this.deletedId
        deleteWorkFlow(dataBody, false).then(({data}) => {
          if (data && data.message === 'success') {
            this.deleteVisible = false
            this.getDataList()
          }
        })
      },
      /** 查询 */
      searchHandle () {
        this.pageNum = 1
        this.getDataList()
      },
      /** 重置 */
      resetHandle () {
        this.pageNum = 1
        this.dataForm.workerBee = ''
        this.dataForm.id = ''
        this.dataForm.flowCode = ''
        this.getDataList()
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