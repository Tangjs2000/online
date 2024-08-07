<template>
  <el-scrollbar ref="scrollbarRef" height="100%" always @scroll="scroll">
    <div class="unit-body">
      <!-- 工具栏 -->
      <div class="tool-space">
        <el-menu
            style="background: #C4E1C5;font-weight: bold;padding: 0 15px;"
            background-color="#C4E1C5"
            class="el-menu-demo"
            mode="horizontal"
            :ellipsis="false"
            :default-active="this.UNIT_NAME.WAV_TRANSFER_TEXT"
            @select="switchUnit">
          <el-menu-item :index="this.UNIT_NAME.HOME">
            <img style="width: 50px" src="../assets/logo.svg" alt="logo"/>
          </el-menu-item>
          <div/>
          <el-menu-item :index="this.UNIT_NAME.CHINESE_MONEY">人民币大写转换</el-menu-item>
          <el-menu-item :index="this.UNIT_NAME.WAV_TRANSFER_TEXT">语音转写</el-menu-item>
          <el-menu-item :index="this.UNIT_NAME.MAILBOX">建议信箱</el-menu-item>
        </el-menu>
      </div>
      <!-- 内容栏 -->
      <div class="content-space">
        <wav-transfer-text v-if="UNIT_NAME.WAV_TRANSFER_TEXT === this.contentSpace"/>
        <chinese-money-unit v-else/>
      </div>
      <!-- 广告位 -->
      <div class="ad-space">
        <button @click="console">输出</button>
        <quill-rich-text-editor style="width: 1000px;height: 600px;"
                                :value="richText.h5"/>
      </div>
      <!-- 版权位 -->
      <div class="oem-space">
        <p>
          <span>©外星人有限公司&nbsp&nbsp</span>
          <span style="text-decoration: underline;bottom: 2px;cursor: pointer;">tangjiashuai2000@gmail.com</span>
        </p>
      </div>

      <!-- 发送邮件框 -->
      <el-dialog v-model="hasShow.mailbox" title="发送邮件" width="500" align-center>
        <div style="height: 120px;">
          <el-input v-model="this.custom.mailContent" type="textarea" :rows="4" placeholder="请留下您宝贵建议"
                    style="font-size: 17px;width: 100%"></el-input>
        </div>
        <template #footer>
          <div class="dialog-footer">
            <el-button type="success" @click="hasShow.mailbox = true">发 送</el-button>
          </div>
        </template>
      </el-dialog>
    </div>
  </el-scrollbar>
</template>


<script>
import ChineseMoneyUnit from "./unit/ChineseMoneyUnit.vue";
import WavTransferText from "./unit/WavTransferText.vue";
import QuillRichTextEditor from "./unit/QuillRichTextEditor.vue";

import("./unit-view.css")


/**
 * 组件名称
 * @type {{}}
 */
const UNIT_NAME = {
  HOME: "home",
  CHINESE_MONEY: "chinese_money",
  WAV_TRANSFER_TEXT: "wav_transfer_text",
  MAILBOX: "mailbox"
}

export default {
  name: "UnitView",
  components: {WavTransferText, ChineseMoneyUnit, QuillRichTextEditor},
  data() {
    return {
      UNIT_NAME: {
        HOME: "home",
        CHINESE_MONEY: "chinese_money",
        WAV_TRANSFER_TEXT: "wav_transfer_text",
        MAILBOX: "mailbox"
      },
      contentSpace: "wav_transfer_text",
      hasShow: {
        mailbox: false,
      },
      custom: {
        mailContent: "",
      },
      richText: {
        h5: "<h1>WQEQWEQWE</h1>",
        text: ""
      }
    }
  },
  methods: {
    switchUnit(key, keyPath) {
      switch (key) {
        case this.UNIT_NAME.CHINESE_MONEY: {  // 人民币大写转换
          this.contentSpace = this.UNIT_NAME.CHINESE_MONEY;
          break;
        }
        case this.UNIT_NAME.WAV_TRANSFER_TEXT: {  // 语音转写
          this.contentSpace = this.UNIT_NAME.WAV_TRANSFER_TEXT;
          break;
        }
        case this.UNIT_NAME.MAILBOX: {  // 邮件发送框
          this.hasShow.mailbox = true;
          break;
        }
      }
    },
    console() {
      console.log("h5:" + this.richText.h5 + ",\n" + "text:" + this.richText.text);
    }
  },
  watch: {},
  beforeCreate() {
    document.title = "工具";
  },
  mounted() {
    console.log(window.location.href)
    this.UNIT_NAME = UNIT_NAME;
  }
}
</script>

<style scoped>

</style>