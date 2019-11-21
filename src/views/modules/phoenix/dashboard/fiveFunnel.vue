<template>
  <div class="mod-demo-echarts">
    <el-row :gutter="20">
      <el-col v-for="(outdata, index) in arr" :key="outdata.id" class="echartList funnelStyle">
        <el-card class="funnel-card">
          <div class="funnel-radio" v-if="index == 0">
            <el-radio v-model="radio" label="0" @change="selectFunnel">全量</el-radio>
            <el-radio v-model="radio" label="1" @change="selectFunnel">信息流</el-radio>
            <el-radio v-model="radio" label="2" @change="selectFunnel">应用市场</el-radio>
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
    },
    selection: {
      type: Array,
      default: []
    },
    selectedList: {
      type: Object,
      default: []
    }
  },
  data () {
    return {
      radio: '0'
    }
  },
  methods: {
    changeValue1 (data, index) {
      this.$emit('changeValue1', data, index)
    },
    changeTag (data) {
      this.$emit('changeTag', data)
    },
    selectFunnel () {
      console.log(this.radio)
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
    top: 15px;
    z-index: 100;
    .el-radio {
      margin: 0 10px;
    }
  }
}
</style>
