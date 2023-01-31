<template>
  <div class="home-container">
    <!-- 头部导航 -->
    <van-nav-bar fixed>
      <template #left>
        <img src="../../assets/logo.png" alt="logo" class="logo">
      </template>
      <template #right>
        <van-icon name="search" color="white" size="18" @click="$router.push('/search')" />
      </template>
    </van-nav-bar>
    <!-- 频道列表的标签页 -->
    <van-tabs v-model="active" sticky offset-top="46px" swipeable :before-change="beforeTabsChange" @change="onTabsChange">
      <van-tab v-for="item in userChannel" :key="item.id" :title="item.name">
        <ArtList :channelId="item.id"></ArtList>
      </van-tab>
    </van-tabs>
    <!-- 频道列表图标 -->
    <van-icon name="bars" size="16" class="plus" @click="show = true" />
    <!-- 频道列表弹出层 -->
    <van-popup
      v-model="show"
      closeable
      close-icon-position="top-left"
      position="bottom"
      :style="{ height: '90%' }"
    >
    <ChannelEdit :channels="userChannel" :myactive="active" @channelChange="getChannelId" @updateChannel="getChannels"></ChannelEdit>
    </van-popup>
  </div>
</template>

<script>
// 获取频道列表API
import { getUserChannelAPI } from '@/api/homeAPI'
// 文章列表组件
import ArtList from '@/components/ArtList/ArtList.vue'
// 频道管理组件
import ChannelEdit from '@/components/ChannelEdit/ChannelEdit.vue'
export default {
  name: 'Home',
  components: {
    ArtList,
    ChannelEdit
  },
  data() {
    return {
      active: 0,
      // 频道列表数据
      userChannel: [],
      // 控制频道列表弹出层
      show: false,
      nameToTop: {}
    }
  },
  methods: {
    // 获取用户频道事件
    async initUserChannel() {
      try {
        const { data: res } = await getUserChannelAPI()
        this.userChannel = res.data.channels
      } catch {
        this.$toast('获取频道列表失败')
      }
    },
    // 切换用户频道事件
    getChannelId(id) {
      this.active = id
      this.show = false
    },
    // 频道管理完成编辑后更新用户频道
    getChannels() {
      this.initUserChannel()
    },
    beforeTabsChange() {
      const name = this.userChannel[this.active].name
      this.nameToTop[name] = window.scrollY
      return true
    },
    onTabsChange() {
      this.$nextTick(() => {
        const name = this.userChannel[this.active].name
        window.scrollTo(0, this.nameToTop[name] || 0)
      })
    }
  },
  // 页面加载时，获取用户频道数据
  created() {
    this.initUserChannel()
  },
  beforeRouteLeave(to, from, next) {
    from.meta.top = window.scrollY
    next()
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
  .van-popup--bottom {
    padding-top: 40px;
  }
}
</style>
