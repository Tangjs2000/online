/**
 *  消息分发-处理(消息发送、消息接收)
 *
 *  1、定义当前所需调用接口API
 *  2、定义当前所需的常量
 *  3、调用接口处理方法
 *  4、导出方法
 */
import {CHAT_MSG_PROCESS_CONSTANT, ChatMsg, msgViewBuild} from "./chatMsgProcess";
import {initChat, chat, destroy} from "./robot";
import axios from "axios";
import {transferSeat, webSocket} from "./seat";
import {core, H5ChatObj} from "./h5ChatMessage";
import {MESSAGE_CONTENT_TYPE} from "./onlineAppConstant";
import {chatHistory} from "./ChatHistory";
import {bulid} from "./ChatMessage";


/* 1、定义当前所需调用接口API */
const API = {
    template: {
        url: "",
        method: "POST"
    },
    chatMsgHistory: { // 查询历史聊天消息
        url: "/online/chatMsg/history",
        method: "POST"
    }
}

/* 2、定义当前所需的常量 */
const CHAT_CONSTANT = {
    define: {
        node: {robot: "robot", seat: "seat"},
    },
    node: "robot", // 流程节点 robot、seat
    inputType: {
        text: "1",
        wavRecord: "2",
        file: "3",
    },
    own: {},
    other: {},
    history: {
        current: 1,
        size: 10,
    },
    fileModel: {
        picture: ['.jpg', '.png', '.jpeg', '.svg', '.gif', '.bmp', '.webp'],
        video: ['.avi', '.wmv', '.mpg', 'mpeg', '.mov', '.rm', '.ram', '.swf', '.flv', '.mp4'],
        audio: ['.wav', '.mp3']
    }
}


/* 3、调用接口处理方法 */
/**
 * 消息视图构建
 */
const msgProcess = function (inputType, inputText, resourceUri, wavDuration, fileInfo) {
    console.log(inputType, inputText, resourceUri);
    let chatMsg = new ChatMsg();
    chatMsg.chatId = Date.now();
    chatMsg.msgType = CHAT_MSG_PROCESS_CONSTANT.chatMsgType.own;
    chatMsg.inputType = inputType;
    chatMsg.dateTime = new Date();
    chatMsg.textContent = inputText;
    chatMsg.resourceUri = resourceUri;
    chatMsg.wavDuration = wavDuration / 1000;
    chatMsg.fileInfo = fileInfo;
    msgViewBuild(chatMsg, false);

    /* 将访客发送的消息转换成标准h5消息 */
    let textContent = inputText;
    if (CHAT_CONSTANT.inputType.text === inputType) {
    } else if (CHAT_CONSTANT.inputType.file === inputType) {
        let h5ChatObj = new H5ChatObj();
        h5ChatObj.type = MESSAGE_CONTENT_TYPE.IMG;
        h5ChatObj.resourceList = [
            {
                accessUrl: resourceUri,
                type: MESSAGE_CONTENT_TYPE.IMG
            }
        ]
        textContent = core(h5ChatObj) ? core(h5ChatObj).outerHTML : '';
    }

    /* 当前为机器人对话 */
    if (CHAT_CONSTANT.node === CHAT_CONSTANT.define.node.robot) {
        chat(chatMsg.inputType, textContent, chatMsg.resourceUri)
            .then(result => {
                const {code, data, message} = result;
                if ("SUCCESS" === code) {
                    let chatMsg = new ChatMsg();
                    chatMsg.chatId = Date.now();
                    chatMsg.msgType = CHAT_MSG_PROCESS_CONSTANT.chatMsgType.other
                    chatMsg.inputType = data.inputType;
                    chatMsg.dateTime = data.dateTime;
                    chatMsg.textContent = data.text;
                    chatMsg.guideTitle = data.guideTitle;
                    chatMsg.recommends = data.recommends;
                    msgViewBuild(chatMsg, false)
                }
            });
    }
    /* 当前为坐席对话 */
    else if (CHAT_CONSTANT.node === CHAT_CONSTANT.define.node.seat) {
        let roomId = localStorage.getItem("roomId");
        let sessionId = localStorage.getItem("sessionId");
        chatMsg.roomId = roomId;
        chatMsg.sessionId = sessionId;
        if (!webSocket || webSocket.status === 'CLOSING' || webSocket.status === 'CLOSED')
            transferSeat();
        webSocket.send(JSON.stringify(chatMsg));
    }
}

let audio = new Audio();
let playWavChatId;
let playOrPause;    // true播放、false暂停
/**
 * 播放语音
 * @param resourceUri
 */
