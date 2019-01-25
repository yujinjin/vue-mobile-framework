const path = require('path'),
    webpack = require('webpack'),
    MiniCssExtractPlugin = require('mini-css-extract-plugin'),
    env = process.env.NODE_ENV === 'prd' ? 'production' : 'development',
    sourceMap = (env === 'production'),
    FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin'),
    CleanWebpackPlugin = require('clean-webpack-plugin'),
    VueLoaderPlugin = require('vue-loader/lib/plugin');

const config = {
    mode: env, // 通过设定mode参数设置为development，production或者none，您可以启用对应于每个环境的WebPack内置的优化。默认值为production。TODO: 判断实现
    target: "web", // 编译以在类似浏览器的环境中使用（默认）
    context: path.resolve(__dirname, '../'), // 基本目录，一个绝对路径，用于从配置中解析入口点和加载器。
    devtool: false, // 是否以及如何生成源映射
    entry: {
        index: "src/js/index.js"
    },
    output: {
        path: path.resolve(__dirname, '../', 'build'),
        publicPath: "./build/",
        filename: "build.[hash].js"
    },
    optimization: {
        minimize: sourceMap, // 是否进行代码压缩
        runtimeChunk: {
            name: "manifest"
        }, // 打出来的包很大，肯定是一些webpack的运行文件导致，这里创建要为所有生成的块共享的运行时文件。
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                // 提取 node_modules 中代码
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendors",
                    chunks: "all"
                }
            }
        } // 默认情况下，webpack v4 +为动态导入的模块提供了开箱即用的新常见块策略
    },
    externals: [],
    module: {
        rules: [{
            test: /\.js(x)*$/,
            user: 'babel-loader',
            exclude: /^node_modules$/,
            include: [path.resolve(__dirname, '../', 'src'), path.resolve(__dirname, '../', 'test')]
        }, {
            test: /\.vue$/,
            use: {
                loader: "vue-loader",
                options: {
                    transformAssetUrls: {
                        video: ['src', 'poster'],
                        source: 'src',
                        img: 'src',
                        image: 'xlink:href'
                    },
                    hotReload: false, // 是否使用 webpack 的模块热替换在浏览器中应用变更而不重载整个页面。 用这个选项 (值设为 false) 在开发环境下关闭热重载特性。
                    productionMode: sourceMap // 是否生产环境
                }
            }
        }, {
            test: /\.(sa|sc|c)ss$/,
            user: [{
                loader: MiniCssExtractPlugin.loader,
                options: {
                    publicPath: "./"
                }
            }, {
                loader: 'css-loader',
                options: {
                    modules: true,
                    localIdentName: '[local]_[hash:base64:5]' // class的名称
                }
            }, {
                loader: 'postcss-loader',
                options: {
                    sourceMap: sourceMap
                }
            }, {
                loader: 'sass-loader'
            }]
        }, {
            test: /\.less/,
            use: [{
                loader: MiniCssExtractPlugin.loader,
                options: {
                    publicPath: "./"
                }
            }, {
                loader: 'css-loader',
                options: {
                    modules: true,
                    localIdentName: '[local]_[hash:base64:5]' // class的名称
                }
            }, {
                loader: 'postcss-loader',
                options: {
                    sourceMap: sourceMap
                }
            }, {
                loader: 'less-loader',
                options: {
                    indentedSyntax: true // 使用基于缩进的 sass 语法
                }
            }]
        }, {
            test: /\.svg$/,
            include: [path.resolve(__dirname, '../', 'src/js/components/icons')],
            use: [{
                loader: 'svg-sprite-loader',
                options: {
                    symbolId: 'icon-[name]'
                }
            }]
        }, {
            test: /\.(png|jpe?g|gif|svg|ico)(\?.*)?$/,
            exclude: [path.resolve(__dirname, '../', 'src/js/components/icons')],
            use: [{
                loader: "url-loader",
                options: {
                    limit: 10000,
                    name: 'imgs/[name].[hash:7].[ext]',
                    publicPath: "./"
                }
            }]
        }, {
            test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
            loader: 'url-loader',
            options: {
                limit: 10000,
                name: 'media/name.[hash:7].[ext]'
            }
        }, {
            test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
            use: [{
                loader: "url-loader",
                options: {
                    limit: 5000,
                    name: 'fonts/[name].[hash:7].[ext]'
                }
            }]
        }]
    },
    plugins: [
        new VueLoaderPlugin(), // 将定义过的其它规则复制并应用到 .vue 文件里相应语言的块
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: '[name].[hash].css', // devMode ? '[name].css' : 
            chunkFilename: '[id].[hash].css', // devMode ? '[id].css' : ,
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV),
                NODE_RUN: false
            },
            //根据环境加载JS
            config: JSON.stringify(require(path.resolve(__dirname, '../', "src/js/config/" + process.env.NODE_ENV + ".js")))
        }),
        new CleanWebpackPlugin(['build/*'], {
            root: path.resolve(__dirname, '../'),
            verbose: true, //开启控制台输出
            dry: false //启用删除文件
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'src/index.html',
            favicon: "src/imgs/site.ico",
            inject: true,
            hash: true, // 防止缓存
            vendor: './vendor.dll.js', //与dll配置文件中output.fileName对齐
            chunksSortMode: 'none', //如果使用webpack4将该配置项设置为'none'
            minify: {
                removeAttributeQuotes: true, //压缩 去掉引号
                removeComments: true, //移除HTML中的注释
                collapseWhitespace: false, //删除空白符与换行符
            }
        }),
        // banner注释 
        new webpack.BannerPlugin('版权所有，翻版必究'),
        // 开启 Scope Hoisting
        new webpack.optimize.ModuleConcatenationPlugin(),
        //显示构建进度
        new webpack.ProgressPlugin(),
        new FriendlyErrorsPlugin(),
        // 用于固定模块id 防止调整顺序对于id进行重新打包
        new webpack.HashedModuleIdsPlugin()
    ],
    resolve: {
        extensions: ['.js', '.vue', '.jsx', '.less', '.scss', '.css'], //后缀名自动补全
        alias: {
            '@src': path.resolve(__dirname, '../', 'src/'),
            '@js': path.resolve(__dirname, '../', 'src/js'),
            '@imgs': path.resolve(__dirname, '../', 'src/imgs/'), // 图片资源
            '@style': path.resolve(__dirname, '../', 'src/style'), // 视图
            '@views': path.resolve(__dirname, '../', 'src/views'), // 视图
            '@components': path.resolve(__dirname, '../', 'src/views/components/') // 视图内的组件
        }
    }
}
module.exports = config;