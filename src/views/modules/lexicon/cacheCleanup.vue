<template>
  <div>
    <el-button type="primary" @click="addOrUpdateHandle()" style="margin-bottom:10px">新增</el-button>
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
  import { api } from '../../components/action/cacheCleanup'
  export default {
    mixins: [api],
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
        const dataBody = {
          'pageNum': 1,
          'pageSize': val
        }
        this.getList(dataBody)
      },
      // 当前页
      currentChangeHandle (val) {
        const dataBody = {
          'pageNum': val,
          'pageSize': this.pageSize
        }
        this.getList(dataBody)
      }
    }
  }
</script>
<style scoped>
  .el-button+.el-button{
    margin: 0 !important;
  }
</style>