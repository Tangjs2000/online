import {playWav, scrollButton} from "./chat.js";
import {ChatMode, ChatRole, ChatScene, ChatSendStatus, chatService, ChatType, MenuEvent} from "./ChatV2";

/**
 * 对话消息处理服务接口定义
 *
 * @author jiashuai.tang
 * @since 2024/07/27
 */
export interface ChatMessage {

    buildDialog(chatMsg: ChatMsgV2): string;

    buildHistoryDialog(history: ChatMsgHistory): string;

}

/**
 * 对话历史消息实体
 *
 * @author jiashuai.tang
 * @since 2024/07/27
 */
export class ChatMsgHistory {

    /**
     * 消息id
     */
    public msgId: String;

    /**
     * 会话id
     */
    public meetingId: String;

    /**
     * 消息发送角色
     */
    public role: String;

    /**
     * 消息类型 枚举ChatType
     */
    public type: String;

    /**
     * 消息内容
     */
    public content: String;

    /**
     * h5消息内容
     */
    public contentH5: String;

    /**
     * content随路内容
     */
    public contentExt: Object;

    /**
     * 消息所属人编号
     */
    public personalId: String;

    /**
     * 消息所属人名称
     */
    public personalName: String;

    /**
     * 消息时间
     */
    public datetime: String;

    /**
     * 撤回标识 (1是 0否)
     */
    public revoke: number = 0;

    /**
     * 已读标识 (是否已读 1是 0否)
     */
    public hasRead: number = 0;

    /**
     * 删除标识(是否有效 1有效 0无效)
     */
    public hasValid: number = 1;

    /**
     * 评价标识(是否支持评价|点赞点踩 1支持 0不支持)
     */
    public hasAssess: number = 0;

    /**
     * 访客id
     */
    public visitorId: String;

    /**
     * 随路参数
     */
    public ext: Object;

    /**
     * 引导语|推荐话术-机器人
     */
    public guideTitle:String;

    /**
     * 推荐问题列表-机器人
     */
    public recommends: Array;

}

/**
 * 对话机器人回复消息实体
 *
 * @author jiashuai.tang
 * @since 2024/07/27
 */
export class ChatRobotReplyMsg {

    /**
     * 消息id
     */
    public chatId: String;

    /**
     * 会话id
     */
    public sessionId: String;

    /**
     * 消息时间
     */
    public dateTime: String;

    /**
     * 机器人回复H5
     */
    public text: String;

    /**
     * 推荐引导语
     */
    public guideTitle: String;

    /**
     * 推荐问题
     */
    public recommends: Array;

    /**
     * 用户id
     */
    public userId: String;
}

/**
 * 对话消息实体
 *
 * @author jiashuai.tang
 * @since 2024/07/27
 */
export class ChatMsgV2 {

    /**
     * 消息id
     */
    public msgId: String;

    /**
     * 会话id
     */
    public meetingId: String;

    /**
     * 是否本人消息
     */
    public hasSelf: boolean;

    /**
     * 消息发送角色
     */
    public role: String;

    /**
     * 消息类型 枚举ChatType
     */
    public type: ChatType;

    /**
     * 对话|消息模式
     */
    public chatMode: ChatMode;

    /**
     * 消息内容
     */
    public content: String;

    /**
     * 语音消息-录音文件访问地址
     */
    public wavUrl:String;

    /**
     * 推荐引导语(role=robot：仅当机器人回复消息有效)
     */
    public guideTitle: String;

    /**
     * 推荐问题(role=robot：仅当机器人回复消息有效)
     */
    public recommends: Array;

    /**
     * 消息所属人编号
     */
    public personalId: String;

    /**
     * 消息所属人名称
     */
    public personalName: String;

    /**
     * 头像
     */
    public avatar: String;

    /**
     * 消息时间
     */
    public datetime: String;

    /**
     * 发送状态
     */
    public sendStatus: ChatSendStatus = ChatSendStatus.send_success;

    /**
     * 撤回标识 (1是 0否)
     */
    public revoke: number = 0;

    /**
     * 已读标识 (是否已读 1是 0否)
     */
    public hasRead: number = 0;

