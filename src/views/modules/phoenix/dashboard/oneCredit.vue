<template>
  <el-row :gutter="20">
    <el-col v-for="(outdata, index) in arr" :key="outdata.id" class="echartList" :span="12">
      <el-card>
        <el-select
          v-model="value"
          class="selectList"
          multiple
          placeholder="全部"
          v-show="outdata.selection[0]"
          @visible-change="checkNode(index)"
          @remove-tag="checkNode(index)"
        >
          <el-option
            v-for="item in selectedList"
            :key="item.name"
            :label="item.value"
            :value="item.name"
          ></el-option>
        </el-select>
        <div :id="'J_chartLineBox' + outdata.id" class="chart-box"></div>
      </el-card>
      <funnel :outdata="outdata" />
    </el-col>
  </el-row>
</template>
<script>
import funnel from './funnel'
export default {
  components: { funnel },
  props: {
    arr: {
      type: Array,
      default: []
    },
    selectedList: {
      type: Array,
      default: []
    }
  },
  data () {
    return {
      value: []
    }
  },
  methods: {
    checkNode (index) {
      this.$emit('checkNode', this.value, index, this.arr[index].selection[0])
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
