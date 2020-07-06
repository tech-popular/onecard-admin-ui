<template>
  <div>
    <searchForm size='mini' labelWidth = '80px' :searchData = "searchData" :searchForm = "searchForm" :searchHandle="searchHandle"></searchForm>
    <tab :list="list" :columns="columns" :operates="operates"/>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageNum"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper"/>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="init"/> 
  </div>
</template>

<script>
  import AddOrUpdate from './cacheCleanup-add-or-update'
  import { models } from '../../components/action/cacheCleanup'
  export default {
    mixins: [models],
    components: {
      AddOrUpdate
    },
    mounted () {
      this.init()
    },
    methods: {
      init () {
        const dataBody = {
          'pageNum': this.pageNum,
          'pageSize': this.pageSize
        }
        this.getList(dataBody)
      },
      // 新增 / 修改
      addOrUpdateHandle () {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init()
        })
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.init()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageNum = val
        this.init()
      },
       /** 查询 */
      handleSearch () {
        this.init()
      },
    /** 重置 */
      resetHandle () {
        this.pageNum = 1
        this.dataForm = []
        this.init()
      }
    }
  }
</script>
<style scoped>
  .el-button+.el-button{
    margin: 0 !important;
  }
</style>