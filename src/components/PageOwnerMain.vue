<template>
  <div>
    <center><h3>{{this.realname}}菜品管理界面</h3></center>
  </div>
</template>
<script>
export default {
  data(){
    return{
      realname:window.sessionStorage.getItem("realname"),
    }
  }
}
</script>
<style lang="less" scoped>

</style>