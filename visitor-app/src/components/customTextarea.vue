<template>
  <div id="custom-textarea" ref="custom-textarea" class="textarea" contenteditable="true"
       :value="modelValue" :placeholder="placeholder">
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
  data() {
    return {
      cursorFocus: 0,
    }
  },
  watch: {
    "modelValue": {
      deep: true,
      handler: function (val, oldVal) {
        this.$emit('update:modelValue', val);
      }
    }
  },
  methods: {
    input(h5Content, isClearInput) {
      /*  */
      /*let element = document.createElement(`i`)
      element.innerHTML = h5Content;*/
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

      /*box.focus();
      // 创建一个新的选区
      var selection = window.getSelection();
      // 如果光标位置原来就存在，就用原来的。
      // 原来不存在，就重新创建一个
      var range = currentRange ?? selection.getRangeAt(0);
      // 插入表情图标
      range.insertNode(img.cloneNode());
      // 插入后，光标显示在表情图片后面
      range.collapse();
      // 移除其他的区域
      selection.removeAllRanges();
      // 把带有表情图片的区域插入到选区内
      selection.addRange(range);*/
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
      /* 输入类型 */
      /*switch (event.inputType) {
        case "insertCompositionText": {
          /!* 键盘输入事件 *!/
          /!*if (!event.data) this.innerHTML = null;
          else {
            if (!event.isComposing)
              this.innerHTML += event.data;
          }*!/
          break;
        }
        case "deleteContentBackward": {
          /!* 键盘回退事件 *!/
          /!*this.innerHTML = this.innerHTML.toString().substr(0,
              this.innerHTML.toString().length ? this.innerHTML.toString().length - 1 : 0);*!/
          break;
        }
        default: {

        }
      }*/
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