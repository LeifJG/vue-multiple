const { join, resolve } = require('path')
const webpack = require('webpack')
const glob = require('glob')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin')

const extractCSS = new ExtractTextPlugin({
  filename: 'assets/css/[name].css',
  allChunks: true
})
const extractLESS = new ExtractTextPlugin({
  filename: 'assets/css/[name].css',
  allChunks: true
})

const entries = {}
const chunks = []
glob.sync('./src/pages/**/app.js').forEach(path => {
  const chunk = path.split('./src/pages/')[1].split('/app.js')[0]
  entries[chunk] = path
  chunks.push(chunk)
})

const config = {
  entry: entries,
  output: {
    path: resolve(__dirname, './dist'),
    filename: 'assets/js/[name].js',
    publicPath: '/'
  },
  resolve: {
    extensions: ['.js', '.vue'],
    alias: {
      assets: join(__dirname, '/src/assets'),
      components: join(__dirname, '/src/components'),
      root: join(__dirname, 'node_modules')
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: [
          'cache-loader',
          {
            loader: 'vue-loader',
            options: {
              loaders: {
                css: ExtractTextPlugin.extract({
                  use: ['cache-loader', 'css-loader'],
                  fallback: 'style-loader'
                }),
                less: ExtractTextPlugin.extract({
                  use: ['cache-loader', 'css-loader', 'postcss-loader', 'less-loader'],
                  fallback: 'style-loader'
                }),
                postcss: ExtractTextPlugin.extract({
                  use: ['cache-loader', 'css-loader', 'postcss-loader'],
                  fallback: 'style-loader'
                })
              }
            }
          }
        ]
      },
      {
        test: /\.js$/,
        use: [
          'cache-loader',
          'babel-loader'
        ],
        include: resolve('src'),
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          use: ['cache-loader', 'css-loader', 'postcss-loader'],
          fallback: 'style-loader'
        })
      },
      {
        test: /\.less$/,
        use: ExtractTextPlugin.extract({
          use: ['cache-loader', 'css-loader', 'postcss-loader', 'less-loader'],
          fallback: 'style-loader'
        })
      },
      {
        test: /\.html$/,
        use: [
          'cache-loader',
          {
            loader: 'html-loader',
            options: {
              root: resolve(__dirname, 'src'),
              attrs: ['img:src', 'link:href']
            }
          }
        ]
      },
      {
        test: /\.(eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
        exclude: /favicon\.png$/,
        use: [
          'cache-loader',
          {
            loader: 'url-loader',
            options: {
              limit: 80000,
              name:'fonts/[name].[md5:hash:hex:7].[ext]'
            }
          }
        ]
      },
      {
        test: /\.(png|jpg|jpeg|gif)(\?.+)?$/,
        exclude: /favicon\.png$/,
        use: [
          'cache-loader',
          {
            loader: 'url-loader',
            options: {
              limit: 800000,
              name:'img/[name].[md5:hash:hex:7].[ext]'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new CommonsChunkPlugin({
      name: 'vendors',
      filename: 'assets/js/vendors.js',
      chunks: chunks,
      minChunks: chunks.length
    }),
    extractLESS,
    extractCSS
  ],
  devServer: {
    //host: '192.168.1.48',
    host: '192.168.1.50',
    //host: 'localhost',
    port: 8080,
    historyApiFallback: false,
    noInfo: true,
    disableHostCheck: true,
    proxy: {
      '/api': {
        target: 'http://192.168.1.110:8081',
        changeOrigin: true,
        pathRewrite: { '^/api': '' }
      }
    }
  },
  devtool: '#eval-source-map'
}

glob.sync('./src/pages/**/*.html').forEach(path => {
  const chunk = path.split('./src/pages/')[1].split('/app.html')[0]
  const filename = chunk + '.html'
  const htmlConf = {
    filename: filename,
    template: path,
    inject: 'body',
    favicon: './src/assets/img/logo.jpg',
    hash: process.env.NODE_ENV === 'production',
    chunks: ['vendors', chunk]
  }
  config.plugins.push(new HtmlWebpackPlugin(htmlConf))
})

module.exports = config

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map'
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ])
}
