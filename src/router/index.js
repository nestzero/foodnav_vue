import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'//引入login组件
import Page from '../components/Page.vue'//引入Page组件
import PageMain from '../components/PageMain.vue'//引入PageMain组件
import UserList from '../components/Manage/UserList.vue'//引入UserList组件
import OwnerList from '../components/Manage/OwnerList.vue'//引入ownerList组件

Vue.use(VueRouter)

const routes = [
  {
    path:"/",
    redirect:"/login"
  },
  {
    path:"/login",
    component:Login,
  },
  {
    path:"/page",
    component:Page,
    redirect:"/pageMain",
    children:[
      {path:"/pageMain",component:PageMain},
      {path:"/userlist",component:UserList},
      {path:"/ownerlist",component:OwnerList}
    ]
  },
]

const router = new VueRouter({
  routes
})

//出现问题的时候使用
const originalPush=VueRouter.prototype.push
VueRouter.prototype.push=function push(location,onResolve,onReject){
  if(onResolve||onReject) return originalPush.call(this,location,onResolve,onReject);
  return originalPush.call(this,location).catch(err => err)
}

//挂载路由导航守卫
router.beforeEach((to,from,next)=>{
  //to将要访问，
  // from从哪访问，
  // next接下来干啥 next(url) 重定向到url上 next() 继续访问 to路径
  if(to.path=='/login') return next();
  //获取user
  const userFlag=window.sessionStorage.getItem("user");//取出当前用户
  if(!userFlag) return next('/login'); //无值，返回登录页
  next();//符合要求 放行
})

export default router
