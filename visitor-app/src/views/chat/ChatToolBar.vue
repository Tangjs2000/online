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
      <div id="textarea" class="textInput"
           v-show="config.inputMode === `keyboard`">
      </div>
      <!-- 语音输入 -->
      <button id="speakButton" class="voiceInput"
              v-show="config.inputMode === `speak`">
      </button>
    </div>
    <!-- 表情包 -->
    <i class="inputSwitch" @click="showUnitTool(`emoji`)">
      <img src="/public/svg/unit_emoji.svg"/>
    </i>
    <button v-if="textarea.content?.trim().length > 0" id="sendButton" class="sendButton"
            @click="()=>{this.$emit('send', textarea.content);this.inputClear()}">发送
    </button>
    <!-- 组件工具(视频、文件) -->
    <i v-else id="unitTool" class="inputSwitch" @click="showUnitTool(`extend`)">
      <img src="/public/svg/unit_extend.svg">
    </i>
  </div>
  <!--  <chat-unit-box v-model="config.unitModule"></chat-unit-box>-->
  <div v-show="config.unitModule" id="unitBar" class="unitBar">
    <div v-show="config.unitModule === `extend`" id="extendUnit" class="extendUnit"></div>
    <div v-show="config.unitModule === `emoji`" id="emojiUnit" class="emojiUnit">
      <div id="emojiTab" class="emojiTab"></div>
      <div class="emojiContent">
        <div id="emojiBody" class="emojiBody"></div>
        <div id="emojiBody-backspace" class="emojiBody-backspace" @click="this.inputClear()"></div>
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
import {InputMode, UnitModule} from "../../stores/chat/ChatV2";
import {emojiService} from "../../stores/chatV2/EmojiService.ts";
import {mic_open} from "../../stores/chat/HoldToTalk";
import {scrollButton} from "../../stores/chat/chat";
import CustomTextarea from "../../components/customTextarea.vue";
import {TOOLBAR_INPUTBOX_TYPE} from "../../stores/chat/onlineAppConstant";
import {pinyin} from 'pinyin-pro';
import Editor from '@toast-ui/editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import {InputType} from "../../stores/chat/RichTextInput.ts"
import ChatUnitBox from "./ChatUnitBox.vue";

export default {
  name: "ChatToolBar",
  components: {ChatUnitBox, CustomTextarea},
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
      textarea: {
        instance: null,
        content: '',
        mentions: [],
      },
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
      const {label, value} = data;
      this.h5Input({
        type: InputType.MENTION,
        content: '@' + label,
        extend: {
          href: value
        }
      }, false)
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
      // document.getElementById('textInput').blur();
    },
  },
  watch: {
    'textarea.content': {
      deep: true,
      handler(newValue, oldValue) {
        if (newValue) {
          let mentions = this.textarea.mentions
          const parser = new DOMParser();
          const doc = parser.parseFromString(newValue, 'text/html')
          const mentionTags = doc.querySelectorAll('[data-type="mention"]');
          console.log(mentionTags)
        }
      }
    }
  },
  mounted() {
    /* 初始化富文本输入框 */
    let that = this;
    const textarea = new Editor({
      el: document.getElementById('textarea'),
      language: 'zh-CN',
      toolbarItems: [],
      hideModeSwitch: true,   // 隐藏模式切换
      usageStatistics: true, // 禁用使用统计
      useDefaultHTMLSanitizer: true, // 禁用默认净化器
      extendedAutolinks: true,
      minHeight: '36px',
      height: 'auto',
      initialEditType: 'wysiwyg', // markdown 或 wysiwyg
      previewStyle: 'vertical', // vertical编辑样式，还支持tab切换的形式
      placeholder: '请输入您的问题~',
      initialValue: that.textarea.content,
      events: {
        change: () => {
          that.textarea.content = textarea.getMarkdown() ? textarea.getHTML() : '';
        },
        keydown: (type, event) => {
          const {code, shiftKey} = event;
          /* 提及事件处理 */
          if (shiftKey && 'Digit2' === code) this.mention()
        }
      },
      hooks: {},
      customHTMLSanitizer: (html) => {
        console.log("customHTMLSanitizer", html)
        return html.replace(/<span([^>]*)>/g, '<span$1>');
      },
      customHTMLRenderer: {
        htmlBlock: {
          mention(node, next) {
            console.log(node, next)
            const {attrs, childrenHTML} = node
            return [
              {type: 'openTag', tagName: 'span', attributes: attrs},
              {type: 'html', content: childrenHTML},
              {type: 'closeTag', tagName: 'span'}
            ];
          },
          span(node, next) {
            console.log(node, next)
            const {attrs, childrenHTML} = node
            return [
              {type: 'openTag', tagName: 'span', attributes: attrs},
              {type: 'html', content: childrenHTML},
              {type: 'closeTag', tagName: 'span'}
            ]
          }
        },
        htmlInline: {
          /*span(node, {entering}) {
            console.log(node)
            return {
              type: entering ? 'openTag' : 'closeTag',
              tagName: 'span',
              attributes: node.attributes
            };
          }*/
        }
      },
      /* 自定义净化规则 todo 不生效 */
      sanitizer: {
        tags: {
          span: true
        },
        attributes: {
          span: ['style', 'class', 'data-*']
        }
      }
    });
    textarea.moveCursorToEnd();
    that.textarea.instance = textarea;
    /* 外部输入事件监听 */
    /**
     * 输入内容
     */
    window.globalInput = this.h5Input = (input, hasClear) => {
      if (hasClear) this.inputClear();
      textarea.changeMode('wysiwyg');
      const {type, content, extend} = input
      switch (type) {
        case InputType.IMAGE: {
          textarea.exec('addImage', {
            imageUrl: content,  // 图片URL（必需）
            altText: extend?.altText,  // 图片alt文本
            width: extend?.style?.width || '1.8rem',    // 图片宽度（可选）
            height: extend?.style?.height || '1.8rem',   // 图片高度（可选）
          });
          break;
        }
        case InputType.TEXT: {
          textarea.insertText(content)
          break;
        }
        case InputType.RICH_TEXT: {
          textarea.insertText(content)
          break;
        }
        case InputType.MENTION: {
          console.log(textarea.wwEditor);
          textarea.setHTML(this.textarea.content + `<span class="mention">${content}</span>`);
          // textarea.replaceSelection(`${content}`);
          break;
        }
        default: {
          console.log(`未知的type：${type}`)
        }
      }
    }
    /**
     * 清除输入框内容
     */
    window.globalInputClear = this.inputClear = () => {
      this.textarea.content = '';
      textarea.setHTML(this.textarea.content);
    }

  }
}
</script>

<style>
@import url(../../assets/textarea_toast.css);
</style>
<style scoped>
@import url(../../assets/chat/tool-bar.css);
@import url(../../assets/chat/emoji.css);
</style>