<template>
  <div class="funnelList">
    <ul v-show="outdata.type == 'funnel'">
      <li :key="index" v-for="(item, index) in outdata.legend.data">
        <p class="funnelInfo">{{item.name}}</p>
        <p class="funnelInfo">{{item.metric}}{{item.metric_unit}}
          <span class="colorRed" :class="{'percentRise' : item.percentRise}">
            {{item.percentRise ? '↑' : '↓'}}
          </span>
          {{item.percent}}{{item.percent_unit}}
        </p>
      </li>
    </ul>
    <!-- <ul></ul> -->
  </div>
</template>
<script>
export default {
  props: {
    outdata: {
      type: Object,
      default: () => {}
    }
  }
}
</script>
<style lang="scss">
.funnelList {
  .funnelInfo {
    margin: 0;
  }
  ul {
    position: absolute;
    width: 170px;
    height: 200px;
    top: 90px;
    left: 20px;
    padding: 0;
    li {
      color: #555;
      margin-top: 41px;
    }
    li:nth-child(1) {
      margin-top: -71px;
      left: 150px;
      width: 100px;
      position: absolute;
      text-align: center;
    }
  }
}
.colorRed {
  color: red;
}
.percentRise {
  color: green;
}
</style>