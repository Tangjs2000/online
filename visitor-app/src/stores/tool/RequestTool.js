import axios from 'axios'

/**
 * 创建请求实例
 *
 * @author jiashuai.tang
 * @since 2024/04/24
 * @type {AxiosInstance}
 */
const service = axios.create({
  // baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  // timeout: 5000, // request timeout
  //用于解决long类型转换为number失去精度问题,转换为string类型
  // transformResponse: [function (data) {
  //   return jsonlint.parse(data)
  // }]

})

/**
 * 请求拦截器
 *
 * @author jiashuai.tang
 * @since 2024/04/24
 */
service.interceptors.request.use(
  config => {
    config.headers['Content-Type'] = 'application/json;charset=UTF-8'
    return config
  },
  error => {
    console.error(error)
    return Promise.reject(error)
  }
)

/**
 * 响应拦截器
 *
 * @author jiashuai.tang
 * @since 2024/04/24
 */
service.interceptors.response.use(
  response => {
    const { status, headers, data } = response
    const { token } = headers

    /* 根据请求 */
    switch (status) {
      case 200: {
        break
      }
      case 401:
      case 404:
      case 500:
      default: {
        console.error(response)
        return
      }
    }
    return data
  },
  error => {
    console.error('error:', error)
    return Promise.reject(error)
  }
)

export default service
