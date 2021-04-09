<template>
  <div>
    <div>
      <el-menu
        :default-active="activeIndex2"
        class="el-menu-demo"
        mode="horizontal"
        @select="handleSelect"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
      >
        <el-menu-item @click="EnterOr">{{ this.loginButton }}</el-menu-item>
        <el-submenu index="2" class="mens">
          <template slot="title">区域选择</template>
          <el-menu-item index="2-1" @click="getAreaInside"
            >校内范围</el-menu-item
          >
          <el-menu-item index="2-2" @click="getAreaOutside"
            >校外周边</el-menu-item
          >
        </el-submenu>
        <div class="header_navbar">
          <!-- 注销按钮 -->
          <el-button class="buts" type="info" @click="login">{{
            this.loginItem
          }}</el-button>
        </div>
      </el-menu>
    </div>
    <div>
      <!-- 引入container布局 -->
      <el-container class="home-container">
        <!-- 主体 -->
        <el-container>
          <!-- 主体内容 -->
          <el-main>
            <div>
              <!-- 商家主体部分 -->
              <el-card>
                <el-dropdown style="margin-left: 950px">
                  <span class="el-dropdown-link">
                    排序<i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="getAscOwnerList()"
                      >升序</el-dropdown-item
                    >
                    <el-dropdown-item @click.native="getDescOwnerList()"
                      >降序</el-dropdown-item
                    >
                  </el-dropdown-menu>
                </el-dropdown>
                <el-row>
                  <el-col
                    :span="10"
                    v-for="(items, index) in ownerList"
                    :key="index"
                    class="pad1"
                  >
                    <el-card
                      :body-style="{ margin: '0 20px', padding: '0 20px' }"
                    >
                      <img
                        :src="'http://localhost:9090/api/file/' + items.pic"
                        class="avatar"
                        style="height:500px;width:400px"
                      />
                      <div style="padding: 14px">
                        <span>{{ items.realname }} {{ items.addr }}</span>
                        <div class="bottom clearfix">
                          <el-rate
                            v-model="items.star"
                            disabled
                            text-color="#ff9900"
                          >
                          </el-rate>
                          <el-button
                            style="margin-left: 210px"
                            type="primary"
                            class="iconfont icon-biaoqiankuozhan_taolun-169 bottom-btn-insert"
                            size="mini"
                            @click="enterOwnerInfo(items.realname, items.pic)"
                          ></el-button>
                          <el-button
                            style="margin-left: 27f0px"
                            type="primary"
                            class="iconfont icon-jinru bottom-btn-remark"
                            size="mini"
                            @click="enterOwner(items.realname)"
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
          <!-- 侧边栏 -->
          <el-aside width="210px">
            <h3 style="margin-top: 20px"><center>热评TO5</center></h3>
            <!-- 侧边栏菜单区 -->
            <el-menu
              background-color="white"
              text-color="#3a3a3b"
              active-text-color="#ffd04b"
              :router="true"
              :index="item.oid + ''"
              v-for="item in rankList"
              :key="item.oid"
            >
              <el-menu-item @click="enterOwner(item.realname)">
                <div style="margin-left: 5px">
                  <img
                    :src="'http://localhost:9090/api/file/' + item.pic"
                    class="avatar"
                    style="height: 50px; width: 50px"
                  />
                  {{ item.realname }}
                  {{ item.star }}
                </div>
              </el-menu-item>
            </el-menu>
            <h3 style="margin-top: 50px"><center>新开张商家</center></h3>
            <el-menu
              background-color="white"
              text-color="#3a3a3b"
              active-text-color="#ffd04b"
              :router="true"
              :index="item.oid + ''"
              v-for="item in newList"
              :key="item.oid"
            >
              <el-menu-item @click="enterOwner(item.realname)">
                <div style="margin-left: 5px">
                  <img
                    :src="'http://localhost:9090/api/file/' + item.pic"
                    class="avatar"
                    style="height: 50px; width: 50px"
                  />
                  {{ item.realname }}
                  {{ item.star }}
                </div>
              </el-menu-item>
            </el-menu>
          </el-aside>
        </el-container>
      </el-container>
    </div>
  </div>
