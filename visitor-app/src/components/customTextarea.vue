<template>
  <div id="custom-textarea" ref="custom-textarea" class="textarea" contenteditable="true"
       :placeholder="placeholder" v-html="modelValue">
  </div>
</template>

<script>
export default {
  name: "customTextarea",
  props: {
    ref: {
      type: String,
      default: "custom-textarea",
    },
    modelValue: {
      type: String,
      default: "",
    },
    placeholder: {
      type: String,
      default: "请输入......"
    }
  },
  emits: ['update:modelValue'],
  data() {
    return {
      cursorFocus: 0,
    }
  },
  watch: {
    "modelValue": {
      deep: true,
      handler: function (val, oldVal) {
        let textarea = this.$refs['custom-textarea']
        console.log(textarea)
        // textarea.innerHTML = val;
      }
    }
  },
  methods: {
    input(h5Content, isClearInput) {
      let element = document.createTextNode(h5Content);
      let textarea = this.$refs["custom-textarea"];
      textarea.focus();
      const selection = window.getSelection();
      const range = selection.getRangeAt(0);
      /* 插入待输入内容 */
      range.insertNode(element);
      // range.setStartAfter(h5Content);
      range.collapse(false);  // 光标显示在插入内容位置 true之前、false之后
      selection.removeAllRanges();  // 移除所有选中区
      selection.addRange(range);  // 添加选中区
      this.$emit('update:modelValue', textarea.innerHTML);  // 更新modelValue
      console.log(textarea.innerHTML)
    }
  },
  mounted() {
    let that = this;
    let customTextarea = this.$refs["custom-textarea"];
    document.addEventListener('selectionchange', function (event) {
      let selection = window.getSelection();
      let cursorFocus = 0;
      let range = selection.getRangeAt(0);
      let preCursorRange = range.cloneRange();
      preCursorRange.selectNodeContents(customTextarea);
      preCursorRange.setEnd(range.startContainer, range.startOffset);
      cursorFocus = preCursorRange.toString().length;
      that.cursorFocus = cursorFocus;
    })
    customTextarea.addEventListener('input', function (event) {
      /* 检测只剩下无效标签设置清空内容 */
      let ignore = ["<br>"];
      if (ignore.includes(this.innerHTML)) {
        this.innerHTML = '';
      }
      that.$emit('update:modelValue', this.innerText);
    });
  }
}
</script>

<style scoped>
.textarea {
  width: 100%;
  /*height: 100%;*/
  overflow: auto;
  word-wrap: break-word;
}

.textarea[contenteditable] {
  border: 1px solid #ccc;
  padding: 1px 1px 0 1px;
}

.textarea::after {
  content: attr(placeholder);
  color: grey;
  pointer-events: none; /* 使文本不受鼠标事件影响 */
  display: none; /* 使文本占据空间 */
}

.textarea:empty::after {
  display: block; /* 当div为空时显示占位符 */
}
</style>