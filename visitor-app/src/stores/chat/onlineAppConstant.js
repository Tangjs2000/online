/* 系统信息 */
const SYSTEM_MESSAGE = {
  NO_HISTORY_MESSAGE: `已无历史消息`,
  REVOKE: `你撤回了一条信息`,
  NOW: Date.now()
}

/* 消息类型 */
const MESSAGE_TYPE = {
  SYSTEM: 'system', // 系统消息
  DIALOG: 'dialog',  // 普通对话消息
}

/* 消息内容类型 */
const MESSAGE_CONTENT_TYPE = {
  TEXT: 'text',
  IMG: 'img',
  LINK: 'link',
  AUDIO: 'audio',
  VIDEO: 'audio',
  RICH_TEXT: 'richText'
}

/* 工具栏输入框类型 */
const TOOLBAR_INPUTBOX_TYPE = {
  VOICE: 'voice',
  TEXT: 'TEXT'
}

export {SYSTEM_MESSAGE, MESSAGE_TYPE, MESSAGE_CONTENT_TYPE, TOOLBAR_INPUTBOX_TYPE}
