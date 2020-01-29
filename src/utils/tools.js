/**
 * 防抖
 * @param idle     {number} 延迟时间
 * @param action   {func}   执行方法
 * @param promptly {func}   立即执行方法。
 * */
export const debounce = (idle, action, promptly) => {
    var last;
    return function () {
        var ctx = this, args = arguments;
        if (promptly) promptly.apply(ctx, args);
        clearTimeout(last);
        last = setTimeout(function () {
            action.apply(ctx, args);
        }, idle);
    }
}

/**
 * 獲取用戶信息
 * @param {Boolean} automaticLogin  如果發現未登錄是否自動登錄, 默認否
 * @param {Boolean} isGetToken      是否获取token，默认获取
 * @returns
 */
export const getUserInfo = async (isGetToken = true, automaticLogin = false) => {
    return new Promise((resolve) => {
        const sdkINv = setInterval(async () => {
            if (window.jsSdk) {
                clearInterval(sdkINv);
                const SDK = window.jsSdk;
                const LoginStatus = await SDK.auth.getLoginStatus();
                const isLogin = LoginStatus.status === SDK.STATUS.CONNECTED;
                const refreshToken = isLogin ? LoginStatus.response.refreshToken : document.cookie.match(/(^| )_refreshToken=([^;]*)(;|$)/) ? document.cookie.match(/(^| )_refreshToken=([^;]*)(;|$)/)[2] : null;
                let accessToken = isLogin ? LoginStatus.response.accessToken : document.cookie.match(/(^| )_accessToken=([^;]*)(;|$)/) ? document.cookie.match(/(^| )_accessToken=([^;]*)(;|$)/)[2] : null;
                if (isLogin) {
                    // 設置30天refreshToken
                    document.cookie = `_refreshToken=${refreshToken};expires=${new Date(new Date().setTime(new Date().getTime() + 30 * 24 * 60 * 60 * 1000)).toGMTString()}`;
                    // 設置3天accessToken
                    document.cookie = `_accessToken=${accessToken};expires=${new Date(new Date().setTime(new Date().getTime() + 3 * 24 * 60 * 60 * 1000)).toGMTString()}`;
                } else if (refreshToken) {
                    try {
                        const refresh = await SDK.auth.refresh(refreshToken);
                        // 續簽30天refreshToken
                        document.cookie = `_refreshToken=${refresh.response.refreshToken};expires=${new Date(new Date().setTime(new Date().getTime() + 30 * 24 * 60 * 60 * 1000)).toGMTString()}`;
                        // 續簽3天accessToken
                        document.cookie = `_accessToken=${refresh.response.accessToken};expires=${new Date(new Date().setTime(new Date().getTime() + 3 * 24 * 60 * 60 * 1000)).toGMTString()}`;
                        // 賦值新的accessToken
                        accessToken = refresh.response.accessToken;
                    } catch (error) {
                        sessionStorage.removeItem('profile');
                        // 設置refreshToken過期
                        document.cookie = `_refreshToken=${refreshToken};expires=${new Date(new Date().getTime() - 10e3).toGMTString()}`;
                        // 設置accessToken過期
                        document.cookie = `_accessToken=${accessToken};expires=${new Date(new Date().getTime() - 10e3).toGMTString()}`;
                        accessToken = null;
                        if (window.debugConsole) window.debugConsole.error(error);
                        if (automaticLogin) SDK.auth.login(`${window.location.href}`, () => { window.location.reload(); }, { isBindPhoneRequired: true });
                        else resolve(null);
                    }
                } else {
                    if (automaticLogin) SDK.auth.login(`${window.location.href}`, () => { window.location.reload(); }, { isBindPhoneRequired: true });
                    else resolve(null)
                }
                if (accessToken) {
                    // 獲取用戶信息
                    const profile = await SDK.auth.getProfile(accessToken);
                    profile.isLogin = SDK.loginStatus.status === SDK.STATUS.CONNECTED;
                    sessionStorage.setItem('profile', JSON.stringify(profile));
                    if (isGetToken) profile.token = await SDK.auth.getTokens(accessToken);
                    resolve(profile);
                }
            }
        }, 10)
    })
}

// 圖片嬾加載
export const loadImg = () => {
    // 獲取可視區域的高度
    const seeHeight = document.documentElement.clientHeight;
    // 嬾加載圖片
    document.querySelectorAll('[data-src]').forEach(el => {
        if (el.attributes['data-src'] && (el.src !== el.attributes['data-src'].nodeValue)) {
            const BoundingClient = el.getBoundingClientRect();
            if (BoundingClient.top > -1 && BoundingClient.top < seeHeight + 100) {
                var img = document.createElement('img');
                const src = el.src;
                img.src = el.attributes['data-src'].nodeValue;
                img.onload = () => {
                    el.src = el.attributes['data-src'].nodeValue;
                }
                img.onerror = () => {
                    el.attributes['data-src'].nodeValue = src;
                }
            }
        }
    })
}

export const isPathComplicated = (path) => {
    return path.indexOf(':') === -1 ? false : true;
}

export const overscroll = (el) => {
    el.addEventListener('touchstart', function() {
        var top = el.scrollTop,
        totalScroll = el.scrollHeight,
        currentScroll = top + el.offsetHeight

        if (top === 0) {
            el.scrollTop = 1
        } else if(currentScroll === totalScroll) {
            el.scrollTop = top - 1
        }
    })
}