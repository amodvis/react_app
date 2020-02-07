var path = require('path');
var libraryBlock = false;
process.argv.forEach(function (val, index, array) {
  var params =  val.split(":");
  if(params.length === 2 && "library" === params[0] && 'true'===params[1]){
    libraryBlock = true;
    return;
  }
});

var entry = {
  "index": "src/index.js",
  "server": "src/server.js"
};

if(libraryBlock == true){
  entry = {"block":"src/Block/index.js"};
}
module.exports = {
  outputDir: 'dist',
  vendor: false,
  entry : entry,
  publicPath:"/",
  devServer: {
    historyApiFallback: true
  },
  plugins: [
    ['ice-plugin-fusion', {
      themePackage: '@icedesign/theme',
    }],
    ['ice-plugin-moment-locales', {
      locales: ['zh-cn'],
    }],
  ],
  chainWebpack:(config) => {
    if(libraryBlock == true){
      // 修改 webpack output.path
      config.output.path(path.resolve(__dirname, 'build/library'));
      config.output.library("LIBRARY_BLOCKS");
    }else{
      config.output.path(path.resolve(__dirname, 'build'));
    }
  }
};
