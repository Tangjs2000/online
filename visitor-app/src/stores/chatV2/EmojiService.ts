import {Input, InputType} from "../chat/RichTextInput";
import {chatService} from "../chat/ChatV2";

/**
 * 表情包选项卡
 */
export enum EmojiTab {
    /* 表情包搜索|检索 */
    search = "search",
    /* 默认 */
    default = "default",
    /* 自定义 */
    custom = "custom"
}

/**
 * 表情包处理服务
 *
 * @author jiashuai.tang
 * @since 2024/08/08
 */
export interface EmojiService {
}

export class EmojiServiceImpl implements EmojiService {
    /* 初始化表情包 */
    initEmoji() {
        /* 清除表情包选项卡 */
        let emojiTabDiv = document.getElementById(`emojiTab`);
        while (emojiTabDiv.firstChild) {
            emojiTabDiv.removeChild(emojiTabDiv.firstChild);
        }
        /* 初始化表情包选项卡 */
        const emojiTabs = [
            {"type": EmojiTab.search, "name": "search", "icon": "/emoji/group_search.svg"},
            {"type": EmojiTab.default, "name": "default", "icon": "/emoji/group_default.svg"},
            {
                "type": EmojiTab.custom,
                "name": "custom_new240807",
                "icon": "https://movies.smartalien.cn/assets/logo-DWb-DfrG.svg",
                "content": [
                    {
                        access_url: "https://movies.smartalien.cn/assets/logo-DWb-DfrG.svg",
                        alt: "logo"
                    },
                    {
                        access_url: "https://movies.smartalien.cn/live/CCTV1.png",
                        alt: "CCTV1"
                    }
                ],
            },
        ];
        if (emojiTabs?.length > 0) {
            let that = this;
            for (let item of emojiTabs) {
                let emojiTab = document.createElement(`img`);
                emojiTab.src = item.icon
                emojiTab.classList.add("emojiTab-item");
                emojiTab.addEventListener("click", () => {
                    that.emojiTabSwitch(item)
                })
                emojiTabDiv.appendChild(emojiTab);
            }
        }
    }

    /* 切换表情包选项卡 */
    emojiTabSwitch(emojiTab) {
        /* 清除表情包历史 */
        let emojiBody = document.getElementById("emojiBody");
        while (emojiBody.firstChild) {
            emojiBody.removeChild(emojiBody.firstChild);
        }
        /* 添加表情包 */
        const root = document.documentElement;
        if (EmojiTab.default === emojiTab.type) { // 默认表情包
            // @ts-ignore
            root.style.setProperty('--emoji-card-columns', 8);
            this.initDefaultEmoji();
        } else if (EmojiTab.custom === emojiTab.type) {
            // @ts-ignore
            root.style.setProperty('--emoji-card-columns', 5);
            for (let emoji of emojiTab.content) {
                let element = document.createElement(`img`)
                element.src = emoji.access_url;
                element.width = 34;
                element.height = 34;
                element.alt = emoji.alt;
                element.contentEditable = 'false';
                element.addEventListener("click", () => {
                    let imageInput: Input = {
                        type: InputType.IMAGE,
                        content: element.src,
                        extend: {
                            altText: element.alt,
                            style: {
                                width: '1.8rem',
                                height: '1.8rem',
                            }
                        }
                    }
                    chatService.inputText(imageInput, false);
                })
                emojiBody.appendChild(element);
            }
        }
    }

    /**
     * 初始话默认表情包
     *
     * @author jiashuai.tang
     * @since 2025/04/09
     */
    initDefaultEmoji() {
        let emojiBody = document.getElementById("emojiBody");
        const emojiDefault = ["yyds", "亲亲", "便便", "分裂", "发呆", "发烧", "口水", "口罩", "可怜", "叹气", "吃瓜",
            "吐", "咒骂", "大哭", "大笑", "奋斗", "害羞", "尴尬", "庆祝", "彩虹马", "微笑", "思考", "惊讶", "感到鸭力", "晕",
            "暗中观察", "柠檬精", "炸弹", "生气", "疑问", "白眼", "睡觉", "石化", "笑哭", "调皮", "酷", "闭嘴", "骷髅",
            "黑脸", "鼓掌"];
        for (let emojiName of emojiDefault) {
            let element = document.createElement(`img`)
            element.src = "/emoji/default/" + emojiName + ".png";
            element.width = 34;
            element.height = 34;
            element.alt = emojiName;
            element.contentEditable = 'false';
            element.addEventListener("click", () => {
                let imageInput: Input = {
                    type: InputType.IMAGE,
                    content: element.src,
                    extend: {
                        altText: emojiName,
                        style: {
                            width: '1.8rem',
                            height: '1.8rem',
                        }
                    }
                }
                chatService.inputText(imageInput, false);
            })
            emojiBody.appendChild(element);
        }
    }
}

export const emojiService = new EmojiServiceImpl();