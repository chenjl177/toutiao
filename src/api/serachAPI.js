import request from '@/utils/request'

// 获取搜索建议API
export const getSuggestListAPI = kw => {
  return request.get('/v1_0/suggestion', {
    params: {
      q: kw
    }
  })
}
// 搜索文章数据API
export const getSearchResultAPI = (kw, page) => {
  return request.get('/v1_0/search', {
    params: {
      q: kw,
      page
    }
  })
}
