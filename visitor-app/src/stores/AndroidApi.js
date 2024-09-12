/* JavaScript调用 Android --- Api */

/**
 * 申请照相机权限
 */
export const applyCameraPermission = () => {
    AndroidBridge.applyCameraPermission();
    return true;
}

/**
 * 申请麦克风权限
 */
export const applyMicrophonePermission = () => {
    AndroidBridge.applyMikePermission();
    return true;
}

export const applyPermission = (permissionList) => {

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

/**
 * 权限清单
 */
const PermissionList = {
    camera:"CAMERA", // 相机
    record_audio:"RECORD_AUDIO", //麦克风
}