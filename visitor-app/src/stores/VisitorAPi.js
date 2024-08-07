import RequestTool from '../stores/tool/RequestTool.js'

const REQUEST = {
    METHOD: {
        GET: 'GET',
        POST: 'POST',
        PUT: 'PUT',
        DELETE: 'DELETE',
        HEAD: 'HEAD'
    },
    URL: {
        basicConfiguration: '/visitor/basicConfiguration',
    }
}

/**
 * 获取基础配置
 *
 * @author jiashuai.tang
 * @since 2024/04/24
 */
export const gainBasicConfiguration = async (params, body) => {
    let result
    await RequestTool.request({
        url: REQUEST.URL.basicConfiguration,
        method: REQUEST.METHOD.GET
    }).then(res => {
        const { code, data, message } = res
        result = data
    }).catch(e => {
    })
    return result
}