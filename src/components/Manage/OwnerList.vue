<template>
  <div>
    <!-- 商家列表主体 -->
    <el-card>
      <!-- 间隙 -->
      <el-row :gutter="25">
        <!-- 列宽 -->
        <el-col :span="10">
          <!-- 搜索区域 -->
          <el-input
            placeholder="请输入搜索内容"
            v-model="queryInfo.query"
            clearable
            @clear="getOwnerList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getOwnerList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true"
            >添加商家</el-button
          >
        </el-col>
      </el-row>
      <!-- 商家列表 border边框 stripe隔行变色 -->
      <el-table :data="ownerList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="地址" prop="addr"></el-table-column>
        <el-table-column label="电话" prop="tel"></el-table-column>
        <el-table-column label="昵称" prop="realname"></el-table-column>
        <el-table-column label="所在域" prop="area"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 修改 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.oid)"
            ></el-button>
            <!-- 删除 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteOwner(scope.row.oid)"
            ></el-button>
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
          :total="total"
        >
        </el-pagination>
      </div>
    </el-card>
    <!-- 添加用户表单 -->
    <el-dialog
      title="添加商家"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="70px"
      >
        <!-- 地址 -->
        <el-form-item label="地址" prop="addr">
          <el-input v-model="addForm.addr"></el-input>
        </el-form-item>
        <!-- 电话 -->
        <el-form-item label="电话" prop="tel">
          <el-input v-model="addForm.tel"></el-input>
        </el-form-item>
        <!-- 昵称 -->
        <el-form-item label="昵称" prop="realname">
          <el-input v-model="addForm.realname"></el-input>
        </el-form-item>
        <!-- 所属区域 -->
        <el-form-item label="所在域" prop="area">
          <el-select v-model="addForm.area" placeholder="请选择活动区域">
            <el-option label="校外" value="校外"></el-option>
            <el-option label="校内" value="校内"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <!-- 内容底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addOwner">确定</el-button>
        <el-button @click="addDialogVisible = false">取消</el-button>
      </span>
    </el-dialog>
    <!-- 修改对话框 -->
    <el-dialog
      title="修改用户信息"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="70px"
      >
        <!-- 地址 -->
        <el-form-item label="地址" prop="addr">
          <el-input v-model="editForm.addr"></el-input>
        </el-form-item>
        <!-- 昵称 -->
        <el-form-item label="电话" prop="tel">
          <el-input v-model="editForm.tel"></el-input>
        </el-form-item>
        <!-- 所属区域 -->
        <el-form-item label="所在域" prop="area">
          <el-select v-model="editForm.area" placeholder="请选择活动区域">
            <el-option label="校外" value="校外"></el-option>
            <el-option label="校内" value="校内"></el-option>
          </el-select>
        </el-form-item>
        <!-- 权限 -->
        <el-form-item label="昵称" prop="realname">
          <el-input v-model="editForm.realname" disabled></el-input>
        </el-form-item>
        <!-- 上传店铺外景 -->
        <div>
          <!-- 头像上传  -->
          <el-upload
            class="upload-demo"
            :action="'http://localhost:9090/uploadPic?oid='+editForm.oid"
            :limit="1"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
          </el-upload>
        </div>
      </el-form>
      <!-- 内容底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editOwnerInfo">确定</el-button>
        <el-button @click="editDialogVisible = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  created() {
    this.getOwnerList();
  },
  data() {
    const checkRealname = (rule, value, callback) => {
      if (value === "" || value === null) {
        return callback(new Error("请输入商家昵称"));
      } else {
        this.checkRealnameRight(value, callback);
      }
    };
    return {
      // 查询信息实体
      queryInfo: {
        query: "", //查询信息
        pageNum: 1, //当前页
        pageSize: 5, //每页最大数
      },
      ownerList: [], //用户列表
      total: 0, //总记录数
      addDialogVisible: false, //对话框状态
      // 添加表单信息
      addForm: {
        addr: "",
        tel: "",
        realname: "",
        area: "",
      },
      // 修改商家信息
      editForm: {},
      // 显示或隐藏修改商家信息
      editDialogVisible: false,
      // 添加商家表单验证
      addFormRules: {
        addr: [
          { required: true, message: "请输入地址", trigger: "blur" },
          {
            min: 5,
            max: 12,
            message: "长度在 5 到 12 个字符",
            trigger: "blur",
          },
        ],
        tel: [
          { required: true, message: "请输入电话", trigger: "blur" },
          {
            min: 7,
            max: 14,
            message: "长度在 7 到 14 个字符",
            trigger: "blur",
          },
        ],
        realname: [
          { required: true, trigger: "blur", validator: checkRealname },
          {
            min: 2,
            max: 12,
            message: "长度在 2 到 12 个字符",
            trigger: "blur",
          },
        ],
      },
      //修改商家表单验证
      editFormRules: {
        addr: [
          { required: true, message: "请输入地址", trigger: "blur" },
          {
            min: 5,
            max: 12,
            message: "长度在 5 到 12 个字符",
            trigger: "blur",
          },
        ],
        tel: [
          { required: true, message: "请输入电话", trigger: "blur" },
          {
            min: 7,
            max: 14,
            message: "长度在 7 到 14 个字符",
            trigger: "blur",
          },
        ],
      },
      //外景上传
      headers: {
        authorization: "authorization-text",
      },
      filename: "",
    };
  },
  methods: {
    // 获取所有用户
    async getOwnerList() {
      const { data: res } = await this.$http.get("allOwner", {
        params: this.queryInfo,
      });
      this.ownerList = res.data; //用户列表数据封装
      this.total = res.numbers; //总用户数封装
    },
    // 最大数
    handleSizeChange(newSize) {
      this.queryInfo.pageSize = newSize;
      this.getOwnerList();
    },
    // pageNum的触发功能
    handleCurrentChange(newPage) {
      this.queryInfo.pageNum = newPage;
      this.getOwnerList();
    },
    //监听添加用户
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    // 添加商家
    addOwner() {
      if (this.checkRealnameUnique() != true);
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post("addOwner", this.addForm);
        if (res != "success") {
          return this.$message.error("操作失败!");
        }
        this.$message.success("操作成功!");
        this.addDialogVisible = false;
        this.getOwnerList();
      });
    },
    // 添加商家时进行昵称唯一性验证
    async checkRealnameUnique() {
      try {
        const { data: res } = await this.$http.post(
          "ownerOr?realname=" + this.addForm.realname
        );
        if (res === "error") {
          return this.$message.error("该账号已存在商家信息");
        } else {
          return true;
        }
      } catch (e) {}
    },
    // 添加商家时进行昵称存在验证
    async checkRealnameRight(value, callback) {
      try {
        const { data: res } = await this.$http.post(
          "registerOwner?realname=" + this.addForm.realname
        );
        if (res === "error") {
          return callback(new Error("请输入与商家账号昵称一致的内容"));
        } else {
          callback();
        }
      } catch (e) {}
    },
    // 删除商家
    async deleteOwner(oid) {
      const confirmResult = await this.$messagebox
        .confirm("此操作将永久删除该商家，是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .catch((err) => err);
      // 取消
      if (confirmResult != "confirm") {
        return this.$message.Info("已取消删除!");
      }
      const { data: res } = await this.$http.delete("deleteOwner?oid=" + oid);

      if (res != "success") {
        return this.$message.error("删除失败!");
      }
      this.$message.success("删除成功!");
      this.ownerList = [];
      this.getOwnerList();
    },
    // 显示对话框
    async showEditDialog(oid) {
      const { data: res } = await this.$http.get("/getUpdateOwner?oid=" + oid);
      this.editForm = res; //查询出用户信息反填回编辑表单中
      this.editDialogVisible = true; //开启编辑对话框
    },
    // 关闭窗口
    editDialogClosed() {
      this.$refs.editFormRef.resetFields(); //重置信息
    },
    // 确认修改
    editOwnerInfo() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post("editOwner", this.editForm);
        if (res != "success") return this.$message.error("操作失败!");
        this.$message.success("操作成功!");
        // 隐藏修改对话框
        this.editDialogVisible = false;
        this.getOwnerList();
      });
    },
    handleChange(info) {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        this.$message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === "error") {
        this.$message.error(`${info.file.name} file upload failed.`);
      }
    },
    handleAvatarSuccess(res) {
      // 把图片名给img
      this.filename = res;
    },
    beforeAvatarUpload(file) {
      // 设置限定格式
      const img_mimetype = ["image/jpeg", "image/jpg", "image/png"];
      const isJPG = img_mimetype.includes(file.type);
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传头像只能是图片格式!");
        return false;
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
        return false;
      }
      return isJPG && isLt2M;
    },
  },
};
</script>
<style lang="less" scoped>
</style>