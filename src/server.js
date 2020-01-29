import React from 'react';
// 载入默认全局样式 normalize 、.clearfix 和一些 mixin 方法等
import '@alifd/next/reset.scss';
import Router from './router';
import { StaticRouter } from 'react-router';
import ReactDOMServer from 'react-dom/server';
let location = global.pageLocation;
print(ReactDOMServer.renderToString(<StaticRouter location={location}>{Router}</StaticRouter>));