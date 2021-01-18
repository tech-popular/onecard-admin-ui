<template>
<div>
	<el-table :data="list" border	width="100%">
			 <el-table-column  prop="id"  header-align="center" align="center" label="任务名称"></el-table-column>
			 <el-table-column  prop="name"  header-align="center" align="center" label="系统名称"></el-table-column>
			 <el-table-column  prop="type"  header-align="center"  align="center"  label="任务类型"></el-table-column>
			 <el-table-column  prop="person"  header-align="center" align="center"  label="负责人"></el-table-column>
			 <el-table-column
        prop="time"
        header-align="center"
        align="center"
        label="时间触发">
      </el-table-column>
			<el-table-column
        prop="ishas"
        header-align="center"
        align="center"
        label="有无依赖">
      </el-table-column>
			<el-table-column
        prop="this"
        header-align="center"
        align="center"
        label="本次执行时间">
      </el-table-column>
			<el-table-column
        prop="wancheng"
        header-align="center"
        align="center"
        label="本次完成时间">
      </el-table-column>
			<el-table-column
        prop="next"
        header-align="center"
        align="center"
        label="下次执行时间">
      </el-table-column>
			 <el-table-column
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row)">依赖快照</el-button>
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
      layout="total, sizes, prev, pager, next, jumper"
    ></el-pagination>
</div>
</template>
<script>
export default {
  data () {
    return {
      list: [],
      id: '',
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0
    }
  },
  methods: {
    init () {
      this.pageIndex = 1
      this.pageSize = 10
      this.totalPage = 0
      this.getDataList()
    },
    getDataList () {
      console.log('11111')
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
    },
    // 点击查看快照
    addOrUpdateHandle (row) {
      console.log('row: ', row)
      this.$emit('addTab', row)
    }
  }
}
</script>
