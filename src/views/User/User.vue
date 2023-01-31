<template>
  <div class="user-container">
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <div class="user-card">
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
          <img class="login-img" src="~@/assets/mobile.png" @click="$router.push('/login')">
          <span>点击登录</span>
        </div>
      </div>
      <div class="user-setting">
        <van-cell-group>
          <van-cell icon="edit" title="编辑面板" is-link @click="$router.push({ name: 'user-edit' })" />
          <van-cell icon="chat-o" title="小思同学" is-link @click="$router.push({ name: 'chat' })" />
        </van-cell-group>
        <van-button class="login-out" type="default" size="large" v-if="userInfo.name" @click="onLogout">退出登录</van-button>
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
  background-color: #f9f9f9;
  height: 100%;
  .user-card {
    position: relative;
    height: 250px;
    background: url("@/assets/login_bg.jpg") no-repeat;
    background-size: cover;
    .signed {
      .user-info {
        background: none;
        top: 50px;
        color: white;
        &::after {
          display: none;
        }
        .user-img {
          width: 70px;
          height: 70px;
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
        width: 100%;
        bottom: 10px;
        &::after {
          border: none;
        }
        .van-grid-item__content {
          padding: 4px 8px;
          height: 48px;
          background: none;
          color: white;
          font-size: 14px;
          &::after {
            border: none;
          }
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
  }
  .user-setting {
    margin-top: 10px;
    .login-out {
      margin-top: 10px;
    }
  }
}
</style>
