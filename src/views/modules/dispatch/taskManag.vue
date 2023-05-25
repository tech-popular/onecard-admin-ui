<template>
  <div>
    <searchForm
      size="mini"
      labelWidth="100px"
      :searchData="searchData"
      :searchForm="searchForm"
      :searchHandle="searchHandle"
    ></searchForm>
    <tab :list="list" :columns="columns" :operates="operates" :fixed="operatesFixed" :operates-width="operatesWidth" :is-selection="isAdmin" @selection-change="handleSelectionChange"/>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageNum"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper"
    />
    <!-- 弹窗, 新增 / 修改同步任务 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="init" />
    <!-- 弹窗, 新增 / 修改计算任务 -->
    <comput-add-or-update
      v-if="computAddOrUpdateVisible"
      ref="computAddOrUpdate"
      @refreshDataList="init"
    />
        <!-- 弹窗, 新增 / 修改计算任务 -->
    <AddDBTPop
      v-if="addDBTVisible"
      ref="addDBTRef"
      @refreshDataList="init"
    />
    <!--调度配置-->
    <dispatch-config-add-or-update v-if="dispatchConfigAddOrUpdateVisible" ref="dispatchConfigAddOrUpdate" @refreshDataList="init" />
    <!-- 授权 -->
    <assign-permission v-if="assignPermissionVisible" :submitDataApi= "submitDataApi" :submitDataApis="submitDataApis" ref="assignPermission" @refreshDataList="init"></assign-permission>
    <!-- 依赖快照 -->
    <taskManag-snap-shot v-if="taskManagSnapShotVisible" ref="taskManagSnapShot"></taskManag-snap-shot>
  </div>
</template>

<script>
import AddOrUpdate from './taskManag-add-or-update'
import ComputAddOrUpdate from './compute-add-or-update'
import AddDBTPop from './add-DBT-pop'
import dispatchConfigAddOrUpdate from './dispatchConfig-add-or-update'
import AssignPermission from '../../components/permission/assign-permission'
import taskManagSnapShot from './taskManag-snap-shot'
import { models } from '../../components/actions/dispatch/taskManag'
export default {
  mixins: [models],
  components: {
    AddDBTPop,
    AddOrUpdate,
    ComputAddOrUpdate,
    dispatchConfigAddOrUpdate,
    AssignPermission,
    taskManagSnapShot
  }
}
</script>
