<template>
  <div>
    <!--用户主体部分 -->
    <el-card>
      <el-row :gutter="15">
        <el-col :span="40" style="float:right">
          <el-button type="primary" @click="addDialogVisibleTrue">添加菜品</el-button>
        </el-col>
      </el-row>      
      <!-- 用户列表 border边框 stripe隔行变色-->
      <el-table :data="foodList" border stripe>
      <el-table-column type="index"></el-table-column>
      <el-table-column></el-table-column>
      <el-table-column label="菜名" prop="foodname"></el-table-column>
      <el-table-column label="价格" prop="price"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <!-- 修改 -->
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.fid)"></el-button>
          <!-- 删除 -->
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteFood(scope.row.fid)"></el-button>
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
      <!-- 添加菜品表单 -->
      <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
          <!-- 菜名 -->
          <el-form-item label="菜名" prop="foodname">
            <el-input v-model.lazy="addForm.foodname"></el-input>
          </el-form-item>    
          <!-- 价格-->
          <el-form-item label="价格" prop="price">
            <el-input v-model="addForm.price"></el-input>
          </el-form-item>
          <!-- 昵称 -->
          <el-form-item label="昵称" prop="realname1">
            <el-input v-model="addForm.realname1"></el-input>
          </el-form-item>
        </el-form>
        <!-- 内容底部区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="addFood">确定</el-button>
          <el-button @click="addDialogVisible = false">取消</el-button>
        </span>
      </el-dialog>
      <!-- 修改菜品表单 -->
      <el-dialog title="修改用户信息" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
           <!-- 菜名 -->
          <el-form-item label="菜名" prop="foodname">
            <el-input v-model.lazy="editForm.foodname"></el-input>
          </el-form-item>    
          <!-- 价格-->
          <el-form-item label="价格" prop="price">
            <el-input v-model="editForm.price"></el-input>
          </el-form-item>
        </el-form>
        <!-- 内容底部区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="editFoodInfo">确定</el-button>
          <el-button @click="editDialogVisible = false">取消</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
export default {
  created(){
    this.getFoodList();
  },
  data(){

    return{
       // 查询信息实体
      queryInfo:{
        pageNum: 1,//当前页
        pageSize: 5,//每页最大数
      },
      foodList:[],//菜品列表
      total:0,//总记录数
      addDialogVisible:false, //对话框状态
      //添加表单信息
      addForm:{
        foodname:'',
        price:'',
        realname1:'',
      },
      // 添加用户表单验证
      addFormRules: {
        foodname: [
          { required: true,message:'请输入菜名',trigger: 'blur'},
          { min: 1, max: 12, message: '长度在 1 到 12 个字符', trigger: 'blur' },
        ],
        price: [
          { required: true, message: '请输入价格', trigger: 'blur'},
          { min: 1, max: 5, message: '长度在 1 到 5 个字符', trigger: 'blur' },
        ],
        realname1:[
          { required: true, message: '请输入商铺昵称', trigger: 'blur'},
        ]
      },
       // 修改菜品信息
      editForm:{},
      //显示或隐藏修改菜品栏
      editDialogVisible:false,
       //修改菜品表单验证
      editFormRules: {         
          foodname: [
            { required: true, message: '请输入菜名', trigger: 'blur' },
            { min: 1, max: 12, message: '长度在 1 到 12 个字符', trigger: 'blur' },
          ],
          price:[
            {required:true,message:'请输入价格',trigger:'blur'},
            { min: 1, max: 5, message: '长度在 1 到 5 个字符', trigger: 'blur' },
          ]
      }
    }
  },
  methods:{
    // 获取相应菜品列表
    async getFoodList(){
      const {data:res}= await this.$http.post("allFood?realname1="+window.sessionStorage.getItem("realname")+
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
    //改变添加对话框状态
    addDialogVisibleTrue(){
      console.log(window.sessionStorage.getItem("realname"));
      this.addDialogVisible=true;
    },
    //监听添加用户
    addDialogClosed(){
      this.$refs.addFormRef.resetFields();
    },
    // 添加菜品
    addFood(){
      if(this.addForm.realname1!=window.sessionStorage.getItem("realname")){
        return this.$message.error("请输入自己的商铺名称")
      }else{
          this.$refs.addFormRef.validate(async valid=>{
          if(!valid) return;
          const {data:res} = await this.$http.post("addFood",this.addForm);
          if(res!="success"){
            return this.$message.error("操作失败!");
          }
          this.$message.success("操作成功!");
          this.addDialogVisible=false;
          this.getFoodList();
        });    
      }
      
    },
    // 根据fid删除菜品
    async deleteFood(fid){
      const confirmResult = await this.$confirm('此操作将永久删除菜品，是否继续?','提示',{
        confirmButtonText:'确定',
        cancelButtonText:'取消',
        type:'warning'
      }).catch(err => err)
      // 取消
      if(confirmResult!='confirm'){
        return this.$message.Info("已取消删除!");
      }
      const {data:res}=await this.$http.delete("deleteFood?fid="+fid);
      if(res !="success"){
        return this.$message.error("删除失败!");
      }
      this.$message.success("删除成功!");
      this.getFoodList();
    },
    // 显示对话框
    async showEditDialog(fid){
      const {data:res} =await this.$http.get("/getUpdateFood?fid="+fid);
      this.editForm=res;//查询出菜品信息反填回编辑表单中
      this.editDialogVisible=true;//开启编辑对话框
    },
    // 关闭窗口
    editDialogClosed(){
      this.$refs.editFormRef.resetFields();//重置信息
    },
    // 确认修改
    editFoodInfo(){
      this.$refs.editFormRef.validate(async valid =>{
        if(!valid) return;
        //发起修改请求
        const {data:res} = await this.$http.post("editFood",this.editForm);
        
        if(res!="success")return this.$message.error("操作失败!");
        this.$message.success("操作成功!");
        //隐藏修改对话框
        this.editDialogVisible=false;
        this.getFoodList(); 
      })
    },
  }
}
</script>
<style lang="less" scoped>

</style>