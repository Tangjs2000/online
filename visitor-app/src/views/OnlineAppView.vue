<template>
  <div>
    <div id="custom-menu" class="menu">
      <p id="menu-copy" class="menu-item">复制</p>
      <p id="menu-revoke" class="menu-item">撤回</p>
      <p id="menu-save" class="menu-item">保存</p>
      <p id="menu-save-as" class="menu-item">另存为</p>
    </div>
    <div id="appBar" class="appBar">
      <!-- 1、对话栏 -->
      <div id="dialogBox" class="dialogBox">
        <!-- 标题 -->
        <div id="topicBar" class="topicBar">
          <img v-if="Basic.logo" :src="Basic.logo" class="topicLogo"/>
          <span v-if="Basic.title" class="topicTitle">{{ Basic.title }}</span>
        </div>
        <!-- 对话消息栏 -->
        <div id="dialogMsgBar" class="dialogMsgBar">
          <!-- 系统公告 -->
          <!--          <div class="sys_notice">
                      <t-notice-bar style="height: 30px;padding: 5px 16px" visible marquee
                                    content="阿达亲请问请问请问请问科技七五九二七五九二就期间恶趣味驱蚊器微乎其微" />
                    </div>-->
          <!-- 查看历史消息 -->
          <div id="viewHistoryChat" class="dialog">
            <button id="gainHistoryChat">查看历史消息</button>
          </div>
          <!-- 历史消息 -->
          <div id="historyChat"></div>
          <!-- 历史消息分割线 -->
          <div id="historyDivider" class="dialogV2">
            <div class="systemCard">
              <div class="cross-mark">
                <span style="margin:0 10px">以下是新消息</span>
              </div>
            </div>
          </div>
          <!-- 新消息(最新会话消息) -->
          <div id="newChat">
            <!-- 撤回消息 todo 本人撤回和对方撤回 不同展示处理-->
            <div id="revoke" class="dialogV2">
              <div class="systemCard">你撤回了一条消息
                <span style="color: darkorange;margin: 0 5px" @click="reEdit('123123')">重新编辑</span>
              </div>
            </div>
          </div>
        </div>
        <!-- 气泡栏 -->
        <div id="bubbleBar" class="bubbleBar">
          <ol id="bubble" class="bubble"></ol>
        </div>
        <!-- 工具栏 -->
        <div id="toolbar" class="toolbar">
            <i id="inputSwitch" class="inputSwitch recordMess" @click="inputSwitch">
              <!-- object标签会阻止click事件 todo 弃用 -->
              <!--<object v-if="initConfig.inputBoxType === TOOLBAR_INPUTBOX_TYPE.TEXT"
                      class="inputSwitch"
                      type="image/svg+xml" data="/public/svg/unit_speak.svg" style="fill: red"/>
              <object v-else-if="initConfig.inputBoxType === TOOLBAR_INPUTBOX_TYPE.VOICE"
                      class="inputSwitch"
                      type="image/svg+xml" data="/public/svg/unit_keyboard.svg" style="fill: red"/>-->
              <img v-if="initConfig.inputMode === `keyboard`" src="/public/svg/unit_speak.svg"/>
              <img v-else-if="initConfig.inputMode === `speak`" src="/public/svg/unit_keyboard.svg"/>
            </i>
            <div class="input">
              <textarea id="textInput" class="textInput" placeholder="请输入您的问题,我来为您解答~"
                        v-model="inputText"
                        v-show="initConfig.inputMode === `keyboard`">
              </textarea>
              <button id="speakButton" class="voiceInput" @click="sendMessage"
                      v-show="initConfig.inputMode === `speak`">
              </button>
            </div>
            <i class="inputSwitch" @click="showUnitTool(`emoji`)">
              <img src="/public/svg/unit_emoji.svg"/>
            </i>
            <button v-if="inputText" id="sendButton" class="sendButton" @click="sendMessage">发送</button>
            <!-- 组件工具(视频、文件) -->
            <i v-else id="unitTool" class="inputSwitch" @click="showUnitTool(`extend`)">
              <img src="/public/svg/unit_extend.svg">
            </i>
        </div>
        <div v-show="initConfig.unitModule" id="unitBar" class="unitBar">
          <div v-show="initConfig.unitModule === `extend`" id="extendUnit" class="extendUnit"></div>
          <div v-show="initConfig.unitModule === `emoji`" id="emojiUnit" class="emojiUnit">
            <div id="emojiTab" class="emojiTab"></div>
            <div style="flex: 1;overflow-y: auto;">
              <div id="emojiBody" class="emojiBody"></div>
            </div>
          </div>
        </div>
      </div>
      <!-- 信息栏 -->
      <div id="informationBox" v-if="initConfig.informationBox.show" class="informationBox"></div>
    </div>
  </div>
