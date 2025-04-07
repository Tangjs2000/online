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
      <custom-textarea id="textInput" ref="textarea" class="textInput"
                       @mention="mention"
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

  <t-popup v-model="config.mention.show" placement="bottom" style="height: 70%">
    <t-indexes :index-list="config.mention.indexes">
      <template v-for="item in config.mention.content" :key="item.index">
        <t-indexes-anchor :index="item.index"/>
        <t-cell-group>
          <t-cell v-for="(val, i) in item.children" :key="i" :title="val.label"
                  @click="mentionConfirm(val)"/>
        </t-cell-group>
      </template>
    </t-indexes>
  </t-popup>
</template>

<script>
import {emojiService, InputMode, UnitModule} from "../../stores/chat/ChatV2";
import {mic_open} from "../../stores/chat/HoldToTalk";
import {scrollButton} from "../../stores/chat/chat";
import CustomTextarea from "../../components/customTextarea.vue";
import {TOOLBAR_INPUTBOX_TYPE} from "../../stores/chat/onlineAppConstant";
import {pinyin} from 'pinyin-pro';

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
        emojiTab: `default`,
        mention: {
          show: false,
          indexes: [],
          content: []
        }
      },
      inputText: ''
    }
  },
  methods: {
    /**
     * 提及功能
     * @param data
     */
    mention(data) {
      let mention = [
        {label: '所有人', value: '@all'},
        {label: '机器人', value: '@robot'},
        {label: '助手', value: '@aide'}
      ]

      /* 2、转换成索引列表 */
      const grouped = {};
      mention.forEach(item => {
        let label = item?.label;
        if (label && typeof label === 'string') {
          /* 获取首字母 */
          const letter = pinyin(label.charAt(0), {
            pattern: 'first',
            toneType: 'none'
          }).toUpperCase()
          if (!grouped[letter]) {
            grouped[letter] = [];
          }
          grouped[letter].push(item);
        }
      })

      /* 3、按字母顺序排序 */
      const sortedLetters = Object.keys(grouped).sort();
      this.config.mention.content = sortedLetters.map(letter => ({
        index: letter,
        children: grouped[letter]
      }));
      this.config.mention.indexes = sortedLetters;
      this.config.mention.show = true;
    },
    /**
     * 提及确认
     * @param data 选中的值
     */
    mentionConfirm(data) {
      this.config.mention.show = false;
      let label = data.label;
      let value = data.value;
      let aElement = document.createElement('mention')
      aElement.innerText = '@' + label;
      aElement.href = value;
      this.h5Input(aElement.outerHTML)
    },

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
      this.$refs.textarea.input(h5Content);
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