<template>
  <div>
    <div id="media-mask" class="media-mask">
      <div class="media-mask">
      </div>
    </div>
    <div id="custom-menu" class="menu">
      <p id="menu-copy" class="menu-item">复制</p>
      <p id="menu-revoke" class="menu-item">撤回</p>
      <p id="menu-save" class="menu-item">保存</p>
      <p id="menu-save-as" class="menu-item">另存为</p>
    </div>
    <!-- 按住说话、上滑取消样式 -->
    <div id="hold-mask" class="hold-mask">
      <div class="hold-mask-item">
        <img id="hold-mask-img" src="/public/svg/online/holdToTalk.svg" class="hold-mask-img">
        <p id="hold-mask-explain" class="hold-mask-explain">上滑取消</p>
      </div>
    </div>
    <div id="appBar" class="appBar">
      <!-- 1、对话栏 -->
      <div id="dialogBox" class="dialogBox">
        <!-- 标题栏 -->
        <chat-topic-bar v-model="Basic"/>
        <!-- 对话消息栏 -->
        <chat-dialog-bar v-model:notice="Basic.notice" v-model="dialogMsg"
                         @reEdit="reEdit" @revoke=""/>
        <!-- 气泡栏 -->
        <chat-bubble-bar v-model:bubble="Basic.bubble"/>
        <!-- 工具栏 -->
        <chat-tool-bar @send="sendMessage"/>
      </div>
      <!-- 信息栏 -->
      <div id="informationBox" v-if="initConfig.informationBox.show" class="informationBox"></div>
    </div>
  </div>
</template>

<link rel="stylesheet" type="text/css" href="../../assets/chat/online-app.css"/>
<link rel="stylesheet" type="text/css" href="../../assets/chat/wav-card.css"/>
<link rel="stylesheet" type="text/css" href="../../assets/chat/text-card.css"/>
<link rel="stylesheet" type="text/css" href="../../assets/chat/topic-bar.css"/>
<link rel="stylesheet" type="text/css" href="../../assets/chat/bubble-bar.css"/>
<link rel="stylesheet" type="text/css" href="../../assets/chat/tool-bar.css"/>
<link rel="stylesheet" type="text/css" href="../../assets/chat/file-card.css"/>

<script>

import {formatDate, getRuntimeEnv, uuid} from "xijs"
import {Basic} from "../../stores/BasicConfigure";
import {TOOLBAR_INPUTBOX_TYPE} from "../../stores/chat/onlineAppConstant";
import {scrollTopEventProcess, scrollButton, historyV2} from "../../stores/chat/chat";
import {initChat} from "../../stores/chat/robot";
import {transferSeat} from "../../stores/chat/seat";
import {gainFingerprint, upload} from "../../stores/tool/CustomTool";
import {gainBasicConfiguration} from "../../stores/VisitorAPi";
import {ChatMsgV2, bulid} from "../../stores/chat/ChatMessage.ts";
import {ChatMode, ChatRole, ChatScene, chatService, InputMode, UnitModule} from "../../stores/chat/ChatV2";
import {h5ContentService, ResourceMode} from "../../stores/chat/H5ContentService";
import {mic_open} from "../../stores/chat/HoldToTalk";
import CustomTextarea from "../../components/customTextarea.vue";
import Hammer from 'hammerjs';
import ChatTopicBar from "./ChatTopicBar.vue";
import ChatDialogBar from "./ChatDialogBar.vue";
import ChatBubbleBar from "./ChatBubbleBar.vue";
import ChatToolBar from "./ChatToolBar.vue";
import {Input, InputType} from "../../stores/chatV2/RichTextInput";