</template>

<link rel="stylesheet" type="text/css" href="../assets/chat/online-app.css"/>
<link rel="stylesheet" type="text/css" href="../assets/chat/wav-card.css"/>
<link rel="stylesheet" type="text/css" href="../assets/chat/text-card.css"/>
<link rel="stylesheet" type="text/css" href="../assets/chat/topic-bar.css"/>
<link rel="stylesheet" type="text/css" href="../assets/chat/bubble-bar.css"/>
<link rel="stylesheet" type="text/css" href="../assets/chat/tool-bar.css"/>
<link rel="stylesheet" type="text/css" href="../assets/chat/file-card.css"/>

<script>

import {formatDate, getRuntimeEnv, uuid} from "xijs"
import {Basic} from "../stores/BasicConfigure";
import {TOOLBAR_INPUTBOX_TYPE} from "../stores/chat/onlineAppConstant";
import {scrollTopEventProcess, scrollButton, historyV2} from "../stores/chat/chat";
import {initMedia} from "../stores/chat/MediaRTC";
import {initChat} from "../stores/chat/robot";
import {transferSeat} from "../stores/chat/seat";
import {gainFingerprint, upload} from "../stores/tool/CustomTool";
import {gainBasicConfiguration} from "../stores/VisitorAPi";
import {ChatMsgV2, bulid} from "../stores/chat/ChatMessage.ts";
import {
  ChatMode,
  ChatRole,
  ChatScene,
  chatService,
  emojiService,
  EmojiTab,
  InputMode,
  UnitModule
} from "../stores/chat/ChatV2";
import {playWav} from '../stores/chat/chat';
import {h5ContentService, ResourceMode} from "../stores/chat/H5ContentService";


// let chatImpl = new ChatImpl();
// let chatMessageService = new ChatMessageImpl();

