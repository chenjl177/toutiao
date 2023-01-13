import request from '@/utils/request'

// 获取文章详情的API
export const getArticleDetailAPI = id => {
  return request.get(`/v1_0/articles/${id}`)
}

// 获取文章评论数据
export const getCmtListAPI = (artId, offset) => {
  return request.get('/v1_0/comments', {
    params: {
      type: 'a',
      source: artId,
      offset
    }
  })
}

// 关注文章作者的API
export const followUserAPI = userId => {
  return request.post('/v1_0/user/followings', {
    target: userId
  })
}

// 文章作者取消关注
export const unfollowUserAPI = userId => {
  return request.delete(`/v1_0/user/followings/${userId}`)
}

// 文章点赞
export const addLikeAPI = artId => {
  return request.post('/v1_0/article/likings', {
    target: artId
  })
}
// 文章取消点赞
export const delLikeAPI = artId => {
  return request.delete(`/v1_0/article/likings/${artId}`)
}

// 评论点赞
export const addLikeCmtAPI = cmtId => {
  return request.post('/v1_0/comment/likings', {
    target: cmtId
  })
}

// 取消评论点赞
export const delLikeCmtAPI = cmtId => {
  return request.delete(`/v1_0/comment/likings/${cmtId}`)
}
