<template>
  <!-- 引入container布局 -->
    <el-container class="home-container">
      <!-- 头部 -->
      <el-header>
        <!-- 前台首页跳转 -->
        <el-menu  background-color="#545c64" text-color="#fff" active-text-color="#409eff"
        >
          <el-menu-item type="info" @click="indexPage">进入前台</el-menu-item>
        </el-menu>
        <!-- 管理员logo -->
        <span class="iconfont icon-guanliyuan">网站后台管理</span>
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
            <!--菜品管理-->
            <el-menu-item index="/foodlist" class="iconfont icon-shiwu" @click="saveNavState('/foodlist')">菜品管理</el-menu-item>
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
  created(){

  },
  data(){
    return{
      activePath:'/pageMain',//默认路径
    }
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
    //保存路径
    saveNavState(activePath){
      window.sessionStorage.setItem('activePath',activePath);//存方在session里
      this.activePath=activePath;
    }
  }
}
</script>
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