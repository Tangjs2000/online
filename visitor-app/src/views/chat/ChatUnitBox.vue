<template>
  <div v-show="showModule" id="unitBar" class="unitBar">
    <div v-show="showModule === `extend`" id="extendUnit" class="extendUnit"></div>
    <div v-show="showModule === `emoji`" id="emojiUnit" class="emojiUnit">
      <div id="emojiTab" class="emojiTab"></div>
      <div class="emojiContent">
        <div id="emojiBody" class="emojiBody"></div>
        <div id="emojiBody-backspace" class="emojiBody-backspace" @click="this.inputClear()"></div>
      </div>
    </div>
  </div>
</template>

<script>
import {emojiService} from "../../stores/chatV2/EmojiService";
import {upload} from "../../stores/tool/CustomTool";
import {h5ContentService, ResourceMode} from "../../stores/chat/H5ContentService";
import {ChatScene, chatService} from "../../stores/chat/ChatV2";
import {transferSeat} from "../../stores/chat/seat";

export default {
  name: "ChatUnitBox",
  props: {
    showModule: {
      type: String,
      default: ''
    },
    config: {
      type: Object,
      default: () => {
        return {
          emoji: [],
          unitTool: []
        }
      }
    }
  },
  data() {
  },
  watch: {
    "showModule": {
      deep: true,
      handler: function (newVal, oldVal) {
        if (newVal === 'emoji') {
          this.showEmoji()
        } else if (newVal === 'extend') {
          this.showUnitTool()
        }
      }
    }
  },
  methods: {
    showEmoji() {
      let unitBar = document.getElementById(`unitBar`);
      unitBar.style.height = '35%';
      unitBar.style.maxHeight = '35%';
      let personalEmoji = this.config.emoji;
      emojiService.initEmoji(personalEmoji);
    },
    showUnitTool() {
      this.initUnitTool(this.config.unitTool)
    },
    initUnitTool(unitTools) {
      let that = this;
      if (unitTools && unitTools.length > 0) {
        let extendUnit = document.getElementById(`extendUnit`);
        for (let i = 0; i < Math.min(unitTools.length, 8); i++) {
          let unitTool = unitTools[i];
          let unitToolDiv = document.createElement(`div`);
          let unitToolButton = document.createElement(`button`);
          let unitToolP = document.createElement(`p`);
          unitToolDiv.id = unitTool.id;
          if (unitTool.h5_icon) {
            unitToolButton.innerHTML = unitTool.h5_icon;
          } else {
            let img = document.createElement(`img`);
            img.src = unitTool.h5_icon_url
            unitToolButton.appendChild(img);
          }
          unitToolP.innerText = unitTool.title;
          unitToolDiv.classList.add(`unit`);
          unitToolDiv.addEventListener(`click`, function () {
            console.log(unitTool.event);
            that.callSystemUnit(unitTool.event);
          })
          unitToolDiv.append(unitToolButton);
          unitToolDiv.append(unitToolP);
          extendUnit.append(unitToolDiv);
        }
      }
    },
    /**
     * 调用系统单元
     *
     * @param event 单元事件
     */
    callSystemUnit: function (event) {
      switch (event) {
        case "album": {
          /* 1、创建虚拟文件输入document元素 */
          let fileInput = document.createElement(`input`);
          fileInput.id = "file-input";
          fileInput.type = "file"
          fileInput.accept = "image/*"
          fileInput.multiple = true
          fileInput.capture = true
          fileInput.click();
          break;
        }
        case "camera": {
          break;
        }
        case "videoChat": {
          this.$router.push({name: 'videoChat'})
          break;
        }
        case "file": {
          /* 1、创建虚拟文件输入document元素 */
          let fileInput = document.createElement(`input`);
          fileInput.type = "file"
          // fileInput.accept = ".jpg,.jpeg,.png"
          fileInput.accept = "*"
          fileInput.click();

          /* 2、监听文件输入document元素文件上传事件 */
          fileInput.addEventListener("change", function (event) {
            let files = event.target.files;
            if (files && files.length > 0) {
              for (const file of files) {
                upload(file).then(fileInfo => {
                  let element = h5ContentService.builder()
                      .resourceMode(ResourceMode.picture)
                      .parse("." + fileInfo.fileSuffix)
                      .resourceUri(fileInfo.accessUrl)
                      .build();
                  let contentH5 = element.outerHTML;
                  console.log(contentH5);
                  chatService.sendRichText(contentH5, ChatScene.robot);
                  /*msgProcess(CHAT_CONSTANT.inputType.file,
                      null, fileInfo.accessUrl, 0, fileInfo);*/
                });
              }
            }
          })
          break;
        }
        case "toManual": {
          transferSeat();
          break;
        }
        case"position": {
          if ("geolocation" in navigator) {
            // geolocation is available
            navigator.geolocation.getCurrentPosition(function (position) {
              console.log("Latitude is :", position.coords.latitude);
              console.log("Longitude is :", position.coords.longitude);
            }, function (error) {
              console.error("Error Code = " + error.code + " - " + error.message);
            });
          } else {
            // geolocation is not supported
            console.log("Geolocation is not supported by this browser.");
          }
          break;
        }
        case 'scan': {

        }
        default: {
          console.log("调用未知的处理单元");
        }
      }
    },
  },
  mounted() {
  }
}
</script>

<style scoped>

</style>