<template>
  <div class="monitor">
      <div class="monitorLeft" v-if="simpleList[0] || simpleList[1] || simpleList[2]">
        <div :key='item.id' v-for="(item) in simpleList">
          <p>{{item.legend.extend.simple[0].name}}</p>
          <p>{{item.legend.extend.simple[0].metric}}{{item.legend.extend.simple[0].metric_unit}}<span class="colorRed" :class="{'percentRise' : item.legend.extend.simple[0].percentRise}">{{item.legend.extend.simple[0].percentRise ? '↑' : '↓'}} {{item.legend.extend.simple[0].percent}}{{item.legend.extend.simple[0].percent_unit}}</span></p>
        </div>
      </div>
      <div class="monitorRight">
        <div class="monitorRightList" :key="item.id" v-for="(item, index) in barRightList">
          <div :id="'barCharts' + item.id" class="barCharts"></div>
          <input class="allChecked" :id="'selectall' + index" @click="clickALlCheck(index, 'barRightList')" type="button" value="全不选" flag="1"/>
        </div>
      </div>
    </div>
</template>
<script>
export default {
  props: {
    simpleList: {
      type: Array,
      default: []
    },
    barRightList: {
      type: Array,
      default: []
    }
  },
  watch: {
    barRightList (val) {
      console.log(val)
    }
  },
  mounted () {
    console.log(this.barRightList)
  },
  data () {
    return {

    }
  },
  methods: {
    clickALlCheck (index, type) {
      this.$emit('clickALlCheck', index, type)
    }
  }
}
</script>
<style lang="scss">
  li{
    list-style: none;
  }
 
  .colorRed{
    color: red;
  }
  .percentRise{
    color: green;
  }

  .monitor{
    width: 100%;
    // background: #f0f4f8;
    margin-top: 20px;
    display: flex;
    .monitorLeft{
      flex: 1;
      &>div{
        border-radius: 10px;
        margin: 40px 20px;
        background: #ccc;
        text-align: center;
        padding: 100px 7px;
        div{
          font-size: 12px;
          line-height: 12px;
          margin-bottom: 10px;
        }
      }
    }
    .monitorRight{
      flex: 5;
      .monitorRightList{
        // background: #ccc;
        margin: 20px;
        position: relative;
        box-sizing: border-box;
      }
      .barCharts{
        min-height: 300px;
        max-height: 300px;
      }
    }
  }
  .allChecked{
    position: absolute;
    top: 0;
    left: 50%;
    background: #f1675d;
    color: #fff;
    border: none;
    border-radius: 5px;
  }
</style>