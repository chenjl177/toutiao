// 导入请求数据的request模块
import request from '@/utils/request'

// 请求用户频道列表数据的API
export const getUserChannelAPI = () => {
  // return request({
  //   method: 'get',
  //   url: '/v1_0/user/channels'
  // })
  return request.get('/v1_0/user/channels')
}

// 获取全部频道列表数据
export const getAllChannelAPI = () => {
  return request.get('/v1_0/channels')
}

// 请求频道文章列表数据
export const getArtListAPI = (id, time) => {
  return request({
    method: 'get',
    url: '/v1_0/articles',
    params: {
      channel_id: id,
      timestamp: time
    }
  })
}

// 更新用户频道数据
export const updateUserChannelAPI = channels => {
  return request.put('/v1_0/user/channels', { channels })
}

// 将文章设置为不感兴趣的API
export const dislikeArticleAPI = id => {
  return request.post('/v1_0/article/dislikes', {
    target: id
  })
}

// 举报文章的API
export const reportArticleAPI = (target, type) => {
  return request.post('/v1_0/article/reports', {
    target,
    type
  })
}
