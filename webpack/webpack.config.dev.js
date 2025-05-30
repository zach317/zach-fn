const path = require('path')

module.exports = {
  mode: 'development',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module:{
    rules:[
      {
        test:/\.css$/,
        use:['style-loader','css-loader','postcss-loader']
      },
      {
        test:/\.less$/,
        use:['style-loader','css-loader','postcss-loader','less-loader']
      }
    ]
  },
  devServer:{
    host:'127.0.0.1',
    port:9000,
    open:true,
    hot:true,
  }
}