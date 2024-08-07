import {webSocket} from "./seat";

let websocket;

class WebRTC_V1 {
    init() {

    }
}

class WebSocket_V1 {

    init(configuration) {
        websocket = new WebSocket("/online/chat/av");
        /* 打开连接 */
        websocket.onopen = (event) => {
            console.log("onopen:", event)
        }

        /* 消息接收 */
        websocket.onmessage = (event) => {

        }

        /* 连接异常 */
        websocket.onerror = (event) => {
        }

        /* 关闭连接 */
        websocket.onclose = (event) => {
        }

        /*setInterval(function () {
            if (webSocket && webSocket.readyState === 3) return;
            else WebSocket_V1.init();
        }, 5000)*/
    }


    /*process(type, message) {
        switch (type) {

        }
    }*/

}

export {
    WebRTC_V1,
    WebSocket_V1
}