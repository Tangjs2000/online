/**
 *  聊天消息处理
 *
 *  1、定义当前所需调用接口API
 *  2、定义当前所需的常量
 *  3、定义需要所用实体
 *  4、调用接口处理方法
 *  5、导出方法
 */

/* 1、定义当前所需调用接口API */
import {CHAT_CONSTANT, msgProcess, playWav, scrollButton} from "./chat";
import {fileCard} from "./ChatCard";

const API = {}

/* 2、定义当前所需的常量 */
const CHAT_MSG_PROCESS_CONSTANT = {
    /* 2.1、聊天消息类型 */
    chatMsgType: {
        own: "1",               // 本人消息
        other: "2",             // 对方消息
        visitor: "visitor",     // 访客消息
        seat: "seat",           // 坐席消息
        system: "system",       // 系统消息
    },
    className: {
        dialog: "dialog",
    },
    no_history_message_id: 'NO_HISTORY_MESSAGE_ID',
    ownAvatar: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAflBMVEUdHRv+/v4AAAAaGhjp6eezs7PFxcUlJSMNDQp4eHaqqqm8vLwaGhocHBzc3Nx9fX3Ozs4QEA0XFxUFBQD09PRdXVxXV1dsbGqIiIiUlJRlZWPa2ti5ubkXFxSGhoQTExM+Pj6enp5OTk40NDRCQkEsLCpKSkpxcW+amprj4+ObZh3IAAADEElEQVR4nO3c7XKaQBhAYXw3McSAKKBGU4PGpGnu/wbbtJ188K6ydJjsrj3PX5ThDF8DLCQJAAAAAAAAAAAAAAAAAAAAAAAAAADAMGRQje8crZyMBzTbzH0HKfPpaEhF6jtImd9RSCGFvlFIIYX+UUghhf5RSGH4hUlijiuvLlTDpZz4Q5b7rrE4sbxm27fQ+K7py1gLfS/VkCiMH4XxozB+FMaPwvhRGD8K40fhP2nKQZZtGMMX5rksFgElDl+YSRHU3aqhC43k30aj63MtNFuR+3oUWWGTtjS224l53qQi6W7/Z24xFZbLomVhGxSVZg/FZPw2q5gK5bI9dWzZhmX1eVRSVIWT9tQbXVgVrd+cW2G5q8+8UPbt35xbYTU788I8U4MfKfxKFFKYUOgdhRQmFHpHIYUJhd5RSGFCoXcUOhRmZ1+Y56rwOaA3aTsL9+2p6p53rmeximgdVuv21KnaSg9qDpuAXvjuKkzv1eSsNdS7WaifPERUON+oyavWTqZ31XoX0VPu8rH9TKK9I5pUzWEa0G7Y/YRUL//o8dM2KLfqB7YHcN50FspYTb+TD6+VzJ/USh6tq68POap7HaqD6esp8W0tVk8vevoioNOhw3P877pgNH0Q2ZblXORZ/310kYb0Yk33WAyxflZjtl7uHjd7ywoMbdRYd2GljyQdlgGdDV0KTaIPJSfdSVCvtzmMGNJn9NOu09gKzVWvwJewVqHTqC/50acwtG8QuRSa1HrItLMMt/HLaeRes3QOrPOQzoWv3MYmir6GOmIZ2DbqPPrS9XhahLaNOhea6ptL4G14gc4jaE2qBinaAkPbCZMeY4SNWC4yPqlXAa7BPqOgjSws1xHvZoeQrgrf9RnnnWb74yuwkIDuzXzUayS7kSf7MbVeN1X2pcvtrudY/VK29+0PidTjZwnxEPOXubqZta1P3SozlRyKyeyi/u1lPFklEtKtNc3oL5R2Xf1k6a8f5Yfd7pC/fs803NV3lMvVT2ZMWRoT1oUSAAAAAAAAAAAAAAAAAAAAAAAAAAD/oZ8CbDyoBExzvAAAAABJRU5ErkJggg==",
    otherAvatar: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAflBMVEUdHRv+/v4AAAAaGhjp6eezs7PFxcUlJSMNDQp4eHaqqqm8vLwaGhocHBzc3Nx9fX3Ozs4QEA0XFxUFBQD09PRdXVxXV1dsbGqIiIiUlJRlZWPa2ti5ubkXFxSGhoQTExM+Pj6enp5OTk40NDRCQkEsLCpKSkpxcW+amprj4+ObZh3IAAADEElEQVR4nO3c7XKaQBhAYXw3McSAKKBGU4PGpGnu/wbbtJ188K6ydJjsrj3PX5ThDF8DLCQJAAAAAAAAAAAAAAAAAAAAAAAAAADAMGRQje8crZyMBzTbzH0HKfPpaEhF6jtImd9RSCGFvlFIIYX+UUghhf5RSGH4hUlijiuvLlTDpZz4Q5b7rrE4sbxm27fQ+K7py1gLfS/VkCiMH4XxozB+FMaPwvhRGD8K40fhP2nKQZZtGMMX5rksFgElDl+YSRHU3aqhC43k30aj63MtNFuR+3oUWWGTtjS224l53qQi6W7/Z24xFZbLomVhGxSVZg/FZPw2q5gK5bI9dWzZhmX1eVRSVIWT9tQbXVgVrd+cW2G5q8+8UPbt35xbYTU788I8U4MfKfxKFFKYUOgdhRQmFHpHIYUJhd5RSGFCoXcUOhRmZ1+Y56rwOaA3aTsL9+2p6p53rmeximgdVuv21KnaSg9qDpuAXvjuKkzv1eSsNdS7WaifPERUON+oyavWTqZ31XoX0VPu8rH9TKK9I5pUzWEa0G7Y/YRUL//o8dM2KLfqB7YHcN50FspYTb+TD6+VzJ/USh6tq68POap7HaqD6esp8W0tVk8vevoioNOhw3P877pgNH0Q2ZblXORZ/310kYb0Yk33WAyxflZjtl7uHjd7ywoMbdRYd2GljyQdlgGdDV0KTaIPJSfdSVCvtzmMGNJn9NOu09gKzVWvwJewVqHTqC/50acwtG8QuRSa1HrItLMMt/HLaeRes3QOrPOQzoWv3MYmir6GOmIZ2DbqPPrS9XhahLaNOhea6ptL4G14gc4jaE2qBinaAkPbCZMeY4SNWC4yPqlXAa7BPqOgjSws1xHvZoeQrgrf9RnnnWb74yuwkIDuzXzUayS7kSf7MbVeN1X2pcvtrudY/VK29+0PidTjZwnxEPOXubqZta1P3SozlRyKyeyi/u1lPFklEtKtNc3oL5R2Xf1k6a8f5Yfd7pC/fs803NV3lMvVT2ZMWRoT1oUSAAAAAAAAAAAAAAAAAAAAAAAAAAD/oZ8CbDyoBExzvAAAAABJRU5ErkJggg=="
}

