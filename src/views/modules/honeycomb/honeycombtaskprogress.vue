<template>
  <el-dialog
    title="进度数据"
    :visible.sync="visible">
    <span data-align="right">
    <el-button @click="refreshData()" type="danger"  align="right" round>刷新</el-button>
    <el-button @click="visible = false" type="primary"  align="right" round>关闭</el-button>
    </span>
    <!--<el-form :inline="true" :model="dataForm" >
      <el-form-item>
        <el-input v-model="dataForm.key" placeholder="参数名" clearable @keyup.enter.native="getDataList()"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button v-if="isAuth('honeycomb:honeycombhealthcheck:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button v-if="isAuth('honeycomb:honeycombhealthcheck:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
      </el-form-item>
    </el-form>-->
  <div class="mod-config">
    <el-table
      :data="dataList"
      row-key="timestamp"
      border
      v-loading="dataListLoading"
      lazy
      :load="load"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
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

     <!-- <el-table-column
        prop="task_status_desc"
        header-align="center"
        show-tooltip-when-overflow
        align="center"
        label="任务描述">
      </el-table-column>-->
      <el-table-column
        prop="timestamp"
        header-align="center"
        align="center"
        label="批次时间"
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
        dataForm: {
          key: ''
        },
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
              url: this.$http.adornUrl(`/honeycomb/honeycombtask/es`),
              method: 'get',
              params: this.$http.adornParams({
                'taskId': this.param
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataList = data.groupdata
              } else {
                this.dataList = []
                this.dataForm.id = 0
              }
            })
          }
        })
        this.dataListLoading = false
      },
      load (row, treeNode, resolve) {
        console.log('task_id', row.task_id)
        console.log('timestamp', row.timestamp)
        this.$http({
          url: this.$http.adornUrl(`/honeycomb/honeycombtask/es/detail`),
          method: 'get',
          params: this.$http.adornParams({
            'taskId': row.task_id,
            'timestamp': row.timestamp
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            console.log('data', data.detailData)
            resolve(data.detailData)
          }
        })
      }
    }
  }
</script>
