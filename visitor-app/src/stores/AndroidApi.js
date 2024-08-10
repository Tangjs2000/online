/* JavaScript调用 Android --- Api */

/**
 * 申请照相机权限
 */
export const applyCameraPermission = () => {
  AndroidBridge.applyCameraPermission()
}

/**
 * 下载文件
 */
export const download = (params) => {
  AndroidBridge.download(params)
}

/**
 * 内置浏览器打开
 */
export const openBrowser = (url) => {
  AndroidBridge.openBrowser(url)
}