/* 3、定义需要所用实体 */
class ChatMsg {
    /**
     * 对话消息编号
     */
    chatId;

    /**
     * 消息类型 1.本人消息、2.对方消息、3.系统消息
     */
    msgType;

    /**
     * 系统事件(仅当消息类型为3时有效) 1.历史消息分割线、default.默认样式
     */
    systemEvent;

    /**
     * 消息类型 1.文本、2.语音 3.文件
     */
    inputType;

    /**
     * 文本内容
     */
    textContent;

    /**
     * 访问资源相对路径
     */
    resourceUri;

    /**
     * 音频时长
     */
    wavDuration;

    /**
     * 引导语|推荐话术
     */
    guideTitle;

    /**
     * 推荐问题列表
     */
    recommends;

    /**
     * 消息时间
     */
    dateTime;

    /**
     * 文件信息 name|size|accessUrl
     */
    fileInfo;

    /**
     * 撤回标识 (1是 0否)
     * @type {number}
     */
    revoke = 0;

    /**
     * 删除标识(是否有效 1有效 0无效)
     * @type {number}
     */
    hasValid = 1
}

/* 4、调用接口处理方法 */
/**
 * 消息视图构建
 * @param chatMsg   聊天消息
 * @param isHistory 是否历史消息
 */
const msgViewBuild = function (chatMsg, isHistory) {
    let dialog;
    if (chatMsg.msgType === CHAT_MSG_PROCESS_CONSTANT.chatMsgType.own ||
        chatMsg.msgType === CHAT_MSG_PROCESS_CONSTANT.chatMsgType.visitor) {
        dialog = CHAT_CONSTANT.inputType.wavRecord === chatMsg.inputType ? wavCardViewBuild(chatMsg) :
            CHAT_CONSTANT.inputType.file === chatMsg.inputType ? fileCardViewBuild(chatMsg) : ownMsgViewBuild(chatMsg);
    } else if (chatMsg.msgType === CHAT_MSG_PROCESS_CONSTANT.chatMsgType.other ||
        chatMsg.msgType === CHAT_MSG_PROCESS_CONSTANT.chatMsgType.seat) {
        dialog = CHAT_CONSTANT.inputType.wavRecord === chatMsg.inputType ? wavCardViewBuild(chatMsg) :
            CHAT_CONSTANT.inputType.file === chatMsg.inputType ? fileCardViewBuild(chatMsg) : otherMsgViewBuild(chatMsg);
    } else if (chatMsg.msgType === CHAT_MSG_PROCESS_CONSTANT.chatMsgType.system) {
        dialog = systemMsgViewBuild(chatMsg);
    }
    // console.log(chatMsg.chatId, dialog);
    showChatMsgView(dialog, isHistory);
}

