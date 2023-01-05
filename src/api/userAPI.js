import request from '@/utils/request'

// 登录
export const loginAPI = data => {
  return request.post('/v1_0/authorizations', data)
}

// 获取验证码
export const sendSms = mobile => {
  return request.get(`/v1_0/sms/codes/${mobile}`)
}
