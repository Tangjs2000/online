/* 聊天消息卡片生成器 */


import {Basic} from "../BasicConfigure";
import {download} from "../tool/CustomTool";
import {CHAT_CONSTANT} from "./chat";


/**
 * 文件卡片
 *
 * @param fileInfo
 */
const fileCard = function (fileInfo) {
    /* 1、校验文件信息 */

    let accessUrl = fileInfo.accessUrl;
    if (!accessUrl){
        console.error("错误的文件,fileInfo:", fileInfo);
    }
    let suffix = accessUrl.substr(accessUrl.lastIndexOf("."));
    if(CHAT_CONSTANT.fileModel.picture.includes(suffix)){
        return pictureCard(fileInfo);
    }else if(CHAT_CONSTANT.fileModel.video.includes(suffix)){
        return videoCard(fileInfo);
    }

    /* 2、创建必要H5元素 */
    let fileCardDiv = document.createElement(`div`);
    let fileCardSvgDiv = document.createElement(`div`);
    let fileCardInfoDiv = document.createElement(`div`);
    let fileCardNameDiv = document.createElement(`div`);
    let fileCardOtherDiv = document.createElement(`div`);
    let fileCardSizeDiv = document.createElement(`div`);
    let fileCardOptionDiv = document.createElement(`div`);

    /* 3、编排H5元素 */
    fileCardDiv.appendChild(fileCardSvgDiv);
    fileCardDiv.appendChild(fileCardInfoDiv);
    fileCardInfoDiv.appendChild(fileCardNameDiv);
    fileCardInfoDiv.appendChild(fileCardOtherDiv);
    fileCardOtherDiv.appendChild(fileCardSizeDiv);
    fileCardOtherDiv.appendChild(fileCardOptionDiv);

    /* 4、为元素添加内容、事件 */
    fileCardNameDiv.innerText = fileInfo.name;
    fileCardSizeDiv.innerText = fileInfo.size + " " + fileInfo.unit;
    fileCardSizeDiv.innerText = "点击下载";
    fileCardSvgDiv.innerHTML = Basic.file_resource_configuration.svg[fileInfo.type];
    // fileCardOptionDiv.innerHTML = Basic.file_resource_configuration.svg.download_option;
    fileCardDiv.addEventListener("click", function () {
        download(fileInfo.accessUrl, fileInfo?.name);
    })

    /* 5、设置元素样式 */
    fileCardDiv.classList.add("fileCard");
    fileCardSvgDiv.classList.add("fileCardSvg");
    fileCardInfoDiv.classList.add("fileCardInfo");
    fileCardNameDiv.classList.add("fileCardName");
    fileCardOtherDiv.classList.add("fileCardOther");
    fileCardSizeDiv.classList.add("fileCardSize");
    fileCardOptionDiv.classList.add("fileCardOption");
    return fileCardDiv;
}

/**
 * 图片卡片
 *
 * @param fileInfo
 */
const pictureCard = function (fileInfo) {
    console.log(fileInfo);
    /* 1、校验文件信息 * /

    /* 2、创建必要H5元素 */
    let pictureCard = document.createElement(`div`);
    let img = document.createElement(`img`);

    /* 3、编排H5元素 */
    pictureCard.appendChild(img);

    /* 4、为元素添加内容、事件 */
    img.src = fileInfo.accessUrl
    img.addEventListener(`click`, function () {
        if (img.classList.contains('zoomed')){
            img.classList.remove('zoomed');
        }else {
            img.classList.toggle('zoomed');
        }
    })

    /* 5、设置元素样式 */
    img.classList.add('zoomable-image');
    return pictureCard;
}

/**
 * 视频卡片
 *
 * @param fileInfo
 */
const videoCard = function (fileInfo) {
    console.log(fileInfo);
    /* 1、校验文件信息 * /

    /* 2、创建必要H5元素 */
    let videoCard = document.createElement(`div`);
    let video = document.createElement(`video`);
    let videoSource = document.createElement(`source`);

    /* 3、编排H5元素 */
    videoCard.appendChild(video);
    video.appendChild(videoSource)

    /* 4、为元素添加内容、事件 */
    video.controls = true;
    video.autoplay = true;
    videoSource.src = fileInfo.accessUrl;

    /* 5、设置元素样式 */

    return videoCard;
}


export {fileCard}
