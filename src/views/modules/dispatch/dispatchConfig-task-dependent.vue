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
          <div slot="header" class="clearfix" style="display:flex">
            <span style="width: 150px">所有依赖</span>
            <el-input v-model="leftSearchText" size="mini" placeholder="请输入搜索关键字">
              <el-button slot="append" icon="el-icon-search" @click="searchTableHandle"></el-button>
            </el-input>
          </div>
          <el-table
              ref="multipleLeftTable"
              :data="leftTableData"
              border
              @selection-change="handleLeftSelectChange">
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
        <el-button size="mini" type="primary" style="margin-top: 100px" @click="addToRight">添加至</el-button>
      </el-col>
      <el-col :span="11">
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <span>已选依赖</span>
            <el-button style="float: right;" size="mini" type="danger" @click="multiDeleteHandle">批量删除</el-button>
          </div>
          <el-table
              ref="multipleRightTable"
              :data="rightTableData"
              border
              @selection-change="handleRightSelectChange">
            <el-table-column header-align="center" align="center" type="selection" width="55"></el-table-column>
            <el-table-column header-align="center" align="center" prop="taskName" label="任务名称"></el-table-column>
            <el-table-column label="操作" header-align="center" align="center">
                <template slot-scope="scope">
                  <a style="cursor: pointer" @click="deleteDependenceHandle(scope.$index)">删除</a>
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
      leftSearchText: '',
      leftSelectedData: [],
      rightSelectedData: [],
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
          taskName: 'mc_sqp_t_mal2',
          taskSys: '大数据项目2'
        },
        {
          taskName: 'mc_sqp_t_mal13',
          taskSys: '大数据项目3'
        }
      ],
      rightTableData: []
    }
  },
  methods: {
    init () {
      this.visible = true
    },
    // 左侧搜索功能
    searchTableHandle () {
      console.log(this.leftSearchText)
    },
    handleLeftSelectChange (val) {
      this.leftSelectedData = val
    },
    handleRightSelectChange (val) {
      this.rightSelectedData = val
    },
    // 单独删除
    deleteDependenceHandle (index) {
      this.rightTableData.splice(index, 1)
    },
    // 批量删除
    multiDeleteHandle () {
      if (!this.rightSelectedData.length) return
      let arr = this.filterArr(this.rightSelectedData, this.rightTableData)
      this.rightTableData = arr
    },
    // 添加到右侧
    addToRight () {
      if (!this.leftSelectedData.length) return
      if (!this.rightTableData.length) {
        this.rightTableData = this.leftSelectedData
      } else {
        this.rightTableData = this.unique(this.rightTableData.concat(this.leftSelectedData))
      }
      this.$refs.multipleLeftTable.clearSelection()
    },
    // 取两个对象数组的并集且去重
    unique (arr) {
      const res = new Map()
      return arr.filter((arr) => !res.has(arr.taskName) && res.set(arr.taskName, 1))
    },
    // 从一个对象数组中过滤过另一个对象数组的内容
    filterArr (a, b) {
      return [...b].filter(x => [...a].every(y => y.taskName !== x.taskName))
    },
    dataFormSubmit () {
      console.log(this.rightTableData)
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
