<template>
  <div class="ChannelEdit-container">
    <!-- 标题 -->
    <van-cell>
      <template #title>
        <span>我的频道</span>
      </template>
      <template #right-icon>
        <van-button plain type="danger" size="mini" round @click="completeEdit">{{ isEdit?'完成':'编辑'}}</van-button>
      </template>
    </van-cell>
    <!-- 我的频道 -->
    <van-grid direction="horizontal" clickable :gutter="10">
      <van-grid-item class="grid-item" v-for="(item, index) in this.userChannels" :key="index">
        <van-icon slot="icon" name="close" v-if="isEdit && item.name !== '推荐'" @click="ondelChannel(item.id)" />
        <span slot="text" class="grid-text" @click="channelChange(index)" :class="{ active: index === myactive}">{{ item.name }}</span>
      </van-grid-item>
    </van-grid>
    <!-- 标题 -->
    <van-cell>
      <template #title>
        <span>推荐频道</span>
      </template>
    </van-cell>
    <!-- 全部频道 -->
    <van-grid direction="horizontal" clickable :gutter="10">
      <van-grid-item v-for="item in recommendChannel" :key="item.id">
        <van-icon slot="icon" name="plus" v-if="isEdit" />
        <span slot="text" class="grid-text" @click="addChannel(item)">{{ item.name }}</span>
      </van-grid-item>
    </van-grid>
  </div>
</template>

<script>
// 获取全部频道API，更新用户频道数据API
import { getAllChannelAPI, updateUserChannelAPI } from '@/api/homeAPI'
export default {
  name: 'ChannelEdit',
  props: {
    // 我的频道列表数据
    channels: {
      type: Array,
      required: true
    },
    // 切换频道
    myactive: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      // 我的频道列表
      userChannels: [],
      // 全部频道列表数据
      AllChannels: [],
      // 编辑按钮
      // false 为编辑
      isEdit: false
    }
  },
  computed: {
    // 计算属性，在全部频道中去除我的频道
    recommendChannel() {
      // 定义空数组，存放推荐频道
      const recommentChannels = []
      // 遍历全部频道数据
      this.AllChannels.forEach(item => {
        // 与我的频道数据做对比
        const res = this.userChannels.find(mychannels => {
          return mychannels.id === item.id
        })
        // id相等，则不添加到推荐频道
        if (!res) {
          recommentChannels.push(item)
        }
      })
      // 返回推荐频道
      return recommentChannels
    }
  },
  methods: {
    // 获取全部频道数据
    async loadAllChannels() {
      try {
        const { data: res } = await getAllChannelAPI()
        this.AllChannels = res.data.channels
      } catch {
        this.$toast('获取频道列表数据失败')
      }
    },
    // 更新用户频道列表数据
    async updateChannel(data) {
      // 将频道转换成需要的参数形式{id, 顺序}
      const userChennel = data.map((item, index) => {
        return {
          id: item.id,
          seq: index
        }
      })
      try {
        // 更新用户频道
        updateUserChannelAPI(userChennel)
        // 将父组件的用户频道也更新
        this.$emit('updateChannel')
      } catch {
        this.$toast('更新频道列表数据失败')
      }
    },
    // 删除频道
    ondelChannel(id) {
      // 将用户频道从列表中删除
      this.userChannels = this.userChannels.filter(item => item.id !== id)
    },
    // 增加频道
    addChannel(item) {
      // 在编辑装填下才能增加频道
      if (this.isEdit) {
        this.userChannels.push(item)
      }
    },
    // 切换频道
    channelChange(id) {
      // 不在编辑状态下才能切换
      if (!this.isEdit) {
        // 将切换的频道顺序传给父组件
        this.$emit('channelChange', id)
      }
    },
    // 完成编辑
    completeEdit() {
      // 将按钮改为编辑
      this.isEdit = !this.isEdit
      // 编辑完成，更新用户频道数据
      if (!this.isEdit) {
        this.updateChannel(this.userChannels)
      }
    }
  },
  created() {
    // 在加载组件时获取频道数据
    this.loadAllChannels()
    this.userChannels = this.channels
  }
}
</script>

<style lang="less">
.ChannelEdit-container {
  .van-button--mini {
    width: 52px;
    height: 24px;
    font-size: 13px;
    color: #f85959;
    border: 1px solid #f85959;
  }
  .van-grid-item__content {
    align-items: center;
    width: 80px;
    height: 43px;
    .grid-text {
      font-size: 12px;
    }
    .van-grid-item__icon-wrapper{
      line-height: 14px;
      margin-right: 5px;
    }
    .van-icon {
      font-size: 14px;
    }
  }
  .grid-item {
    .van-grid-item__icon-wrapper {
      position: absolute;
      top: -10px;
      left: 70px;
    }
    .active {
        color: #f85959;
      }
  }
}
</style>
