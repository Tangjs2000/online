/**
 *  转人工后坐席对接-处理
 *
 *  1、定义当前所需调用接口API
 *  2、定义当前所需的常量
 *  3、调用接口处理方法
 *  4、导出方法
 */
import axios from "axios";
import {msgViewBuild} from "./chatMsgProcess";
import {CHAT_CONSTANT} from "./chat";


/* 1、定义当前所需调用接口API */
const API = {
    ws: "ws://127.0.0.1:8088/online/visitor/",
    wws: ""
}

/* 2、定义当前所需的常量 */
const SEAT_CONSTANT = {
    sessionId: null,
}
export let webSocket;

/* 3、调用接口处理方法 */
/**
 * 3.1、转接坐席,打开WebSocket连接
 * 执行逻辑：
 *
 */
const transferSeat = function () {
    /* 1、 */
    CHAT_CONSTANT.node = CHAT_CONSTANT.define.node.seat;
    if (webSocket && webSocket.readyState === 3) return;
    let userinfo = JSON.parse(localStorage.getItem("userinfo"));
    webSocket = new WebSocket(API.ws + userinfo?.userId);

    /* 打开连接 */
    webSocket.onopen = (event) => {
        console.log("onopen:", event)
    }

    /* 消息接收 */
    webSocket.onmessage = (event) => {
        console.log("onmessage:", event);

        let chatMsg = JSON.parse(event?.data);
        const {roomId, sessionId, msgType} = chatMsg;
        if (roomId) localStorage.setItem("roomId", roomId);
        if (sessionId) localStorage.setItem("sessionId", sessionId);
        if ("system" !== msgType) playSystemPromptSound(PROMPT_TYPE.news);

        msgViewBuild(chatMsg, false);
    }

    webSocket.onerror = (event) => {
        console.log("onerror:", event);
        CHAT_CONSTANT.node = CHAT_CONSTANT.define.node.robot;
    }

    /* 关闭连接 */
    webSocket.onclose = (event) => {
        console.log("onclose:", event);
        CHAT_CONSTANT.node = CHAT_CONSTANT.define.node.robot;
    }

    /* 添加 */
    /*webSocket.addListener(`ping`, function () {
        webSocket.send("pong");
    })*/
}

/**
 * 系统提示音类型
 * @type {{news: string}}
 */
const PROMPT_TYPE = {
    news: "news"    // 新消息提示
}

/**
 * 播放系统提示音
 * @param promptType
 */
const playSystemPromptSound = function (promptType) {
    switch (promptType) {
        case PROMPT_TYPE.news: {
            let newsAudio = new Audio("/src/prompt/news.wav");
            newsAudio.play();
            break;
        }
        default: {
            console.warn("暂无对应系统提示音");
        }
    }
}

export {transferSeat}













