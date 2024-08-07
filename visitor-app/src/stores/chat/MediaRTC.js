import axios from "axios";
import Recorder from "js-audio-recorder";
import {msgProcess, CHAT_CONSTANT} from "./chat";
import {bulid, ChatMsgV2} from "./ChatMessage";
import {ChatMode, ChatRole, ChatScene, chatService} from "./ChatV2";

let hasInitFinish = false;
let hasCancel = false;
let mediaRecorder;
let recordBlob = [];  // 创建一个Blob对象，用于存储录音数据
let startDate;  // 录音开始时间
let endDate;    // 录音结束时间
const minDuration = 2000;  // 音频文件最小时长
let isRecorder = false;    // 是否正在触摸按住说话


/**
 * 初始化媒体
 */
export async function initMedia() {
  /* 1、获取媒体资源,并初始化事项 */
  const stream = await navigator.mediaDevices.getUserMedia(
    {audio: {sampleRate: 16000}},
    (res) => {    // 成功回调函数
      hasInitFinish = true;
      console.log(res);
    },
    (e) => {      // 失败回调函数
      let hasInitFinish = false;
      console.error(e);
    });

  mediaRecorder = new Recorder({
    sampleBits: 16,               // 采样位数，支持 8 或 16
    sampleRate: 16000,           // 采样率
    numChannels: 1,             // 声道数，支持 1 或 2
    // 编码格式，支持 'pcm' 或 'wav'
    // pcm 编码的音频数据需要通过其他库（如 lamejs）转码为 mp3 格式才能播放
    // wav 编码的音频数据可以直接播放，但文件体积较大
    encode: 'wav'
  });

  /* 2、设置录音开始、暂停、停止事件 */
  /* 2.1、录音数据保存事件 */
  mediaRecorder.ondataavailable = function (e) {
    if (hasCancel) {
      console.log("录音数据保存事件=====>录音取消上传");
      return;
    }
    recordBlob.push(e.data);
  };
  /* 2.2、录音停止事件 */

  /* 3、初始化起点坐标、终点坐标 */
  let posStart = 0; //初始化起点坐标
  let posEnd = 0;   //初始化终点坐标
  let speakBtnElem = document.getElementById("speakButton"); // 获取按住说话按钮元素
  speakBtnElem.innerText = '按住 说话';

  /* 4、添加按住说话事件 */
  speakBtnElem.addEventListener("touchstart", function (event) {
    if (isRecorder) return
    isRecorder = true;
    event.stopPropagation();  // 阻止冒泡
    event.preventDefault();   //阻止浏览器默认行为
    posStart = 0;
    posStart = event.touches[0].pageY;  //获取起点坐标
    speakBtnElem.innerText = '松开 结束';
    // $("#audiobg").show();
    // $("#audiobg>p").hide();
    startRecord() // 开始录音
    console.log("Start");
  });

  /* 5、添加说话结束事件 */
  speakBtnElem.addEventListener("touchend", function (event) {
    if (!isRecorder) return
    isRecorder = false;
    event.stopPropagation();
    event.preventDefault();
    posEnd = 0;
    posEnd = event.changedTouches[0].pageY;//获取终点坐标
    speakBtnElem.innerText = '按住 说话';

    if (posStart - posEnd < 100) {
      // $("#audiobg>p").hide();
      hasCancel = false;
      endDate = new Date();
      console.log("End");
    } else {
      // $("#audiobg>p").show();
      hasCancel = true;
      console.log("Cancel");
    }
    stopRecord();
  })
}

/**
 * 开始录制
 */
function startRecord() {
  recordBlob = [];
  mediaRecorder.start();
  startDate = new Date();
}

/**
 * 结束录制
 */
function stopRecord() {
  mediaRecorder.stop();

  let wavDuration = endDate - startDate;
  // if (hasCancel || minDuration > wavDuration) {
  if (hasCancel) {
    console.log("录音停止事件=====>录音取消上传：" + hasCancel + ",时长：" + wavDuration + "ms");
    return;
  }

  let wavBlob = mediaRecorder.getWAVBlob();
  console.log("录音停止事件=====>录音开始上传");
  // const newBolb = new Blob(wavBlob, {type: "audio/wav"});
  let formData = new FormData()
  formData.append("file", wavBlob, "recorder.wav");
  // msgProcess(CHAT_CONSTANT.inputType.wavRecord, null, null, wavDuration);
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
    // msgProcess(CHAT_CONSTANT.inputType.wavRecord, null, data, wavDuration);

    chatService.sendVoice(data,ChatScene.robot)
  }).catch(e => {
    console.error(e);
  });

}




