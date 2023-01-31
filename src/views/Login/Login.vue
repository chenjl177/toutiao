<template>
  <div class="login-container">
    <!-- 登录标题 -->
    <van-nav-bar title="头条-登录" fixed/>
    <!-- 登录表单 -->
    <van-form @submit="login" ref="loginForm">
      <van-field
        v-model="form.mobile"
        type="number"
        name="mobile"
        label="手机号码"
        placeholder="请输入手机号码"
        :rules="rules.mobile"
      />
      <van-field
        v-model="form.code"
        type="number"
        name="code"
        label="登录验证码"
        placeholder="请输入登录密码"
        :rules="rules.code"
      >
      <template #button>
      <van-count-down v-if="isCountDownShow" :time="1000 * 5" format="ss秒" @finish="isCountDownShow = false" />
      <van-button v-else native-type="button" size="small" round @click="onSendSms">发送验证码</van-button>
      </template>
      </van-field>
      <div style="margin: 16px;">
        <van-button round block type="info" native-type="submit">提交</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
// 导入登录的API接口
import { loginAPI, sendSms } from '@/api/userAPI'
import { mapMutations } from 'vuex'
export default {
  name: 'Login',
  data() {
    return {
      // 登录表单数据
      form: {
        // 用户手机号
        mobile: '',
        // 登录密码
        code: ''
      },
      // 表单验证规则
      rules: {
        // 手机号码规则
        mobile: [{ required: true, message: '请填写手机号' }, { pattern: /^1[3|5|7|8|9]\d{9}$/, message: '请填写正确的手机号' }],
        // 验证码规则
        code: [{ required: true, message: '请填写密码' }, { pattern: /^\d{6}$/, message: '请填写正确的验证码' }]
      },
      isCountDownShow: false
    }
  },
  methods: {
    // async login() {
    //   const res = await loginAPI(this.form)
    //   console.log(res)
    //   if (res.message === 'ok') {
    //     console.log(res)
    //   }
    // }
    ...mapMutations(['updateTokenInfo']),
    // 登录函数
    async login() {
      this.$toast.loading({
        message: '登录中...',
        forbidClick: true
      })
      try {
        const { data: res } = await loginAPI(this.form)
        this.$toast.success('登录成功')
        this.updateTokenInfo(res.data)
        const navPath = this.$route.query.pre || '/'
        this.$router.replace(navPath)
      } catch (err) {
        console.log('登录失败', err)
        this.$toast.fail('登录失败')
      }
    },
    // 获取验证码
    async onSendSms() {
      try {
        // 校验手机规则
        await this.$refs.loginForm.validate('mobile')
      } catch (err) {
        return this.$toast.fail('验证失败', err)
      }
      try {
        await sendSms(this.form.mobile)
        this.$toast('发送成功')
        this.isCountDownShow = true
        this.$router.back()
      } catch (err) {
        if (err.response.status === 429) {
          this.$toast('发送太频繁了，请稍后再试')
        } else {
          this.$toast.fail('发送失败')
        }
      }
    }
  }
}
</script>

<style lang="less">
.login-container {
  padding-top: 46px;
  .van-button--default {
    width: 80px;
  }
}
</style>
