import { PullToRefresh, Toast } from 'antd-mobile';
import { withRouter } from 'react-router-dom';
import 'antd-mobile/dist/antd-mobile.css';
import React, { Component } from 'react';
import * as B from '../../Block';
import UtilFetch from '../../utils/fetch';
import { getUserInfo, isPathComplicated, overscroll } from './../../utils/tools';


import './index.scss';

const envJson = require('../../.env.json');

const cre = React.createElement;

class CommonPage extends Component {
  constructor(props) {
    super(props);
    console.log('CommonPage -------- constructor');
    this.state = {
      page_module_data: {},
      moduleFetchUrl: envJson.moduleFetchUrl,
      data: props.data,
      is_pull_update: props.is_pull_update,
      is_cdn_cache: props.is_cdn_cache,
      is_user_auth: props.is_user_auth,
    };
    this.modProps = this.modProps.bind(this);
    this.getSections = this.getSections.bind(this);
    this.colMain = this.colMain.bind(this);
  }

  componentWillMount() {
    if (typeof window.is_not_auth_login === 'undefined') {
      window.is_not_auth_login = envJson.is_not_auth_login;
    }

    if (!window.app_name_by_domain) {
      window.app_name_by_domain = envJson.app_name_by_domain;
    }
    if (typeof window.shop_vendor_token == "undefined") {
      window.shop_vendor_token = envJson.shop_vendor_token;
    }
    if (!window.app_key) {
      window.app_key = envJson.app_key;
    }
    if (!window.userSSOUrl) {
      window.userSSOUrl = envJson.userSSOUrl;
    }

    if (window.debuglog) window.debuglog(`MATCH---------- ${this.props.match.params.keyword}`);
  }

  componentDidMount = () => {
    if (window.debuglog){
        window.debuglog('DEBUG CommonPage componentDidMount');
    }
    this.getModuleData();
    overscroll(document.querySelector('#page'));
    console.log(this.props.match.path)
  };

getModuleData(get_from) {
    console.log("getModuleData 1")
    let userInfo = null;
    if (!window.is_not_auth_login && !window.user_auth_token) {
      console.log("getModuleData 2")
      userInfo =  getUserInfo(true, false);
    }
    console.log("getModuleData 3")
    if (userInfo) {
      window.user_auth_token = userInfo.token.paperlessEc.token;
    }
    if (get_from === 'from_pull_update' && window.onRefresh) {
      window.onRefresh(this);
    }
    const id = this.props.match.params.id ? this.props.match.params.id : 0;
    const product_id = this.props.match.params.product_id ? this.props.match.params.product_id : 0;
    const article_id = this.props.match.params.article_id ? this.props.match.params.article_id : 0;
    const keyword = this.props.match.params.keyword ? this.props.match.params.keyword : '';
    let fetchUrl = (window.moduleFetchUrl || this.state.moduleFetchUrl) + window.app_name_by_domain;
    fetchUrl += `?id=${id}&product_id=${product_id}&article_id=${article_id}&keyword=${keyword}`;
    let headers = new Headers();
    if (window.app_key) {
      headers.append('App-Key', window.app_key);
    }
    if (typeof window.shop_vendor_token != "undefined") {
      headers.append('shop-vendor-token', window.shop_vendor_token);
    }
    if (window.user_auth_token) {
      UtilFetch.get(window.userSSOUrl + window.user_auth_token, null, headers, false)
        .then((res) => {
          if (res.code !== 0) {
            console.error(res.message);
          }
        });
      headers.append('HK-Auth-Token', window.user_auth_token);
    }
    headers.append('Content-Type', 'application/json');
    // 如果存在缓存就使用缓存
    if (!window.pre_load_page_cache) {
      window.pre_load_page_cache = {};
    }
    console.log("getModuleData 4")
    if (!isPathComplicated(this.props.match.path) &&
      window.pre_load_page_cache[this.props.match.path] &&
      get_from !== 'from_pull_update'
    ) {
      console.log("getModuleData 5")
      // 简单页面并且已缓存
      this.setState({ page_module_data: window.pre_load_page_cache[this.props.match.path] });

    }
    console.log("getModuleData 6")
    this.fetchOnePageModuleData(fetchUrl, headers, this.props.data, this.props.match.path,this.state.is_cdn_cache, this.state.is_user_auth, (res, path) => {
      if (!isPathComplicated(this.props.match.path)) {
        // 简单页面才缓存
        window.pre_load_page_cache[path] = res.data;
      }
      this.setState({ page_module_data: res.data });
    });
    console.log("getModuleData 8")
    fetchUrl += '&pre_load_page_cache=1';
    this.setPrePages2Cache(fetchUrl, headers, (res, path) => {
      window.pre_load_page_cache[path] = res.data;
    });
  }

