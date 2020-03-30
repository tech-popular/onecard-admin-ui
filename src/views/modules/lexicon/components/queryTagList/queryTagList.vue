<template>
  <div>
    <div class="query-tag-content">
      <el-tag
        :key="tag"
        v-for="tag in data"
        closable
        :disable-transitions="false"
        @close="handleClose(tag)"
        class="tag-item"
      >
        {{tag}}
      </el-tag>
      <p v-if="data.length === 0">暂无内容</p>
    </div>
    <div class="query-tag-total">
      <el-button type="primary" size="mini" style="float: left" @click="multiAddClick">批量新增至以下词组中</el-button>
      <b>目前已添加 <span>{{data.length}}</span> 条</b>
    </div>
  </div>
</template>
<script>
import { deepClone } from '../../assets/js/utils'
export default {
  data () {
    return {

    }
  },
  props: {
    data: {
      type: Array,
      default: []
    }
  },
  methods: {
    handleClose (tag) {
      let data = deepClone(this.data)
      data.splice(data.indexOf(tag), 1)
      this.$emit('tagChange', data)
    },
    multiAddClick () { // 批量新增至以下词组中
      this.$emit('multiAdd')
    }
  }
}
</script>
<style scoped>
  @import "../../assets/style/update-base.css";
</style>