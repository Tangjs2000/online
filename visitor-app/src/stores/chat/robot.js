/**
 *  机器人对接-处理
 *
 *  1、定义当前所需调用接口API
 *  2、定义当前所需的常量
 *  3、调用接口处理方法
 *  4、导出方法
 */
import axios from "axios";
import {uuid} from "xijs";


/* 1、定义当前所需调用接口API */
const API = {
    initChat: { // 初始化会话
        url: "/online/robot/initChat",
        method: "POST"
    },
    chat: { // 对话聊天
        url: "/online/robot/chat",
        method: "POST"
    },
    destroy: {  // 销毁会话
        url: "/online/robot/destroy",
        method: "POST"
    }
}

/* 2、定义当前所需的常量 */
const ROBOT_CONSTANT = {
    sessionId: null,

}

/* 3、调用接口处理方法 */
/**
 * 3.1、初始化会话
 *
 */
const initChat = function () {
    return new Promise((success, fail) => {
        if (ROBOT_CONSTANT.sessionId) {
            console.error("当前会话已初始化,sessionId:" + ROBOT_CONSTANT.sessionId);
            return;
        }
        ROBOT_CONSTANT.sessionId = uuid(20);

        let userinfo = JSON.parse(localStorage.getItem("userinfo"));

        let data = {
            sessionId: ROBOT_CONSTANT.sessionId,
            userId: userinfo?.userId,
            ext: {}
        }

        axios.create().request({
            url: API.initChat.url,
            method: API.initChat.method,
            data
        }).then(res => {
            console.log("robot-initChat接口调用成功,响应结果:", res);
            success(res.data);
        }).catch(e => {
            console.error("robot-initChat接口调用失败!!!", e);
            fail(e);
        })
    });
}

/**
 * 3.2、对话聊天
 *
 * @param inputType
 * @param queryText
 * @param resourceUri
 */
const chat = function (inputType, queryText, resourceUri) {
    return new Promise((success, fail) => {
        if (!ROBOT_CONSTANT.sessionId) {
            console.error("请先初始化会话");
            return;
        }

        let userinfo = JSON.parse(localStorage.getItem("userinfo"));

        let data = {
            sessionId: ROBOT_CONSTANT.sessionId,
            userId: userinfo?.userId,
            inputType,
            queryText,
            resourceUri,
            ext: {}
        }

        axios.create().request({
            url: API.chat.url,
            method: API.chat.method,
            data
        }).then(res => {
            console.log("robot-chat接口调用成功,响应结果:", res);
            success(res.data);
        }).catch(e => {
            console.error("robot-chat接口调用失败!!!", e);
            fail(e);
        })
    })
}

/**
 * 3.3、销毁会话
 */
const destroy = function () {
    if (!ROBOT_CONSTANT.sessionId) {
        console.log("当前会话已销毁");
        return;
    }

    let data = {
        sessionId: ROBOT_CONSTANT.sessionId
    }
    axios.create().request({
        url: API.destroy.url,
        method: API.destroy.method,
        data
    }).then(res => {
        ROBOT_CONSTANT.sessionId = null;
        console.log("robot-destroy接口调用成功,响应结果:", res);
    }).catch(e => {
        console.error("robot-destroy接口调用失败!!!", e);
    })
}

/* 4、导出方法 */
export {
    initChat,
    chat,
    destroy
}