/**
 * 本人消息处理
 *
 * 执行逻辑：
 * 1、校验消息内容,判断消息内容是否存在
 * 2、创建必要H5元素
 * 3、编排H5元素
 * 4、为元素添加内容、事件
 * 5、设置元素样式
 *
 * @param chatMsg
 * @return {HTMLDivElement}
 */
const ownMsgViewBuild = function (chatMsg) {
    /* 1、校验消息内容,判断消息内容是否存在 */
    if (!chatMsg) {
        return;
    }

    /* 2、创建必要H5元素 */
    let dialogDiv = document.createElement(`div`)
    let otherAvatarDiv = document.createElement(`div`)
    let ownAvatarDiv = document.createElement(`div`)
    let avatarImg = document.createElement(`img`)
    let messageCardDiv = document.createElement(`div`)
    let messageDiv = document.createElement(`div`)
    let recommendDiv = recommend(chatMsg.guideTitle, chatMsg.recommends);

    /* 3、编排H5元素 */
    dialogDiv.appendChild(otherAvatarDiv);
    dialogDiv.appendChild(messageCardDiv);
    dialogDiv.appendChild(ownAvatarDiv);
    messageCardDiv.appendChild(messageDiv);
    if (recommendDiv)
        messageCardDiv.appendChild(recommendDiv);
    ownAvatarDiv.appendChild(avatarImg);

    /* 4、为元素添加内容、事件 */
    dialogDiv.id = chatMsg.chatId;
    avatarImg.src = CHAT_MSG_PROCESS_CONSTANT.ownAvatar;
    messageDiv.innerHTML = chatMsg.textContent;
    // 处理语音消息 wavRecord
    if (CHAT_CONSTANT.inputType.wavRecord === chatMsg.inputType) {
        let playWavImg = document.createElement(`img`);
        playWavImg.style.height = '30px';
        playWavImg.src = '/img/online_play.svg';
        messageDiv.appendChild(playWavImg);
        messageDiv.addEventListener("click", function () {
            playWav(chatMsg.chatId, chatMsg.resourceUri);
        });
    }


    /* 5、设置元素样式 */
    dialogDiv.classList.add(CHAT_MSG_PROCESS_CONSTANT.className.dialog);
    otherAvatarDiv.classList.add("other_constant");
    otherAvatarDiv.setAttribute("hidden", "hidden");
    messageCardDiv.classList.add("messageCard");
    messageCardDiv.classList.add("ownMessageCard");
    ownAvatarDiv.classList.add("own_constant");
    avatarImg.classList.add("constant_img");

    /*dialog.innerHTML = '<!-- 头像框 -->\n' +
      '          <div class="other_constant" hidden></div>\n' +
      '          <div class="messageCard ownMessageCard">\n' +
      '           <p>' + chatMsg.textContent + '</p>\n' +
      '          </div>\n' +
      '          <div class="own_constant">' +
      '           <img class="constant_img" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAflBMVEUdHRv+/v4AAAAaGhjp6eezs7PFxcUlJSMNDQp4eHaqqqm8vLwaGhocHBzc3Nx9fX3Ozs4QEA0XFxUFBQD09PRdXVxXV1dsbGqIiIiUlJRlZWPa2ti5ubkXFxSGhoQTExM+Pj6enp5OTk40NDRCQkEsLCpKSkpxcW+amprj4+ObZh3IAAADEElEQVR4nO3c7XKaQBhAYXw3McSAKKBGU4PGpGnu/wbbtJ188K6ydJjsrj3PX5ThDF8DLCQJAAAAAAAAAAAAAAAAAAAAAAAAAADAMGRQje8crZyMBzTbzH0HKfPpaEhF6jtImd9RSCGFvlFIIYX+UUghhf5RSGH4hUlijiuvLlTDpZz4Q5b7rrE4sbxm27fQ+K7py1gLfS/VkCiMH4XxozB+FMaPwvhRGD8K40fhP2nKQZZtGMMX5rksFgElDl+YSRHU3aqhC43k30aj63MtNFuR+3oUWWGTtjS224l53qQi6W7/Z24xFZbLomVhGxSVZg/FZPw2q5gK5bI9dWzZhmX1eVRSVIWT9tQbXVgVrd+cW2G5q8+8UPbt35xbYTU788I8U4MfKfxKFFKYUOgdhRQmFHpHIYUJhd5RSGFCoXcUOhRmZ1+Y56rwOaA3aTsL9+2p6p53rmeximgdVuv21KnaSg9qDpuAXvjuKkzv1eSsNdS7WaifPERUON+oyavWTqZ31XoX0VPu8rH9TKK9I5pUzWEa0G7Y/YRUL//o8dM2KLfqB7YHcN50FspYTb+TD6+VzJ/USh6tq68POap7HaqD6esp8W0tVk8vevoioNOhw3P877pgNH0Q2ZblXORZ/310kYb0Yk33WAyxflZjtl7uHjd7ywoMbdRYd2GljyQdlgGdDV0KTaIPJSfdSVCvtzmMGNJn9NOu09gKzVWvwJewVqHTqC/50acwtG8QuRSa1HrItLMMt/HLaeRes3QOrPOQzoWv3MYmir6GOmIZ2DbqPPrS9XhahLaNOhea6ptL4G14gc4jaE2qBinaAkPbCZMeY4SNWC4yPqlXAa7BPqOgjSws1xHvZoeQrgrf9RnnnWb74yuwkIDuzXzUayS7kSf7MbVeN1X2pcvtrudY/VK29+0PidTjZwnxEPOXubqZta1P3SozlRyKyeyi/u1lPFklEtKtNc3oL5R2Xf1k6a8f5Yfd7pC/fs803NV3lMvVT2ZMWRoT1oUSAAAAAAAAAAAAAAAAAAAAAAAAAAD/oZ8CbDyoBExzvAAAAABJRU5ErkJggg==" alt=""/>' +
      '          </div>';*/
    return dialogDiv;
}

