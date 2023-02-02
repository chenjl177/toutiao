<template>
  <div class="user-container">
    <div class="user-card"></div>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <div class="signed" v-if="userInfo.name">
        <van-cell class="user-info">
          <template #icon>
            <van-image class="user-img" round :src="userInfo.photo"/>
          </template>
          <template #title>
            <span class="user-name">{{ userInfo.name }}</span>
          </template>
          <template #label>
            <van-tag >申请认证</van-tag>
          </template>
        </van-cell>
        <van-grid class="user-data" :column-num="3">
          <van-grid-item>
            <span>{{ userInfo.art_count }}</span>
            <span>动态</span>
          </van-grid-item>
          <van-grid-item>
            <span>{{ userInfo.follow_count }}</span>
            <span>关注</span>
          </van-grid-item>
          <van-grid-item>
            <span>{{ userInfo.fans_count }}</span>
            <span>粉丝</span>
          </van-grid-item>
        </van-grid>
      </div>
      <div class="notsigned" v-else>
        <img class="login-img" src="~@/assets/mobile.png" @click="$router.push('login')">
        <span>点击登录</span>
      </div>
      <div class="user-service">
        <van-grid>
          <van-grid-item icon="chat-o" text="消息通知" />
          <van-grid-item icon="like-o" text="我的收藏" />
          <van-grid-item icon="underway-o" text="阅读历史" />
          <van-grid-item icon="records" text="我的作品" />
        </van-grid>
      </div>
      <div class="user-setting">
        <van-cell-group inset>
          <van-cell icon="edit" title="编辑面板" is-link @click="$router.push({ name: 'user-edit' })" />
          <van-cell icon="chat-o" title="小思同学" is-link @click="$router.push({ name: 'chat' })" />
        </van-cell-group>
        <van-button class="login-out" type="default" block size="large" v-if="userInfo.name" @click="onLogout">退出登录</van-button>
      </div>
    </van-pull-refresh>
  </div>
</template>

<script>
// 导入vueX中的函数方法
import { mapActions, mapState, mapMutations } from 'vuex'
export default {
  name: 'User',
  data() {
    return {
      isLoading: false
    }
  },
  computed: {
    ...mapState(['userInfo', 'tokenInfo'])
  },
  methods: {
    ...mapActions(['initUserInfo']),
    ...mapMutations(['cleanState']),
    onLogout() {
      this.$dialog.confirm({
        title: '确认退出吗？'
      })
        .then(() => {
          // 调用vueX中的退出登录方法
          this.cleanState()
        })
        .catch(() => {
          console.log('no')
        })
    },
    onRefresh() {
      this.initUserInfo()
      this.isLoading = false
    }
  },
  created() {
    if (this.tokenInfo) {
      this.initUserInfo()
    }
  },
  activated() {
    // 只要组件被激活了，就重新初始化用户的信息
    this.initUserInfo()
  }
}
</script>

<style lang="less">
.user-container {
  position: relative;
  padding-bottom: 50px;
  background-color: #f8f8f8;
  height: 100vh;
  .van-hairline {
    &::after {
      border: none;
    }
  }
  .van-hairline--top {
    &::after {
      border: none
    }
  }
  .van-pull-refresh {
    height: 100%;
  }
  .user-card {
    position: absolute;
    height: 250px;
    width: 100%;
    background: url('@/assets/login_bg.jpg') no-repeat;
    background-size: cover;
  }
  .signed {
    .user-info {
      background: none;
      top: 30px;
      color: white;
      &::after {
        display: none;
      }
      .user-img {
        width: 60px;
        height: 60px;
        border: 1px solid #fff;
      }
      .van-cell__title {
        padding-top: 8px;
        padding-left: 15px;
        .user-name {
          font-size: 14px;
          font-weight: bold;
        }
      }
    }
    .user-data {
      position: absolute;
      top: 140px;
      width: 100%;
      .van-grid-item__content {
        padding: 4px 8px;
        height: 48px;
        background: none;
        color: white;
        font-size: 14px;
      }
    }
  }
  .notsigned {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    padding-top: 60px;
    .login-img {
      margin-bottom: 10px;
      width: 70px;
      height: 70px;
    }
    span {
      font-size: 16px;
      color: #fff;
    }
  }
  .user-service {
    position: relative;
    top: 120px;
    margin: 0 auto;
    width: 333px;
    height: 80px;
    border: 5px solid #fff;
    border-radius: 10px;
    background-color: #fff;
    .van-grid-item__content {
      .van-grid-item__icon {
        font-size: 20px;
      }
      .van-grid-item__text {
        margin-top: 4px;
      }
    }
  }
  .user-setting {
    position: relative;
    top: 130px;
    .login-out {
      margin: 10px auto;
      width: 343px;
      height: 44px;
      border-radius: 8px;
    }
  }
}
</style>
