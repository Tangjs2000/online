import axios from "axios";

const KEEP_ALIVE_WEBSOCKET_URL = "";
let keep_alive_websocket: WebSocket = undefined;

import {openBrowser} from '../stores/AndroidApi.js'

/**
 * 应用后台
 *
 * @author jiashuai.tang
 * @since 2024/08/09
 */
class ApplicationBackend {

    private keepAlive: KeepAlive = keepAlive;
    private execStrategy: ExecStrategy = execStrategy;

    /**
     * 系统通知处理
     *
     * @param notice
     */
    public noticeProcess(notice: Notice) {
        /* 1、获取全局遮流罩 */
        let globalMask = document.getElementById(`globalMask`);
        globalMask.style.display = 'block';
        /* 2、全局弹窗 */
        /*let popupDiv = document.createElement(`div`);
        globalMask.appendChild(popupDiv);*/
        /*let popupV1 = document.getElementById(`popupV1`);
        console.log(popupV1.getElementsByClassName(`popup-body-content`)[0]);*/
        /* 3、通知标题及内容 */
        let popupHeader = document.getElementById(`popup-header`)
        popupHeader.innerText = notice.title;
        let popupBodyContent = document.getElementById(`popup-body-content`);
        popupBodyContent.innerHTML = notice.content ? notice.content : "";
        /* 4、通知操作按钮 */
        if (notice.operate?.length > 0) {
            let popupOperate = document.getElementById(`popup-operate`);
            for (let item of notice.operate) {
                let operateEvent = document.createElement(`span`);
                operateEvent.innerText = item.text;
                operateEvent.classList.add(`popup-operate`, `item`);
                operateEvent.style.backgroundColor = '#d54941';
                operateEvent.style.color = '#FFFFFF';
                operateEvent.addEventListener("click", () => {
                    execStrategy.process(item);
                })
                popupOperate.appendChild(operateEvent)
            }
        }
        /* 5、关闭按钮 */
        if (notice?.canClosed === true) {
            let popupV1Close = document.getElementById(`popupV1Close`);
            popupV1Close.style.display = 'block';
            popupV1Close.addEventListener("click", () => {
                globalMask.style.display = 'none';
            });
        }
    }


}

/**
 * 长连接
 *
 * @author jiashuai.tang
 * @since 2024/08/09
 */
export class KeepAlive {

    /**
     * 打开连接
     */
    public openConn() {
        /*keep_alive_websocket = new WebSocket(KEEP_ALIVE_WEBSOCKET_URL);
        keep_alive_websocket.onopen(() => {

        })*/
        /* 1、创建通知消息对象 */
        let notice = new Notice();
        let noticeOperate = [];
        notice.noticeId = Date.now().toString();
        notice.title = "发现新版本";
        notice.operate = noticeOperate;
        notice.content = "版本号：v3.3.7+37<br/>" +
            "更新后出现两个app，使用新版，卸载旧版本即可<br/>" +
            "1.修复一些情况下会播放失败<br/>" +
            "2.提高播放速度";
        notice.canClosed = true;
        let var1 = new NoticeOperate();
        var1.text = '立即下载';
        var1.accessUrl = 'https://47.120.74.142/';
        var1.operateMode = ExecMode.download;
        let var2 = new NoticeOperate();
        var2.text = '浏览器下载';
        var2.accessUrl = 'https://www.baidu.com/';
        var2.operateMode = ExecMode.browser;
        noticeOperate.push(var1);
        noticeOperate.push(var2);

        // application.noticeProcess(notice);
    }


}

/**
 * 系统通知内容
 *
 * @author jiashuai.tang
 * @since 2024/08/09
 */
class Notice {

    /**
     * 通知编号
     */
    noticeId: string;

    /**
     * 通知标题
     */
    title: string;

    /**
     * 通知内容
     */
    content: string;

    /**
     * 通知事件
     */
    event: string;

    /**
     * 事件操作
     */
    operate: NoticeOperate[];

    /**
     * 是否可关闭
     */
    canClosed: boolean;
}

/**
 * 通知事件操作
 *
 * @author jiashuai.tang
 * @since 2024/08/10
 */
class NoticeOperate {

    /**
     * 链接地址
     */
    public accessUrl: string;

    /**
     * 执行方式
     */
    public operateMode: ExecMode;

    /**
     * 显示文本
     */
    public text: string;
}

/**
 * 操作|执行方式
 *
 * @author jiashuai.tang
 * @since 2024/08/10
 */
enum ExecMode {
    download = "download",    // 下载
    browser = "browser",      // 浏览器打开
}

/**
 * 操作|执行策略
 */
class ExecStrategy {

    /**
     * 策略执行方案
     *
     * @param operate
     */
    public process(operate: NoticeOperate) {
        switch (operate.operateMode) {
            case ExecMode.download: {
                console.log(`执行下载：`, operate);
                break;
            }
            case ExecMode.browser: {
                openBrowser(operate.accessUrl);
                break;
            }
            default: {
                console.error("未知的执行方案")
            }
        }
    }
}

export const execStrategy = new ExecStrategy();
export const keepAlive = new KeepAlive();
export const application = new ApplicationBackend();