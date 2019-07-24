<template>
  <el-dialog
    :visible.sync="visible"
    >
  <div class="mod-config">
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      style="width: 100%;">
      <el-table-column
        prop="taskId"
        header-align="center"
        align="center"
        label="任务Id">
      </el-table-column>
      <el-table-column
        prop="taskStatus"
        header-align="center"
        align="center"
        label="任务状态">
      </el-table-column>
      <el-table-column
        prop="taskStatusDesc"
        header-align="center"
        align="center"
        label="任务描述">
      </el-table-column>
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        label="创建时间">
      </el-table-column>
      <el-table-column
        prop="updateTime"
        header-align="center"
        align="center"
        label="更新时间">
      </el-table-column>
    </el-table>
  </div>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        visible: false,
        dataList: [],
        taskId: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false
      }
    },
    methods: {
      // 获取数据列表
      init (id) {
        this.visible = true
        this.dataListLoading = true
        this.$nextTick(() => {
          if (id) {
            this.$http({
              url: this.$http.adornUrl(`/canary/first/es/` + id),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataList = data.list
                console.log(this.dataList)
              } else {
                this.dataList = []
              }
            })
          }
        })
        this.dataListLoading = false
      }
    }
  }
</script>
