<template>
  <div>
    <button @click="console">输出</button>
    <!-- 工具栏 -->
    <div id="toolbar"></div>
    <!-- 富文本编辑框 -->
    <div id="editor"></div>
  </div>
</template>

<script>
import Quill from "quill";

import 'quill/dist/quill.core.css' // 引入样式
import 'quill/dist/quill.snow.css' // snow theme
import 'quill/dist/quill.bubble.css'
import Delta from "quill-delta"; // bubble theme


/* 工具栏想要显示什么,就要在这里加上什么 */
const TOOL_BAR_OPTIONS = [
  ["bold", "italic", "underline", "strike"],       // 粗体、斜体、下划线、删除线
  ["blockquote", "code-block"],                    // 引用、代码
  // [{"header": 1}, {"header": 2}],              // 一级标题、二级标题
  [{"list": "ordered"}, {"list": "bullet"}],   // 有序列表、无序列表
  [{"script": "sub"}, {"script": "super"}],    // 下标、上标
  [{"indent": "-1"}, {"indent": "+1"}],        // 左缩进、右缩进
  [{"direction": "rtl"}],                         // 文字方向
  [{"size": ["small", false, "large", "huge"]}], // 字体大小
  [{"header": [1, 2, 3, 4, 5, 6, false]}],       // 标题大小
  [{"color": []}, {"background": []}],         // 字体颜色、背景颜色
  [{"font": []}],                                // 字体种类
  [{"align": []}],                               // 对齐方式
  ["clean"],                                       // 清除格式
  ["link", "image", "video"],                      // 链接、图片、视频
];

export default {
  name: "QuillRichTextEditor",
  data() {
    return {
      quill: null
    };
  },
  props: {
    value: {
      type: String,
      default: ""
    }
  },
  mounted() {
    let that = this;
    const quill = new Quill("#editor", {
      modules: {
        toolbar: {
          container: TOOL_BAR_OPTIONS
        }
      },
      theme: "snow",
      placeholder: "请输入。。。"
    });
    quill.setText(that.value);
    quill.enable();
    quill.on("text-change", (delta, oldDelta, source) => {
      that.value = quill.root.innerHTML;
    })
  },
  methods: {
    console() {
      console.log("h5:" + this.value);
    }
  },
  watch: {
    /*"value": {
      deep: true,
      handler: function (newVal, oldVal) {
        console.log("value.newVal:", newVal);
        this.value = newVal;
        const delta = this.quill.getContents();
        this.quill.setContents(delta);
        this.quill.enable();
      }
    }*/
  }
}
</script>

<style scoped>

</style>