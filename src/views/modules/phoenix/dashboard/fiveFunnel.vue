<template>
  <div class="mod-demo-echarts">
    <el-row :gutter="20">
      <el-col v-for="(outdata, index) in arr" :key="outdata.id" class="echartList funnelStyle">
        <el-card class="funnel-card">
          <div class="funnel-radio" v-if="index == 0">
            <el-radio v-model="radio" label="市场渠道" @change="checkNode(index)">全量</el-radio>
            <el-radio v-model="radio" label="信息流" @change="checkNode(index)">信息流</el-radio>
            <el-radio v-model="radio" label="应用市场" @change="checkNode(index)">应用市场</el-radio>
          </div>
          <div :id="'J_chartLineBox' + outdata.id" class="chart-box"></div>
        </el-card>
        <funnel :outdata="outdata" />
      </el-col>
    </el-row>
  </div>
</template>
<script>
import funnel from './funnel'
export default {
  components: { funnel },
  props: {
    arr: {
      type: Array,
      default: []
    }
  },
  data () {
    return {
      radio: '市场渠道'
    }
  },
  methods: {
    checkNode (index) {
      this.$emit('checkNode', [this.radio], index, this.arr[index].selection[0])
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
  // .selectList {
  //   position: absolute;
  //   width: 25%;
  //   top: 20px;
  //   left: 70%;
  //   z-index: 9;
  // }
}
li {
  list-style: none;
}
.funnel-card {
  position: relative;
  .funnel-radio {
    position: absolute;
    right: 0;
    top: 5px;
    z-index: 100;
    .el-radio {
      margin: 0;
    }
    .el-radio__label {
      padding: 0 5px;
    }
  }
}
</style>
