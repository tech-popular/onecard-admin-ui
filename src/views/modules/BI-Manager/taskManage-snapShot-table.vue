<template>
<div>
	<el-table :data="tableList" border	width="100%">
			 <el-table-column  prop="taskId"  header-align="center" align="center" label="任务ID"></el-table-column>
			 <el-table-column  prop="taskName"  header-align="center" align="center" label="任务名称"></el-table-column>
       <el-table-column  prop="requestedUser"  header-align="center" align="center"  label="负责人"></el-table-column>
			<el-table-column  prop="dependence"  header-align="center"  align="center"  label="有无依赖">
        <template slot-scope="scope">
          {{scope.row.dependence === 0 ? '有': '无'}}
        </template>
      </el-table-column>
			<el-table-column
        prop="startTime"
        header-align="center"
        align="center"
        label="本次执行时间">
      </el-table-column>
			<el-table-column
        prop="endTime"
        header-align="center"
        align="center"
        label="本次完成时间">
      </el-table-column>
      <el-table-column
        prop="exStatus"
        header-align="center"
        align="center"
        label="任务状态">
      </el-table-column>
			 <el-table-column
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button type="primary"  size="small" @click="addOrUpdateHandle(scope.row)">依赖快照</el-button>
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
      layout="total, sizes, prev, pager, next, jumper"
    ></el-pagination>
</div>
</template>
<script>
import { deepClone } from '@/utils'
export default {
  props: {
    dataApi: {
      type: Function,
      required: true
    },
    taskId: {
      required: true
    },
    taskType: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      tableList: [],
      pageNo: 1,
      pageSize: 10,
      totalPage: 0
    }
  },
  methods: {
    init () {
      this.$nextTick(() => {
        this.pageNo = 1
        this.pageSize = 10
        this.totalPage = 0
      })
      this.getDataList()
    },
    getDataList () {
      let params = {
        taskId: this.taskId,
        type: this.taskType,
        pageSize: this.pageSize,
        page: this.pageNo
      }
      this.dataApi(params).then(({ data }) => {
        if (data && data.code === 0) {
             this.tableList = deepClone(data.data.list)
             this.totalPage = data.data.totalCount
        }
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
    // 点击查看快照
    addOrUpdateHandle (row) {
      this.$emit('addTab', row)
    }
  }
}
</script>
