import path from 'path'
import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import VueDevTools from 'vite-plugin-vue-devtools'
import viteVConsole from "vite-plugin-vconsole";

// https://vitejs.dev/config/
export default defineConfig({
    publicPath: './',  // 基本路径
    outputDir: 'dist', // 构建时的输出目录
    assetsDir: 'static', // 放置静态资源的目录
    indexPath: 'index.html', // html 的输出路径
    filenameHashing: true, // 文件名哈希值
    lintOnSave: false, // 是否在保存的时候使用 `eslint-loader` 进行检查。
    plugins: [
        vue(),
        // VueDevTools(),
        viteVConsole({
            entry: path.resolve('src/main.js'), // 入口文件，或者可以使用这个配置: [path.resolve('src/main.js')]
            localEnabled: true, // 本地是否启用
            enabled: true, // 是否启用
            config: {
                maxLogNumber: 1000,
                theme: 'light' // 主题颜色 'dark'|'light'
            }
        })
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src')
        }
    },
    server: {
        open: true,         // 编译后直接打开浏览器
        host: "localhost",  // 域名主机
        port: 9527,         // 端口
        https: false,       // 是否https
        overlay: {          // 显示警告和错误
            warnings: false,
            errors: true,
        },
        proxy: {            // 代理
            "/online": {
                target: `http://127.0.0.1:8088`,
                // target: `http://47.120.74.142:441`,
                changeOrigin: true,
                ws: true,
                logLevel: "debug",
                pathRewrite: {
                    '^/online': '/online'
                }
            },
            "/unit": {
                target: `http://47.120.74.142:441`,
                changeOrigin: true,
                ws: true,
                logLevel: "debug",
                pathRewrite: {
                    '^/unit': '/unit'
                }
            }
        }
    }
})