export default {
  name: "online-app",
  components: {ChatToolBar, ChatBubbleBar, ChatDialogBar, ChatTopicBar, CustomTextarea},
  data() {
    return {
      Basic,
      TOOLBAR_INPUTBOX_TYPE,
      initConfig: {
        unitModule: undefined,
        own: 123456,
        other: 1234556,
        inputMode: InputMode.keyboard,
        topicBox: {},
        informationBox: {
          show: false,
        }
      },
      inputText: '',
      textInputBox: document.getElementById(`textInput`),
      dialogMsg: [],
    }
  },
  methods: {
    /* 大图展示 */
    showLargePic(src) {
      let mediaMask = document.getElementById(`media-mask`);
      /* 设置消息资源点击放大事件 */
      let appBar = document.getElementById(`appBar`);
      appBar.style.pointerEvents = 'none';
      /* 1、清除内部元素 */
      while (mediaMask.firstChild) {
        mediaMask.removeChild(mediaMask.firstChild);
      }
      /* 2、创建图片元素 */
      let image = document.createElement(`img`);
      image.src = src;
      image.classList.add("picture");
      mediaMask.appendChild(image);
      mediaMask.style.display = 'flex';
      this.picture();
    },
    picture() {
      let mediaMask = document.getElementById(`media-mask`);
      const element = document.querySelector('.picture');
      // 轻击事件
      const hammer = new Hammer(element)
      // 定义触发器
      const tap = new Hammer.Tap({
        taps: 1,  // 点击次数
      })
      // 添加到 manager 中
      hammer.add(tap)

      /* 移动事件处理 */
      hammer.on('pan', (event) => {
        event.target.classList.toggle('expand');
      });
      /* 放大|缩放事件处理 */
      hammer.get('pinch').set({enable: true})
      hammer.on('pinch', (event) => {
        // 根据比例变化元素大小或位置等
        element.style.transform = 'scale(' + event.scale + ')';
      })
      /* 关闭大图 */
      hammer.on('tap', (event) => {
        mediaMask.style.display = 'none';
        /* 解除消息资源点击放大事件 */
        setTimeout(() => {
          let appBar = document.getElementById(`appBar`);
          appBar.style.pointerEvents = 'auto';
        }, 100)
      });
    },
    /* 撤回消息按钮处理事件-重新编辑 */
    reEdit(oldMessage) {
      this.initConfig.inputMode = InputMode.keyboard;
      let richTextInput = {
        type: InputType.RICH_TEXT,
        content: oldMessage,
        extend: {}
      }
      chatService.inputText(richTextInput, true);
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
      /*let dialogMsgBar = document.getElementById(`dialogMsgBar`);
      let inputBox = document.getElementById(`textInput`);
      inputText = inputText instanceof String && inputText ? inputText : inputBox.innerHTML;*/
      if (inputText?.length === 0) return; // 不允许发送空消息
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
    async init() {
      /* 1、检验当前环境 */
      let env = getRuntimeEnv();
      if (env.isAndroid || env.isIOS) {
        const root = document.documentElement;
        root.style.setProperty('--message-card-width-scale', 0.75);
      }

      const urlParams = new URLSearchParams(window.location.search)
      /* 2、初始化渠道信息 */
      let channel = urlParams?.get('channel');
      if (!channel) {
        channel = "88888888"
      }
      /* 2、初始化页面配置 */
      /* 3、初始化个人信息 */
      const phone = urlParams?.get('phone');
      const userid = urlParams?.get('userid');
      const hisUserid = await this.$globalStorage.gainPersonal('userid', null)
      await this.$globalStorage.setPersonal('userid', userid || phone || hisUserid || await gainFingerprint())
      /* 4、初始化会话信息 */
      let hasNewMeet = true;
      if (hasNewMeet) {
        await this.$globalStorage.setPersonal('meetingId', uuid(20))
        await this.$globalStorage.setPersonal('initDatetime', formatDate(Date.now(), 'YY-MM-DD hh:mm:ss'))
      }
    },
    /**
     * 初始化基础配置
     */
    async initBasicConfiguration() {
      let that = this;
      /* 1、请求接口获取基础配置 */
      let bubbles = null;
      let isRobotPriority = false;
      let unitTools = null;
      await this.init();
      await gainBasicConfiguration()
          .then(result => {
            // bubbles = result?.bubbles;
            unitTools = result?.unitTools;
          })

      /* 2、动态初始化浏览器页签logo和标题 todo 移至到对应组件 */
      /* 3、初始化气泡栏|胶囊栏 todo 移至到对应组件 */
      /*setInterval(() => {
        let content = []
        for (let i = 0; i < 8; i++) {
          content.push("测试问题" + Math.ceil(Math.random() * 1000))
        }
        that.Basic.bubble = {
          show: false,
          content
        };
      }, 5000)*/

      /* 4、初始化工具单元栏 */
      if (unitTools && unitTools.length > 0) {
        let extendUnit = document.getElementById(`extendUnit`);
        for (let i = 0; i < Math.min(unitTools.length, 8); i++) {
          let unitTool = unitTools[i];
          let unitToolDiv = document.createElement(`div`);
          let unitToolButton = document.createElement(`button`);
          let unitToolP = document.createElement(`p`);
          unitToolDiv.id = unitTool.id;
          if (unitTool.h5_icon) {
            unitToolButton.innerHTML = unitTool.h5_icon;
          } else {
            let img = document.createElement(`img`);
            img.src = unitTool.h5_icon_url
            unitToolButton.appendChild(img);
          }
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
            bulid(chatMsg, false);
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
                      .parse("." + fileInfo.fileSuffix)
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
        case 'scan': {

        }
        default: {
          console.log("调用未知的处理单元");
        }
      }
    },
    playWavPage(msgId, url) {
      chatService.playWav(msgId, url);
    }

  },
  watch: {},
  mounted: function () {
    /* 初始化基础配置 */
    this.Basic = Basic;
    this.initBasicConfiguration();
  }
}
</script>

<style>
@import url(../../assets/chat/online-app.css);
@import url(../../assets/chat/wav-card.css);
@import url(../../assets/chat/richText-card.css);
@import url(../../assets/chat/topic-bar.css);
@import url(../../assets/chat/bubble-bar.css);
@import url(../../assets/chat/tool-bar.css);
@import url(../../assets/chat/file-card.css);
@import url(../../assets/chat/menu-card.css);
@import url(../../assets/chat/emoji.css);
@import url(../../assets/chat/hold-talk.css);
@import url(../../assets/chat/media-mask.css);
/*@import url(../assets/chat/text-card.css);*/
</style>
