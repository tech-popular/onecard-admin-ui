<template>
  <el-row :gutter="20">
    <el-col v-for="(outdata, index) in arr" :key="outdata.id" class="echartList" :span="12">
      <el-card>
        <el-select
          v-model="selectedList && selectedList.data && selectedList.data.length > 0 && selectedList.id == outdata.id ? selectedList.data : outdata.selectListArr"
          class="selectList"
          multiple
          placeholder="全部"
          v-show="outdata.selection[0]"
          @visible-change="changeValue1(outdata, index)"
          @remove-tag="changeTag(outdata)"
        >
          <el-option
            v-for="item in selection"
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
    return {}
  },
  methods: {
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
