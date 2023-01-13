import request from '@/utils/request'

// 发表评论（artId是文章id，content是评论内容）
export const pubCommentAPI = (id, content, artId) => {
  return request.post('/v1_0/comments', {
    target: id,
    content,
    art_id: artId
  })
}
