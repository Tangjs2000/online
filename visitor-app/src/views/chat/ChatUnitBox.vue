<template>
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
</template>

<script>
export default {
  name: "ChatUnitBox",
  props: {
    config: {
      type: Object,
      default: () => {
        return {
          emoji: {
            show: false,
            content: []
          },
          extend: {
            show: false,
            content: []
          }
        }
      }
    }
  },
  data() {
    return {
      emoji: {
        show: false
      },
      extend: {
        show: false
      }
    }
  },
  watch: {
    "config.emoji": {
      deep: true,
      handler: function (newVal, oldVal) {
      }
    }
  },
  mounted() {
    this.emoji.show = this.config.unitModule === "emoji";
  }
}
</script>

<style scoped>

</style>