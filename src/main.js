import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 添加全局样式
import  './assets/css/global.css'
//引入iconfont
import  './assets/font/iconfont.css'
//导入axios
import axios from 'axios'

import format from 'date-fns/format';

// 引入Ant Design Vue
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
Vue.config.productionTip = false;

Vue.use(Antd);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})

import { Message, MessageBox } from 'element-ui'  //引入Message, MessageBox

Vue.prototype.$message = Message                //vue实例上挂载Message                
Vue.prototype.$messagebox = MessageBox             //vue实例上挂载MessageBox 


//挂载axios
Vue.prototype.$http=axios
//设置访问根路径
axios.defaults.baseURL="http://localhost:9090"

Vue.config.productionTip = false

Vue.filter('date',(date)=>{
  return format(new Date(date),'yyyy-MM-dd')
})



new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
