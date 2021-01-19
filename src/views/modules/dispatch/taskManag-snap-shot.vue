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
			<taskManageSnapShotTable :dataApi ="taskSnapshotNewDepends" :taskId="taskId" taskType="up" type="new" @addTab = "addTab" ref="taskSnapshotUpNewDepends"></taskManageSnapShotTable>
			<h3>老调度任务依赖</h3>
			<taskManageSnapShotTable :dataApi ="taskSnapshotOldDepends" :taskId="taskId" taskType="up" type="old" ref="taskSnapshotUpOldDepends"></taskManageSnapShotTable>
		</el-tab-pane>
    <el-tab-pane label="下游任务" name="second">
			<h3>新调度任务依赖</h3>
			<taskManageSnapShotTable :dataApi ="taskSnapshotNewDepends" :taskId="taskId" taskType="down" type="new" @addTab = "addTab" ref="taskSnapshotDownNewDepends"></taskManageSnapShotTable>
			<h3>老调度任务依赖</h3>
			<taskManageSnapShotTable :dataApi ="taskSnapshotOldDepends" :taskId="taskId" taskType="down"  type="old" ref="taskSnapshotDownOldDepends"></taskManageSnapShotTable>
		</el-tab-pane>
  </el-tabs>
  </el-tab-pane>
</el-tabs>
 </el-dialog>
</template>

<script>
import taskManageSnapShotTable from './taskManage-snapShot-table.vue'
import { taskSnapshotNewDepends, taskSnapshotOldDepends } from '@/api/dispatch/taskManag'
export default {
  data () {
    return {
      visible: false,
      taskId: '',
      editableTabsValue: '1',
      taskIdLIst: [],
      taskSnapshotNewDepends: taskSnapshotNewDepends,
      taskSnapshotOldDepends: taskSnapshotOldDepends,
      editableTabs: [{
        title: '',
        name: '1',
        content: {
          activeName: 'first'
        }}],
        tabIndex: 1,
        tabClickIndex: 0
    }
  },
  components: { taskManageSnapShotTable },
  methods: {
    init (row) {
      this.taskIdLIst = []
      this.editableTabs = [{
        title: row.taskName,
        name: '1',
        content: {
          activeName: 'first'
        }
      }]
      this.editableTabsValue = '1'
      this.tabIndex = 1
      this.taskId = row.id
      this.taskIdLIst.push(row.id)
      this.visible = true
      this.$nextTick(() => {
        // 上游任务
        this.$refs.taskSnapshotUpNewDepends[0].init()
        this.$refs.taskSnapshotUpOldDepends[0].init()
      })
    },
    // 点击依赖快照
    addTab(targetName) {
        let newTabName = ++this.tabIndex + ''
        this.editableTabs.push({
          title: targetName.taskName,
          name: newTabName,
          content: {
            activeName: 'first'
          }
        })
        this.taskIdLIst.push(targetName.taskId)
        this.taskId = targetName.taskId
        this.tabClickIndex = this.tabIndex - 1
        this.$nextTick(() => {
          this.$refs.taskSnapshotUpNewDepends[this.tabClickIndex].init()
          this.$refs.taskSnapshotUpOldDepends[this.tabClickIndex].init()
        })
        this.editableTabsValue = newTabName
      },
      // 切换任务
      tabClick (tab, event) {
        this.tabClickIndex = tab.index
        this.taskId = this.taskIdLIst[this.tabClickIndex]
        this.editableTabs[this.tabClickIndex].content.activeName = 'first'
        this.$nextTick(() => {
          this.$refs.taskSnapshotUpNewDepends[this.tabClickIndex].init()
          this.$refs.taskSnapshotUpOldDepends[this.tabClickIndex].init()
        })
      },
      // 切换上下游
      tabhandleClick (tab, event) {
        if (tab.index === '0') {
          this.$nextTick(() => {
            this.$refs.taskSnapshotUpNewDepends[this.tabClickIndex].init()
            this.$refs.taskSnapshotUpOldDepends[this.tabClickIndex].init()
          })
        } else {
          this.$nextTick(() => {
            this.$refs.taskSnapshotDownNewDepends[this.tabClickIndex].init()
            this.$refs.taskSnapshotDownOldDepends[this.tabClickIndex].init()
          })
        }
      }
  }
}
</script>