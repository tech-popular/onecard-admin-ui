<template>
  <div>
    <div class="search-content">
      <div class="search-title">搜索服务</div>
      <div class="search-pane">
        <el-card class="box-card" shadow="hover">
          <el-row>
            <el-col :span="4"><div class="grid-content bg-purple">21212</div></el-col>
            <el-col :span="20"><div class="grid-content bg-purple-light">32323</div></el-col>
          </el-row>
          <el-row>
            <el-col :span="24"><div class="grid-content bg-purple-dark">54545</div></el-col>
          </el-row>
        </el-card>
        <el-card class="box-card" shadow="hover">
          <el-row :gutter="20">
            <el-col :span="4"><div class="grid-content bg-purple">21212</div></el-col>
            <el-col :span="20"><div class="grid-content bg-purple-light">32323</div></el-col>
          </el-row>
          <el-row>
            <el-col :span="24"><div class="grid-content bg-purple-dark">54545</div></el-col>
          </el-row>
        </el-card>
        <el-card class="box-card" shadow="hover">
          <el-row :gutter="20">
            <el-col :span="4"><div class="grid-content bg-purple">21212</div></el-col>
            <el-col :span="20"><div class="grid-content bg-purple-light">32323</div></el-col>
          </el-row>
          <el-row>
            <el-col :span="24"><div class="grid-content bg-purple-dark">54545</div></el-col>
          </el-row>
        </el-card>
        <el-card class="box-card" shadow="hover">
          <el-row :gutter="20">
            <el-col :span="4"><div class="grid-content bg-purple">21212</div></el-col>
            <el-col :span="20"><div class="grid-content bg-purple-light">32323</div></el-col>
          </el-row>
          <el-row>
            <el-col :span="24"><div class="grid-content bg-purple-dark">54545</div></el-col>
          </el-row>
        </el-card>
        <el-card class="box-card" shadow="hover">
          <el-row :gutter="20">
            <el-col :span="4"><div class="grid-content bg-purple">21212</div></el-col>
            <el-col :span="20"><div class="grid-content bg-purple-light">32323</div></el-col>
          </el-row>
          <el-row>
            <el-col :span="24"><div class="grid-content bg-purple-dark">54545</div></el-col>
          </el-row>
        </el-card>
        <el-card class="box-card" shadow="hover">
          <el-row :gutter="20">
            <el-col :span="4"><div class="grid-content bg-purple">21212</div></el-col>
            <el-col :span="20"><div class="grid-content bg-purple-light">32323</div></el-col>
          </el-row>
          <el-row>
            <el-col :span="24"><div class="grid-content bg-purple-dark">54545</div></el-col>
          </el-row>
        </el-card>
        <el-card class="box-card" shadow="hover">
          <el-row :gutter="20">
            <el-col :span="4"><div class="grid-content bg-purple">21212</div></el-col>
            <el-col :span="20"><div class="grid-content bg-purple-light">32323</div></el-col>
          </el-row>
          <el-row>
            <el-col :span="24"><div class="grid-content bg-purple-dark">54545</div></el-col>
          </el-row>
        </el-card>
      </div>
    </div>
    <div class="recommend-content">
      <div class="search-title">推荐服务</div>
    </div>
  </div>
</template>
<style scoped>
  .search-title {
    padding-bottom: 10px;
    font-size: 16px;
  }
  .search-pane {
    width: 100%;
    padding-bottom: 50px;
    overflow: hidden;
  }
  .box-card {
    width: 300px;
    height: 200px;
    float: left;
    margin: 0 20px 20px 0;
  }
  .box-card:nth-child(5n) {
    margin-right: 0;
  }
</style>
