<template>
  <div>
      <el-select v-model="newValue" placeholder="请选择">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
    <span>（如需配置账户请 <router-link :to="{name:'dispatch-dataSource'}">点击</router-link>）</span>
  </div>
</template>
<script>
  import {formMixin} from 'vue-ele-form'

  export default {
    name: 'RoutGoPath', // name 属性必须填写, 在使用时, 需要和这里定义的 name 一致
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