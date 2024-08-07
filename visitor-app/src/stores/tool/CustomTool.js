/* 自定义工具组件 */

import axios from "axios";
import {floatDiv} from "xijs";
import {ElMessage} from "element-plus";
import Qs from 'qs'
import Fingerprint2 from 'fingerprintjs2'

/**
 * 上传文件
 *
 * 执行逻辑：
 * 1、校验文件内容是否合法
 * 2、解析构建文件上传表单
 * 3、上传文件到服务器
 * 4、处理响应结果
 * 5、返回结果
 *
 * @param file 文件
 */
const upload = async function (file) {
    /* 1、校验文件内容是否合法 */


    /* 2、解析构建文件上传表单 */
    let fileInfo;
    let filename = file.name;
    let filesize = file.size;
    let formData = new FormData();
    formData.append("file", file, filename);

    /* 3、上传文件到服务器 */
    await axios.create().request({
        url: "/unit/minio/upload",
        method: "POST",
        headers: {
            "Content-Type": "multipart/form-data;"
        },
        data: formData,
    }).then(res => {
        /* 4、处理响应结果 */
        let {data} = res.data;
        let fileType;
        let fileSuffix;

        /* 4.1、校验结果,获取资源访问URL,并解析文件类型 */
        if (data && (fileSuffix = data.substr(data.lastIndexOf('.') + 1))) {
            /* 4.2、格式化标准文件大小 */
            let num = 0;
            let units = ["b", "B", "KB", "MB", "G"]
            while (filesize >= 1024 && num < 4) {
                filesize = floatDiv(filesize, 1024);
                num++;
            }

            /* 4.3、解析文件类型 */
            if (["img", "png", "image", "jpg"].includes(fileSuffix)) {
                fileType = "image";
            } else if (["mp3"].includes(fileSuffix)) {
                fileType = "audio";
            } else if (["mp4"].includes(fileSuffix)) {
                fileType = "video";
            } else if (["txt"].includes(fileSuffix)) {
                fileType = "txt";
            } else if (["doc", "docx"].includes(fileSuffix)) {
                fileType = "word";
            } else if (["pdf"].includes(fileSuffix)) {
                fileType = "pdf";
            } else {
                fileType = "none";
            }

            /* 4.4、构建文件信息对象 */
            fileInfo = {
                name: filename,
                size: filesize.toFixed(1),
                unit: units[num],
                accessUrl: "/unit/" + data,
                type: fileType,
                fileSuffix : fileSuffix
            };
        }
        console.log("上传文件(upload)完成。");
    }).catch(e => {
        console.error("上传文件(upload)异常,异常信息：", e);
    });

    /* 5、返回结果 */
    return fileInfo;
}

/**
 * 下载文件
 *
 * 执行逻辑：
 * 1、判断文件名不存在解析响应头文件名
 * 2、浏览器下载文件
 *
 * @param accessUrl 下载地址
 * @param filename  文件名称
 */
const download = function (accessUrl, filename) {
    axios({
        url: accessUrl,
        method: "GET",
        responseType: "blob", // 后台响应数据类型
    }).then(res => {
        /* 1、判断文件名不存在解析响应头文件名 */
        if (!filename) {
            let disposition = res.headers[`content-disposition`];
            const splits = disposition.split(`;`);
            for (const split of splits) {
                const parts = disposition.split(`=`);
                const left = parts[0];
                const right = parts.length > 1 ? parts[1] : null;
                if ("filename" === left.toLowerCase())
                    filename = right;
            }
        }

        /* 2、浏览器下载文件 */
        const url = window.URL.createObjectURL(res.data);
        const elink = document.createElement('a');
        elink.href = url;
        elink.target = '_self'; // 当前也 target打开新页面
        elink.setAttribute('download', filename);
        elink.style.display = 'none';
        document.body.appendChild(elink);
        elink.click();
        document.body.removeChild(elink);
        console.log("下载文件(download)完成。")
    }).catch(e => {
        console.error("下载文件(download)异常,异常信息：", e);
    })
}

/**
 * 消息提示
 * @param options
 */
const prompt = function (options) {
    const {type, content, duration} = options;
    if (!options || !content) {
        console.log("消息提示失败!!!");
    }

    options.message = content;
    ElMessage(options);
}

/**
 * URL处理  (解析|构建URL)
 * @type {{parse: URLProcess.parse, build: URLProcess.build}}
 */
const URLProcess = {
    /* 解析URL */
    parse: function (url) {
        let split;
        if (!url || (split = url.toString().split("?"))?.length < 1) return null;
        let res = {
            baseUrl: "",
            params: {},
        }
        res.baseUrl = split[0];
        if (split.length > 1) res.params = Qs.parse(split[1]);
        return res;
    },
    /* 构建完整URL */
    build: function (baseurl, params) {
        let strParams = "";
        if (params) {
            strParams = Qs.stringify(params);
        }
        return (baseurl ? baseurl : "") + (strParams ? "?" + strParams : "");
    }
}

/**
 * 获取浏览器指纹
 */
const gainFingerprint = function () {
    let murmur;
    Fingerprint2.get(function(components) {
        const values = components.map(function(component,index) {
            if (index === 0) { //把微信浏览器里UA的wifi或4G等网络替换成空,不然切换网络会ID不一样
                return component.value.replace(/\bNetType\/\w+\b/, '')
            }
            return component.value
        })
        // 生成最终id murmur
        murmur = Fingerprint2.x64hash128(values.join(''), 31)
        console.log(murmur);
    })
    return murmur;
    /*const values = components.map((component) => component.value);
    const fingerprint = Fingerprint2.x64hash128(values.join(''), 31);
    console.log(fingerprint); // 输出计算得到的指纹*/
}

export {upload, download, prompt, gainFingerprint, URLProcess}

