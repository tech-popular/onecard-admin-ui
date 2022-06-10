<template>
  <el-dialog title="流转依赖任务" :modal-append-to-body="false" :append-to-body="true" :visible.sync="visible" width="50%" :close-on-click-modal="false">
    <el-table :data="dataList" height="600px;" border v-loading="dataListLoading" style="width: 100%;">
      <el-table-column prop="id" header-align="center" align="center" label="任务ID"></el-table-column>
      <el-table-column prop="englishName" header-align="center" align="center" label="任务名称">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" placement="top">
            <div v-html="toBreak(scope.row.englishName)" slot="content"></div>
            <div class="text-to-long-cut">{{scope.row.englishName}}</div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="enable" header-align="center" align="center" label="任务状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.enable === true" size="small">已完成</el-tag>
          <el-tag v-else size="small" type="danger">未完成</el-tag>
        </template>
      </el-table-column>
    </el-table>
    <div slot="footer">
      <el-button type="primary" @click="saveHandle" size="small">确定</el-button>
      <el-button type="default" @click="cancelHandle" size="small">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  props: {
    // 父组件传来的值需定义一下
    dataList: {
      default: [],
      type: Array // 类型
    }
  },
  data () {
    return {
      visible: false,
      dataListLoading: false
    }
  },
  methods: {
    init () {
      this.visible = true
    },
    saveHandle () {

    },
    cancelHandle () {
      this.visible = false
    }
  }
}
</script>