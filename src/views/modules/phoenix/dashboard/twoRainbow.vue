<template>
  <div class="mod-demo-echarts">
    <el-row :gutter="20">
      <el-col v-for="(outdata, index) in arr" :key="outdata.id" class="echartList Rainbow">
        <el-card>
          <select-tree
            class="selectList"
            :options="options"
            :optionIds="optionIds"
            :index="index"
            :defaultCheckNodes="hadSelectedList[index]"
            @checkNode="checkNode"
          ></select-tree>
          <div :id="'J_chartLineBox' + outdata.id" class="chart-box"></div>
        </el-card>
        <funnel :outdata="outdata"/>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import selectTree from './selectTree'
import funnel from './funnel'
export default {
  components: { selectTree, funnel },
  props: {
    arr: {
      type: Array,
      default: []
    },
    selectedList: {
      type: Object,
      default: []
    },
    options: {
      type: Array,
      default: []
    },
    optionIds: {
      type: Array,
      default: []
    },
    hadSelectedList: {
      type: Array,
      default: []
    }
  },
  data () {
    return {}
  },
  methods: {
    checkNode (data, index) {
      data = [...new Set(data)]
      this.$emit('checkNode', data, index, this.arr[index].selection[0])
    },
    changeValue1 (data, index) {
      this.$emit('changeValue1', data, index)
    },
    changeTag (data) {
      this.$emit('changeTag', data)
    }
  }
}
</script>
<style lang="scss">
.mod-demo-echarts {
  .el-card__body {
    padding: 10px;
  }
  .chart-box {
    min-height: 400px;
  }
  .lineCharts {
    min-height: 200px;
  }
  .echartList {
    position: relative;
  }
  .funnelStyle {
    width: 33.33%;
  }
  .Rainbow:nth-child(odd) {
    width: 35%;
  }
  .Rainbow:nth-child(even) {
    width: 65%;
  }
  .selectList {
    position: absolute;
    width: 40%;
    top: 5px;
    left: 57%;
    z-index: 9;
  }
}
li {
  list-style: none;
}

</style>