    /**
     * 删除标识(是否有效 1有效 0无效)
     */
    public hasValid: number = 1;

    /**
     * 评价标识(是否支持评价|点赞点踩 1支持 0不支持)
     */
    public hasAssess: number = 0;

    /**
     * 评价内容
     */
    public assessExt: Assess;
}

/**
 * 消息评价内容
 *
 * @author jiashuai.tang
 * @since 2024/07/27
 */
export class Assess {

    /**
     * 点赞或是点踩
     */
    public goodOrStep: String;

    /**
     * 原因列表
     */
    // public reason: Array;
}

/**
 * 对话消息处理服务实现
 *
 * @author jiashuai.tang
 * @since 2024/07/27
 */
export class ChatMessageImpl implements ChatMessage {

    // public chatCardImpl: ChatCardImpl = new ChatCardImpl();

    /**
     * 构建历史对话消息
     *
     * @param history
     * @return {*}
     */
    public buildHistoryDialog = (history: ChatMsgHistory) => {
        if (!history) return;

        let dialog = null;
        switch (history.role) {
            case "seat": {
                break;
            }
            case "0":
            case "visitor": {
                let chatMsg = new ChatMsgV2();
                chatMsg.msgId = history.msgId;
                chatMsg.meetingId = history.meetingId;
                chatMsg.hasSelf = true;
                chatMsg.role = ChatRole.visitor
                chatMsg.chatMode = ChatMode.richText
                chatMsg.type = history.type;
                chatMsg.content = history.contentH5;
                chatMsg.personalId = history.personalId;
                chatMsg.personalName = history.personalName;
                chatMsg.datetime = history.datetime;
                chatMsg.hasRead = history.hasRead;
                dialog = this.visitorDialog(chatMsg);
                break;
            }
            case "system": {
                break;
            }
            case "2":
            case "robot": {
                let chatMsg = new ChatMsgV2();
                chatMsg.msgId = history.msgId;
                chatMsg.meetingId = history.meetingId;
                chatMsg.hasSelf = false;
                chatMsg.role = ChatRole.robot
                chatMsg.chatMode = ChatMode.richText
                chatMsg.type = history.type;
                chatMsg.content = history.contentH5;
                chatMsg.personalId = history.personalId;
                chatMsg.personalName = history.personalName;
                chatMsg.datetime = history.datetime;
                chatMsg.hasRead = history.hasRead;
                chatMsg.guideTitle = history.guideTitle
                chatMsg.recommends = history.recommends
                dialog = this.RobotDialog(chatMsg);
                break;
            }
            default: {
                console.error("未知的消息处理方案-消息内容：", history)
            }
        }
        if (dialog) {
            let historyChat = document.getElementById(`historyChat`);
            let firstDocument = historyChat.firstChild;
            if (firstDocument == null) {
                historyChat.append(dialog);
            } else {
                // if (firstDocument.id !== CHAT_MSG_PROCESS_CONSTANT.no_history_message_id)
                    firstDocument.before(dialog);
            }
        }
        return dialog;
    };

