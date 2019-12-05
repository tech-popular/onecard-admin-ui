<template>
  <div class="monitor">
    <div class="monitorLeft" v-if="simpleList[0] || simpleList[1] || simpleList[2]">
      <div :key="item.id" v-for="(item) in simpleList">
        <p>{{item.legend.extend.simple[0].name}}</p>
        <p>
          {{item.legend.extend.simple[0].metric}}{{item.legend.extend.simple[0].metric_unit}}
          <span
            class="colorRed"
            :class="{'percentRise' : item.legend.extend.simple[0].percentRise}"
          >{{item.legend.extend.simple[0].percentRise ? '↑' : '↓'}} {{item.legend.extend.simple[0].percent}}{{item.legend.extend.simple[0].percent_unit}}</span>
        </p>
      </div>
    </div>
    <div class="monitorRight">
      <div class="monitorRightList" :key="item.id" v-for="(item, index) in barRightList">
        <div :id="'barCharts' + item.id" class="barCharts"></div>
        <select-tree
            class="monitorSelectList"
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
    simpleList: {
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
      this.$emit('checkNode', data, index, this.barRightList[index].selection[0])
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

.monitor {
  width: 100%;
  margin-top: 20px;
  display: flex;
  .monitorLeft {
    flex: 1;
    & > div {
      border-radius: 10px;
      margin: 40px 20px;
      background: #ccc;
      text-align: center;
      padding: 100px 7px;
      div {
        font-size: 12px;
        line-height: 12px;
        margin-bottom: 10px;
      }
    }
  }
  .monitorRight {
    flex: 5;
    .monitorRightList {
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
.monitorSelectList {
    position: absolute;
    width: 200px;
    top: -8px;
    left: 160px;
    z-index: 9;
}
</style>