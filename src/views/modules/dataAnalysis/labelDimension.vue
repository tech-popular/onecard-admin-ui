<template>
<div class="aside-main">
	<div class="dimension-tree">
		<el-input
		  class="code-select"
      placeholder="输入关键字进行过滤"
      v-model="filterText">
    </el-input>
		<el-tree
			class="filter-tree"
			:data="treeData"
			:props="defaultProps"
			default-expand-all
			:filter-node-method="filterNode"
			ref="tree">
	    <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span>
					 <el-button
            v-if="node.id === 0"
            type="text"
            size="mini"
            @click="() => append()">
            添加维度
          </el-button>
          <el-button
            type="text"
            size="mini"
            @click="() => append(data)">
            修改
          </el-button>
          <el-button
            type="text"
            size="mini"
            @click="() => remove(node, data)">
            删除
          </el-button>
        </span>
      </span>
		</el-tree>
	</div>
	<div class="main-center">
    <div class="main-content-top">
			<div class="main-content-title">
        <h4>性别</h4>
				<span class="title-code">编码：123456</span>
		</div>
     <el-button  @click="changeHandle()">添加值</el-button>
		</div>
		<el-table :data="dataList" border style="width: 100%;">
				<el-table-column prop="code" header-align="center" align="center" label="维度code"></el-table-column>
				<el-table-column prop="modify" header-align="center" align="center" label="修饰值"></el-table-column>
				<el-table-column header-align="center" align="center" label="操作">
					<template slot-scope="scope">
						<el-button type="text" size="small"  @click="changeHandle(scope.row)">修改名称</el-button>
						<el-button type="text" size="small"  @click="deleteHandle(scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
	</div>
	    <!-- 维度Code -->
    <el-dialog :visible.sync="modifyaddorupdate" width="600px">
      <el-form :model="dataForm" ref="dataForm" :rules="dataRule" label-width="100px"  >
        <el-form-item label="维度code" prop="code">
          <el-input v-model="dataForm.code" placeholder="请输入编码" type="text"></el-input>
        </el-form-item>
        <el-form-item prop="modify" label="修饰值">
          <el-input v-model="dataForm.modify" placeholder="请输入" type="text"></el-input>
        </el-form-item>
      </el-form>
			<div slot="footer" class="foot">
        <el-button type="primary" @click="modifySubmit()">确认</el-button>
        <el-button type="primary" @click="modifyCancel()">取消</el-button>
    </div>
    </el-dialog>
			    <!-- 维度 -->
    <el-dialog :visible.sync="addorupdate" width="600px">
      <el-form :model="baseForm" ref="baseForm" :rules="baseRule" label-width="100px">
        <el-form-item label="维度名称" prop="name">
          <el-input v-model="baseForm.name" placeholder="请输入维度名称" type="text"></el-input>
        </el-form-item>
        <el-form-item prop="code" label="维度编码">
          <el-input v-model="baseForm.code" placeholder="请输入维度编码" type="text"></el-input>
        </el-form-item>
      </el-form>
			<div slot="footer" class="foot">
        <el-button type="primary" @click="submit()">确认</el-button>
        <el-button type="primary" @click="cancel()">取消</el-button>
    </div>
    </el-dialog>
</div>
</template>
<script>
import { selectAllGroupTypeNum } from '@/api/dataAnalysis/labelDimension'
export default {
  data () {
    return {
      filterText: '',
      addorupdate: false,
      modifyaddorupdate: false,
      treeData: [{
        id: 0,
        label: '标签维度',
        children: []
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      dataList: [
        {
          'code': 1,
          'modify': 2
        }
      ],
      dataForm: {
        code: '',
        modify: ''
      },
      baseForm: {
        code: '',
        name: ''
      },
      dataRule: {
        code: [
          { required: true, message: '维度code不能为空', trigger: 'blur' }
        ],
        modify: [
          { required: true, message: '修饰值不能为空', trigger: 'blur' }
        ]
      },
      baseRule: {
        code: [
          { required: true, message: '维度编码不能为空', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '维度名称不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  mounted () {
    this.getSelectAllGroupTypeNum()
  },
  methods: {
    getSelectAllGroupTypeNum () {
      selectAllGroupTypeNum().then(({ data }) => {
        console.log('data: ', data)
        if (data && data.status === '1') {
          this.treeData[0].children.push(data.data)
        }
      })
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    append(data) {
      this.addorupdate = true
      this.baseForm.code = data ? data.code : ''
      this.baseForm.name = data ? data.name : ''
    },

    remove(node, data) {
      const parent = node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex(d => d.id === data.id)
      children.splice(index, 1)
    },
    changeHandle (row) {
      this.modifyaddorupdate = true
      this.dataForm.code = row ? row.code : ''
      this.dataForm.modify = row ? row.modify : ''
    },
    deleteHandle() {},
    modifySubmit () {
      this.$refs['dataForm'].validate(valid => {
      })
    },
    modifyCancel () {
      this.modifyaddorupdate = false
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
      })
    },
    submit () {
      this.$refs['baseForm'].validate(valid => {
      })
    },
    cancel () {
      this.addorupdate = false
      this.$nextTick(() => {
        this.$refs['baseForm'].resetFields()
      })
    }
  }
}
</script>
<style scoped>
  .aside-main {
	  box-sizing: border-box;
    height: 100%;
    overflow: hidden;
		display: flex;
  }
  .dimension-tree {
	  width: 320px;
	  position: relative;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    height: 100%;
    min-height: 300px;
    overflow: hidden;
	  border: 1px solid #e6e6e6;
  }
	.code-select {
		position: relative;
    box-sizing: border-box;
    display: flex;
    flex: 0 0 46px;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 6px;
	}
	.main-center {
		width: 100%;
    overflow: hidden;
		padding-left: 20px;
		/* border: 1px solid #e6e6e6; */
	}
	.custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
		padding-left: 10px;
  }
	.main-content-top {
		display: flex;
    align-items: flex-start;
    justify-content: space-between;
    width: 100%;
    padding: 0;
    padding-right: 10px;
		 align-items: center;
    background-color: transparent;
	}
	.main-content-title {
		display: flex;
    align-items: flex-start;
    align-items: center;
		padding-left: 20px;
	}
	.title-code {
		padding-left: 20px;
	}
	.el-tree {
    flex: 1 1 100%;
    width: 100%;
    overflow-y: auto;
  }
	.custom-tree-node {
      align-items: center;
      justify-content: space-between;
      font-size: 14px;
	}
	.el-tree-node__content {
		height: 40px !important;
	}
	.el-tree-node.is-current  .el-tree-node__content{
			background-color: #409eff;
	}
</style>