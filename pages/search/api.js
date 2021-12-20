import request from '@/request'

const apis = {
  // 搜索热词
  getHotDetail: data => request('/search/hot/detail', 'post', data),
  // 搜索建议
  getSearchSuggest: data => request('/search/suggest', 'post', data)
}

export default apis
