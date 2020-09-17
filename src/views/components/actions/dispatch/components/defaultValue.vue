<template>
  <el-input
    placeholder="请输入任务名称"
    v-model="newValue"
    @input="handleChange"
    :class="desc.class"
    :style="desc.style"
    v-bind="desc.attrs"
    v-on="desc.on"
  >
    <template slot="prepend">mc_to_rds_</template>
  </el-input>
</template>
<script>
  import {formMixin} from 'vue-ele-form'

  export default {
    name: 'DefaultValue', // name 属性必须填写, 在使用时, 需要和这里定义的 name 一致
    minxins: [formMixin], // 必须引入mixin
    props: {
      // value 是传递过来的值
      value: String,
      // desc是此组件的描述, 结构为
      // { style: {}, class: {}, on: {}, attrs: {} }
      desc: {
        type: Object,
        default () {
          return {}
        }
      }
    },
    data () {
      return {
        // 用于v-model绑定, 因为 v-model无法绑定props值
        newValue: this.value
      }
    },
    methods: {
      handleChange (value) {
        this.$emit('input', value) // 当值变化时, 一定要触发input事件
      }
    }
  }
</script>