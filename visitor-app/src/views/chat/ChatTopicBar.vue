<template>
  <div id="topicBar" class="topicBar">
    <img v-if="modelValue.logo" :src="modelValue.logo" class="topicLogo"/>
    <span v-if="modelValue.title" class="topicTitle">{{ modelValue.title }}</span>
  </div>
</template>

<script>

export default {
  name: "ChatTopicBar",
  props: {
    modelValue: {
      type: Object,
      default: () => {
        return {
          logo: "",
          title: ""
        }
      }
    }
  },
  watch: {
    'modelValue': {
      deep: true,
      handler: function (config, oldValue) {
        /* 2、动态初始化浏览器页签logo和标题 */
        document.title = config.title;
        let logoLink = document.querySelector("link[rel='icon']");
        if (logoLink) logoLink.href = config.logo;
        else {
          logoLink = document.createElement("link");
          logoLink.rel = "icon";
          logoLink.href = config.logo;
          document.head.appendChild(logoLink);
        }
      }
    }
  }
}
</script>

<style scoped>
@import "../../assets/chat/topic-bar.css";
</style>