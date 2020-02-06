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
 */
export const getUserInfo =  () => {
    return null
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