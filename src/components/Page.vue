<template>
    
    <!-- 引入container布局 -->
    <el-container class="home-container">
        <!-- 头部 -->
        <el-header>
          <!-- 管理员logo -->
          <span class="iconfont icon-guanliyuan">网站后台管理</span>
          <!-- 前台首页跳转 -->
          <el-button type="info" @click="indexPage">进入前台</el-button>
          <!-- 注销按钮 -->
          <el-button type="info" @click="logout">注销</el-button>
        </el-header>
        <!-- 主体 -->
        <el-container>
            <!-- 侧边栏 -->
            <el-aside width="200px">
              <el-menu  background-color="#545c64" text-color="#fff" active-text-color="#409eff"
                :router="true"
                :default-active="activePath">
                  <!-- 用户管理 -->
                  <el-menu-item index="/userlist" class="iconfont icon-ziyuan111" @click="saveNavState('/userlist')">用户管理</el-menu-item>
                  <!--商家管理-->
                  <el-menu-item index="/ownerlist" class="iconfont icon-shangpu" @click="saveNavState('/ownerlist')">商家管理</el-menu-item>
                  <!-- 评论管理 -->
                  <el-menu-item index="/commitlist" class="iconfont icon-pinglun" @click="saveNavState('/commentlist')">评论管理</el-menu-item>                 
              </el-menu>
            </el-aside>
            <!-- 主体内容 -->
            <el-main>
              <router-view></router-view>
            </el-main>
        </el-container>

    </el-container>

</template>
<script>
export default {
  data(){
    return{
      //菜单列表
      menuList:[],
      activePath:'/pageMain',//默认路径
    }
  },
  //onload事件
  created(){
    //查询menuList
    this.getMenuList();
    this.activePath=window.sessionStorage.getItem('activePath');//取出session里的path，动态修改
  },
  methods:{
      // 首页跳转
      indexPage(){
        this.$router.push("/indexPage");//回到前台首页
      },
      //注销完成
      logout(){
          window.sessionStorage.clear();//清除session
          this.$router.push("/login");//回到登录界面
      },
      //获取导航菜单方法
      async getMenuList(){
        const {data:res} = await this.$http.get("menus");
        console.log(res);
        if(res.flag!=200) return this.$message.error("获取列表失败!");//访问失败
        this.menuList=res.menus;//数据回填
      },
      //保存路径
      saveNavState(activePath){
        window.sessionStorage.setItem('activePath',activePath);//存方在session里
        this.activePath=activePath;
      }
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
//侧边栏样式
.el-aside{
    background-color: #8590b4;
}
.el-menu{
  border-right:none;
}
//主体样式
.el-main{
    background-color: #eaedf1;
}
</style>