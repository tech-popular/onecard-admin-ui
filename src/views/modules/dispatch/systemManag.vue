<template>
  <div>
    <searchForm size='mini' labelWidth = '100px' :searchData = "searchData" :searchForm = "searchForm" :searchHandle="searchHandle"></searchForm>
    <tab :list="list" :columns="columns" :operates="operates"/>
    <el-pagination 
      @size-change="sizeChangeHandle" 
      @current-change="currentChangeHandle" 
      :current-page="pageNum" :page-sizes="[10, 20, 50, 100]" 
      :page-size="pageSize" 
      :total="totalPage" 
      layout="total, sizes, prev, pager, next, jumper"/>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="init"/> 
  </div>
</template>

<script>
  import AddOrUpdate from './systemManag-add-or-update'
  import { models } from '../../components/actions/dispatch/systemManag'
  export default {
    mixins: [models],
    components: {
      AddOrUpdate
    }
  }
</script>