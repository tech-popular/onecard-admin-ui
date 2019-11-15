<template>
  <div class="quadrant">
    <h3>四象限&&小X卡</h3>
    <div class="titleName">
      <p>四象限</p>
      <p>小X卡</p>
    </div>
    <div class="mainText">
      <div class="quadrantLeft">
        <div class="quadrantLeftLeft">
          <div :key="index" v-for="(value, key, index) in quadrantList.quadrantDetails">
            <p>{{key}}</p>
            <ul :key="indexList" v-for="(valueList, keyList, indexList) in value">
              <li>
                {{keyList}} {{valueList[0].metric}}{{valueList[0].metric_unit}} {{valueList[1].metric}}{{valueList[1].metric_unit}}
                <span
                  class="colorRed"
                  :class="{'percentRise' : valueList[1].percentRise}"
                >{{valueList[1].percentRise ? '↑' : '↓'}} {{valueList[1].percent}}{{valueList[1].percent_unit}}</span>
              </li>
            </ul>
          </div>
        </div>
        <div class="quadrantLeftRight">
          <div :key="index" v-for="(value, key, index) in quadrantList.quadrant">
            <p>{{key}}</p>
            <ul :key="indexList" v-for="(valueList, keyList, indexList) in value">
              <li>
                {{valueList.metric}}{{valueList.metric_unit}}
                <span
                  class="colorRed"
                  :class="{'percentRise' : valueList.percentRise}"
                >{{valueList.percentRise ? '↑' : '↓'}} {{valueList.percent}}{{valueList.percent_unit}}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="quadrantRight">
        <div
          :key="index"
          class="quadrantRightList"
          v-for="(value, key, index) in quadrantList.quadrantCards"
        >
          <div class="quadrantRightListContent">
            <p>{{key}}</p>
            <ul :key="indexValue" v-for="(valueList, keyList, indexValue) in value">
              <li>{{valueList.metric}}{{valueList.metric_unit}}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    quadrantList: {
      type: Object,
      default: []
    }
  },
  data () {
    return {}
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
.quadrant {
  width: 100%;
  background: #f0f4f8;
  padding-bottom: 20px;
  h3 {
    padding-top: 10px;
    text-align: center;
  }
  .titleName {
    width: 100%;
    height: 40px;
    display: flex;
    p {
      text-align: center;
    }
    p:nth-child(1) {
      flex: 3;
    }
    p:nth-child(2) {
      flex: 1;
    }
  }
  .mainText {
    width: 100%;
    display: flex;
    font-size: 12px;
    height: 400px;
    p {
      padding-top: 20px;
    }
    .quadrantLeft {
      flex: 3;
      display: flex;
      .quadrantLeftLeft {
        flex: 1;
        & > div {
          height: 50%;
          margin-top: -12px;
          ul {
            padding: 0;
          }
        }
        & > div:nth-child(1) {
          background: #f2c9a1;
          // background-image: linear-gradient(to right, #f1d8c3 , #f2c08d);
        }
        & > div:nth-child(2) {
          background: #baa993;
          // background-image: linear-gradient(to right, #baa993 , #825820);
        }
      }
      .quadrantLeftRight {
        color: #fff;
        flex: 2;
        & > div {
          width: 50%;
          display: inline-block;
          text-align: center;
          vertical-align: middle;
          height: 50%;
          ul {
            padding: 0;
          }
        }
        & > div:nth-child(1) {
          background: #f2c9a1;
          // background-image: linear-gradient(to right, #f1d8c3 , #f2c08d);
        }
        & > div:nth-child(2) {
          background: #eb9038;
        }
        & > div:nth-child(3) {
          background: #baa993;
          // background-image: linear-gradient(to right, #baa993 , #825820);
        }
        & > div:nth-child(4) {
          background: #eba25b;
        }
      }
    }
    .quadrantRight {
      flex: 1;
      & > div {
        height: 31.35%;
        margin: 0 20px;
        p {
          text-align: center;
        }
        ul {
          padding: 0;
          text-align: center;
        }
      }
      & > div:nth-child(1) {
        background: #f5e8d5;
        margin-top: -12px;
      }
      & > div:nth-child(2) {
        background: #faf7d7;
      }
      & > div:nth-child(3) {
        background: #d3e6dd;
      }
    }
  }
}
</style>
