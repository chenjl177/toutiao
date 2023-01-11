import request from '@/utils/request'

// 获取文章详情的API
export const getArticleDetailAPI = id => {
  return request.get(`/v1_0/articles/${id}`)
}

// 关注用户的API
export const followUserAPI = userId => {
  return request.post('/v1_0/user/followings', {
    target: userId
  })
}

// 取消关注
export const unfollowUserAPI = userId => {
  return request.delete(`/v1_0/user/followings/${userId}`)
}

// 点赞
export const addLikeAPI = artId => {
  return request.post('/v1_0/article/likings', {
    target: artId
  })
}
// 取消点赞
export const delLikeAPI = artId => {
  return request.delete(`/v1_0/article/likings/${artId}`)
}
