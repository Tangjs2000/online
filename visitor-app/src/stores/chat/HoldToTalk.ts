import {RecordRTC} from '../voice/RecordRTC.js';
import axios from "axios";
import {ChatScene, chatService} from "./ChatV2";
import {applyMicrophonePermission} from "../AndroidApi";

let microphone = undefined;
let recorder: RecordRTC;
const isEdge = navigator.userAgent.indexOf('Edge') !== -1 && (!!navigator.msSaveOrOpenBlob || !!navigator.msSaveBlob);
const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

/* 按住说话 */
export const holdToTalk = () => {
}


/* 打开麦克风 */
export const mic_open = () => {
    let micPermission = mic_permission_open(function (mic: MediaSource) {
        microphone = mic;
        /* 1、初始化RecordRTC */
        let options = {
            type: 'audio',
            mimeType: 'audio/wav',
            numberOfAudioChannels: isEdge ? 1 : 2,
            checkForInactiveTracks: true,
            bufferSize: 16384,
            sampleRate: 16000,
            recorderType: undefined,
        };
        if (isSafari || isEdge) {
            options.recorderType = RecordRTC.StereoAudioRecorder;
        }
        if (navigator.platform && navigator.platform.toString().toLowerCase().indexOf('win') === -1) {
            // options.sampleRate = 48000; // or 44100 or remove this line for default
        }
        if (isSafari) {
            // options.sampleRate = 44100;
            options.bufferSize = 4096;
            options.numberOfAudioChannels = 2;
        }
        // @ts-ignore
        recorder = new RecordRTC(mic, options);

        /* 2、初始化起点坐标、终点坐标 */
        let hasCancel;
        let posStart; //初始化起点坐标
        let posEnd;   //初始化终点坐标
        let speakBtnElem = document.getElementById("speakButton"); // 获取按住说话按钮元素
        let holdMask = document.getElementById(`hold-mask`);    // 获取样式蒙版
        let holdMaskExplain = holdMask.getElementsByClassName(`hold-mask-explain`);
        speakBtnElem.innerText = '按住 说话';

        /* 3、添加按住说话事件 */
        speakBtnElem.addEventListener("touchstart", function (event) {
            event.stopPropagation();  // 阻止冒泡
            event.preventDefault();   //阻止浏览器默认行为
            hasCancel = false;
            posStart = event.touches[0].pageY;  //设置起点坐标
            posEnd = posStart;                  //设置终点坐标
            speakBtnElem.innerText = '松开 结束';
            holdMask.style.display = 'block';
            holdMaskExplain[0].innerHTML = '上滑取消';
            // @ts-ignore
            recorder.startRecording(startCallback) // 开始录音
            console.log("Start");
        });
        /* 移动事件|检测是否取消发送 */
        speakBtnElem.addEventListener(`touchmove`, (event) => {
            posEnd = event.touches[0].pageY;
            if (posStart - posEnd > 100) {
                hasCancel = true;
                holdMaskExplain[0].innerHTML = '松开取消';
            } else {
                hasCancel = false;
                holdMaskExplain[0].innerHTML = '上滑取消';
            }
        })

        /* 4、添加说话结束事件 */
        speakBtnElem.addEventListener("touchend", function (event) {
            /*event.stopPropagation();
            event.preventDefault();*/
            holdMask.style.display = 'none';
            speakBtnElem.innerText = '按住 说话';

            if (hasCancel) {
                // @ts-ignore
                recorder.stopRecording();
                console.log("取消发送");
            } else {
                // @ts-ignore
                recorder.stopRecording(stopCallback);
            }
        })
    });
}

/**
 * 开始录音
 *
 * @param mediaSource
 */
const startCallback = (mediaSource: MediaSource) => {

}

/**
 * 停止录音
 *
 * @param mediaSource
 */
const stopCallback = (mediaSource: MediaSource) => {
    console.log("停止录音回调")

    // @ts-ignore
    const internalRecorder = recorder.getInternalRecorder();
    /* 左声道|右声道 */
    let leftchannel = internalRecorder.leftchannel;
    let rightchannel = internalRecorder.rightchannel;
    // @ts-ignore
    let wavBlob = new Blob([recorder.getBlob()], {type: 'audio/wav'})

    /* 上传录音文件到服务器 */
    console.log("录音停止事件=====>录音开始上传", wavBlob);
    let formData = new FormData()
    formData.append("file", wavBlob, "recorder.wav");
    /* 1、上传录音文件到服务器 */
    axios.create().request({
        url: "/unit/minio/upload",
        method: "POST",
        headers: {
            "Content-Type": "multipart/form-data;"
        },
        data: formData,
    }).then(res => {
        let {data} = res.data;
        chatService.sendVoice(data, ChatScene.robot)
    }).catch(e => {
        console.error(e);
    });
}

/**
 * 打开麦克风权限
 *
 * @param callback
 */
export const mic_permission_open = (callback): boolean => {
    try {
        applyMicrophonePermission();
    } catch {
    }

    if (typeof navigator.mediaDevices === 'undefined' || !navigator.mediaDevices.getUserMedia) {
        alert('This browser does not supports WebRTC getUserMedia API.');
        if (!!navigator.getUserMedia) {
            alert('This browser seems supporting deprecated getUserMedia API.');
        }
    }
    navigator.mediaDevices.getUserMedia({
        audio: isEdge ? true : {
            echoCancellation: false
        }
    }).then(function (mic) {
        callback(mic);
        return true;
    }).catch(function (error) {
        console.error("打开录音权限失败", error);
    });
    return false;
}