    /**
     * 构建即时对话消息
     *
     * @param chatMsg
     * @return {*}
     */
    public buildDialog = (chatMsg: ChatMsgV2) => {
        if (!chatMsg) return;

        let dialog = null;
        switch (chatMsg.role) {
            case "seat": {
                break;
            }
            case "0":
            case "visitor": {
                dialog = this.visitorDialog(chatMsg);
                break;
            }
            case "system": {
                break;
            }
            case "2":
            case "robot": {
                dialog = this.RobotDialog(chatMsg);
                break;
            }
            default: {
                console.error("未知的消息处理方案-消息内容：", chatMsg)
            }
        }
        if (dialog) {
            let newChat = document.getElementById(`newChat`);
            console.log(dialog);
            newChat.appendChild(dialog);

            /* 获取自定义菜单元素 */
            // let menu = chatService.menu();
            let menu = document.getElementById(`custom-menu`);
            menu.addEventListener('contextmenu', function(event) {
                event.preventDefault();
            });

            let messageCard = document.getElementById( 'messageCard-' + chatMsg.msgId)
            // 监听contextmenu事件
            messageCard.addEventListener('contextmenu', function(event) {
                event.preventDefault(); // 阻止默认右键菜单

                // 设置自定义菜单的位置并显示
                menu.style.top = `${event.pageY}px`;
                menu.style.left = `${event.pageX}px`;
                menu.style.display = 'block';

                let var1 = event.target;
                while (!var1.id || !var1.id.toString().startsWith("dialog")){
                    var1 = var1.parentNode;
                }

                let dialogId = var1.id.toString();
                let currChatMsgId = dialogId.replace("dialog-","");

                /* 获取操作 */
                // 如果点击自定义菜单，则不隐藏 todo
                menu.onclick = null;
                if (currChatMsgId === chatMsg.msgId){
                    menu.addEventListener('click', (event)=>chatService.menuPopup(menu, chatMsg, event));
                }
            });

            // 点击其他位置隐藏自定义菜单
            document.addEventListener('click', function() {
                menu.style.display = 'none';
                menu.removeEventListener(`click`,(event)=>chatService.menuPopup(menu, chatMsg, event));
            });
            scrollButton();
        }
        return dialog;
    };

    /**
     * 访客对话消息
     * @author jiashuai.tang
     * @since 2024/07/27
     */
    private visitorDialog = (chatMsg: ChatMsgV2) => {
        chatMsg.avatar = chatMsg.avatar ? chatMsg.avatar :"https://47.120.74.142:442/unit/minio/download?filename=visitor_20240731011746.jpg";
        return chatCardService.ChatCard(chatMsg);
    }

    /**
     * 机器人对话消息
     * @author jiashuai.tang
     * @since 2024/07/27
     * @return
     */
    private RobotDialog = (chatMsg: ChatMsgV2) => {
        chatMsg.avatar = chatMsg.avatar ? chatMsg.avatar :"https://47.120.74.142:442/unit/minio/download?filename=robot_20240731011152.jpg";
        let res = chatCardService.ChatCard(chatMsg);
        return res;
    }

    /**
     * 坐席对话消息
     * @author jiashuai.tang
     * @since 2024/07/27
     */
    private SeatDialog = (chatMsg: ChatMsgV2) => {

    }

    /**
     * 系统对话消息
     * @author jiashuai.tang
     * @since 2024/07/27
     */
    private SystemDialog = (chatMsg: ChatMsgV2) => {

    }


    /**
     * 封装转换机器人消息
     *
     * @author jiashuai.tang
     * @since 2024/07/27
     */
    public wrapperRobotReply(robotReplyMsg: ChatRobotReplyMsg): ChatMsgV2 {
        let chatMsg = new ChatMsgV2();
        chatMsg.msgId = robotReplyMsg.chatId;
        chatMsg.meetingId = robotReplyMsg.sessionId;
        chatMsg.role = ChatRole.robot;
        chatMsg.chatMode = ChatMode.richText;
        chatMsg.content = robotReplyMsg.text;
        chatMsg.datetime = robotReplyMsg.dateTime;
        chatMsg.guideTitle = robotReplyMsg.guideTitle;
        chatMsg.recommends = robotReplyMsg.recommends;
        return chatMsg;
    }
}
export const chatMessageService = new ChatMessageImpl();

export interface ChatCard{

}

/**
 * 对话消息卡片实现
 *
 * @author jiashuai.tang
 * @since 2024/07/27
 */
class ChatCardImpl implements ChatCard {

    // public messageCardService:MessageCardImpl = new MessageCardImpl();

    /**
     * 对话卡片生成器
     *
     * @param chatMsg
     * @constructor
     */
    public ChatCard=(chatMsg: ChatMsgV2) => {
        if (chatMsg.role?.toString() === ChatRole.visitor.toString()) {
            return this.rightChatCard(chatMsg);
        }else {
            return this.leftChatCard(chatMsg);
        }

    }

