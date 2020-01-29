import { Toast } from 'antd-mobile';
import { getUserInfo } from './tools';

const HTTPUtil = {};


// GET请求
HTTPUtil.get = function (url, params, headers, isAutoLogin = true) {
  if (params) {
    let paramsArray = [];
    // encodeURIComponent
    Object.keys(params).forEach(key => paramsArray.push(`${key}=${params[key]}`));
    if (url.search(/\?/) === -1) {
      url += `?${paramsArray.join('&')}`;
    } else {
      url += `&${paramsArray.join('&')}`;
    }
  }
  return new Promise(async (resolve, reject) => {
    fetch(url, {
      method: 'GET',
      headers: headers || await new Promise(async (resolve) => {
        const token = window.user_auth_token ? { paperlessEc: { token: window.user_auth_token } } : ((await getUserInfo(true, false)) || { token: { paperlessEc: { token: null } } }).token;
        console.log('get fetch')
        console.log(token)
        console.log('================')
        const fetch_headers = new Headers();
        if (url.search(/AMODVIS_API_FLAG/) !== -1) {
          fetch_headers.append('Authenticate', window.vendor_id_by_domain);
        }
        console.log(window.app_key)

        // fetch_headers.append('Content-Type', 'application/json;charset=UTF-8');
        if (window.app_key && url.search(/AMODVIS_API_FLAG/) === -1) {
          fetch_headers.append('appkey', window.app_key);
        }
        if (token.paperlessEc && token.paperlessEc.token && url.search(/AMODVIS_API_FLAG/) === -1) {
          fetch_headers.append('token', token.paperlessEc.token);
        }
        resolve(fetch_headers);
      }),
      credentials: 'include',
      mode: 'cors',
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        reject({ status: response.status });
      })
      .then((response) => {
        if (response.code === 4001 && isAutoLogin) {
          Toast.loading('尚未登入，現將轉至登入頁...', 3, () => {
            if (window.jsSdk) {
              window.jsSdk.auth.login(window.location.href, () => { window.location.reload(); }, { isBindPhoneRequired: true });
            }
            Toast.hide();
          });
        } else {
          resolve(response);
        }
      })
      .catch(() => {
        reject({ status: -1 });
      });
  });
};
// POST请求  FormData 表单数据
HTTPUtil.post = function (url, formData, headers, isAutoLogin = true) {
  return new Promise(async (resolve, reject) => {
    fetch(url, {
      method: 'POST',
      headers: headers || await new Promise(async (resolve) => {
        const token = window.user_auth_token ? { paperlessEc: { token: window.user_auth_token } } : ((await getUserInfo(true, false)) || { token: { paperlessEc: { token: null } } }).token;
        console.log('POST fetch')
        console.log(token)
        console.log('================')
        const fetch_headers = new Headers();
        if (url.search(/AMODVIS_API_FLAG/) !== -1) {
          fetch_headers.append('Authenticate', window.vendor_id_by_domain);
        }
        fetch_headers.append('Content-Type', 'application/json;charset=UTF-8');
        if (window.app_key && url.search(/AMODVIS_API_FLAG/) === -1) {
          fetch_headers.append('appkey', window.app_key);
        }
        if (token.paperlessEc && token.paperlessEc.token && url.search(/AMODVIS_API_FLAG/) === -1) {
          fetch_headers.append('token', token.paperlessEc.token);
        }
        resolve(fetch_headers);
      }),
      body: formData,
      credentials: 'include',
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        reject({ status: response.status });
      })
      .then((response) => {
        if (response.code === 4001 && isAutoLogin) {
          Toast.loading('尚未登入，現將轉至登入頁...', 3, () => {
            if (window.jsSdk) {
              window.jsSdk.auth.login(window.location.href, () => { window.location.reload(); }, { isBindPhoneRequired: true });
            }
            Toast.hide();
          });
        } else {
          resolve(response);
        }
      })
      .catch(() => {
        reject({ status: -1 });
      });
  });
};
export default HTTPUtil;