</template>
<script>
export default {
  created() {
    this.getRankList();
    this.getOwnerList();
    this.getLoginItem();
    this.getLoginButton();
    this.getNewList();
  },
  data() {
    return {
      rankList: [], //商家列表
      newList: [], //新商家列表
      // 查询信息实体
      queryInfo: {
        query: "", //查询信息
        pageNum: 1, //当前页
        pageSize: 4, //每页最大数
      },
      ownerList: [], //用户列表
      total: 0, //总记录数

      activeIndex: "1",
      activeIndex2: "1",
      loginButton: "", //首页按钮
      area: "",
    };
  },
  methods: {
    // 绘制前后台进入按钮
    getLoginButton() {
      const root = window.sessionStorage.getItem("root");
      if (root == "1") {
        this.loginButton = "进入后台";
      } else if (root == "2") {
        this.loginButton = "进入后台";
      } else {
        this.loginButton = "美食向导网站";
      }
    },
    // 按钮控制
    getLoginItem() {
      const userSession = window.sessionStorage.getItem("user");
      if (userSession != null) {
        this.loginItem = "注销";
      } else {
        this.loginItem = "登录";
      }
    },
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
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
    EnterOr() {
      const root = window.sessionStorage.getItem("root");
      if (root == "1") {
        this.$router.push({ path: "/page" }); //页面跳转
      } else if (root == "2") {
        this.$router.push({ path: "/pageOwner" });
      } else {
        this.$router.push({ path: "/indexPage" });
      }
    },
    // 获取前五商家列表
    async getRankList() {
      const { data: res } = await this.$http.get("rankOwner");
      this.rankList = res.data;
    },
    // 获取所有用户
    async getOwnerList() {
      const { data: res } = await this.$http.get("allOwner?", {
        params: this.queryInfo,
      });
      this.ownerList = null;
      this.ownerList = res.data; //用户列表数据封装
      this.total = res.numbers; //总用户数封装
    },
    async getNewList() {
      const { data: res } = await this.$http.get("newOwner");
      this.newList = res.data;
    },
    // 最大数
    handleSizeChange(newSize) {
      this.queryInfo.pageSize = newSize;
      if (this.queryInfo.query == "校内") {
        this.getAreaInside();
      } else if (this.queryInfo.query == "校外") {
        this.getAreaOutside();
      } else {
        this.getOwnerList();
      }
    },
    // pageNum的触发功能
    handleCurrentChange(newPage) {
      this.queryInfo.pageNum = newPage;
      if (this.queryInfo.query == "校内") {
        this.getAreaInside();
      } else if (this.queryInfo.query == "校外") {
        this.getAreaOutside();
      } else {
        this.getOwnerList();
      }
    },
    // 进入商家店面
    enterOwner(realname) {
      this.$router.push({
        path: "/ownerPage",
        query: { realname: realname },
      });
    },
    enterOwnerInfo(realname, pic) {
      this.$router.push({
        path: "/ownerInfo",
        query: { realname: realname, pic: pic },
      });
    },
    //区域选择
    async getAreaInside() {
      this.queryInfo.query = "校内";
      const { data: res } = await this.$http.get("getArea", {
        params: this.queryInfo,
      });
      this.ownerList = [];
      this.ownerList = res.data;
      this.total = res.numbers; //总用户数封装
      console.log(this.ownerList);
    },
    async getAreaOutside() {
      this.queryInfo.query = "校外";
      const { data: res } = await this.$http.get("getArea", {
        params: this.queryInfo,
      });
      this.ownerList = [];
      this.ownerList = res.data;
      this.total = res.numbers; //总用户数封装
      console.log(this.ownerList);
    },
    async getAscOwnerList() {
      const { data: res } = await this.$http.get("getAscOwnerList?", {
        params: this.queryInfo,
      });
      this.ownerList = null;
      this.ownerList = res.data; //用户列表数据封装
      this.total = res.numbers; //总用户数封装
    },
    async getDescOwnerList() {
      const { data: res } = await this.$http.get("getDescOwnerList?", {
        params: this.queryInfo,
      });
      this.ownerList = null;
      this.ownerList = res.data; //用户列表数据封装
      this.total = res.numbers; //总用户数封装
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
  background-color: white;
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
  background-color: #f8f8fa;
}
//主体样式
.el-main {
  background-color: #eaedf1;
}
.buts {
  border: none;
  vertical-align: middle;
  margin-left: 83%;
  margin-top: 12px;
}
.mens {
  position: absolute;
  margin-left: 600px;
}

.time {
  font-size: 13px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
  height: 24px;
  position: relative;
}
.bottom-btn-insert {
  position: absolute;
  left: 100px;
  top: -5px;
}
.bottom-btn-remark {
  position: absolute;
  left: 200px;
  top: -5px;
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
