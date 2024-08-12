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
        recorder = new RecordRTC(microphone, options);

        /* 2、初始化起点坐标、终点坐标 */
        let hasCancel = false;
        let posStart = 0; //初始化起点坐标
        let posEnd = 0;   //初始化终点坐标
        let speakBtnElem = document.getElementById("speakButton"); // 获取按住说话按钮元素
        speakBtnElem.innerText = '按住 说话';

        /* 3、添加按住说话事件 */
        speakBtnElem.addEventListener("touchstart", function (event) {
            event.stopPropagation();  // 阻止冒泡
            event.preventDefault();   //阻止浏览器默认行为
            posStart = 0;
            posStart = event.touches[0].pageY;  //获取起点坐标
            speakBtnElem.innerText = '松开 结束';
            // @ts-ignore
            recorder.startRecording(startCallback) // 开始录音
            console.log("Start");
        });

        /* 4、添加说话结束事件 */
        speakBtnElem.addEventListener("touchend", function (event) {
            event.stopPropagation();
            event.preventDefault();
            posEnd = 0;
            posEnd = event.changedTouches[0].pageY;//获取终点坐标
            speakBtnElem.innerText = '按住 说话';
            if (posStart - posEnd < 100) {
                hasCancel = false;
                // endDate = new Date();
                console.log("End");
            } else {
                hasCancel = true;
                console.log("Cancel");
            }

            // @ts-ignore
            recorder.stopRecording(stopCallback);
        })
    });
    /*if (!micPermission){
        console.error("麦克风权限无法打开");
    }*/
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


    // @ts-ignore
    /*let src = URL.createObjectURL(recorder.getBlob());
    let newAudio = document.createElement('audio');
    newAudio.controls = true;
    newAudio.autoplay = true;

    if(src) {
        newAudio.src = src;
    }
    newAudio.play();*/
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
