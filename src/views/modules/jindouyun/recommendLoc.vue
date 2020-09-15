<template>
  <div>
    <tab :list="list" :columns="columns" :operates="operates"/>
  </div>
</template>

<script>
  import { models } from '../../components/actions/jindouyun/recommendLoc'
  export default {
    mixins: [models]
  }
</script>
