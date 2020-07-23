<template>
  <div>
    <el-select v-model="newValue" placeholder="请选择" @change="handleChange">
    <el-option-group
      v-for="group in options"
      :key="group.label"
      :label="group.label">
      <el-option
        v-for="item in group.options"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-option-group>
  </el-select>
    <span style="color:red;font-size:10px;">（如需配置账户/无账户信息，请前往 <router-link :to="{name:'dispatch-dataSource'}">配置</router-link>）</span>
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
        newValue: this.value,
        options: [{
          label: '个人账号',
          options: [{
            value: 'Shanghai',
            label: '个人一'
          }, {
            value: 'Beijing',
            label: '个人二'
          }]
        }, {
          label: '公共账号',
          options: [{
            value: 'Chengdu',
            label: '北京账号'
          }, {
            value: 'Shenzhen',
            label: '上海账号'
          }, {
            value: 'Guangzhou',
            label: '广州账号'
          }]
        }]
      }
    },
    methods: {
      handleChange (value) {
        this.$emit('input', value) // 当值变化时, 一定要触发input事件
      }
    }
  }
</script>