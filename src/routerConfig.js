// 变量名 routerConfig 为 iceworks 检测关键字，请不要修改名称
var routeConfigRewrite = require('./router_config.json');
const routerConfig = global.pageApiData ? global.pageApiData : (window.pageApiData ? window.pageApiData : routeConfigRewrite);
export default routerConfig;
