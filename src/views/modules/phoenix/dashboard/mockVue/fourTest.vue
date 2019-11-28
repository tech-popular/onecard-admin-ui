<template>
  <div class="quadrant">
    <h3>四象限&&小X卡</h3>
    <div class="titleName">
      <p>四象限</p>
      <p>小X卡</p>
    </div>
    <div class="mainText" v-loading="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.1)">
      <div class="quadrantLeft"></div>
      <div class="quadrantRight"></div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      loading: true
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
