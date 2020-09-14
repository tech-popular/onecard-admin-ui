<template>
  <div>
    <tab :list="list" :columns="columns" :operates="operates"/>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageNum" :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper"/>
  </div>
</template>

<script>
  import { models } from '../../components/actions/jindouyun/recommendLoc'
  export default {
    mixins: [models]
  }
</script>
