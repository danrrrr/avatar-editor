const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const OpenBrowserPlugin = require('open-browser-webpack-plugin'); // 启动后自动打开浏览器
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
module.exports = {
  entry: [
    'react-hot-loader/patch',
    './src/index.js'
  ],
  output: {
    path: path.resolve(__dirname, 'build'), // 打包文件的输出绝对路径
    filename: 'bundle.js', // 打包文件名
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html'
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new OpenBrowserPlugin({
      url: 'http://localhost:5000'
    }),
    // new BundleAnalyzerPlugin()
  ],
  devtool: 'eval-source-map',
  devServer: {
    contentBase: path.resolve(__dirname, 'build'),
    hot: true,
    port: 5000
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader?cacheDirectory',
        options: {
          presets: ['env', 'react'],
          plugins: ['react-hot-loader/babel']
        },
        exclude: /node_modules/
      },
      {
        test: /\.js$/,
        enforce: 'pre', // 加载器执行顺序(pre|post) eslint是检查代码规范应该在编译前执行
        loader: 'eslint-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(css|scss)$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1, // 查询参数 importLoaders，用于配置「css-loader 作用于 @import 的资源之前」有多少个 loader。
              //  // 0 => 无 loader(默认); 1 => postcss-loader; 2 => postcss-loader, sass-loader
            }
          },
          {
            loader: 'sass-loader'
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [
                require('autoprefixer'),
                require('postcss-flexbugs-fixes')
              ]
            }
          }
        ]
      },
      {
        test: /\.(gif|jpe?g|png)$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 10000, // 1w字节以下的图片会自动转成base64
          }
        }]
      },
    ]
  }
};
