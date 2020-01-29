var path = require('path');
var config = {
  devServer: {
    historyApiFallback: true,    
  }
};
var libraryBlock = false;
process.argv.forEach(function (val, index, array) {
  var params =  val.split(":");
  if(params.length === 2 && "library" === params[0] && 'true'===params[1]){
    libraryBlock = true;
    return;
  }
});
if(true === libraryBlock){
  config.entry = {"block":"src/Block/index.js"};
  config.output = {
    library: 'LIBRARY_BLOCKS',
    path: path.resolve(__dirname, 'build/library'),
  };
}
module.exports = config;