/**
 * 他人消息处理
 *
 * 执行逻辑：
 * 1、校验消息内容,判断消息内容是否存在
 * 2、创建必要H5元素
 * 3、编排H5元素
 * 4、为元素添加内容、事件
 * 5、设置元素样式
 *
 * @param chatMsg
 * @return {HTMLDivElement}
 */
const otherMsgViewBuild = function (chatMsg) {
    /* 1、校验消息内容,判断消息内容是否存在 */
    if (!chatMsg) {
        return;
    }

    /* 2、创建必要H5元素 */
    let dialogDiv = document.createElement(`div`)
    let otherAvatarDiv = document.createElement(`div`)
    let ownAvatarDiv = document.createElement(`div`)
    let avatarImg = document.createElement(`img`)
    let messageCardDiv = document.createElement(`div`)
    let messageDiv = document.createElement(`div`)
    let recommendDiv = recommend(chatMsg.guideTitle, chatMsg.recommends);

    /* 3、编排H5元素 */
    dialogDiv.appendChild(otherAvatarDiv);
    dialogDiv.appendChild(messageCardDiv);
    dialogDiv.appendChild(ownAvatarDiv);
    otherAvatarDiv.appendChild(avatarImg);
    messageCardDiv.appendChild(messageDiv);
    if (recommendDiv)
        messageCardDiv.appendChild(recommendDiv);

    /* 4、为元素添加内容、事件 */
    dialogDiv.id = chatMsg.chatId;
    avatarImg.src = CHAT_MSG_PROCESS_CONSTANT.otherAvatar;
    messageDiv.innerHTML = chatMsg.textContent;
    // 处理语音消息 wavRecord
    if (CHAT_CONSTANT.inputType.wavRecord === chatMsg.inputType) {
        let playWavImg = document.createElement(`img`);
        playWavImg.style.height = '30px';
        playWavImg.src = '/img/online_play.svg';
        messageDiv.appendChild(playWavImg);
        messageDiv.addEventListener("click", function () {
            playWav(chatMsg.chatId, chatMsg.resourceUri);
        });
    }


    /* 5、设置元素样式 */
    dialogDiv.classList.add(CHAT_MSG_PROCESS_CONSTANT.className.dialog);
    otherAvatarDiv.classList.add("other_constant");
    messageCardDiv.classList.add("messageCard");
    messageCardDiv.classList.add("otherMessageCard");
    ownAvatarDiv.classList.add("own_constant");
    ownAvatarDiv.setAttribute("hidden", "hidden");
    avatarImg.classList.add("constant_img");

    return dialogDiv;
}