    public leftChatCard(chatMsg: ChatMsgV2){
        /* 1、定义元素 */
        let dialog = document.createElement(`div`);         // 对话
        let chatCard = document.createElement(`div`);       // 对话卡片
        let messageCard = document.createElement(`div`);    // 对话消息卡片
        let messageBody = document.createElement(`div`);    // 对话消息内容-h5
        let avatar = document.createElement(`img`);         // 头像图片
        let read = document.createElement(`i`);             // 是否已读标识
        let goodOrStep = document.createElement(`i`);       // 点赞点踩卡片
        let recommend = messageCardService.recommend(chatMsg.guideTitle,chatMsg.recommends);
        dialog.id = "dialog-" + chatMsg.msgId;
        chatCard.id = "chatCard-" + chatMsg.msgId;
        messageCard.id = "messageCard-" + chatMsg.msgId;
        messageBody.id = "messageBody-" + chatMsg.msgId;
        avatar.id = "avatar-" + chatMsg.msgId;
        read.id = "read-" + chatMsg.msgId;
        goodOrStep.id = "goodOrStep-" + chatMsg.msgId;
        // recommend.id = "recommend-" + chatMsg.msgId;

        /* 2、设置元素样式 */
        dialog.classList.add("dialogV2", "left");
        chatCard.classList.add("chatCard", "left");
        messageCard.classList.add("messageCard", "left");
        messageBody.classList.add("messageBody", "left");
        avatar.classList.add("constant_img");
        read.classList.add("read");
        goodOrStep.classList.add();
        avatar.src = chatMsg.avatar;


        /* 3、组装元素 */
        console.log(messageCardService.messageCard(chatMsg),chatMsg);

        // messageCard.innerHTML = goodOrStep.outerHTML;
        dialog.appendChild(avatar);
        dialog.appendChild(chatCard);
        chatCard.appendChild(messageCard);
        messageCard.appendChild(messageBody)
        messageCard.appendChild(read);
        messageBody.appendChild(messageCardService.messageCard(chatMsg));
        if (recommend) messageBody.appendChild(recommend);
        /* 4、 */
        return dialog;
    }

    public rightChatCard(chatMsg: ChatMsgV2){
        /* 1、定义元素 */
        let dialog = document.createElement(`div`);         // 对话
        let chatCard = document.createElement(`div`);       // 对话卡片
        let messageCard = document.createElement(`div`);    // 对话消息卡片
        let messageBody = document.createElement(`div`);    // 对话消息内容-h5
        let avatar = document.createElement(`img`);         // 头像图片
        let read = document.createElement(`i`);             // 是否已读标识
        let goodOrStep = document.createElement(`i`);       // 点赞点踩卡片
        let recommend = messageCardService.recommend(chatMsg.guideTitle,chatMsg.recommends);
        dialog.id = "dialog-" + chatMsg.msgId;
        chatCard.id = "chatCard-" + chatMsg.msgId;
        messageCard.id = "messageCard-" + chatMsg.msgId;
        messageBody.id = "messageBody-" + chatMsg.msgId;
        avatar.id = "avatar-" + chatMsg.msgId;
        read.id = "read-" + chatMsg.msgId;
        goodOrStep.id = "goodOrStep-" + chatMsg.msgId;
        // recommend.id = "recommend-" + chatMsg.msgId;

        /* 2、设置元素样式 */
        dialog.classList.add("dialogV2", "right");
        chatCard.classList.add("chatCard", "right");
        messageCard.classList.add("messageCard", "right");
        messageBody.classList.add("messageBody", "right");
        avatar.classList.add("constant_img");
        read.classList.add("read");
        avatar.src = chatMsg.avatar;


        /* 3、组装元素 */
        console.log(messageCardService.messageCard(chatMsg),chatMsg);
        // messageCard.innerHTML = messageCardService.messageCard(chatMsg).outerHTML + goodOrStep.outerHTML;
        dialog.appendChild(chatCard);
        dialog.appendChild(avatar);
        chatCard.appendChild(messageCard);
        messageCard.appendChild(read);
        messageCard.appendChild(messageBody);
        messageBody.appendChild(messageCardService.messageCard(chatMsg))
        if (recommend) messageBody.appendChild(recommend);
        /* 4、 */

        /* 测试转写内容 */
        /*chatMsg.content = "安东尼请问却微乎其微后期获取华为u氰化物烈火全力维护i去好委屈好委屈hi文化请问u和趣味回去很晚七五额和趣味黑棋和";
        chatMsg.chatMode = ChatMode.richText;
        let tranChatCard = document.createElement(`div`);       // 对话卡片
        let tranMessageCard = document.createElement(`div`);    // 转写语音消息卡片
        tranChatCard.style.top = '10px'
        tranMessageCard.classList.add("messageCard")
        tranChatCard.classList.add("chatCard")
        tranMessageCard.appendChild(messageCardService.messageCard(chatMsg));
        dialog.appendChild(tranChatCard)
        tranChatCard.appendChild(tranMessageCard);*/
        return dialog;
    }

}
export const chatCardService = new ChatCardImpl();

