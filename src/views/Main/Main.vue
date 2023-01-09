<template>
  <div>
    <!-- 路由占位符 -->
    <router-view></router-view>
    <!-- 底部导航 -->
    <!-- route 属性：开启路由模式 -->
    <van-tabbar route>
      <van-tabbar-item icon="home-o" to="/home">首页</van-tabbar-item>
      <van-tabbar-item icon="user-o" to="/user">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  name: 'Main'
}
</script>

<style lang="less">

</style>
