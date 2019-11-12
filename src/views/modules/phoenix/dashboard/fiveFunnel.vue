<template>
  <div class="mod-demo-echarts"> 
    <el-row :gutter="20"> 
      <el-col v-for="(outdata, index) in arr" :key="outdata.id" class='echartList funnelStyle'>
        <el-card>
          <el-select v-model="selectedList && selectedList.data && selectedList.data.length > 0 && selectedList.id == outdata.id ? selectedList.data : outdata.selectListArr" class='selectList' multiple placeholder="全部" v-show="outdata.selection[0]" @visible-change="changeValue1(outdata, index)" @remove-tag="changeTag(outdata)">
            <el-option
              v-for="item in selection"
              :key="item.name"
              :label="item.value"
              :value="item.name">
            </el-option>
          </el-select>
          <div :id="'J_chartLineBox' + outdata.id" class="chart-box"></div>
        </el-card>
        <div class="funnelList">
          <ul v-show="arr[index].type == 'funnel'">
            <li :key='index' v-for="(item, index) in outdata.legend.data">{{item.name}}{{item.metric}}{{item.metric_unit}}<span class="colorRed" :class="{'percentRise' : item.percentRise}">{{item.percentRise ? '↑' : '↓'}}</span>{{item.percent}}{{item.percent_unit}}</li>
          </ul>
          <ul>
          </ul>
        </div>  
      </el-col>
    </el-row> 
  </div>
</template>
<script>
export default {
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
    .el-card__body{
      padding: 10px;
    }
    .chart-box {
      min-height: 400px;
    }
    .lineCharts {
      min-height: 200px;
    }
    .echartList{
      position: relative;
    }
    .funnelStyle{
      width: 33.33%;
    }
    .Rainbow:nth-child(odd){
      width: 30%;
    }
    .Rainbow:nth-child(even){
      width: 70%;
    }
    .selectList{
      position: absolute;
      width: 25%;
      top: 20px;
      left: 70%;
      z-index: 9;
    }
  }
  li{
    list-style: none;
  }
  .funnelList{
    ul{
      position: absolute;
      width: 170px;
      height: 200px;
      top: 90px;
      left: 20px;
      padding: 0;
      li{
        color: #555;
        margin-top: 41px;
      }
      li:nth-child(1){
        margin-top: -71px;
        left: 150px;
        width: 100px;
        position: absolute;
        text-align: center;
      }
    }
  }
  .colorRed{
    color: red;
  }
  .percentRise{
    color: green;
  }

</style>
