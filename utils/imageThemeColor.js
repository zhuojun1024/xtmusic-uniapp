export async function getImageThemeColor (url, canvasId) {
    // 如果图片地址为空，直接返回空
    if (!url) return new Error('图片地址不能为空')
    // 下载图片
    const path = await downloadFile(url)
    // 处理图片
    const themeColor = await handleImage(path, canvasId)
    return themeColor
}

// 下载图片文件到临时目录
function downloadFile (url) {
  return new Promise((resolve, reject) => {
    uni.downloadFile({
      url,
      success: res => {
        resolve(res.tempFilePath)
      },
      fail: err => {
        reject(err)
        console.error('图片下载失败：', err)
      }
    })
  })
}

// 处理图片
function handleImage (src, canvasId) {
  return new Promise((resolve, reject) => {
    const canvas = uni.createCanvasContext(canvasId)
    canvas.drawImage(src, 0, 0, 1, 1)
    canvas.draw(false, () => {
      uni.canvasGetImageData({
        canvasId,
        x: 0,
        y: 0,
        width: 1,
        height: 1,
        success: res => {
          const data = res.data || []
          if (data.length >= 4) {
            const r = data[0]
            const g = data[1]
            const b = data[2]
            const themeColor = `rgb(${r}, ${g}, ${b})`
            resolve(themeColor)
          } else {
            throw new Error('图片数据异常：' + JSON.stringify(data))
          }
        },
        fail: err => {
          reject(err)
          console.error('图片处理失败：', err)
        }
      })
    })
  })
}
