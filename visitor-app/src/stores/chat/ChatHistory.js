import RequestTool from "../tool/RequestTool";

const REQUEST = {
    METHOD: {
        GET: 'GET',
        POST: 'POST',
        PUT: 'PUT',
        DELETE: 'DELETE',
        HEAD: 'HEAD'
    },
    URL: {
        chatHistoryV2: '/online/chatMsg/historyV2',
    }
}

/**
 * 查询会话聊天历史
 *
 * @author jiashuai.tang
 * @since 2024/07/27
 */
const chatHistory = async (params, body) => {
    let result
    await RequestTool.request({
        url: REQUEST.URL.chatHistoryV2,
        method: REQUEST.METHOD.POST,
        data: body,
    }).then(res => {
        const {code, data, message} = res
        result = data
    }).catch(e => {
    })
    return result;
}

/**
 * 构建历史消息卡片
 *
 * @author jiashuai.tang
 * @since 2024/07/27
 */
const buildChatMsg = (history) => {
    if (!history || history.length === 0) return null;

    for (let i = history.length; i > 0; i--) {
        let historyChat = history[i];
        let msgId = historyChat.msgId;
        let role = historyChat.role;
        switch (role) {
            case 'seat': {

                break;
            }
            case 'robot': {
                break;
            }
            case 'visitor': {
                break;
            }
            default: {

            }
        }
    }

}


export {
    chatHistory
}