  fetchOnePageModuleData = (fetchUrl, headers, props_data, path,is_cdn_cache, is_user_auth, callback) => {
    let modules = [];
    let self = this;
    //"project_name":"business","module_name":"Carousel","page_name":"index","position":"1563956494"
    Object.values(props_data)
      .map((part_modules) => {
        part_modules.map((items) => {
          Object.values(items)
            .map((json_items) => {
              Object.values(json_items)
                .map((json_item) => {
                  if (self.getRequest() === false) {
                    json_item.module_data = {};
                  }
                  modules.push([ json_item.project_name, json_item.module_name, json_item.page_name, json_item.position ]);
                  return json_item;
                });
              return json_items;
            });
          return items;
        });
        return part_modules;
      });
    let formData = {
      module_list: JSON.stringify(modules),
      is_advance: 0,
    };
    const prop_modules = this.props.data;
    console.log('fetchUrl', fetchUrl);
    var newHeader = new Headers();
    headers.forEach((val,key) => {
      newHeader.append(key,val);
    })
    if (!is_cdn_cache) {
      newHeader.append("Cache-Control", "no-cache")
    }
    let authHeader = new Headers();
    newHeader.forEach((val,key) => {
      if(is_user_auth){
        authHeader.append(key,val);
      }else{
        if(key != 'hk-auth-token'){
          authHeader.append(key,val);
        }
      }
    })
    UtilFetch.get(fetchUrl, formData, authHeader, false)
      .then((res) => {
        console.log(res);
        // 重新设计 this.props.data 中module_data数据，防止页面返回的时候读取的默认数据出现闪烁
        Object.values(prop_modules)
          .map(
            (part_modules, page_part) => {
              Object.values(part_modules)
                .map((items, i) => {
                  Object.values(items)
                    .map((json_items, type_key) => {
                      Object.keys(json_items, (j) => {
                        self.modProps(page_part, i, type_key, j, res.data);
                      });
                      return json_items;
                    });
                  return items;
                });
              return part_modules;
            },
          );
        callback(res, path);
      });
  };

  setPrePages2Cache = (fetchUrl, headers, callback) => {
    if (!window.pageApiData) {
      return false;
    }
    Object.values(window.pageApiData)
      .map((page_info) => {
        if (page_info.is_pre_load) {
          // fetch页面module data并写入本地
          if (this.props.match.path !== page_info.path && !window.pre_load_page_cache[page_info.path]) {
            // 请求的不是当前遍历的router page并且没缓存
            this.fetchOnePageModuleData(fetchUrl, headers, page_info.modules, page_info.path, page_info.is_cdn_cache, page_info.is_user_auth, callback);
          }
          return page_info;
        }
        return page_info;
      });
  };

  getRequest = () => {
    const url = location.search;
    if (url.indexOf('?') !== -1) {
      const str = url.substr(1);
      const strs = str.split('=');
      if (strs[0] === 'module_data_debug') {
        return true;
      }
    }
    return false;
  };

