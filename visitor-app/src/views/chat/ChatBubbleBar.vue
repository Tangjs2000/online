<template>
  <div v-if="bubble?.show && bubble?.content?.length > 0" id="bubbleBar" class="bubbleBar">
    <ol id="bubble" class="bubble"></ol>
  </div>
</template>

<script>
import {ChatScene, chatService} from "../../stores/chat/ChatV2";

export default {
  name: "ChatBubbleBar",
  props: {
    bubble: {
      type: Object,
      default: () => {
        return {
          show: false,
          content: []
        }
      }
    }
  },
  methods: {
    /**
     * 初始化气泡栏|胶囊栏
     *
     * @param bubble 气泡栏|胶囊栏
     */
    init(bubble) {
      let bubbleEl = document.getElementById(`bubble`);
      if (bubbleEl) {
        bubbleEl.replaceChildren();
        if (bubble?.content) {
          for (let content of bubble?.content) {
            let bubbleLi = document.createElement(`li`);
            bubbleLi.innerText = content;
            bubbleLi.addEventListener(`click`, function () {
              chatService.sendRichText(content, ChatScene.robot);
            })
            bubbleEl.appendChild(bubbleLi);
          }
        }
      }
    }
  },
  watch: {
    'bubble': {
      deep: true,
      handler: function (bubble) {
        this.init(bubble)
      }
    }
  },
  mounted() {
    this.init(this.bubble)
  }
}
</script>

<style scoped>
@import "../../assets/chat/bubble-bar.css";
</style>