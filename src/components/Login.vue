<template>
  <div class="login_container">
      <!-- 登录模块 -->
      <div class="login_box">

          <div class="avatar_box">
            <img src="../assets/logo.png" alt=/>
          </div>


          <!--表单区域-->
          <el-form ref="loginFormRef" :rules="loginRules" :model="loginForm" class="login_form" label-width="0px">
            <!-- 用户名 -->
            <el-form-item prop="username">
              <el-input v-model="loginForm.username" prefix-icon="iconfont icon-denglu"></el-input>
            </el-form-item>

            <!-- 密码 -->
            <el-form-item prop="password">
              <el-input v-model="loginForm.password" prefix-icon="iconfont icon-mima" type="password"></el-input>
            </el-form-item>

            <!-- 按钮 -->
            <el-form-item class="btns">        
              <el-button type="primary" @click="login()">登录</el-button>
              <el-button type="info" @click="resetLoginForm()">重置</el-button>            
            </el-form-item>
            
          </el-form>

      </div>

    </div>
</template>
<script>
export default {
  data(){
    return{
      loginForm:{
        username:"admin",
        password:"123456",
      },
      //验证对象
      loginRules:{
        //校验用户名
        username:[
            { required: true, message: '用户名称为必填项', trigger: 'blur' },//必填验证
            { min: 5, max: 12, message: '长度在 5 到 12 个字符', trigger: 'blur' }//长度验证
        ],
        //校验密码
        password:[
            { required: true, message: '请输入用户密码', trigger: 'blur' },//必填验证
            { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }//长度验证
        ],
      },
    };    
  },
  methods:{
     //重置表单内容
    resetLoginForm(){
      this.$refs.loginFormRef.resetFields();
    },
    //登录方法
    login(){
      //1.验证校验规则
      this.$refs.loginFormRef.validate(async valid => {
        console.log(this.loginForm);
        if(!valid)  return;//验证失败
        const {data:res} = await this.$http.post("login",this.loginForm);//访问后台
        if(res.flag=="ok"){
          window.sessionStorage.setItem("user",res.user);//存储user对象
          this.$message.success("操作成功!");//信息提示
          this.$router.push({path:"/page"});//页面跳转
          
        }else{
          this.$message.error("操作失败!");//错误提示
        }
      })
    },
  },
}
</script>
<style lange="less" scoped>
/* 根节点样式 */
.login_container{
  background-color: #2b4b6b;
  height: 100%;
}
.login_box{
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left:50%;
  top: 50%;
  transform: translate(-50%,-50%); 
  
}
.login_box .avatar_box{
  width: 130px;
  height: 130px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding:5px;
  box-shadow: 0 0 2px #dddd;
  position: absolute;
  left: 50%;
  transform: translate(-50%,-50%);
  background-color: #eee;
  
}
.login_box .avatar_box img{
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #eee;
}
.btns{
  display: flex;
  justify-content: flex-end;
  
}
.login_form{
  position: absolute;
  bottom: 0%;
  width:100%;
  padding: 0 10px;
  box-sizing: border-box;
}
</style>