<template>
  <div>
    <searchForm
      size="mini"
      labelWidth="100px"
      :searchData="searchData"
      :searchForm="searchForm"
      :searchHandle="searchHandle"
    ></searchForm>
    <tab :list="list" :columns="columns" :operates="operates" />
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageNum"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper"
    />
    <!-- 弹窗, 新增 / 修改同步任务 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="init" />
    <!-- 弹窗, 新增 / 修改计算任务 -->
    <comput-add-or-update
      v-if="computAddOrUpdateVisible"
      ref="computAddOrUpdate"
      @refreshDataList="init"
    />
  </div>
</template>

<script>
import AddOrUpdate from './taskManag-add-or-update'
import ComputAddOrUpdate from './compute-add-or-update'
import { models } from '../../components/actions/dispatch/taskManag'
export default {
  mixins: [models],
  components: {
    AddOrUpdate,
    ComputAddOrUpdate
  }
}
</script>