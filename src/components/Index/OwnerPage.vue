<template>
  <!-- 引入container布局 -->
  <el-container class="home-container">
    <!-- 头部 -->
    <el-header>
      <!-- 管理员logo -->
      <el-breadcrumb>
        <el-breadcrumb-item
          :to="{ path: '/indexPage' }"
          class="iconfont icon-meishi"
          ><span>首页</span></el-breadcrumb-item
        >
      </el-breadcrumb>
      <!-- 商家-->
      <span>{{ this.$route.query.realname }}</span>
      <!-- 注销按钮 -->
      <el-button type="info" @click="login">{{ this.loginItem }}</el-button>
    </el-header>
    <!-- 主体 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200px">
        <h3><center>Top5</center></h3>
        <!-- 侧边栏菜单区 -->
        <el-menu
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#409eff"
          :router="true"
          :index="item.fid + ''"
          v-for="item in rankFood"
          :key="item.fid"
        >
          <el-menu-item>
            <center>
              <span>{{ item.foodname }} {{ "4.9" }}</span>
            </center>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <!-- 主体内容 -->
      <el-main>
        <div>
          <!-- 商家主体部分 -->
          <el-card>
            <el-dropdown style="margin-left: 850px">
              <span class="el-dropdown-link">
                菜品类型<i class="el-icon-arrow-down el-icon--right"></i>
              </span>

              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="getFoodList()"
                  >重置</el-dropdown-item
                >
                <el-dropdown-item
                  v-for="(items, index) in genreList"
                  :key="index"
                  @click.native="GenreList(items)"
                  >{{ items }}</el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
            <el-row>
              <el-col
                :span="10"
                v-for="(items, index) in foodList"
                :key="index"
                class="pad1"
              >
                <el-card :body-style="{ margin: '0 20px', padding: '0 20px' }">
                  <img
                    :src="'http://localhost:9090/api/file/' + items.pic"
                    class="avatar"
                    style="height: 500px; width: 400px"
                  />
                  <div style="padding: 14px">
                    <span>{{ items.foodname }} {{ items.price }}</span>
                    <div class="bottom clearfix">
                      <span>{{ items.genre }} {{ items.star }}</span>
                      <el-button
                        style="margin-left: 250px"
                        type="primary"
                        class="iconfont icon-jinru"
                        size="mini"
                        @click="enterFood(items.fid, items.foodname, items.pic)"
                      ></el-button>
                    </div>
                  </div>
                </el-card>
              </el-col>
            </el-row>

            <!-- 分页组件 size-change每页最大变化数 current-change当前最大变化数 layout功能组件-->
            <div>
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pageNum"
                :page-sizes="[1, 2, 4, 100]"
                :page-size="queryInfo.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
              >
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
  created() {
    this.getRankFood();
    this.getFoodList();
    this.getLoginItem();
    this.getGenreList();
  },
  data() {
    return {
      rankFood: [], //食物排行
      // 查询信息实体
      queryInfo: {
        pageNum: 1, //当前页
        pageSize: 4, //每页最大数
      },
      foodList: [], //食物列表
      total: 0, //总记录数
      loginItem: "", //登录按钮名称
      genreList: [], //菜品类型列表
    };
  },
  methods: {
    // 按钮控制
    getLoginItem() {
      const userSession = window.sessionStorage.getItem("user");
      if (userSession != null) {
        this.loginItem = "注销";
      } else {
        this.loginItem = "登录";
      }
    },
    //注销完成
    login() {
      if (this.loginItem == "登录") {
        this.$router.push("/login"); //回到登录界面
      } else if (this.loginItem == "注销") {
        window.sessionStorage.clear();
        this.$router.push("/login");
      }
    },
    // 回到首页
    IndexPage() {
      this.$router.push("/indexPage");
    },
    // 获取前五商品列表
    async getRankFood() {
      const { data: res } = await this.$http.get(
        "rankFood?realname1=" + this.$route.query.realname
      );
      this.rankFood = res.data;
    },
    //获取商家对应的商品列表
    async getFoodList() {
      const { data: res } = await this.$http.get(
        "allFood?realname1=" +
          this.$route.query.realname +
          "&pageStart=" +
          this.queryInfo.pageNum +
          "&pageSize=" +
          this.queryInfo.pageSize
      );
      this.foodList = res.data;
      this.total = res.numbers;
    },
    async getGenreList() {
      const { data: res } = await this.$http.get(
        "getGenreList?realname1=" + this.$route.query.realname
      );
      this.genreList = res.data;
    },
    async GenreList(genre) {
      const { data: res } = await this.$http.get(
        "genreList?genre=" +
          genre +
          "&pageStart=" +
          this.queryInfo.pageNum +
          "&pageSize=" +
          this.queryInfo.pageSize
      );
      this.foodList = res.data;
      this.total = res.numbers;
    },
    // 最大数
    handleSizeChange(newSize) {
      this.queryInfo.pageSize = newSize;
      this.getFoodList();
    },
    // pageNum的触发功能
    handleCurrentChange(newPage) {
      this.queryInfo.pageNum = newPage;
      this.getFoodList();
    },
    //查看相关商品的点评及详情
    enterFood(fid, foodname, pic) {
      this.$router.push({
        path: "/foodPage",
        query: {
          fid: fid,
          foodname: foodname,
          realname: this.$route.query.realname,
          pic: pic,
        },
      });
    },
  },
};
</script>
<style lang="less" scoped>
//布局器样式
.home-container {
  height: 100%;
}
//头样式
.el-header {
  background-color: #6c7377;
  display: flex;
  justify-content: space-between; //左右贴边
  padding-left: 0%; //左边界
  font-size: 20px;
  display: flex;
  align-items: center;
}
.el-header span {
  margin-left: 15px;
}
.el-header .el-menu {
  // position: absolute;
  border-right: none;
}
//侧边栏样式
.el-aside {
  background-color: #8590b4;
  height: 350px;
}
//主体样式
.el-main {
  background-color: #eaedf1;
}
// 面包屑样式
.el-breadcrumb {
  margin-bottom: 10px;
  font-size: 12px;
}

.time {
  font-size: 13px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.button {
  padding: 0;
  float: right;
}

.image {
  width: 100%;
  display: block;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}
.el-col-offset-2 {
  margin: 0 !important;
}
.el-pad1 {
  padding: 0 10px;
}
.pad1 {
  margin: 30px;
}
</style>