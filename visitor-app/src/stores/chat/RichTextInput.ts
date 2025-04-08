/**
 * 输入类型
 */
export enum InputType {
    /* 文本 */
    TEXT = "text",
    /* 富文本 */
    RICH_TEXT = "richText",
    /* 图片 */
    IMAGE = "img",
    /* 提及功能 */
    MENTION = "mention",

}

/**
 * H5内容输入对象
 */
export class Input {
    /* 输入类型 */
    type: InputType
    /* 内容 */
    content: any
    /* 扩展信息 */
    extend: any

    constructor(type: InputType, content: any) {
        this.type = type;
        this.content = content;
    }
}