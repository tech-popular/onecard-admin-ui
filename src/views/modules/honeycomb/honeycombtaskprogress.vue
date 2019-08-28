<template>
  <el-dialog
    title="展示最新10条"
    :visible.sync="visible">
    <span data-align="right">
    <el-button @click="refreshData()" type="danger" align="right" round>刷新</el-button>
    <el-button @click="visible = false" type="primary" align="right" round>关闭</el-button>
    </span>
    <br>
  <div class="mod-config">
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      style="width: 100%;">
      <el-table-column
        prop="task_id"
        header-align="center"
        align="center"
        label="任务Id"
        width="50">
      </el-table-column>
      <el-table-column
        prop="task_status"
        header-align="center"
        align="center"
        label="任务状态">
      </el-table-column>
      <el-table-column
        prop="task_status_desc"
        header-align="center"
        align="center"
        label="任务描述">
      </el-table-column>
      <el-table-column
        prop="remark"
        header-align="center"
        align="center"
        label="任务描述">
      </el-table-column>
      <el-table-column
        prop="create_time"
        header-align="center"
        align="center"
        label="创建时间"
        width="250">
      </el-table-column>
      <el-table-column
        prop="update_time"
        header-align="center"
        align="center"
        label="更新时间"
        width="250">
      </el-table-column>
    </el-table>
  </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">关闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        param: 0,
        visible: false,
        dataList: [],
        taskId: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false
      }
    },
    methods: {
      refreshData () {
        this.init(this.param)
      },
      // 获取数据列表
      init (id) {
        this.param = id | 0
        this.visible = true
        this.dataListLoading = true
        this.$nextTick(() => {
          if (id !== 0) {
            this.$http({
              url: this.$http.adornUrl(`/honeycomb/honeycombtask/es/` + id),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataList = data.list
                console.log(this.dataList)
              } else {
                this.dataList = []
                this.dataForm.id = 0
              }
            })
          }
        })
        this.dataListLoading = false
      }
    }
  }
</script>