export interface MessageCard{
    messageCard(chatMsg: ChatMsgV2);
}
class MessageCardImpl implements MessageCard{


    public messageCard(chatMsg: ChatMsgV2){
        switch (chatMsg.chatMode) {
            case ChatMode.wav:
                return this.wavCard(chatMsg);
            case ChatMode.richText:
                return this.richTextCard(chatMsg);
            case ChatMode.refer:
                break;
            default:
        }
        return
    }
    /**
     * 富文本消息卡片
     * @param chatMsg
     */
    public richTextCard(chatMsg: ChatMsgV2){
        /* 消息内容 */
        let msgDiv = document.createElement(`div`);
        msgDiv.classList.add("replayContent",/*"collapse-base"*/)

        /* 折叠展开按钮 */
        let collapse = document.createElement(`button`);
        collapse.id = "collapse-" + chatMsg.msgId;
        collapse.classList.add("expand");
        msgDiv.innerHTML = chatMsg.content;
        // msgDiv.appendChild(collapse);
        return msgDiv;
    }

    /**
     * 语音消息卡片
     * @param chatMsg
     */
    public wavCard(chatMsg:ChatMsgV2) {
        /* 语音消息 */
        let wavDiv = document.createElement(`div`);
        wavDiv.classList.add("wavCardV2")

        let svg = document.createElement(`i`);
        let wavInfo = document.createElement(`span`);
        svg.classList.add("wavSvg","right");
        wavInfo.classList.add("wavDuration")
        wavInfo.innerText = '11”'
        wavDiv.append(svg);
        wavDiv.append(wavInfo);

        wavDiv.addEventListener(`click`,function (){
            console.log("playWav:",chatMsg.msgId,chatMsg.wavUrl)
            playWav(chatMsg.msgId, chatMsg.wavUrl);
        });

        return wavDiv;
    }

    /**
     * 关联问|相关问题
     *
     * @param guideTitle
     * @param recommends
     */
    public recommend(guideTitle, recommends) {
        /* 1、校验推荐问题列表,判断是否存在推荐问题 */
        if (!recommends || recommends.size === 0) {
            return;
        }

        let that = this;
        /* 2、创建必要H5元素 */
        let recommendDiv = document.createElement(`div`);
        let guideTitleP = document.createElement(`p`);
        let guideTitleB = document.createElement(`b`);
        let recommendOl = document.createElement(`ol`);

        /* 3、编排H5元素 */
        recommendDiv.appendChild(guideTitleP);
        recommendDiv.appendChild(recommendOl);
        guideTitleP.appendChild(guideTitleB);

        /* 4、为元素添加内容、事件 */
        guideTitleB.innerText = guideTitle
        recommends.forEach(recommend => {
            let item = document.createElement(`li`);
            item.innerText = recommend;
            item.addEventListener('click', function () {
                chatService.sendRichText(recommend, ChatScene.robot);
            });
            recommendOl.appendChild(item);
        })

        /* 5、设置元素样式 */
        recommendDiv.classList.add("recommend");

        return recommendDiv;
    };
}
export const messageCardService = new MessageCardImpl();

/**
 * 构建对话消息
 *
 * @param chat
 * @param hasHistory
 */
export const bulid = (chat, hasHistory: boolean) => {
    let chatMessage = new ChatMessageImpl();
    if (hasHistory) {
        chatMessage.buildHistoryDialog(chat);
    } else {
        chatMessage.buildDialog(chat);
    }
}