/**
 * 推荐问题列表
 *
 * 执行逻辑：
 * 1、校验推荐问题列表,判断是否存在推荐问题
 * 2、创建必要H5元素
 * 3、编排H5元素
 * 4、为元素添加内容、事件
 * 5、设置元素样式
 *
 * @param guideTitle
 * @param recommends
 * @return {HTMLDivElement}
 */
const recommend = function (guideTitle, recommends) {
    /* 1、校验推荐问题列表,判断是否存在推荐问题 */
    if (!recommends || recommends.size === 0) {
        return;
    }

    /* 2、创建必要H5元素 */
    let recommendDiv = document.createElement(`div`);
    let guideTitleP = document.createElement(`p`);
    let guideTitleB = document.createElement(`b`);
    let recommendOl = document.createElement(`ol`);

    /* 3、编排H5元素 */
    recommendDiv.appendChild(guideTitleP);
    recommendDiv.appendChild(recommendOl);
    guideTitleP.appendChild(guideTitleB);

    /* 4、为元素添加内容、事件 */
    guideTitleB.innerText = guideTitle
    recommends.forEach(recommend => {
        let item = document.createElement(`li`);
        item.innerText = recommend;
        item.addEventListener('click', function () {
            // msgProcess(CHAT_CONSTANT.inputType.text, recommend, null)
            console.log("推荐问题点击事件：", item.innerText);
        });
        recommendOl.appendChild(item);
    })

    /* 5、设置元素样式 */
    recommendDiv.classList.add("recommend");

    return recommendDiv;
};

/**
 * 文件消息处理
 *
 * @param chatMsg
 */
