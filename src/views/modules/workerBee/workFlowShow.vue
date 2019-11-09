<template>
  <div>
    <el-form :inline="true" :model="dataForm" :rules="rules" ref="dataForm">
      <el-form-item label="工作流">
        <el-input v-model="dataForm.workerBee" placeholder="工作流" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchHandle()">查询</el-button>
        <el-button type="primary" @click="resetHandle()">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;">
      <el-table-column prop="ID" header-align="center" align="center" label="工作流编号"/>
      <el-table-column prop="workerBee" header-align="center" align="center" label="工作流"/>
      <el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
        <template slot-scope="scope">
          <!-- <el-button v-if="isAuth('cash:instmanage:update')" type="text" @click="clickSketchMap(scope.row)">查看工作流</el-button> -->
          <el-button type="text" @click="clickSketchMap(scope.row)">查看工作流</el-button>
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
      layout="total, sizes, prev, pager, next, jumper"/>
    <!-- 弹窗查看示意图 -->
    <el-dialog
      title="工作流预览"
      :close-on-click-modal="false"
      :before-close="handleClosede"
      width="75%"
      :visible.sync="visible">
      <!-- <showFlow v-if="sketchMap" ref="showFlow" :dataAllList="dataAllList" @refreshDataList="getDataList"/> -->
      <showFlow :dataAllList="dataAllList" @refreshDataList="getDataList"/>
    </el-dialog>
  </div>
</template>

<script>
  import showFlow from './workflowChart'
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          workerBee: ''
        },
        dataList: [
          {
            ID: '10001',
            workerBee: '工作流1'
          },
          {
            ID: '10002',
            workerBee: '工作流2'

          }],
        dataAllList: {},
        workerBee: '',
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        sketchMap: false
      }
    },
    components: {
      showFlow
    },
    methods: {
      // 获取数据列表
      // getDataList () {
      //   this.$refs['dataForm'].validate((valid) => {
      //     if (valid) {
      //       this.dataListLoading = true
      //       this.$http({
      //         url: this.$http.adornUrl('/cash/flowchart/list'),
      //         method: 'get',
      //         params: this.$http.adornParams({
      //           'page': this.pageIndex,
      //           'limit': this.pageSize,
      //           'phone': this.dataForm.phone,
      //           'startTime': this.dataForm.startDataTime ? this.dataForm.startDataTime : '',
      //           'endTime': this.dataForm.endDataTime ? this.dataForm.endDataTime : ''
      //         })
      //       }).then(({data}) => {
      //         if (data && data.code === 0) {
      //           this.dataList = data.page.list
      //           this.totalPage = data.page.totalCount
      //         } else {
      //           this.dataList = []
      //           this.totalPage = 0
      //         }
      //         this.dataListLoading = false
      //       })
      //     }
      //   })
      // },
  
      /** 查看示意图接口 */
      // getDataFlowList () {
      //   this.$http({
      //     url: this.$http.adornUrl(`/cash/flowchart/showphone`),
      //     method: 'post',
      //     data: this.$http.adornData({
      //       'phone': this.phone,
      //       'createTime': this.createTime,
      //       'serialNumber': this.serialNumber
      //     })
      //   }).then(({data}) => {
      //     if (data && data.code === 0) {
      //       this.sketchMap = true
      //       this.visible = true
      //       this.sketchMap = true
      //       this.dataAllList = data.list
      //     } else {
      //       return false
      //     }
      //   })
      // },
  
      /** 查看示意图 */
      clickSketchMap (value) {
        this.visible = true
        this.workerBee = value.workerBee
        // this.getDataFlowList()
      },
      /** 查询 */
      searchHandle () {
        this.pageIndex = 1
        this.getDataList()
      },
      /** 重置 */
      resetHandle () {
        this.pageIndex = 1
        this.dataList = []
      },
      // 取消或关闭流程图弹窗
      datano () {
        this.handleClosede()
      },
      handleClosede () {
        this.dataAllList = {}
        this.visible = false
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
      }
    }
  }
</script>
<style scoped>
  .toZhi {
    line-height: 36px;
    margin-right: 8px;
  }
</style>