<template>
  <el-drawer
    title="规则配置"
    :append-to-body="false"
    :visible.sync="visible"
    @close="drawerClose"
    :wrapperClosable="false"
    size="1200px"
    class="rule-config-drawer"
  >
    <div class="content">
      <el-tabs v-model="activeName" type="card" class="tabs">
        <el-tab-pane v-for="(item, index) in tabsList" :key="index" :name="item.id" :label="item.name"></el-tab-pane>
      </el-tabs>
      <rule-config-product v-if="activeName === '1'" :activeName='activeName' ref="ruleConfigProduct" :boxId='boxId'></rule-config-product>
      <rule-config-duplicate v-if="activeName === '2'" ref="ruleConfigDuplicate" :boxId='boxId'></rule-config-duplicate>
      <rule-config-mustpush v-if="activeName === '3'" ref="ruleConfigMustpush" :boxId='boxId'></rule-config-mustpush>
    </div>
    <div class="footer">
      <el-button type="default" @click="drawerClose" size="small">关闭</el-button>
    </div>
  </el-drawer>
</template>
<script>
import ruleConfigProduct from './sceneManage-sceneConfig-rule-config-product'
import ruleConfigDuplicate from './sceneManage-sceneConfig-rule-config-removeDuplicate'
import ruleConfigMustpush from './sceneManage-sceneConfig-rule-config-mustpush'
export default {
  props: [
    'boxId'
  ],
  data () {
    return {
      visible: false,
      activeName: '1',
      tabsList: [
        {
          id: '1',
          name: '物品规则'
        },
        {
          id: '2',
          name: '去重规则'
        },
        {
          id: '3',
          name: '必推规则'
        }
      ]
    }
  },
  components: { ruleConfigProduct, ruleConfigDuplicate, ruleConfigMustpush },
  methods: {
    init () {
      this.visible = true
    },
    drawerClose () {
      this.visible = false
      this.activeName = '1'
    }
  }
}
</script>
<style scoped>
  .content {
    padding: 0px 30px 200px 30px;
    min-height:auto;
    margin-bottom: 100px;
    overflow: auto;
    height: 750px;
  }
  .tabs {
    margin-bottom: 10px;
  }
  .footer {
    position: absolute;
    bottom: 0;
    background: #fff;
    padding: 10px 22px 10px 10px;
    width: 100%;
    height: 55px;
    text-align: right;
    box-shadow: 0 -2px 9px 0 rgba(153,169,191,.17);
    z-index: 500;
  }
</style>
