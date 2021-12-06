<template>
  <el-dialog 
    :visible.sync="visible"
		:fullscreen="true"
	  title="依赖任务进度"
    :close-on-click-modal="false">
  <el-tabs v-model="editableTabsValue" type="border-card" @tab-click="tabClick" :closable ="closable" @tab-remove="removeTab">
  <el-tab-pane
    v-for="(item) in editableTabs"
    :key="item.name"
    :label="item.title"
    :name="item.name"
		:stretch = true
  >
	<el-tabs v-model="item.content.activeName"  @tab-click="tabhandleClick">
    <el-tab-pane label="上游任务" name="first">
			<h3>任务依赖</h3>
			<taskManageSnapShotTable :dataApi ="taskSnapshotDepends" :taskId="taskId" taskType="up" @addTab="addTab" ref="taskSnapshotUpNewDepends"></taskManageSnapShotTable>
		</el-tab-pane>
    <el-tab-pane label="下游任务" name="second">
			<h3>任务依赖</h3>
			<taskManageSnapShotTable :dataApi ="taskSnapshotDepends" :taskId="taskId" taskType="down" @addTab="addTab" ref="taskSnapshotDownNewDepends"></taskManageSnapShotTable>
		</el-tab-pane>
  </el-tabs>
  </el-tab-pane>
</el-tabs>
 </el-dialog>
</template>

<script>
import taskManageSnapShotTable from './taskManage-snapShot-table.vue'
import { taskSnapshotDepends } from '@/api/BI-Manager/taskManage'
export default {
  data () {
    return {
      visible: false,
      taskId: '',
      editableTabsValue: '1',
      closable: false,
      taskSnapshotDepends: taskSnapshotDepends,
      editableTabs: [{
        title: '',
        name: '1',
        content: {
          activeName: 'first',
          id: ''
        }}],
        tabIndex: 1,
        tabClickIndex: 0
    }
  },
  components: { taskManageSnapShotTable },
  methods: {
    init (row) {
      this.editableTabs = [{
        title: row.name,
        name: '1',
        content: {
          activeName: 'first',
          id: row.id
        }
      }]
      this.editableTabsValue = '1'
      this.tabIndex = 1
      this.taskId = row.id
      this.visible = true
      this.$nextTick(() => {
        // 上游任务
        this.$refs.taskSnapshotUpNewDepends[0].init()
      })
    },
    // 点击依赖快照
    addTab(targetName) {
        let newTabName = ++this.tabIndex + ''
        this.editableTabs.push({
          title: targetName.taskName,
          name: newTabName,
          content: {
            activeName: 'first',
            id: targetName.taskId
          }
        })
        this.taskId = targetName.taskId
        this.closable = true
        this.$nextTick(() => {
          this.tabClickIndex = this.editableTabs.length - 1
          this.$refs.taskSnapshotUpNewDepends[this.tabClickIndex].init()
        })
        this.editableTabsValue = newTabName
      },
      // 切换任务
      tabClick (tab, event) {
        this.tabClickIndex = tab.index
        this.taskId = this.editableTabs[this.tabClickIndex].content.id
        this.editableTabs[this.tabClickIndex].content.activeName = 'first'
        this.$nextTick(() => {
          this.$refs.taskSnapshotUpNewDepends[this.tabClickIndex].init()
        })
      },
      // 删除任务
      removeTab(targetName) {
        this.closable = true
        let tabs = this.editableTabs
        let activeName = this.editableTabsValue
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
              let nextTab = tabs[index + 1] || tabs[index - 1]
              if (nextTab) {
                activeName = nextTab.name
              }
            }
          })
        }
        this.editableTabsValue = activeName
        this.editableTabs = tabs.filter(tab => tab.name !== targetName)
        tabs.map((tab, index) => {
          if (tab.name === targetName) {
            if (index < this.tabClickIndex) {
              this.tabClickIndex = this.tabClickIndex - 1
            }
          }
        })
        if (this.editableTabs.length === 1) {
          this.closable = false
        }
      },
      // 切换上下游
      tabhandleClick (tab, event) {
        console.log('上下 ', this.tabClickIndex)
        if (tab.index === '0') {
          this.$nextTick(() => {
            this.$refs.taskSnapshotUpNewDepends[this.tabClickIndex].init()
          })
        } else {
          this.$nextTick(() => {
            this.$refs.taskSnapshotDownNewDepends[this.tabClickIndex].init()
          })
        }
      }
  }
}
</script>