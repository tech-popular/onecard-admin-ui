<template>
  <div v-loading="dataListLoading">
    <searchForm size='mini' labelWidth = '100px' :searchData = "searchData" :searchHandle="searchHandle"></searchForm>
    <tab :list="list" :columns="columns" :operates="operates"/>
  </div>
</template>

<script>
  import { models } from '../../components/actions/jindouyun/recommendLoc'
  export default {
    mixins: [models]
  }
</script>
