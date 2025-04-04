<template>
  <div id="toolbar" class="toolbar">
    <!-- 输入方式切换按钮 -->
    <i id="inputSwitch" @click.stop>
      <i v-if="config.inputMode === `keyboard`" style="position: relative">
        <i style="width: 100%;height: 100%;position: absolute" @click="showUnitTool(`speak`)"/>
        <object class="inputSwitch" style="padding: 0.3rem"
                type="image/svg+xml" data="/public/svg/unit_speak.svg"/>
      </i>
      <i v-else-if="config.inputMode === `speak`" style="position: relative">
        <i style="width: 100%;height: 100%;position: absolute" @click="showUnitTool(`keyboard`)"/>
        <object class="inputSwitch" style="padding: 0"
                type="image/svg+xml" data="/public/svg/unit_keyboard.svg"/>
      </i>
    </i>
    <!-- 输入框 -->
    <div class="input">
      <!-- 文本输入 -->
      <custom-textarea id="textInput" ref="textInput" class="textInput"
                       v-model="inputText" placeholder="请输入您的问题,我来为您解答~"
                       v-show="config.inputMode === `keyboard`">
      </custom-textarea>
      <!-- 语音输入 -->
      <button id="speakButton" class="voiceInput"
              v-show="config.inputMode === `speak`">
      </button>
    </div>
    <!-- 表情包 -->
    <i class="inputSwitch" @click="showUnitTool(`emoji`)">
      <img src="/public/svg/unit_emoji.svg"/>
    </i>
    <button v-if="inputText && inputText.length > 0" id="sendButton" class="sendButton"
            @click="()=>{this.$emit('send', inputText);this.clearInput()}">发送
    </button>
    <!-- 组件工具(视频、文件) -->
    <i v-else id="unitTool" class="inputSwitch" @click="showUnitTool(`extend`)">
      <img src="/public/svg/unit_extend.svg">
    </i>
  </div>
  <div v-show="config.unitModule" id="unitBar" class="unitBar">
    <div v-show="config.unitModule === `extend`" id="extendUnit" class="extendUnit"></div>
    <div v-show="config.unitModule === `emoji`" id="emojiUnit" class="emojiUnit">
      <div id="emojiTab" class="emojiTab"></div>
      <div class="emojiContent">
        <div id="emojiBody" class="emojiBody"></div>
        <div id="emojiBody-backspace" class="emojiBody-backspace" @click="clearInput"></div>
      </div>
    </div>
  </div>
</template>

<script>
import {emojiService, InputMode, UnitModule} from "../../stores/chat/ChatV2";
import {mic_open} from "../../stores/chat/HoldToTalk";
import {scrollButton} from "../../stores/chat/chat";
import CustomTextarea from "../../components/customTextarea.vue";
import {TOOLBAR_INPUTBOX_TYPE} from "../../stores/chat/onlineAppConstant";

export default {
  name: "ChatToolBar",
  components: {CustomTextarea},
  props: {
    modelValue: {
      type: Object,
      default: () => {
        return {
          inputMode: `keyboard`,
          inputBoxType: `text`,
          inputText: ``,
          emojiTab: `default`
        }
      }
    }
  },
  emits: ['send'],
  data() {
    return {
      TOOLBAR_INPUTBOX_TYPE,
      config: {
        inputMode: `keyboard`,
        inputBoxType: `text`,
        inputText: ``,
        emojiTab: `default`
      },
      inputText: ''
    }
  },
  methods: {
    /**
     * 控制组件切换
     *
     * @param unitModule
     */
    showUnitTool(unitModule) {
      if (this.config.unitModule === unitModule) {
        this.config.unitModule = undefined;
        return;
      }
      this.config.unitModule = undefined;
      switch (unitModule) {
          /* 输入方式切换(文本输入、音频输入) */
        case InputMode.speak: {
          console.log("InputMode.speak")
          mic_open();
          this.config.inputMode = InputMode.speak;
          break;
        }
        case InputMode.keyboard: {
          console.log("InputMode.keyboard")
          this.config.inputMode = InputMode.keyboard;
          break;
        }
          /* 展示组件|表情包 */
        case UnitModule.extend: {
          let unitBar = document.getElementById(`unitBar`);
          unitBar.style.height = '170px';
          unitBar.style.maxHeight = '170px';
          this.config.unitModule = UnitModule.extend
          break;
        }
        case UnitModule.emoji: {
          let unitBar = document.getElementById(`unitBar`);
          unitBar.style.height = '190px';
          unitBar.style.maxHeight = '190px';
          emojiService.initEmoji();
          this.config.unitModule = UnitModule.emoji
          break;
        }
        default: {

        }
      }
      scrollButton();
      /* 隐藏软键盘 */
      document.getElementById('textInput').blur();
    },
    /**
     * 输入内容
     */
    h5Input(h5Content) {
      this.$refs.textInput.input(h5Content);
      // this.inputText = h5Content
    },
    /**
     * 清除输入框内容
     */
    clearInput() {
      let inputBox = document.getElementById(`textInput`);
      inputBox.innerHTML = null
      this.inputText = null;
    },
  },
  mounted() {
    window.globalInput = this.h5Input;
  }
}
</script>

<style scoped>
@import url(../../assets/chat/tool-bar.css);
@import url(../../assets/chat/emoji.css);
</style>