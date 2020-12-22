<template>
  <!-- 引入container布局 -->
  <el-container class="home-container">
    <!-- 头部 -->
    <el-header>
      <!-- 管理员logo -->
      <span class="iconfont icon-home">首页</span>
      <!-- 导航 -->
      <el-menu  background-color="#545c64" text-color="#fff" active-text-color="#409eff"
      >
        <!-- 区域选择 -->
        <el-submenu  index="2" mode="horizontal">
          <template slot="title">区域选择</template>
          <el-menu-item index="2-1">校内范围</el-menu-item>
          <el-menu-item index="2-2">校外周边</el-menu-item>
        </el-submenu>
      </el-menu> 
      <!-- 注销按钮 -->
      <el-button type="info" @click="login">登录</el-button>
    </el-header>
    <!-- 主体 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200px">
         <h3><center>Top5</center></h3>
          <!-- 侧边栏菜单区 -->
          <el-menu  background-color="#545c64" text-color="#fff" active-text-color="#409eff"
            :router="true"
            :index="item.fid+''" v-for="item in rankFood" :key="item.fid"
          >           
            <el-menu-item>
              <center>
                <span>{{item.foodname}} {{'4.9'}}</span>
              </center>              
            </el-menu-item>         
          </el-menu>
      </el-aside>
      <!-- 主体内容 -->
      <el-main>
        <div>
          <!-- 商家主体部分 -->
          <el-card>
            <!-- 商家列表 border边框 stripe隔行变色 -->
            <el-table :data="foodList" border stripe>
              <el-table-column type="index"></el-table-column>
              <el-table-column></el-table-column>
              <el-table-column label="菜品" prop="foodname"></el-table-column>
              <el-table-column label="单价" prop="price"></el-table-column>             
              <el-table-column></el-table-column>
              <el-table-column>
                <template slot-scope="scope">
                    <!-- 进入该店家界面 -->
                    <el-button type="primary" class="iconfont icon-jinru" size="mini" @click="enterOwner(scope.row.foodname)"></el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页组件 size-change每页最大变化数 current-change当前最大变化数 layout功能组件-->
            <div>
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pageNum"
                :page-sizes="[1, 2, 5, 100]"
                :page-size="queryInfo.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
              </el-pagination>
            </div>
          </el-card>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  created(){
    this.getRankFood();
    this.getFoodList();
  },
  data(){
    return{
      rankFood:[],//食物排行   
      // 查询信息实体
      queryInfo:{
        pageNum: 1,//当前页
        pageSize: 5,//每页最大数
      },   
      foodList:[],//食物列表
      total:0,//总记录数
    }  
  },
  methods:{
     //注销完成
    login(){
        this.$router.push("/login");//回到登录界面
    },
    // 获取前五商品列表
    async getRankFood(){
      const {data:res}= await this.$http.get("rankFood?realname1="+this.$route.query.realname);     
      this.rankFood=res.data; 
    },   
    //获取商家对应的商品列表
    async getFoodList(){
      const {data:res}=await this.$http.get("allFood?realname1="+this.$route.query.realname+
                                            "&pageStart="+this.queryInfo.pageNum+
                                            "&pageSize="+this.queryInfo.pageSize);
      this.foodList=res.data;
      this.total=res.numbers;
    },
     // 最大数
    handleSizeChange(newSize){
      this.queryInfo.pageSize=newSize;
      this.getFoodList();
    },
    // pageNum的触发功能
    handleCurrentChange(newPage){
      this.queryInfo.pageNum=newPage;
      this.getFoodList();
    },
  }
}
</script>
<style lang="less" scoped>
//布局器样式
.home-container{
    height:100%;
}
//头样式
.el-header{
    background-color: #6c7377;
    display: flex;
    justify-content: space-between; //左右贴边
    padding-left: 0%; //左边界
    font-size:20px;
    display:flex;
    align-items: center;
}
.el-header span{
  margin-left: 15px;
}
.el-header .el-menu{
  // position: absolute;
  border-right:none;
}
//侧边栏样式
.el-aside{
    background-color: #8590b4;  
    height:350px; 
}
//主体样式
.el-main{
    background-color: #eaedf1;
}
</style>