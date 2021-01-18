<template>
  <el-dialog 
    :visible.sync="visible"
		:fullscreen="true"
	  title="依赖快照"
    :close-on-click-modal="false">
  <el-tabs v-model="editableTabsValue" type="border-card" @tab-click="tabClick">
  <el-tab-pane
    v-for="(item, index) in editableTabs"
    :key="index"
    :label="item.title"
    :name="item.name"
		:stretch = true
  >
	<el-tabs v-model="item.content.activeName"  @tab-click="tabhandleClick">
    <el-tab-pane label="上游任务" name="first">
			<h3>新调度任务依赖</h3>
			<taskManageSnapShotTable></taskManageSnapShotTable>
			<h3>老调度任务依赖</h3>
			<taskManageSnapShotTable></taskManageSnapShotTable>
		</el-tab-pane>
    <el-tab-pane label="下游任务" name="second">
			<h3>新调度任务依赖</h3>
			<taskManageSnapShotTable></taskManageSnapShotTable>
			<h3>老调度任务依赖</h3>
			<taskManageSnapShotTable></taskManageSnapShotTable>
		</el-tab-pane>
  </el-tabs>
  </el-tab-pane>
</el-tabs>
 </el-dialog>
</template>

<script>
import taskManageSnapShotTable from './taskManage-snapShot-table.vue'
export default {
  data () {
    return {
      visible: false,
      editableTabsValue: '1',
      editableTabs: [{
        title: '',
        name: '1',
        content: {
          activeName: 'first'
        }}],
        tabIndex: 1
    }
  },
  components: { taskManageSnapShotTable },
  methods: {
    init (row) {
      console.log('row: ', row)
      this.editableTabs[0].title = row.taskName
      this.visible = true
    },
    // 点击依赖快照
    addTab(targetName) {
        let newTabName = ++this.tabIndex + ''
        this.editableTabs.push({
          title: 'New Tab',
          name: newTabName,
          content: {
            activeName: 'first'
          }
        })
        this.editableTabsValue = newTabName
      },
      // 切换任务
      tabClick (tab, event) {
        // console.log('event: ', event)
        // console.log('tab: ', tab)
      },
      // 切换上下游
      tabhandleClick (tab, event) {
        console.log('event: ', event)
        console.log('tab: ', tab)
      }
  }
}
</script>