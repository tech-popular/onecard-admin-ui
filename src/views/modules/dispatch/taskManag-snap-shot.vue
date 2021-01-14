<template>
  <el-dialog 
    :visible.sync="visible"
		:fullscreen="true"
	  title="依赖快照"
    :close-on-click-modal="false">
  <el-tabs v-model="editableTabsValue" type="border-card" closable @tab-remove="removeTab">
  <el-tab-pane
    v-for="(item, index) in editableTabs"
    :key="index"
    :label="item.title"
    :name="item.name"
		:stretch = true
  >
	<el-tabs v-model="item.content.activeName">
    <el-tab-pane label="上游任务" name="first">
			<el-table
			  :data="item.content.tableList"
				border
				width="100%"
			>
			 <el-table-column
        prop="id"
        header-align="center"
        align="center"
        label="任务名称">
      </el-table-column>
			<el-table-column
        prop="name"
        header-align="center"
        align="center"
        label="系统名称">
      </el-table-column>
			<el-table-column
        prop="type"
        header-align="center"
        align="center"
        label="任务类型">
      </el-table-column>
			<el-table-column
        prop="person"
        header-align="center"
        align="center"
        label="负责人">
      </el-table-column>
			<el-table-column
        prop="time"
        header-align="center"
        align="center"
        label="时间触发">
      </el-table-column>
			<el-table-column
        prop="ishas"
        header-align="center"
        align="center"
        label="有无依赖">
      </el-table-column>
			<el-table-column
        prop="this"
        header-align="center"
        align="center"
        label="本次执行时间">
      </el-table-column>
			<el-table-column
        prop="wancheng"
        header-align="center"
        align="center"
        label="本次完成时间">
      </el-table-column>
			<el-table-column
        prop="next"
        header-align="center"
        align="center"
        label="下次执行时间">
      </el-table-column>
			</el-table>
		</el-tab-pane>
    <el-tab-pane label="下游任务" name="second">
			<el-table
			  :data="item.content.list"
				border
				width="100%"
			>
			 <el-table-column
        prop="id"
        header-align="center"
        align="center"
        label="任务名称">
      </el-table-column>
			<el-table-column
        prop="name"
        header-align="center"
        align="center"
        label="系统名称">
      </el-table-column>
			<el-table-column
        prop="type"
        header-align="center"
        align="center"
        label="任务类型">
      </el-table-column>
			<el-table-column
        prop="person"
        header-align="center"
        align="center"
        label="负责人">
      </el-table-column>
			<el-table-column
        prop="time"
        header-align="center"
        align="center"
        label="时间触发">
      </el-table-column>
			<el-table-column
        prop="ishas"
        header-align="center"
        align="center"
        label="有无依赖">
      </el-table-column>
			<el-table-column
        prop="this"
        header-align="center"
        align="center"
        label="本次执行时间">
      </el-table-column>
			<el-table-column
        prop="wancheng"
        header-align="center"
        align="center"
        label="本次完成时间">
      </el-table-column>
			<!-- <el-table-column
        prop="next"
        header-align="center"
        align="center"
        label="下次执行时间">
      </el-table-column> -->
			</el-table>
		</el-tab-pane>
  </el-tabs>
  </el-tab-pane>
</el-tabs>
 </el-dialog>
</template>

<script>
export default {
	data () {
		return {
			visible: false,	
			editableTabsValue: '1',
        editableTabs: [{
          title: 'Tab 1',
          name: '1',
          content: {
						tableList:[],
						list:[],
			      activeName: 'second'
					}}],
        tabIndex: 1
		}
	},
	methods: {
		init (row) {
			console.log('row: ', row)
			this.editableTabs
			this.visible = true
		},
		addTab(targetName) {
        let newTabName = ++this.tabIndex + '';
        this.editableTabs.push({
          title: 'New Tab',
          name: newTabName,
          content: 'New Tab content'
        });
        this.editableTabsValue = newTabName
      },
      removeTab(targetName) {
        let tabs = this.editableTabs
        let activeName = this.editableTabsValue
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
              let nextTab = tabs[index + 1] || tabs[index - 1]
              if (nextTab) {
                activeName = nextTab.name;
              }
            }
          })
        }
        this.editableTabsValue = activeName;
        this.editableTabs = tabs.filter(tab => tab.name !== targetName)
      }
	}
}
</script>