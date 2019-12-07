<template>
  <div class="new-monitor">
    <div class="new-monitorLeft" v-if="lineList.length">
      <div v-if="lineList && lineList.length > 0" class="line">
        <div :key="item.id" v-for="(item) in lineList">
          <div class="lineEvery">
            <p>{{item.titleName}}</p>
            <h3>{{item.series[0].data[item.series[0].data.length - 1].value}}</h3>
            <div :id="'lineCharts' + item.id" class="lineCharts"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="new-monitorRight">
      <div class="new-monitorRightList" :key="item.id" v-for="(item, index) in barRightList">
        <div :id="'barCharts' + item.id" class="barCharts"></div>
        <select-tree
          class="new-monitorSelectList"
          v-show="optionIds.length"
          :options="options"
          :optionIds="optionIds"
          :index="index"
          :defaultCheckNodes="hadSelectedList[index]"
          @checkNode="checkNode"
        ></select-tree>
      </div>
    </div>
  </div>
</template>
<script>
import selectTree from './selectTree'
export default {
  components: { selectTree },
  props: {
    lineList: {
      type: Array,
      default: []
    },
    barRightList: {
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
      this.$emit(
        'checkNode',
        data,
        index,
        this.barRightList[index].selection[0]
      )
    }
  }
}
</script>
<style lang="scss">
li {
  list-style: none;
}

.colorRed {
  color: red;
}
.percentRise {
  color: green;
}

.new-monitor {
  width: 100%;
  // background: #f0f4f8;
  margin-top: 20px;
  display: flex;
  .new-monitorLeft {
    flex: 1;
    & > div {
      border-radius: 10px;
      background: #ccc;
      text-align: center;
      div {
        font-size: 12px;
        line-height: 12px;
        margin-bottom: 10px;
        background: #ccc;
        border-radius: 20px;
      }
    }
  }
  .new-monitorRight {
    flex: 7;
    .new-monitorRightList {
      width: 45%;
      display: inline-block;
      margin: 20px;
      position: relative;
      box-sizing: border-box;
    }
    .barCharts {
      min-height: 300px;
      max-height: 300px;
    }
  }
}
.allChecked {
  position: absolute;
  top: 0;
  left: 50%;
  background: #f1675d;
  color: #fff;
  border: none;
  border-radius: 5px;
}
.new-monitorSelectList {
  position: absolute;
  width: 200px;
  top: -8px;
  left: 160px;
  z-index: 9;
}
.line {
  width: 100%;
  height: 150px;
  background: #f0f4f8;
  margin-top: 20px;
  & > div {
    .lineEvery {
      text-align: center;
      max-width: 400px;
      padding-top: 40px;
      p {
        padding-top: 20px;
      }
    }
  }
}
.lineCharts {
  width: 200px;
  height: 150px;
  overflow: hidden;
}
</style>