<template>
  <div class="home-container">
    <!-- 头部导航 -->
    <van-nav-bar fixed>
      <template #left>
        <img src="../../assets/logo.png" alt="logo" class="logo">
      </template>
      <template #right>
        <van-icon name="search" color="white" size="18" />
      </template>
    </van-nav-bar>
    <!-- 频道列表的标签页 -->
    <van-tabs v-model="active" sticky offset-top="46px" swipeable>
      <van-tab v-for="item in userChannel" :key="item.id" :title="item.name"><ArtList :channelId="item.id"></ArtList>
      </van-tab>
    </van-tabs>
    <!-- 频道列表图标 -->
    <van-icon name="bars" size="16" class="plus" />
  </div>
</template>

<script>
// 获取频道列表API
import { getUserChannelAPI } from '@/api/homeAPI'
// 文章列表组件
import ArtList from '@/components/ArtList/ArtList.vue'
export default {
  name: 'Home',
  components: {
    ArtList
  },
  data() {
    return {
      active: 0,
      userChannel: []
    }
  },
  methods: {
    async initUserChannel() {
      try {
        const { data: res } = await getUserChannelAPI()
        this.userChannel = res.data.channels
      } catch {
        this.$toast('获取频道列表失败')
      }
    }
  },
  created() {
    this.initUserChannel()
  }
}
</script>

<style lang="less">
.home-container {
  padding-top: 46px;
  padding-bottom: 50px;
  .logo {
    height: 80%;
  }
  .van-tabs__wrap {
    padding-right: 36px;
    background-color: white;
  }
  .plus {
    position: fixed;
    top: 58px;
    right: 10px;
    z-index: 999;
  }
  .van-tabs__line {
    background-color: #007bff;
  }
}
</style>
