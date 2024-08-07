import {MESSAGE_CONTENT_TYPE} from "./onlineAppConstant";

/**
 * 访客端h5消息处理
 *
 * @author jiashuai.tang
 * @since 2024/07/05
 */

export class H5ChatObj {

    /* 消息类型 图片、纯文本、富文本、视频、音频、综合 */
    type;

    /* 消息内容：纯文本、富文本 */
    textContent;

    /* 资源列表：图片、视频、音频 */
    resourceList;
}

/**
 * 核心构建h5消息内容处理方案
 *
 * @param h5ChatObj
 */
export function core(h5ChatObj) {
    if (!h5ChatObj) {
        console.error("core==>h5ChatObj不存在异常!!!")
        return;
    } else if (!h5ChatObj.type) {
        console.error("core==>h5ChatObj.type不存在异常!!!")
        return;
    }

    switch (h5ChatObj.type) {
        case MESSAGE_CONTENT_TYPE.IMG: {
            return picture(h5ChatObj.resourceList);
        }
        case MESSAGE_CONTENT_TYPE.VIDEO: {
            return video(h5ChatObj.resourceList);
        }
        case MESSAGE_CONTENT_TYPE.TEXT:
        case MESSAGE_CONTENT_TYPE.RICH_TEXT: {
            return h5ChatObj.textContent;
        }
    }
}

/**
 * h5图片消息处理
 */
function picture(resourceList) {
    let div = document.createElement(`div`);
    if (resourceList && resourceList.length > 0) {
        for (let resourceItem of resourceList) {
            /* 2、创建必要H5元素 */
            let imgItem = document.createElement(`img`);

            /* 3、编排H5元素 */
            div.appendChild(imgItem);

            /* 4、为元素添加内容、事件 */
            imgItem.src = resourceItem.accessUrl;

            /* 5、设置元素样式 */
        }
    }
    return div;
}

/**
 * h5视频消息处理
 */
function video(resourceList) {
    let div = document.createElement(`div`);
    if (resourceList && resourceList.length > 0) {
        for (let resourceItem of resourceList) {
            /* 2、创建必要H5元素 */
            let video = document.createElement(`video`);
            let videoSource = document.createElement(`video`);

            /* 3、编排H5元素 */
            div.appendChild(video);
            video.appendChild(videoSource);

            /* 4、为元素添加内容、事件 */
            videoSource.src = resourceItem.accessUrl;

            /* 5、设置元素样式 */
        }
    }
    return div;
}