<template>
  <el-dialog
      title="分群概览"
      :visible.sync="dialogVisible"
      width="90%"
      :before-close="handleClose">
      <el-row :gutter="20">
        <el-col :span="10">
          <div class="grid-content bg-purple"><strong>分群用户数：</strong>{{peopNum}}人，在<span class="channl">{{channl}}</span>中占比{{proportion}}</div>
        </el-col>
        <el-col :span="10">
          <div class="grid-content bg-purple"><strong>最近计算时间：</strong>{{lately}}</div>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin:10px 0;">
        <el-col :span="5">
          <strong>可视化筛选：</strong>
          <el-tag
            style="margin-left:10px;"
            v-for="tag in detalListCaent"
            :key="tag.name"
            :type="tag.name"
          >{{tag.name}}</el-tag>
        </el-col>
        <el-col :span="5">
          <el-button @click="editTable" type="primary">编辑</el-button>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin:10px 0;" v-show="isShow">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="88px" class="demo-ruleForm">
          <el-col :span="5">
            <el-form-item prop="region">
            <el-cascader
              :options="selectList"
              :props="props"
              clearable></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-button @click="saveTable" type="primary">保存</el-button>
            <el-button @click="editTable">取消</el-button>
          </el-col>
        </el-form>
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
      lately: '2020-04-25',
      ruleForm: {
        region: ''
      },
      isShow: false,
      props: { multiple: true },
      selectList: [
        {
          value: '1',
          label: '用户属性',
          children: [{
            value: '1.1',
            label: '渠道'
          }, {
            value: '1.2',
            label: '性别'
          }]
        }, {
          value: '2',
          label: '用户交易',
          children: [{
            value: '2.1',
            label: '7日内借款'
          }, {
            value: '2.2',
            label: '其他'
          }]
        }
      ],
      detalListCaent: [{name: '渠道'}, {name: '性别'}]
    }
  },
  components: {},
  methods: {
    init (val) {
      this.dialogVisible = true
      // lookAccout(val.id).then(({data}) => {
      // })
    },
    // 编辑
    editTable () {
      this.isShow = true
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
