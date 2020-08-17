<template>
  <el-dialog
    :close-on-click-modal="false"
    width="1000px"
    :append-to-body="true"
    title="新增依赖"
    :visible.sync="visible">
    <el-row :gutter="20">
      <el-col :span="11">
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <span>所有依赖</span>
            <!-- <el-button style="float: right;" size="mini" type="success">批量添加</el-button> -->
          </div>
          <el-table
              ref="multipleTable"
              :data="leftTableData"
              border
              @selection-change="handleSelectChange">
            <el-table-column header-align="center" align="center" type="selection" width="55"></el-table-column>
            <el-table-column header-align="center" align="center" prop="taskName" label="任务名称"></el-table-column>
            <el-table-column header-align="center" align="center" prop="taskSys" label="所属系统"></el-table-column>
          </el-table>
          <el-pagination
            @size-change="sizeChangeHandle"
            @current-change="currentChangeHandle"
            :current-page="pageNo"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageSize"
            :total="totalCount"
            style="margin-top:20px"
            layout="total, sizes, prev, pager, next, jumper" />
        </el-card>
      </el-col>
      <el-col :span="2" style="text-align:center">
        <el-button size="mini" type="primary" style="margin-top: 100px">添加至</el-button>
      </el-col>
      <el-col :span="11">
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <span>已选依赖</span>
            <el-button style="float: right;" size="mini" type="danger">批量删除</el-button>
          </div>
          <el-table
              ref="multipleTable"
              :data="rightTableData"
              border
              @selection-change="handleSelectChange">
            <el-table-column header-align="center" align="center" type="selection" width="55"></el-table-column>
            <el-table-column header-align="center" align="center" prop="taskName" label="任务名称"></el-table-column>
            <el-table-column label="操作" header-align="center" align="center">
                <template slot-scope="scope">
                  <a style="cursor: pointer" @click="deleteDependenceHandle(scope.$index, scope.row)">删除</a>
                </template>
              </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
    <div slot="footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  data () {
    return {
      visible: false,
      pageNo: 1, // 当前页
      pageSize: 10, // 默认每页10条
      totalCount: 0,
      leftTableData: [
        {
          taskName: 'mc_sqp_t_mal',
          taskSys: '大数据项目'
        },
        {
          taskName: 'mc_sqp_t_mal11',
          taskSys: '大数据项目1'
        },
        {
          taskName: 'mc_sqp_t_mal',
          taskSys: '大数据项目'
        },
        {
          taskName: 'mc_sqp_t_mal11',
          taskSys: '大数据项目1'
        }
      ],
      rightTableData: []
    }
  },
  methods: {
    init () {
      this.visible = true
    },
    handleSelectChange (val) {
      console.log(val)
    },
    deleteDependenceHandle () {
      console.log(123)
    },
    // 每页数
    sizeChangeHandle (page) {
      this.pageSize = page
      this.pageNo = 1
      this.getDataList()
    },
    // 当前页
    currentChangeHandle (page) {
      this.pageNo = page
      this.getDataList()
    }
  }
}
</script>
