<template>
  <div class="funnelList">
    <ul v-show="outdata.type == 'funnel'">
      <li :key="index" v-for="(item, index) in outdata.legend.data">
        <p class="funnelInfo funnelInfoOther">{{item.name}}</p>
        <p class="funnelInfo">
          <span :class="index !== 0 ? 'funnel-left inline': ''">{{item.metric}}{{item.metric_unit}}</span><span class="colorRed " :class="{'percentRise' : item.percentRise, 'inline': index !== 0}">
            {{item.percentRise ? '↑' : '↓'}}
          </span>
          <span :class="{'percentRise' : item.percentRise, 'funnel-right inline colorRed': index !== 0}">{{item.percent}}{{item.percent_unit}}</span>
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
    position: relative;
    margin: 0;
  }
  .funnelInfoOther {
    font-size: 12px;
  }
  ul {
    position: absolute;
    width: 180px;
    height: 200px;
    top: 70px;
    left: 20px;
    padding: 0;
    li {
      color: #555;
      margin-top: 50px;
      .inline {
        position: absolute;
        left: 50px;
        display: inline-block;
      }
      .funnel-left {
        left: 0;
        font-size: 21px;
        width: 36px;
        text-align: center;
        transform: scale(0.5);
        -webkit-transform: scale(0.5);
        margin-right: -16px;
        padding-top: -2px; 
      }
      .funnel-right {
        left: 63px;
        top: 6px;
        width: 42px;
        font-size: 12px;
        font-weight: 700;
      }
      
    }
    li:nth-child(1) {
      margin-top: -30px;
      left: 145px;
      width: 170px;
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