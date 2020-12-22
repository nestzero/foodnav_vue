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
        <el-button type="info" @click="login">{{this.loginItem}}</el-button>
      </el-header>
      <!-- 主体 -->
      <el-container>
        <!-- 侧边栏 -->
        <el-aside width="200px">
          <h3><center>Top5</center></h3>
          <!-- 侧边栏菜单区 -->
          <el-menu  background-color="#545c64" text-color="#fff" active-text-color="#409eff"
            :router="true"
            :index="item.oid+''" v-for="item in rankList" :key="item.oid"
          >           
            <el-menu-item>
              <center>
                <span>{{item.realname}} {{'4.9'}}</span>
              </center>              
            </el-menu-item>         
          </el-menu>
        </el-aside>
        <!-- 主体内容 -->
        <el-main>
          <div>
            <!-- 商家主体部分 -->
            <el-card>
              <!-- 间隙 -->
              <el-row :gutter="25">
                <!-- 列宽 -->
                <el-col :span="10">
                  <!-- 搜索区域 -->
                  <el-input placeholder="请输入搜索内容" v-model="queryInfo.query" clearable @clear="getOwnerList">
                    <el-button slot="append" icon="el-icon-search" @click="getOwnerList"></el-button>
                  </el-input>
                </el-col>               
              </el-row>
              <!-- 商家列表 border边框 stripe隔行变色 -->
              <el-table :data="ownerList" border stripe>
                <el-table-column ></el-table-column>
                <el-table-column  prop="addr"></el-table-column>
                <el-table-column  prop="tel"></el-table-column>
                <el-table-column  prop="realname"></el-table-column>
                <el-table-column></el-table-column>
                <el-table-column></el-table-column>
                <el-table-column>
                  <template slot-scope="scope">
                      <!-- 进入该店家界面 -->
                      <el-button type="primary" class="iconfont icon-jinru" size="mini" @click="enterOwner(scope.row.realname)"></el-button>
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
    this.getRankList();
    this.getOwnerList();
    this.getLoginItem();
  },
  data(){
    return{
      rankList:[],//商家列表
      // 查询信息实体
      queryInfo:{
        query:"",//查询信息
        pageNum: 1,//当前页
        pageSize: 5,//每页最大数
      },
      ownerList:[],//用户列表
      total:0,//总记录数
      loginItem:"",//登录按钮名称
    }   
  },
  methods:{
    // 按钮控制
    getLoginItem(){
      const userSession=window.sessionStorage.getItem("user");
      if(userSession!=null){
        this.loginItem="注销";
      }else{
        this.loginItem="登录"
      }
    },
    //注销完成
    login(){
      if(this.loginItem=="登录"){
        this.$router.push("/login");//回到登录界面
      }else if(this.loginItem=="注销"){
        window.sessionStorage.clear();
        this.$router.push("/login")
      }       
        
    },
    // 获取前五商家列表
    async getRankList(){
      const {data:res}= await this.$http.get("rankOwner");
      this.rankList=res.data;
    },
    // 获取所有用户
    async getOwnerList(){
      const {data: res} = await this.$http.get("allOwner?",{params:this.queryInfo});
      this.ownerList=res.data;//用户列表数据封装
      this.total=res.numbers;//总用户数封装
    },
    // 最大数
    handleSizeChange(newSize){
      this.queryInfo.pageSize=newSize;
      this.getOwnerList();
    },
    // pageNum的触发功能
    handleCurrentChange(newPage){
      this.queryInfo.pageNum=newPage;
      this.getOwnerList();
    },
    // 进入商家店面
    enterOwner(realname){

      this.$router.push({
        path:"/ownerPage",
        query:{realname:realname}
      });
     
    },
  }
};
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