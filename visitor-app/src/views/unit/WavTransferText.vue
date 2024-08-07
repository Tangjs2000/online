<template>
  <div class="content-bar">
    <div>
      <div class="wav-input-bar">

      </div>
      <!--      <div class="divider-line"/>-->
      <div class="wav-output-bar">

      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "WavTransferText",
  beforeCreate() {
    document.title = "语音转写-在线工具";
  },
  mounted() {
    // this.tranAmount.tobe = "188.8";
  }
}
</script>

<style scoped>
html {
  --content-border-radius: 30px;
  --content-height: 300px;
  --content-mix-height: 400px;
}


/* 内容框 */
.content-bar {
  width: 900px;
  height: 300px;
  min-height: 400px;
  background-color: #C4E1C5;
  border-radius: var(--content-border-radius);
  /* 卡片阴影效果 */
  box-shadow: 1px 1px 1px 3px rgba(0, 0, 0, 0.15);
  /*background: url("../background.jpg");*/
}

.content-bar > div {
  display: flex;
  place-items: center;
  position: relative;
  top: 50%;
  transform: translateY(-50%);
  justify-content: space-between;
}

.wav-input-bar {
  width: 49.8%;
  height: 300px;
  min-height: 400px;
  /*background-color: #41B883;*/
  border-top-left-radius: var(--content-border-radius);
  border-bottom-left-radius: var(--content-border-radius);
  box-shadow: 1px 0 3px rgba(0, 0, 0, 0.15);
}

.divider-line {
  width: 0.4%;
  height: 300px;
  min-height: 400px;
  background-color: #0b57d0;
}

.wav-output-bar {
  width: 49.8%;
  height: 300px;
  min-height: 400px;
  /*background-color: #41B883;*/
  border-top-right-radius: var(--content-border-radius);
  border-bottom-right-radius: var(--content-border-radius);
  box-shadow: -1px 0 3px rgba(0, 0, 0, 0.15);
}
</style>