const fileCardViewBuild = function (chatMsg) {
    /* 1、校验消息内容,判断消息内容是否存在 */
    if (!chatMsg) {
        return;
    }

    let dialogDiv = document.createElement(`div`)
    let otherAvatarDiv = document.createElement(`div`)
    let ownAvatarDiv = document.createElement(`div`)
    let avatarImg = document.createElement(`img`)
    let messageCardDiv = document.createElement(`div`)
    let fileCardDiv = fileCard(chatMsg.fileInfo);

    dialogDiv.appendChild(otherAvatarDiv);
    dialogDiv.appendChild(messageCardDiv);
    dialogDiv.appendChild(ownAvatarDiv);
    ownAvatarDiv.appendChild(avatarImg);
    messageCardDiv.appendChild(fileCardDiv);

    dialogDiv.classList.add(CHAT_MSG_PROCESS_CONSTANT.className.dialog);
    messageCardDiv.classList.add("messageCard");
    messageCardDiv.classList.add("ownMessageCard");
    otherAvatarDiv.classList.add("other_constant");
    ownAvatarDiv.classList.add("own_constant");
    avatarImg.classList.add("constant_img");
    otherAvatarDiv.setAttribute("hidden", "hidden");

    return dialogDiv;
}

/**
 * 语音消息处理
 *
 * @param chatMsg
 */
const wavCardViewBuild = function (chatMsg) {
    /* 1、校验消息内容,判断消息内容是否存在 */
    if (!chatMsg) {
        return;
    }

    /* 2、创建必要H5元素 */
    let dialogDiv = document.createElement(`div`)
    let otherAvatarDiv = document.createElement(`div`)
    let ownAvatarDiv = document.createElement(`div`)
    let avatarImg = document.createElement(`img`)
    let wavCardDiv = document.createElement(`div`)
    let wavSvg = document.createElement(`svg`)
    let svgPath = document.createElement(`path`)
    let wavSpan = document.createElement(`span`)

    /* 3、编排H5元素 */
    dialogDiv.appendChild(otherAvatarDiv);
    dialogDiv.appendChild(wavCardDiv);
    dialogDiv.appendChild(ownAvatarDiv);
    wavCardDiv.appendChild(wavSvg);
    wavSvg.appendChild(svgPath);
    wavSvg.appendChild(wavSpan);

    /* 4、为元素添加内容、事件 */
    dialogDiv.id = chatMsg.chatId;
    wavSpan.innerText = Math.floor(chatMsg.wavDuration) + '″';
    //  添加语音播放事件
    wavCardDiv.addEventListener("click", function () {
        playWav(chatMsg.chatId, chatMsg.resourceUri);
    });

    /* 5、设置元素样式 */
    dialogDiv.classList.add(CHAT_MSG_PROCESS_CONSTANT.className.dialog);
    otherAvatarDiv.classList.add("other_constant");
    ownAvatarDiv.classList.add("own_constant");
    avatarImg.classList.add("constant_img");
    wavCardDiv.classList.add("wavCard");
    wavSvg.classList.add("wavSvg");
    wavSvg.setAttribute("viewBox", "0 0 1024 1024")
    svgPath.setAttribute("d", "M649.6 12.8l-6.4-6.4L553.6 96l6.4 6.4c224 224 224 588.8 3.2 812.8l89.6 89.6c272-272 272-716.8-3.2-992z m-182.4 182.4c0-3.2-3.2-3.2-3.2-6.4L371.2 278.4l6.4 6.4c124.8 124.8 124.8 326.4 3.2 451.2l89.6 89.6c172.8-172.8 172.8-457.6-3.2-630.4z m-179.2 182.4l-6.4-6.4-134.4 134.4 140.8 140.8c73.6-76.8 73.6-195.2 0-268.8z");
    wavCardDiv.style.width = '20%';
    wavSpan.classList.add("wavDuration");

    /* 6、处理独特事项 */
    switch (chatMsg.msgType) {
        case CHAT_MSG_PROCESS_CONSTANT.chatMsgType.visitor:
        case CHAT_MSG_PROCESS_CONSTANT.chatMsgType.own: {
            ownAvatarDiv.appendChild(avatarImg);

            avatarImg.src = CHAT_MSG_PROCESS_CONSTANT.ownAvatar;
            otherAvatarDiv.hidden = true;

            // wavSvg.setAttribute("", "");
            wavCardDiv.classList.add("ownWavCard");
            wavCardDiv.style.left = 'calc(50% - var(--other-constant-width) - var(--message-card-it-size) - 10%)';
            break;
        }
        case CHAT_MSG_PROCESS_CONSTANT.chatMsgType.seat:
        case CHAT_MSG_PROCESS_CONSTANT.chatMsgType.other: {
        }
        default: {
            otherAvatarDiv.appendChild(avatarImg);
            avatarImg.src = CHAT_MSG_PROCESS_CONSTANT.otherAvatar;
            // ownAvatarDiv.setAttribute("hidden", "hidden");
            ownAvatarDiv.hidden = true;
            wavCardDiv.classList.add("otherWavCard");
            wavCardDiv.style.right = 'calc(50% - var(--other-constant-width) - var(--message-card-it-size) - 10%)';
        }
    }
    return dialogDiv;
}

