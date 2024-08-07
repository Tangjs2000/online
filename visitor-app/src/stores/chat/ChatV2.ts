import {initChat, chat} from './robot'
import {bulid, ChatMessageImpl, chatMessageService, ChatMsgV2} from "./ChatMessage";

export interface Chat {

    /**
     * 发送富文本消息
     *
     * @param richText 富文本内容
     * @param scene    场景
     */
    sendRichText(richText: String, scene: ChatScene): void;

    /**
     * 发送语音消息
     *
     * @param videoUri 语音文件资源
     * @param scene    场景
     */
    sendVoice(videoUri: String, scene: ChatScene): void;

    /**
     * 更新消息发送状态
     *
     * @param msgId 消息编号
     */
    renewSendStatus(msgId: String): void;

}

export class ChatImpl implements Chat {

    // private chatMessageImpl: ChatMessageImpl = new ChatMessageImpl();

    /**
     * 发送富文本消息
     *
     * @param richText 富文本内容
     * @param scene    场景
     */
    public sendRichText(richText: String, scene: ChatScene): void {
        let that = this;
        /* 1、构建对话卡片 */
        let chatMsg = new ChatMsgV2();
        chatMsg.msgId = new Date().getTime().toString();
        chatMsg.content = richText;
        chatMsg.role = ChatRole.visitor;
        chatMsg.chatMode = ChatMode.richText;
        chatMsg.sendStatus = ChatSendStatus.sending;
        bulid(chatMsg, false);

        /* 2、发送消息 */
        switch (scene) {
            case ChatScene.robot: {
                chat(1, richText, null)
                    .then((res) => {
                        const {code, data, message} = res;
                        if (code && code === "SUCCESS") {
                            let chatMsg = chatMessageService.wrapperRobotReply(data);
                            bulid(chatMsg, false);
                        }
                        console.log("发送成功");
                    })
                    .catch((e) => {
                        console.error("发送失败", e);
                    });
                break;
            }
            case ChatScene.manual: {
                break;
            }
            default: {

            }
        }
    }

    /**
     * 发送语音消息
     *
     * @param videoUri 语音文件资源
     * @param scene    场景
     */
    public sendVoice(videoUri: String, scene: ChatScene): void {
        /* 1、构建对话卡片 */
        let chatMsgV2 = new ChatMsgV2();
        chatMsgV2.msgId = Date.now().toString();
        chatMsgV2.wavUrl = videoUri;
        chatMsgV2.role = ChatRole.visitor;
        chatMsgV2.hasSelf = true;
        chatMsgV2.chatMode = ChatMode.wav
        chatMsgV2.sendStatus = ChatSendStatus.sending;
        bulid(chatMsgV2, false);

        switch (scene) {
            case ChatScene.robot: {
                chat(1, null, videoUri)
                    .then((res) => {
                        const {code, data, message} = res;
                        if (code && code === "SUCCESS") {
                            let chatMsg = chatMessageService.wrapperRobotReply(data);
                            bulid(chatMsg, false);
                        }
                        console.info("发送成功");
                    })
                    .catch(() => {
                        console.error("发送成功");
                    });
                break;
            }
            case ChatScene.manual: {
                break;
            }
            default: {

            }
        }
    }

    /**
     * 更新消息发送状态
     *
     * @param msgId 消息编号
     */
    private renewSendStatus(msgId: String): void {

    }

    /**
     * 系统消息事件处理
     *
     * @param event
     * @private
     */
    public systemEventProcess(event:SystemEvent,params: object){
        switch (event) {
            /* 撤回消息-重新编辑 */
            case SystemEvent.reEdit:{
                let textInput = document.getElementById(`textInput`);
                textInput.innerHTML = params.content;
                break;
            }
        }
    }

    /**
     * 菜单事件
     */
    public menuEvent(menuEvent:MenuEvent,msgId: string){
        console.log(menuEvent,msgId)
        switch (menuEvent) {
            /* 拷贝消息处理 */
            case MenuEvent.copy:{
                let dialog = document.getElementById(`dialog-` + msgId);
                break;
            }
            /* 撤回消息处理 */
            case MenuEvent.revoke:{
                let dialog = document.getElementById(`dialog-` + msgId);
                document.removeChild(dialog);
                break;
            }
        }
    }

    /**
     * 菜单弹出事件
     * @param event
     * @param menu
     * @param chatMsg
     */
    public menuPopup(menu:HTMLElement, chatMsg:ChatMsgV2, event:MouseEvent) {
        /* 获取操作事件 */
        let menuEvent = undefined;
        for (const [key, val] of Object.entries(MenuEvent)) {
            if (val === event.target.id) {
                menuEvent = key;
            }
        }
        chatService.menuEvent(menuEvent ,chatMsg.msgId);
        menu.style.display = 'none';
    }

    /*  */
    public menu() {
        let customMenu = document.createElement(`div`);
        customMenu.id = "custom-menu-" + Date.now();
        customMenu.classList.add(`menu`);

        /* 撤回按钮 */
        let revoke = document.createElement(`p`);
        revoke.id = "menu-revoke-" + Date.now();
        revoke.innerText = '撤回';
        revoke.classList.add(`menu-item`);

        customMenu.appendChild(revoke);

        return customMenu;
    }

}
export const chatService = new ChatImpl();

/**
 * 聊天场景
 *
 * @author jiashuai.tang
 * @since 2024/07/28
 */
export enum ChatScene {
    robot="robot", manual="manual"
}

/**
 * 消息状态
 *
 * @author jiashuai.tang
 * @since 2024/07/28
 */
export enum ChatSendStatus {
    sending="sending", send_success="send_success", send_fail="send_fail"
}

/**
 * 消息角色
 *
 * @author jiashuai.tang
 * @since 2024/07/28
 */
export enum ChatRole {
    visitor="visitor", seat="seat", robot="robot"
}

/**
 * 消息类型
 *
 * @author jiashuai.tang
 * @since 2024/07/28
 */
export enum ChatType {

}

/**
 * 消息模式
 *
 * @author jiashuai.tang
 * @since 2024/07/28
 */
export enum ChatMode {
    wav='wav',             // 语音
    richText='richText',   // 富文本
    refer='richText'       // 引用消息
}

/**
 * 系统消息事件处理
 */
export enum SystemEvent{
    reEdit="reEdit"
}

/**
 * 菜单事件
 */
export enum MenuEvent{
    /* 复制 */
    copy="menu-copy",
    /* 撤回 */
    revoke="menu-revoke",
    /* 保存 */
    save="menu-save",
    /* 另存为 */
    saveAs="menu-save-as"
}

/**
 * 表情包选项卡
 */
export enum EmojiTab{
    /* 默认 */
    default="default",
    /* 自定义 */
    custom="custom"
}
