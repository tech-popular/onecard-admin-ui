<template>
<div>
  <div class="el-transfer-panel__header">
    <slot name="header"></slot>
  </div>
  <div :class="['el-transfer-left el-transfer-panel__body', hasFooter ? 'is-with-footer' : '']">
    <el-input
    class="el-transfer-panel__filter"
    v-model="nameWord"
    size="small"
    :placeholder="placeholder"
    style="width: 240px;display:inline-block"
    >
      <i slot="prefix" class="el-input__icon el-icon-search"></i>
    </el-input>
    <el-button type="primary" size="mini" @click="inputChange">查询</el-button>
    <div class="data-list">
      <p class="el-transfer-panel__empty">请输入搜索内容查询数据</p>
    </div>
    <p class="el-transfer-panel__footer" v-if="hasFooter">
      <slot name="footer"></slot>
    </p>
  </div>
</div>
</template>
<script>
export default {
  data () {
    return {
      nameWord: '',
      inputHover: false
    }
  },
  props: {
    placeholder: String,
    hasFooter: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    inputChange () {
      this.$emit('searchName', this.nameWord)
    }
  }
}
</script>
<style scoped>
  .data-list {
    height: 354px;
    padding-bottom: 40px;
    padding-left: 20px;
    overflow: auto;
  }
  .data-list h3 {
    margin: 0;
    padding-left: 10px;
    font-size: 12px;
  }
</style>