export default {
  name: "online-app",
  data() {
    return {
      Basic,
      TOOLBAR_INPUTBOX_TYPE,
      initConfig: {
        unitModule: undefined,
        own: 123456,
        other: 1234556,
        inputMode: InputMode.keyboard,
        topicBox: {
        },
        informationBox: {
          show: false,
        }
      },
      inputText: '',
      dialogMsg: [],
    }
  },
  methods: {
    /* 展示组件|表情包 */
    showUnitTool(unitModule) {
      if (this.initConfig.unitModule && this.initConfig.unitModule === unitModule){
        this.initConfig.unitModule = undefined;
      }else {
        let unitBar = document.getElementById(`unitBar`);
        this.initConfig.unitModule = unitModule

        switch (this.initConfig.unitModule){
          case UnitModule.extend:{
            unitBar.style.height = '170px';
            unitBar.style.maxHeight = '170px';
            break;
          }
          case UnitModule.emoji:{
            unitBar.style.height = '190px';
            unitBar.style.maxHeight = '190px';
            emojiService.initEmoji();
            break;
          }
        }
      }
      scrollButton();
    },

    /* 切换输入方式(文本输入、音频输入) */
    inputSwitch(inputMode) {
      this.initConfig.inputMode = this.initConfig.inputMode === InputMode.speak ?
          InputMode.keyboard : InputMode.speak;
      switch (this.initConfig.inputMode){
        case InputMode.speak:{
          initMedia();
          break;
        }default:{
        }
      }
    },

    /* 撤回消息按钮处理事件-重新编辑 */
    reEdit(oldMessage) {
      this.initConfig.inputMode = InputMode.keyboard;
      this.inputText = oldMessage;
    },

    /**
     * 回复内容超长折叠/展开
     */
    toggleContent(cardId) {
      if (cardId === undefined || !cardId) return;

      let dialogCard = document.getElementById(cardId);
      let content = dialogCard.getElementsByClassName('replayContent')[0];
      // 当前是否展开
      let isExpand = content?.classList.toggle('collapse-base');

      let collapseButton = dialogCard.getElementsByClassName(`collapse`).length > 0 ?
          dialogCard.getElementsByClassName(`collapse`)[0] : dialogCard.getElementsByClassName(`expand`)[0];
      // let collapseButton = dialogCard.getElementById('collapseButton')[0];
      // let content = document.querySelector('.replayContent');
      // let collapseButton = document.getElementById('collapseButton');
      collapseButton?.classList.toggle('collapse');
      collapseButton?.classList.toggle('expand');
    },

    /**
     * 发送消息
     */
    sendMessage(inputText) {
      let dialogMsgBar = document.getElementById(`dialogMsgBar`);
      let inputBox = document.getElementById(`textInput`);
      inputText = inputText instanceof String && inputText ? inputText : inputBox.value;
      if (inputText?.length === 0) return; // 不允许发送空消息
      this.inputText = '';
      inputBox.value = null;
      // msgProcess(CHAT_CONSTANT.inputType.text, inputText, null);


      chatService.sendRichText(inputText, ChatScene.robot);
    },

    /**
     * video视频加载封面
     */
    loadCoverPage() {
      let video = document.getElementById(`video`);
      video.volume = 0;
      video.play();
      video.currentTime = 12;
      setTimeout(function () {
        video.pause();
      }, 0.5);
    },

    /* 初始化信息 */
    init() {
      /* 1、检验当前环境 */
      let env = getRuntimeEnv();
      if (env.isAndroid || env.isIOS) {
        const root = document.documentElement;
        root.style.setProperty('--message-card-width-scale', 0.75);
      }

      /* 2、初始化页面配置 */
      let textInput = document.getElementById("textInput");
      let sendButton = document.getElementById("sendButton");
      textInput.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') { // 或者使用 event.keyCode === 13，但不建议，因为keyCode已废弃
          event.preventDefault(); // 阻止默认的回车行为（例如提交表单）
          // 调用与按钮点击相同的事件处理程序
          // 这将触发按钮的click事件
          sendButton.click();
        }
      });

      let userinfo = {
        userId: "12345678",
        meetingId: uuid(20),
        initDatetime: formatDate(Date.now(), 'YY-MM-DD hh:mm:ss')
      }
      // console.log("localStorage", localStorage)
      localStorage.setItem("userinfo", JSON.stringify(userinfo));
    },

    /**
     * 初始化基础配置
     */
    async initBasicConfiguration() {
      let that = this;
      /* 1、请求接口获取基础配置 */
      let bubbles;
      let isRobotPriority = true;
      let unitTools;
      await gainBasicConfiguration()
          .then(result => {
            bubbles = result.bubbles;
            unitTools = result.unitTools;
          })

      /* 2、动态初始化浏览器页签logo和标题 */
      document.title = Basic.title;
      let logoLink = document.querySelector("link[rel='icon']");
      if (logoLink) logoLink.href = Basic.logo;
      else {
        logoLink = document.createElement("link");
        logoLink.rel = "icon";
        logoLink.href = Basic.logo;
        document.head.appendChild(logoLink);
      }

      /* 3、初始化气泡栏|胶囊栏 */
      let bubbleEl = document.getElementById(`bubble`);
      if (bubbles) {
        for (let bubble of bubbles) {
          let bubbleLi = document.createElement(`li`);
          bubbleLi.innerText = bubble;
          bubbleLi.addEventListener(`click`, function () {
            // msgProcess(CHAT_CONSTANT.inputType.text, bubble, null);
            chatService.sendRichText(bubble, ChatScene.robot);
          })
          bubbleEl.appendChild(bubbleLi);
        }
      }

      /* 4、初始化工具单元栏 */
      if (unitTools && unitTools.length > 0) {
        let extendUnit = document.getElementById(`extendUnit`);
        for (let i = 0; i < Math.min(unitTools.length, 8); i++) {
          let unitTool = unitTools[i];
          let unitToolDiv = document.createElement(`div`);
          let unitToolButton = document.createElement(`button`);
          let unitToolP = document.createElement(`p`);
          unitToolDiv.id = unitTool.id;
          unitToolButton.innerHTML = unitTool.h5_icon;
          unitToolP.innerText = unitTool.title;
          unitToolDiv.classList.add(`unit`);
          unitToolDiv.addEventListener(`click`, function () {
            console.log(unitTool.event);
            that.callSystemUnit(unitTool.event);
          })
          unitToolDiv.append(unitToolButton);
          unitToolDiv.append(unitToolP);
          extendUnit.append(unitToolDiv);
        }
      }

      /* 4、初始化查看历史消息按钮事件 */
      /* 4.1、查看历史消息按钮事件 */
      let gainHistoryChatButton = document.getElementById(`gainHistoryChat`);
      gainHistoryChatButton.addEventListener(`click`, historyV2);
      /* 4.2、滑动事件监听(作用同上：滚动到顶处理获取历史消息) */
      let dialogMsgBar = document.getElementById(`dialogMsgBar`);
      dialogMsgBar.addEventListener(`scroll`, scrollTopEventProcess);

      /* 5、判断是否机器人优先接入 */
      if (isRobotPriority) {
        initChat().then(result => {
          const {code, data, message} = result;
          if ("SUCCESS" === code) {
            let chatMsg = new ChatMsgV2();
            chatMsg.msgId = data.chatId;
            chatMsg.role = ChatRole.robot.toString();
            chatMsg.content = data.text;
            chatMsg.guideTitle = data.guideTitle;
            chatMsg.recommends = data.recommends;
            chatMsg.chatMode = ChatMode.richText
            bulid(chatMsg,false);
          }
        })
      }

      /* 6、坐席接入 */
      // transferSeat();

    },
    /**
     * 调用系统单元
     *
     * @param event 单元事件
     */
    callSystemUnit: function (event) {
      switch (event) {
        case "album": {
          /* 1、创建虚拟文件输入document元素 */
          let fileInput = document.createElement(`input`);
          fileInput.id = "file-input";
          fileInput.type = "file"
          fileInput.accept = "image/*"
          fileInput.multiple = true
          fileInput.capture = true
          fileInput.click();
          break;
        }
        case "camera": {
          break;
        }
        case "videoChat": {
          this.$router.push({name: 'videoChat'})
          break;
        }
        case "file": {
          /* 1、创建虚拟文件输入document元素 */
          let fileInput = document.createElement(`input`);
          fileInput.type = "file"
          // fileInput.accept = ".jpg,.jpeg,.png"
          fileInput.accept = "*"
          fileInput.click();

          /* 2、监听文件输入document元素文件上传事件 */
          fileInput.addEventListener("change", function (event) {
            let files = event.target.files;
            if (files && files.length > 0) {
              for (const file of files) {
                upload(file).then(fileInfo => {
                  let element = h5ContentService.builder()
                  .resourceMode(ResourceMode.picture)
                  .parse("."+fileInfo.fileSuffix)
                  .resourceUri(fileInfo.accessUrl)
                  .build();
                  let contentH5 = element.outerHTML;
                  console.log(contentH5);
                  chatService.sendRichText(contentH5, ChatScene.robot);
                  /*msgProcess(CHAT_CONSTANT.inputType.file,
                      null, fileInfo.accessUrl, 0, fileInfo);*/
                });
              }
            }
          })
          break;
        }
        case "toManual": {
          transferSeat();
          break;
        }
        case"position": {
          if ("geolocation" in navigator) {
            // geolocation is available
            navigator.geolocation.getCurrentPosition(function (position) {
              console.log("Latitude is :", position.coords.latitude);
              console.log("Longitude is :", position.coords.longitude);
            }, function (error) {
              console.error("Error Code = " + error.code + " - " + error.message);
            });
          } else {
            // geolocation is not supported
            console.log("Geolocation is not supported by this browser.");
          }
          break;
        }
        default: {
          console.log("调用未知的处理单元");
        }
      }
    },
    playWavPage(msgId,url){
      playWav(msgId,url);
    }

  },
  mounted: function () {
    let res = gainFingerprint();
    console.log(res);

    /*const vConsole = new VConsole();
    vConsole.show();*/
    // this.scrollListen();
    this.init();
    // this.loadCoverPage();

    /* 初始化基础配置 */
    this.Basic = Basic;
    this.initBasicConfiguration();
    let fileCardMsg = document.getElementById("fileCardMsg");


    /*gainFingerprint().then(res=>{
      console.log(res)
    });*/
    /*let that = this;
    let inputSwitch = document.getElementById(`inputSwitch`);
    inputSwitch.addEventListener(`click`,function (){
      that.inputSwitch();
    })*/
  }
}
</script>

<style>
@import url(../assets/chat/online-app.css);
@import url(../assets/chat/wav-card.css);
@import url(../assets/chat/richText-card.css);
@import url(../assets/chat/topic-bar.css);
@import url(../assets/chat/bubble-bar.css);
@import url(../assets/chat/tool-bar.css);
@import url(../assets/chat/file-card.css);
@import url(../assets/chat/menu-card.css);
@import url(../assets/chat/emoji.css);
/*@import url(../assets/chat/text-card.css);*/
</style>
