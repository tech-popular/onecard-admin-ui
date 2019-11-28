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
          <span v-if="index == 0" class="twoNameToday">{{outdata.series[0].name}}</span>
          <span v-if="index == 0" class="twoNameYesday">{{outdata.series[1].name}}</span>
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
    width: 30%;
  }
  .Rainbow:nth-child(even) {
    width: 70%;
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
.twoNameToday {
  position: absolute;
  left: 48%;
  top: 25%;
  z-index: 100;
  color: #000;
}
.twoNameYesday {
  position: absolute;
  left: 48%;
  top: 45%;
  z-index: 100;
  color: #000;
}
</style>
