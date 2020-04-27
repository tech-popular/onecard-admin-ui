<template>
  <el-dialog
      title="分群概览"
      :visible.sync="dialogVisible"
      width="90%"
      :before-close="handleClose">
      <el-row :gutter="20">
        <el-col :span="10">
          <div class="grid-content bg-purple">分群用户数：{{peopNum}}人，在<span class="channl">{{channl}}</span>中占比{{proportion}}</div>
        </el-col>
        <el-col :span="10">
          <div class="grid-content bg-purple">最近计算时间：{{lately}}</div>
        </el-col>
      </el-row>
      
    </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      dialogVisible: false,
      peopNum: 1000,
      channl: '万卡',
      proportion: '3.4%',
      lately: '2020-04-25'
    }
  },
  components: {},
  methods: {
    init (val) {
      this.dialogVisible = true
      // lookAccout(val.id).then(({data}) => {
      // })
    },
    // 弹窗状态
    handleClose () {
      this.dialogVisible = false
    }
  }
}
</script>
<style scoped>
.channl{
  color: #2093f7;
}
</style>>
