<template>
  <el-dialog
    top="35vh"
    title="选择分析类型"
    :before-close="handleClose"
    :visible="this.dialogFormVisibles">
    <div class="select-the-analysis-type-box">
      <div class="">
        <p>模型分析</p>
        <ul>
          <li @click="dialogFormHideFunc('line')">
            <i class="el-icon-document"></i>
            <p>事件分析</p>
          </li>
          <li @click="dialogFormHideFunc('funnel')">
            <i class="el-icon-document"></i>
            <p>漏斗分析</p>
          </li>
          <li @click="dialogFormHideFunc('retained')">
            <i class="el-icon-document"></i>
            <p>留存分析</p>
          </li>
          <li @click="dialogFormHideFunc('distribution')">
            <i class="el-icon-document"></i>
            <p>分布分析</p>
          </li>
          <li @click="dialogFormHideFunc('property')">
            <i class="el-icon-document"></i>
            <p>属性分析</p>
          </li>
        </ul>
      </div>
      <div class="">
        <p>渠道对比</p>
        <ul>
          <li @click="dialogFormHideFunc('channel')"><i class="el-icon-document"></i>
            <p>渠道对比</p>
          </li>
        </ul>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'TipsHiveComponents',
  props: {
    dialogFormVisible: Boolean
  },
  data () {
    return {
      dialogFormVisibles: this.dialogFormVisible
    }
  },
  methods: {
    haaa (dialogFormVisible) {
      this.dialogFormVisibles = dialogFormVisible
    },
    dialogFormHideFunc (type) {
      this.dialogFormVisibles = false
      this.$emit('visible', {
        visibles: this.dialogFormVisibles,
        chartType: type
      })
    },
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
          this.dialogFormVisibles = false
          this.$emit('visible', {
            visibles: this.dialogFormVisibles,
            chartType: ''
          })
        })
        .catch(_ => {})
    }
  },
  watch: {
    dialogFormVisible: 'haaa'
  }
}
</script>

<style lang="scss" scoped>
  $--color-primary: #17B3A3;
  * {
    margin: 0;
    padding: 0;
  }
  .el-dialog__body {
    padding: 0;
  }
  .select-the-analysis-type-box {
    display: flex;
    &>div {
      display: flex;
      flex-direction: column;
      &>p {
        width: 100%;
        height: 20px;
        font-weight: 500;
      }
      &>ul {
        width: 100%;
        display: flex;
        margin-top: 10px;
        &>li {
          flex: 1;
          display: flex;
          height: 110px;
          flex-direction: column;
          border: 1px solid #E9F0F7;;
          border-radius: 5px;
          list-style: none;
          margin: 0 20px;
          background: #F5F8FC;
          cursor: pointer;
          &>i {
            display: block;
            flex: 1;
            display: flex;
            font-size: 40px;
            padding: 20px;
            margin: auto;
          }
          &>p {
            width: 100%;
            height: 40px;
            text-align: center;
          }
          &:hover {
            border-color: $--color-primary;
            &>i,&>p {
              color: $--color-primary;
            }
          }
        }
      }
      &:first-child {
        flex: 5;
        padding-right: 10px;
      }
      &:last-child {
        flex: 1;
        padding-left: 10px;
      }
    }
  }
</style>
