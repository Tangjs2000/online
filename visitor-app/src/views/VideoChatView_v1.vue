<template>
  <div>
    <video id="mainVideo" class="mainCanvas" autoplay></video>
    <video id="subVideo" class="subCanvas" autoplay muted></video>

    <div class="videoUnit">
      <div class="video-unit-bottom">
        <!-- 麦克风 -->
        <div>
          <button class="videoUnitItem microphone open" @click="innerEvent('microphone', !this.active.microphone)"></button>
          <span class="remark">
            {{ this.active.microphone ? '麦克风已开': '麦克风已关' }}
          </span>
        </div>
        <!-- 扬声器 -->
        <div>
          <button class="videoUnitItem speaker open" @click="innerEvent('speaker', !this.active.speaker)"></button>
          <span class="remark">
            {{ this.active.speaker ? '扬声器已开': '扬声器已关' }}
          </span>
        </div>
        <!-- 摄像头 -->
        <div>
          <button class="videoUnitItem camera open" @click="innerEvent('camera', !this.active.camera)"></button>
          <span class="remark">
            {{ this.active.camera ? '摄像头已开': '摄像头已关' }}
          </span>
        </div>
        <!-- 虚化 -->
        <div>
          <button class="videoUnitItem">虚化</button>
        </div>
        <!-- 挂断 -->
        <div>
          <button class="videoUnitItem hangUp"></button>
        </div>
        <!-- 旋转摄像头 -->
        <div>
          <button class="videoUnitItem reverseCamera"></button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
const CONSTANT = {
  SUB: "sub",
  MAIN: "main",
  SELF: "self",
  REMOTE: "remote",
  /* 系统内置事件 */
  EVENT: {
    OPEN: 'open',
    CLOSE: 'close',
    CAMERA: 'camera',
    MICROPHONE: 'microphone',
    SPEAKER: 'speaker',
  }
}
export default {
  name: "video-chat-view",
  data() {
    return {
      stream: {
        mainShowType: CONSTANT.REMOTE,
        remote: null,
        self: null,
      },
      active:{
        microphone: true,
        speaker: true,
        camera: true
      }
    }
  },
  methods: {
    init() {
      /* 打开媒体流 */
      let that = this;
      /* 打开本人视频消息 */
      navigator.mediaDevices.getUserMedia({video: true, audio: true})
          .then((stream) => {
            let selfCanvas = document.getElementById(`mainVideo`);
            selfCanvas.srcObject = stream;
            that.stream.self = stream
            that.stream.mainShowType = CONSTANT.SELF
          })
          .catch((e) => {
            console.error(e)
          })

      /* 设置副画布切换事件 */
      let subCanvasList = document.getElementsByClassName(`subCanvas`);
      if (subCanvasList != null) {
        let that = this;
        subCanvasList[0].addEventListener(`click`, function () {
          that.switchCanvas();
        })
      }

      /*let webrtcConn = new RTCPeerConnection();
      webrtcConn.addTrack()*/
    },
    /* 通话连接成功 */
    connSuccess() {
      /* 设置展示框对应视频流数据 */
      this.stream.remote = this.stream.self;
      let subCanvas = document.getElementById(`subVideo`);
      subCanvas.srcObject = this.stream.self;
      let mainCanvas = document.getElementById(`mainVideo`);
      mainCanvas.srcObject = this.stream.remote;
      this.stream.mainShowType = CONSTANT.REMOTE

      /* 关闭提示音 */

    },

    /* 小框的拖拽 */
    drag() {
      // script.js
      document.addEventListener('DOMContentLoaded', function () {
        var dragItem = document.getElementById('localVideo');

        // 拖动开始
        dragItem.addEventListener('dragstart', function (e) {
          e.dataTransfer.setData('text/plain', null); // 设置传输的数据（这里不需要实际传输数据，所以用null）
          try {
            // 阻止默认处理（默认处理不允许放置）
            e.dataTransfer.dropEffect = 'move';
          } catch (err) {
          }
        });

        // 拖动中（这里不添加逻辑，但你可以监听并做相应处理）

        // 放置目标（这里没有定义放置区域，所以直接监听整个文档）
        document.addEventListener('dragover', function (e) {
          e.preventDefault(); // 阻止默认处理（默认不允许放置）
        });

        document.addEventListener('drop', function (e) {
          e.preventDefault(); // 阻止默认处理（默认处理会打开链接）
          // 放置逻辑（这里只是打印一个消息）
          console.log('元素被放置了！');
        });
      });
    },
    openCanvas() {

    },
    /* 切换画布(切换主副画布流数据) */
    switchCanvas() {
      let mainCanvas = document.getElementById(`mainVideo`);
      let subCanvas = document.getElementById(`subVideo`);
      if (this.stream.mainShowType === CONSTANT.REMOTE) {
        mainCanvas.srcObject = this.stream.self;
        subCanvas.srcObject = this.stream.remote;
      } else {
        mainCanvas.srcObject = this.stream.remote;
        subCanvas.srcObject = this.stream.self;
      }
    },
    /**
     * 内置事件
     *
     * @param operate 操作(麦克风、摄像头、扬声器)
     * @param active  动作(开、关)true|false
     */
    innerEvent(operate, active) {
      if (operate === undefined || active === undefined) {
        console.error("内置事件,不清楚的操作或动作!!! operate:" + operate + ",active:" + active);
        return
      }

      switch (operate) {
        case CONSTANT.EVENT.MICROPHONE: {
          let trackOperate;
          if (!this.stream.self) {
            console.error("内置麦克风事件,对应流不存在,无法进行")
            return;
          } else {
            // 检查获取音频轨道
            this.stream.self.getTracks().forEach(track => {
              if (track.kind === 'audio') {
                trackOperate = track;
              }
            })
          }

          /* 执行音频轨道操作动作 */
          if (trackOperate !== null) {
            if (active) {
              trackOperate.open();
            } else {
              trackOperate.stop();
            }
            let microphone = document.querySelector(`.microphone`);
            microphone.classList.remove(this.active.microphone ? `open` : `close`)
            this.active.microphone = active;
            microphone.classList.add(this.active.microphone ? `open` : `close`)
          }
          break;
        }
        case CONSTANT.EVENT.CAMERA: {
          let mainVideo = document.getElementById(`mainVideo`);
          let subVideo = document.getElementById(`subVideo`);
          if (active) {
            mainVideo.play();
            subVideo.play();
          } else {
            mainVideo.pause();
            subVideo.pause();
          }
          let camera = document.querySelector(`.camera`);
          camera.classList.remove(this.active.camera ? `open` : `close`)
          this.active.camera = active;
          camera.classList.add(this.active.camera ? `open` : `close`)


          //  todo 下面方法用于停止,不适用当前场景
          /*let trackOperate;
          if (!this.stream.self) {
            console.error("内置摄像头事件,对应流不存在,无法进行")
            return;
          } else {
            this.stream.self.getTracks().forEach(track => {
              if (track.kind === 'video') {
                trackOperate = track;
              }
            })
          }

          /!* 检查获取视频轨道 *!/
          if (trackOperate !== null) {
            if (active) {
              trackOperate.open();
            } else {
              trackOperate.stop();
            }
            let camera = document.querySelector(`.camera`);
            camera.classList.remove(this.active.camera ? `open` : `close`)
            this.active.camera = active;
            camera.classList.add(this.active.camera ? `open` : `close`)
          }*/
          break;
        }
        case CONSTANT.EVENT.SPEAKER: {
          let speaker = document.querySelector(`.speaker`);
          speaker.classList.remove(this.active.speaker ? `open` : `close`)
          this.active.speaker = active;
          speaker.classList.add(this.active.speaker ? `open` : `close`)
          break;
        }
        default: {
          console.error("内置事件,不合法的操作!!! operate:" + operate)
        }
      }
    }
  },
  mounted() {
    this.init();
    this.drag();

    let that = this
    setTimeout(function () {
      that.connSuccess();
    }, 5000)
  }
}
</script>