const playWav = function (chatId, resourceUri) {
    if (playWavChatId && playWavChatId === chatId && audio && audio.src) {
        playOrPause ? audio.pause() : audio.play();
        return;
    }

    playWavChatId = chatId;
    axios.create().request({
        url: "/unit" + resourceUri,
        method: "GET",
        headers: {
            "Content-Type": "application/json;charset=UTF-8"
        },
        responseType: "blob"
    }).then(res => {
        console.log(res);
        // 创建一个临时的URL指向录音文件
        let blob = new Blob([res.data], {type: 'audio/wav'}); // 或者相应的MIME类型
        let url = URL.createObjectURL(blob);

        // 创建一个audio元素并设置src属性为刚才创建的URL
        audio.src = url;
        audio.onplay = function () { // 音频播放事件触发
            playOrPause = true;
            console.log("播放");
        }
        audio.onpause = function () { // 音频(暂停|停止)事件触发
            playOrPause = false;
            console.log("暂停或结束");
        }
        audio.onendded = function () {  // 当不需要临时的URL时，应该释放它
            playOrPause = false;
            URL.revokeObjectURL(url);
        }
        audio.play(); // 播放录音
    }).catch(e => {
        console.error(e);
    });
}

/**
 * 查询聊天历史消息
 */
const history = function () {
    let userinfo = JSON.parse(localStorage.getItem(`userinfo`));

    let patams = {
        "current": CHAT_CONSTANT.history.current,
        "size": CHAT_CONSTANT.history.size
    }
    let data = {
        "userId": userinfo?.userId,
        "datatime": userinfo?.initDatetime
    }
    axios.create().request({
        url: API.chatMsgHistory.url + "?current=" + patams.current + "&size=" + patams.size,
        method: API.chatMsgHistory.method,
        headers: {
            "Content-Type": "application/json;charset=UTF-8"
        },
        data
    }).then(res => {
        const {code, data, message} = res.data;
        if ("SUCCESS" === code) {
            if (data?.length > 0) {
                CHAT_CONSTANT.history.current++;
                let dialogMsgBar = document.getElementById(`dialogMsgBar`);
                let oldHeight = dialogMsgBar.scrollHeight;
                for (const chatMsg of data) {
                    msgViewBuild(chatMsg, true)
                }
                let newHeight = dialogMsgBar.scrollHeight;
                dialogMsgBar.scrollTop = newHeight - oldHeight;

                if (data.length === CHAT_CONSTANT.history.size)
                    return;
            }
            /* 通知滚动到底 */
            let gainHistoryChatButton = document.getElementById(`gainHistoryChat`);
            gainHistoryChatButton.innerText = '暂无历史消息';
            gainHistoryChatButton.removeEventListener(`click`, history)
            let dialogMsgBar = document.getElementById(`dialogMsgBar`);
            dialogMsgBar.removeEventListener(`scroll`, scrollTopEventProcess)
        }
    }).catch(e => {
        console.error(e);
    });
}

/**
 * 查询聊天历史消息
 */
export const historyV2 = function () {
    let userinfo = JSON.parse(localStorage.getItem(`userinfo`));
    let data = {
        "userId": userinfo?.userId,
        "datatime": userinfo?.initDatetime,
        "current": CHAT_CONSTANT.history.current,
        "size": CHAT_CONSTANT.history.size
    }

    chatHistory(null,data)
        .then(res=>{
            const data = res;
            if (data?.length > 0) {
                CHAT_CONSTANT.history.current++;
                let dialogMsgBar = document.getElementById(`dialogMsgBar`);
                let oldHeight = dialogMsgBar.scrollHeight;
                for (const chatMsg of data) {
                    bulid(chatMsg, true)
                }
                let newHeight = dialogMsgBar.scrollHeight;
                dialogMsgBar.scrollTop = newHeight - oldHeight;
                if (data.length === CHAT_CONSTANT.history.size)
                    return;
            }
            /* 通知滚动到底 */
            let gainHistoryChatButton = document.getElementById(`gainHistoryChat`);
            gainHistoryChatButton.innerText = '暂无历史消息';
            gainHistoryChatButton.removeEventListener(`click`, history)
            let dialogMsgBar = document.getElementById(`dialogMsgBar`);
            dialogMsgBar.removeEventListener(`scroll`, scrollTopEventProcess)
        })
        .catch(e=>{console.error(e)})
}

/**
 * 消息框滚动到顶事件
 */
const scrollTopEventProcess = function () {
    let dialogMsgBar = document.getElementById(`dialogMsgBar`);
    if (dialogMsgBar.scrollTop === 0) historyV2();  // 滑动到顶
}

/**
 * 消息框滚动到底
 */
const scrollButton = function () {
    let dialogMsgBar = document.getElementById(`dialogMsgBar`);
    dialogMsgBar.scrollTop = dialogMsgBar.scrollHeight;
}

/* 4、导出方法 */
export {msgProcess, playWav, history, scrollTopEventProcess, scrollButton, CHAT_CONSTANT}