  modProps = (page_part, i, type_key, j, val) => {
    const item = this.props.data[page_part][i][type_key][j];
    const key = `${item.project_name}/${item.module_name}/${item.page_name}/${item.position}`;
    this.state.data[page_part][i][type_key][j].module_data = val[key];
  };

  getDetail = (sectionItem) => {
    return Object.values(sectionItem)
      .map((cn, j) => {
        const projectName = cn.project_name;
        const moduleName = cn.module_name;
        const key = `${cn.project_name}/${cn.module_name}/${cn.page_name}/${cn.position}`;
        let moduleData = cn.module_data;
        if (this.state.page_module_data && this.state.page_module_data[key]) {
          moduleData = this.state.page_module_data[key];
        }
        return (
          cre(B[projectName][moduleName], { key: j, 'data-key': j, module_data: moduleData }, null)
        );
      });
  };

  getColContent = (section, height, fadeIn, isPullToRefresh) => {
    // console.log(isPullToRefresh)
    return Object.values(section)
      .map((sectionItem, j) => {
        const className = Object.keys(section)[j];
        return (
          <div
            key={`module-${className}`}
            className={`${className}`}
            data-key={`module-${className}`}
            // style={{ minHeight: className === 'main' ? height : 'auto', height: (className === 'main' && !isPullToRefresh) ? height : 'auto', overflowY: 'auto' }}
            style={{
              minHeight: className === 'main' ? height : 'auto',
              height: (className === 'main' && !isPullToRefresh) ? height : 'auto', overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {this.getDetail(sectionItem)}
          </div >
        );
      });
  };

  getSections = (sections, height, fadeIn, isPullToRefresh) => {
    return sections.length && sections.map((section, i) => {
      return this.colMain(section, i, height, fadeIn, isPullToRefresh);
    });
  };

  colMain = (section, i, height, fadeIn, isPullToRefresh) => {
    if (Object.values(section).length > 1) {
      return cre('div', {
        className: 'col_main',
        key: `col_main-${i}`,
        'data-key': `col_main-${i}`,
      }, this.getColContent(section, height, null, isPullToRefresh));
    }
    return this.getColContent(section, height, fadeIn, isPullToRefresh);
  };

  setLayout = (data) => {
    return Object.keys(data)
      .map((layout) => {
        return (
          <div id={layout} key={`layout-${layout}`} data-key={`layout-${layout}`}>
            {layout === 'bd' ? (
              this.state.is_pull_update ? (
                <PullToRefresh
                  distanceToRefresh={35}
                  indicator={{ activate: '鬆開立即刷新' }}
                  onRefresh={() => {
                    this.getModuleData('from_pull_update');
                  }}
                  style={{
                    height: `calc(var(--vh, 1vh) * 100${(data.hd && data.hd.length) ? ' - 44px' : ''}${(data.ft && data.ft.length) ? ' - var(--tabsh)' : ''})`,
                    overflow: 'hidden',
                    overflowY: 'auto',
                    WebkitOverflowScrolling: 'touch',
                  }}
                >
                  {data[layout].length ? this.getSections(data[layout], `calc(var(--vh, 1vh) * 100${(data.hd && data.hd.length) ? ' - 44px' : ''}${(data.ft && data.ft.length) ? ' - var(--tabsh)' : ''})`, 'fadeIn', 'PullToRefresh') : null}
                </PullToRefresh>
              ) : data[layout].length ? this.getSections(data[layout], `calc(var(--vh, 1vh) * 100${(data.hd && data.hd.length) ? ' - 44px' : ''}${(data.ft && data.ft.length) ? ' - var(--tabsh)' : ''})`, 'fadeIn') : null
            ) : (data[layout].length ? this.getSections(data[layout]) : null)
            }
          </div>
        );
      });
  };

  componentWillUnmount() {
    if (this.fEInv) clearInterval(this.fEInv);
  }

  render() {
    return (
      <div id="page">
        {this.setLayout(this.state.data)}
      </div>
    );
  }
}

export default withRouter(CommonPage);
