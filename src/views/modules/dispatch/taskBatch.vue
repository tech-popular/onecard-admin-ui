<template>
  <div>
    <searchForm size='mini' labelWidth = '100px' :searchData = "searchData" :searchForm = "searchForm" :searchHandle="searchHandle"></searchForm>
    <tab :list="list" :columns="columns" :operates="operates" :operates-width="operatesWidth" />
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageNum" :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper"/>
      <taskBatch-view-log v-if="viewLogVisible" ref="viewLog"></taskBatch-view-log>
      <taskBatch-yarn-log v-if="viewYarnLogVisible" ref="viewYarnLog"></taskBatch-yarn-log>
  </div>
</template>

<script>
  import { models } from '../../components/actions/dispatch/taskBatch'
  import taskBatchViewLog from './taskBranch-view-log.vue'
  import taskBatchYarnLog from './taskBranch-yarn-log.vue'
  export default {
    mixins: [models],
    components: {
      taskBatchViewLog,
      taskBatchYarnLog
    }
  }
</script>
