<template>
  <div class="chat-container">
    <!-- 标题区域 -->
    <van-nav-bar
      title="小思同学"
      left-arrow
      @click-left="$router.back()"
      fixed
    />
    <div class="chat-list">
      <div v-for="(item, index) in list" :key="index">
        <div class="chat-item left" v-if="item.name === 'xs'">
          <van-image round fit="fill" src="https://img01.yzcdn.cn/vant/cat.jpeg"/>
          <div class="chat-pao">{{ item.msg }}</div>
        </div>
        <div class="chat-item right" v-if="item.name === 'me'">
          <div class="chat-pao">{{ item.msg }}</div>
          <van-image round fit="fill" :src="userAvatar"/>
        </div>
      </div>
      <div class="reply-container van-heirline--top">
        <van-field
        class="chat-int"
        v-model="message"
        left-icon="edit"
        placeholder="说点什么..."
        @keydown="onSend">
          <template #button>
            <span @click.enter="send">发送</span>
          </template>
        </van-field>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import io from 'socket.io-client'
import store from '@/store/index'
let socket = null
export default {
  name: 'Chat',
  computed: {
    ...mapGetters(['userAvatar'])
  },
  data() {
    return {
      message: '',
      list: [
        { name: 'xs', msg: '你好' }
      ]
    }
  },
  methods: {
    send() {
      if (!this.message) return
      socket.emit('send', this.message)
      this.list.push({ name: 'me', msg: this.message })
      this.message = ''
    },
    onSend(event) {
      if (event.ctrlKey && event.keyCode === 13) {
        this.textarea += '\n'
        console.log('ok')
      } else if (event.keyCode === 13) {
        this.send()
      }
    },
    scrollToBottom() {
      const chatItem = document.querySelectorAll('.chat-item')
      const lastItem = chatItem[chatItem.length - 1]
      lastItem.scrollIntoView({
        behavior: 'smooth',
        block: 'end'
      })
    }
  },
  watch: {
    list() {
      this.$nextTick(() => {
        this.scrollToBottom()
      })
    }
  },
  created() {
    const tokenStr = store.state.tokenInfo.token
    socket = io('http://toutiao.itheima.net', {
      query: {
        token: tokenStr
      },
      transports: ['websocket']
    })
    socket.on('message', msg => {
      this.list.push({ name: 'xs', msg })
    })
  },
  beforeDestroy() {
    socket.close()
    socket = null
  }
}
</script>

<style lang="less">
.chat-container {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  padding-top: 46px;
  padding-bottom: 50px;
  box-sizing: border-box;
  background-color: #fafafa;
  .van-nav-bar {
    .van-icon {
      color: #fff;
    }
  }
  .chat-list {
    height: 100%;
    overflow-y: scroll;
    .chat-item {
      padding: 10px;
      .van-image {
        vertical-align: top;
        width: 40px;
        height: 40px;
      }
      .chat-pao {
        padding: 10px;
        position: relative;
        display: inline-block;
        vertical-align: top;
        min-width: 15px;
        max-width: 70%;
        min-height: 20px;
        border: 0.5px solid #c2d9ea;
        border-radius: 4px;
        background-color: #e0effb;
        word-break: break-all;
        font-size: 14px;
        line-height: 16px;
        color: #333;
        &::before {
          position: absolute;
          top: 12px;
          content: '';
          width: 10px;
          height: 10px;
          border-top: 0.5px solid #c2d9ea;
          border-right: 0.5px solid #c2d9ea;
          background-color: #e0effb;
        }
      }
    }
  }
  .chat-item.left {
    text-align: left;
    .chat-pao {
      margin-left: 15px;
      &::before {
        left: -5px;
        transform: rotate(225deg);
      }
    }
  }
  .chat-item.right {
    text-align: right;
    .chat-pao {
      margin-right: 15px;
      &::before {
        right: -5px;
        transform: rotate(45deg);
      }
    }
  }
  .van-field__control {
    padding: 0 4px;
    background-color: #F7F8FA;
    border-radius: 10px;
  }
  .reply-container {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
  }
}
</style>
