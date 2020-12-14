<template>
  <div>
    <!--主体部分 -->
    <el-card>
      <!-- 间隙 -->
      <el-row :gutter="25">
        <!-- 列宽 -->
        <el-col :span="10">
          <!-- 搜索区域 -->
          <el-input placeholder="请输入搜索内容" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表 border边框 stripe隔行变色-->
      <el-table :data="userList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="用户" prop="username"></el-table-column>
        <el-table-column label="密码" prop="password"></el-table-column>
        <el-table-column label="昵称" prop="realname"></el-table-column>
        <el-table-column label="权限" prop="root"></el-table-column>        
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 修改 -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.uid)"></el-button>
            <!-- 删除 -->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUser(scope.row.uid)"></el-button>
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
    <!-- 添加用户表单 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <!-- 用户 -->
        <el-form-item label="用户" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <!-- 昵称 -->
        <el-form-item label="昵称" prop="realname">
          <el-input v-model="addForm.realname"></el-input>
        </el-form-item>
        <!-- 权限 -->
        <el-form-item label="权限" prop="root">
          <el-input v-model="addForm.root"></el-input>
        </el-form-item>
      </el-form>
      <!-- 内容底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addUser">确定</el-button>
        <el-button @click="addDialogVisible = false">取消</el-button>
      </span>
    </el-dialog>

    <!-- 修改对话框 -->
    <el-dialog title="修改用户信息" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
        <!-- 用户 -->
        <el-form-item label="用户" prop="username">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item label="密码" prop="password">
          <el-input v-model="editForm.password"></el-input>
        </el-form-item>
        <!-- 昵称 -->
        <el-form-item label="昵称" prop="realname">
          <el-input v-model="editForm.realname"></el-input>
        </el-form-item>
        <!-- 权限 -->
        <el-form-item label="权限" prop="root">
          <el-input v-model="editForm.root" disabled></el-input>
        </el-form-item>
      </el-form>
      <!-- 内容底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editUserInfo">确定</el-button>
        <el-button @click="editDialogVisible = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  created(){
    this.getUserList();
  },
  data(){
    return{
      //查询信息实体
      queryInfo:{
        query:"",//查询信息
        pageNum: 1,//当前页
        pageSize: 5,//每页最大数
      },
      userList:[],//用户列表
      total:0,//总记录数
      addDialogVisible:false, //对话框状态
      //添加表单信息
      addForm:{
        username:'',
        password:'',
        realname:'',
        root:'',
      },
      // 修改用户信息
      editForm:{},
      //显示或隐藏修改用户栏
      editDialogVisible:false,

      // 添加用户表单验证
      addFormRules: {
          username: [
            { required: true, message: '请输入用户', trigger: 'blur' },
            { min: 5, max: 12, message: '长度在 5 到 12 个字符', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 14, message: '长度在 6 到 14 个字符', trigger: 'blur' }
          ],
          realname: [
            { required: true, message: '请输入昵称', trigger: 'blur' },
            { min: 5, max: 12, message: '长度在 5 到 12 个字符', trigger: 'blur' }
          ],
          root: [
            { required: true, message: '请输入用户权限', trigger: 'blur' },
            { min: 0, max: 1, message: '商家权限为2，普通用户权限为3', trigger: 'blur' }
          ],
      },
      //修改用户表单验证
      editFormRules: {         
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 14, message: '长度在 6 到 14 个字符', trigger: 'blur' }
          ],
          realname: [
            { required: true, message: '请输入昵称', trigger: 'blur' },
            { min: 5, max: 12, message: '长度在 5 到 12 个字符', trigger: 'blur' }
          ],       
      },
    }
  },
  methods:{
    // 获取所有用户
    async getUserList(){
       const {data:res} = await this.$http.get("allUser",{params:this.queryInfo});
       this.userList=res.data;//用户列表数据封装
       this.total=res.numbers;//总用户数封装
    },
    // 最大数
    handleSizeChange(newSize){
      this.queryInfo.pageSize=newSize;
      this.getUserList();
    },
    // pageNum的触发功能
    handleCurrentChange(newPage){
      this.queryInfo.pageNum=newPage;
      this.getUserList();
    },
    //监听添加用户
    addDialogClosed(){
      this.$refs.addFormRef.resetFields();
    },
    // 添加用户
    addUser(){
      this.$refs.addFormRef.validate(async valid=>{
        if(!valid) return;
        const {data:res} = await this.$http.post("addUser",this.addForm);
        if(res!="success"){
          return this.$message.error("操作失败!");
        }
        this.$message.success("操作成功!");
        this.addDialogVisible=false;
        this.getUserList();
      });    
    },
    // 根据uid删除用户
    async deleteUser(uid){
      console.log(uid);
      const confirmResult = await this.$confirm('此操作将永久删除用户，是否继续?','提示',{
        confirmButtonText:'确定',
        cancelButtonText:'取消',
        type:'warning'
      }).catch(err => err)
      // 取消
      if(confirmResult!='confirm'){
        return this.$message.Info("已取消删除!");
      }
      const {data:res}=await this.$http.delete("deleteUser?uid="+uid);
      if(res !="success"){
        return this.$message.error("删除失败!");
      }
      this.$message.success("删除成功!");
      this.getUserList();
    },

    // 显示对话框
    async showEditDialog(uid){
      const {data:res} =await this.$http.get("/getUpdate?uid="+uid);
      this.editForm=res;//查询出用户信息反填回编辑表单中
      this.editDialogVisible=true;//开启编辑对话框
    },
    // 关闭窗口
    editDialogClosed(){
      this.$refs.editFormRef.resetFields();//重置信息
    },
    // 确认修改
    editUserInfo(){
      this.$refs.editFormRef.validate(async valid =>{
        if(!valid) return;
        //发起修改请求
        const {data:res} = await this.$http.post("editUser",this.editForm);
        console.log(res);
        if(res!="success")return this.$message.error("操作失败!");
        this.$message.success("操作成功!");
        //隐藏修改对话框
        this.editDialogVisible=false;
        this.getUserList(); 
      })
    },
  }

}
</script>
<style  lang="less" scoped>

</style>