/**
 * 系统消息处理
 * @param chatMsg
 */
const systemMsgViewBuild = function (chatMsg) {
    /* 1、校验消息内容,判断消息内容是否存在 */
    if (!chatMsg || !chatMsg.systemEvent) {
        return;
    }

    /* 2、创建必要H5元素 */
    let dialogDiv = document.createElement(`div`);
    let otherAvatarDiv = document.createElement(`div`);
    let systemCardDiv = document.createElement(`div`);
    let ownAvatarDiv = document.createElement(`div`);

    /* 3、编排H5元素 */
    dialogDiv.appendChild(otherAvatarDiv);
    dialogDiv.appendChild(systemCardDiv);
    dialogDiv.appendChild(ownAvatarDiv);

    /* 4、为元素添加内容、事件 */
    dialogDiv.id = chatMsg.chatId;
    if ("default" === chatMsg.systemEvent) {
        systemCardDiv.innerText = chatMsg.textContent;
    }

    /* 5、设置元素样式 */
    dialogDiv.classList.add(CHAT_MSG_PROCESS_CONSTANT.className.dialog);
    otherAvatarDiv.classList.add("other_constant");
    otherAvatarDiv.setAttribute("hidden", "hidden");
    // messageCardDiv.classList.add("messageCard");
    ownAvatarDiv.classList.add("own_constant");
    ownAvatarDiv.setAttribute("hidden", "hidden");

    return dialogDiv;
}

/**
 * 展示消息
 *
 * @param dialog    消息视图元素
 * @param isHistory 是否为历史消息 true|false
 */
const showChatMsgView = function (dialog, isHistory) {
    /* V1版本
    let dialogMsgBar = document.getElementById(`dialogMsgBar`);
    if (dialog === undefined) return;
    if (isHistory) {
        let firstDocument = dialogMsgBar.firstChild;
        if (firstDocument == null) {
            dialogMsgBar.append(dialog);
        } else {
            if (firstDocument.id !== CHAT_MSG_PROCESS_CONSTANT.no_history_message_id)
                firstDocument.before(dialog);
        }
        return;
    }
    dialogMsgBar.appendChild(dialog);
    dialogMsgBar.scrollTop = dialogMsgBar.scrollHeight; // 滚动到底*/

    // V2版本
    if (isHistory) {
        let historyChat = document.getElementById(`historyChat`);
        let firstDocument = historyChat.firstChild;
        if (firstDocument == null) {
            historyChat.append(dialog);
        } else {
            if (firstDocument.id !== CHAT_MSG_PROCESS_CONSTANT.no_history_message_id)
                firstDocument.before(dialog);
        }
    } else {
        let newChat = document.getElementById(`newChat`);
        console.log(dialog);
        newChat.appendChild(dialog);
        scrollButton();
    }
}


/* 5、导出方法 */
export {ChatMsg, CHAT_MSG_PROCESS_CONSTANT, msgViewBuild, showChatMsgView}



