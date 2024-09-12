/**
 * 权限检查
 * @param permissions   权限列表
 * @param innerCheck    内部检查
 */
export const checkPermissions = (permissions: Permission[], innerCheck: boolean) => {
    return new Promise(async (resolve) => {
        if (!permissions || permissions.length === 0) {
            console.warn("申请权限不存在!!!");
            resolve(false);
        }

        let check: unknown = true;
        for (let permission of permissions) {
            if (navigator?.permissions?.query) {
                await navigator.permissions.query({name: permission})
                    .then(await async function (result) {
                        if (result.state === "granted") {
                            return;
                        } else if (result.state === "prompt") {
                            console.warn(`${permission} 等待用户授权！！！`);
                            await applyPermission([permission])
                                .then(await function (res) {
                                    check = check && res;
                                })
                            return;
                        }
                        check = check && false;
                        console.error(`${permission} 未启用或用户拒绝访问！！！`);
                    }).catch(e => {
                    });
            } else {
                await applyPermission([permission])
                    .then(await function (res) {
                        check = check && res;
                    })
            }
        }
        resolve(check);
    })
}

/**
 * 申请权限
 *
 * @param permissions
 */
export const applyPermission = (permissions: Permission[]) => {
    return new Promise((async resolve => {
            for (let permission of permissions) {
                switch (permission) {
                    case Permission.camera:
                    case Permission.microphone: {
                        await navigator.mediaDevices.getUserMedia({
                            video: Permission.camera === permission,
                            audio: Permission.microphone === permission,
                        }).then(await function (mediaStream) {
                            resolve(true);
                            releaseMediaStream([mediaStream]);
                            console.log(`${permission} 权限申请成功！！！`)
                        }).catch((e) => {
                            resolve(false);
                            console.error(`${permission} 权限申请失败！！！`, e)
                        })
                        break;
                    }
                    case Permission.geolocation: {
                        break;
                    }
                }
            }
        }
    ))
}

/**
 * 释放|停止媒体流
 *
 * @param mediaStreams
 */
export function releaseMediaStream(mediaStreams: MediaStream[]) {
    if (!mediaStreams && mediaStreams.length === 0) {
        console.warn("媒体流不存在!!!");
        return;
    }

    // @ts-ignore
    for (let streamItem: MediaStream of mediaStreams) {
        if (streamItem === undefined) {
            console.error("挂机操作,对应流不存在,无须进行当前处理")
            continue;
        }
        streamItem?.getTracks().forEach(track => {
            if (track.kind === 'video' || track.kind === 'audio') {
                track.stop();
            }
        })
    }

}

/**
 * 权限列表
 *
 * @author jiashuai.tang
 * @since 2024/09/01
 */
export enum Permission {
    camera = 'camera',
    microphone = 'microphone',
    geolocation = 'geolocation',

}
