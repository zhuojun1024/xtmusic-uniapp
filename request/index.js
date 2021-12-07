// 小程序开发api接口统一配置
const subDomain = '/api' // 子域名
const API_BASE_URL = 'https://www.i4896.com' // 主域名

const request = (url, method, data) => {
  let _url = API_BASE_URL + subDomain + url
  if (data && data.timestamp) {
    _url += '?timestamp=' + data.timestamp
  }
  const cookie = uni.getStorageSync('cookie')
  return new Promise((resolve, reject) => {
    uni.request({
      url: _url,
      method: method,
      data: {
        ...data,
        cookie
      },
      header: {
        'Content-Type': 'application/json'
      },
      success (request) {
        if (request.data.code === 200) {
          resolve(request.data)
        } else {
          reject(request.data.msg)
        }
      },
      fail (error) {
        reject(error)
      },
      complete () {
        // 加载完成
      }
    })
  })
}

module.exports = request
