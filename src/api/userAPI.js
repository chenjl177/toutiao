import request from '@/utils/request'

// 登录
export const loginAPI = data => {
  return request.post('/v1_0/authorizations', data)
}

// 获取验证码
export const sendSms = mobile => {
  return request.get(`/v1_0/sms/codes/${mobile}`)
}

// 获取用户基本信息
export const getUserInfoAPI = () => {
  return request.get('/v1_0/user')
}

// 请求用户简介信息
export const getUserProfileAPI = () => {
  return request.get('/v1_0/user/profile')
}

// 修改用户名
export const updateUserProfileAPI = obj => {
  return request.patch('/v1_0/user/profile', obj)
}

// 修改用户头像
export const updateUserAvatarAPI = fd => {
  return request.patch('/v1_0/user/photo', fd)
}