<style scoped>
.mainCanvas {
  position: fixed;
  right: 0;
  top: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.subCanvas {
  position: fixed;
  right: 2%;
  top: 5%;
  width: 30%;
  height: 30%;
  object-fit: cover;
  z-index: 999;
  transform: scaleX(-1);
  touch-action: none;
  cursor: move; /* 更改鼠标光标表示可拖拽 */
}


.videoUnit {
  position: fixed;
  width: 100%;
  height: 100%;
}
.videoUnit div{
  justify-content: center;
  place-items: center;
  text-align: center;
}


.video-unit-bottom {
  position: fixed;
  display: grid;
  gap: 30px;
  grid-template-columns: 1fr 1fr 1fr;
  justify-content: center;
  place-items: center;
  bottom: 0;
  padding: 0 40px 10% 40px;
  width: 100%;
  z-index: 1000;
}

.videoUnitItem {
  background-color: rgba(0, 0, 0, 0);
  width: 60px;
  height: 60px;
  border-radius: 60px;
  border-width: 0;
  font-size: 14px;
  z-index: 999;
  text-align: center;
}

/* 挂机 */
.hangUp {
  background-image: url("/public/svg/hangUp.svg");
}

/* 翻转相机 */
.reverseCamera {
  background-image: url("/public/svg/reverseCamera.svg");
  width: 40px;
  height: 40px;
}



/* 麦克风打开\关闭样式 */
.microphone{
}
.microphone.open {
  background-color: #FFFFFF;
  background-image: url("/public/svg/microphone_open.svg");
  background-size: 50% 50%;
  background-repeat: no-repeat;
  background-position: center;

}
.microphone.close {
  background-color: #181818;
  background-image: url("/public/svg/microphone_close.svg");
  background-size: 50% 50%;
  background-repeat: no-repeat;
  background-position: center;
}

/* 扬声器打开\关闭样式 */
.speaker{

}
.speaker.open{
  background-color: #FFFFFF;
  background-image: url("/public/svg/speaker_open.svg");
  background-size: 50% 50%;
  background-repeat: no-repeat;
  background-position: center;

}
.speaker.close{
  background-color: #181818;
  background-image: url("/public/svg/speaker_close.svg");
  background-size: 50% 50%;
  background-repeat: no-repeat;
  background-position: center;
}

/* 摄像头打开\关闭样式 */
.camera{

}
.camera.open{
  background-color: #FFFFFF;
  background-image: url("/public/svg/camera_open.svg");
  background-size: 50% 50%;
  background-repeat: no-repeat;
  background-position: center;
}
.camera.close{
  background-color: #181818;
  background-image: url("/public/svg/camera_close.svg");
  background-size: 50% 50%;
  background-repeat: no-repeat;
  background-position: center;
}
.remark{
  display: inline-block;
  color: #FFFFFF;
  position: relative;
  white-space: nowrap;
}




</style>