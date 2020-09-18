<template>
  <div class="event-wrap">
		<el-form :inline="true" :model="dataForm" ref="dataForm">
			<el-form-item label="属性ID">
				<el-input v-model="dataForm.id" placeholder="" clearable=""></el-input>
			</el-form-item>
			<el-form-item label="属性名称">
				<el-input v-model="dataForm.englishName" placeholder="" clearable=""></el-input>
			</el-form-item>
      <el-form-item label="属性类型">
					<el-select v-model="dataForm.dataStandar">
					<el-option v-for="(item,index) in dataStandarList" :label="item.lable" :value="item.value" :key="index">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="数据类型">
        	<el-select v-model="dataForm.fieldType">
					<el-option v-for="(item,index) in fieldTypeList" :label="item.lable" :value="item.value" :key="index">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="属性状态">
				<el-select v-model="dataForm.enable"  placeholder="指标状态">
          <el-option label="全部" value=""></el-option>
          <el-option label="有效" value="true"></el-option>
          <el-option label="无效" value="false"></el-option>
        </el-select>			
			</el-form-item>
			  <el-form-item>
        <el-button type="primary" @click="searchHandle()">查询</el-button>
        <el-button @click="resetHandle()">重置</el-button>
        <el-button type="success" @click="manualSync()">手动同步</el-button>
      </el-form-item>
		</el-form>
		<el-table  :data="dataList" border v-loading="dataListLoading"  style="width: 100%;">
      <el-table-column prop="elementId" header-align="center" align="center"  label="属性ID" sortable></el-table-column>
      <el-table-column prop="englishName" header-align="center" align="center"  label="属性名称">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" placement="top">
            <div v-html="toBreak(scope.row.englishName)" slot="content"></div>
            <div class="text-to-long-cut">{{scope.row.englishName}}</div>
          </el-tooltip>
        </template>        
      </el-table-column>
      <el-table-column prop="fieldType" header-align="center" align="center" label="数据类型"></el-table-column>
      <el-table-column prop="dataStandar" header-align="center" align="center" label="属性类型"></el-table-column>
      <el-table-column prop="createTime" header-align="center" align="center" width="154" label="创建时间"></el-table-column>
      <el-table-column prop="enable" header-align="center" align="center" label="属性状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.enable === true" size="small" >有效</el-tag>
          <el-tag v-else size="small" type="danger">无效</el-tag>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" width="100" label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="addOrUpdateHandle(scope.row)">查看</el-button>
          <!-- <el-button type="text">查看</el-button> -->
        </template>
      </el-table-column>
		</el-table>
		<el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageNum"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalCount"
      layout="total, sizes, prev, pager, next, jumper"/>
			 <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate"/>
  </div>
</template>
<script>
import { eventIndexManageList } from '@/api/dataAnalysis/eventIndexManage'
import addOrUpdate from './baseComponents/eventIndexManage-add-or-update.vue'
export default {
  data () {
    return {
      dataForm: {
        id: '',
        englishName: '',
        dataStandar: '',
        fieldType: '',
        enable: ''
      },
      dataList: [],
      pageNum: 1, // 当前页
      pageSize: 10, // 默认每页10条
      totalCount: 0,
      addOrUpdateVisible: false,
      dataListLoading: false,
      dataStandarList: [ // 属性类型
        { lable: '全部', value: '' },
        { lable: '自定义属性', value: '自定义属性' },
        { lable: '预置属性', value: '预置属性' }
      ],
      fieldTypeList: [ // 数据类型
        { lable: 'number', value: 'number' },
        { lable: 'enums', value: 'enums' },
        { lable: 'string', value: 'string' },
        { lable: 'date', value: 'date' }
      ] // 所属渠道
    }
  },
  components: { addOrUpdate },
  mounted () {
    this.getDataList()
  },
  methods: {
    // 获取数据列表
    getDataList () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.dataListLoading = true
          let params = {
            ...this.dataForm,
            'pageNum': this.pageNum,
            'pageSize': this.pageSize
          }
          eventIndexManageList(params).then(({data}) => {
            if (!data || (data && (data.status !== '1' || !data.data))) {
              this.dataList = []
              this.totalCount = 0
            } else {
              this.dataList = data.data.list
              this.totalCount = data.data.total
            }
            this.dataListLoading = false
          })
        }
      })
    },

    // 查询
    searchHandle () {
      this.pageNum = 1
      this.getDataList()
    },
    // 重置
    resetHandle () {
      this.pageNum = 1
      this.dataForm = {
        elementId: '',
        elementName: '',
        channelCode: '',
        eventType: '',
        enable: ''
      }
      // this.getDataList()
    },
    // 手动同步
    manualSync () {
      // this.dataListLoading = true
    },
    // 每页数
    sizeChangeHandle (page) {
      this.pageSize = page
      this.pageNum = 1
      this.getDataList()
    },
    // 当前页
    currentChangeHandle (page) {
      this.pageNum = page
      this.getDataList()
    },
    addOrUpdateHandle (row) { // 查看
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(row)
      })
    }
  }
}
</script>
