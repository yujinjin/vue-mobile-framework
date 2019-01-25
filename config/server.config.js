const path = require('path'),
    webpack = require('webpack'),
    HtmlWebpackPlugin = require("html-webpack-plugin"),
    FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin'),
    Notifier = require('node-notifier'),
    HappyPack = require('happypack'),
    os = require('os'),
    ip = require('ip').address(),
    happyThreadPool = HappyPack.ThreadPool({size: os.cpus().length}),
    VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
    mode: "development",
    target: "web", // 编译以在类似浏览器的环境中使用（默认）
    context: path.resolve(__dirname, '../'), // 基本目录，一个绝对路径，用于从配置中解析入口点和加载器。
    devtool: "#source-map", // 是否以及如何生成源映射
    performance: {
        hints: false // 打开/关闭提示
    },
    entry: {
        index: "./src/js/entrance.js"
    },
    output: {
        path: path.resolve(__dirname, '../', 'dist'),
        publicPath: "/",
        filename: "build.js"
    },
    module: {
        rules: [{
            test: /\.js(x)*$/,
            // use: ['babel-loader'],
            use: "happypack/loader?id=js",
            exclude: file => (/node_modules/.test(file) && !/\.vue\.js/.test(file)),
            include: [path.resolve(__dirname, '../', 'src'), path.resolve(__dirname, '../', 'test')]
        }, {
            test: /\.vue$/,
            use: [{
                loader: "vue-loader",
                options: {
                    transformAssetUrls: {
                        video: ['src', 'poster'],
                        source: 'src',
                        img: 'src',
                        image: 'xlink:href'
                    },
                    hotReload: true, // 是否使用 webpack 的模块热替换在浏览器中应用变更而不重载整个页面。 用这个选项 (值设为 false) 在开发环境下关闭热重载特性。
                    productionMode: false // 是否生产环境
                }
            }],
            include: [path.resolve(__dirname, '../', 'src'), path.resolve(__dirname, '../', 'test')]
        }, {
            test: /\.(sa|sc)ss$/,
            use: ['vue-style-loader',
            {
                loader: 'css-loader'
            }, {
                loader: 'postcss-loader',
                options: {
                    sourceMap: true
                }
            }, {
                loader: 'sass-loader',
                options: {
                    indentedSyntax: true // 使用基于缩进的 sass 语法
                }
            }],
        }, {
            test: /\.css$/,
            use: ['vue-style-loader',
            {
                loader: 'css-loader'
            }, {
                loader: 'postcss-loader',
                options: {
                    sourceMap: true
                }
            }],
        }, {
            test: /\.less/,
            use: ['vue-style-loader',
            {
                loader: 'css-loader'
            }, {
                loader: 'postcss-loader',
                options: {
                    sourceMap: true
                }
            }, {
                loader: 'less-loader',
                options: {
                    javascriptEnabled: true
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
                    name: 'imgs/[name].[ext]'
                }
            }]
        }, {
            test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
            loader: 'url-loader',
            options: {
                limit: 10000,
                name: 'media/[name].[ext]'
            }
        }, {
            test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
            use: [{
                loader: "url-loader",
                options: {
                    limit: 5000,
                    name: 'fonts/[name].[ext]'
                }
            }]
        }]
    },
    plugins: [
        // new CleanWebpackPlugin(['dist/*'], {
        //     root: path.resolve(__dirname, '../'),
        //     verbose: true, //开启控制台输出
        //     dry: false //启用删除文件
        // }),
        new VueLoaderPlugin(), // 将定义过的其它规则复制并应用到 .vue 文件里相应语言的块
        //显示构建进度
        new webpack.ProgressPlugin(),
        // 开启 Scope Hoisting
        new webpack.optimize.ModuleConcatenationPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV),
                NODE_RUN: true
            }
        }),
        new webpack.optimize.RuntimeChunkPlugin({
			name: "manifest"
		}),
        // 自动加载模块，而不必到处 import 或 require
        new webpack.ProvidePlugin({
            config: path.resolve(__dirname, '../', "src/js/config/" + process.env.NODE_ENV + ".js"),
            app: [path.resolve(__dirname, '../', "src/js/app.js"), "default"]
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'src/index.html',
            favicon: "src/imgs/favicon/favicon.ico",
            inject: true,
            hash: true, // 防止缓存
            // vendor: './vendor.dll.js', //与dll配置文件中output.fileName对齐
            chunks: ['manifest', 'index'],
            chunksSortMode: 'none', //如果使用webpack4将该配置项设置为'none'
            minify: {
                removeAttributeQuotes: true, //压缩 去掉引号
                removeComments: true, //移除HTML中的注释
                collapseWhitespace: false, //删除空白符与换行符
            }
        }),
        new HappyPack({
			id: 'js',
			loaders: ['babel-loader?cacheDirectory=true'],
			threadPool: happyThreadPool,
			verbose: true
        }),
        // new HappyPack({
		// 	id: 'styles',
		// 	loaders: [
        //         'vue-style-loader',
        //         {
        //             loader: 'css-loader',
        //             options: {
        //                 minimize: false
        //             }
        //         }, {
        //             loader: 'postcss-loader',
        //             options: {
        //                 sourceMap: true
        //             }
        //         }, {
        //             loader: 'sass-loader',
        //             options: {
        //                 indentedSyntax: true // 使用基于缩进的 sass 语法
        //             }
        //         }
        //     ],
		// 	threadPool: happyThreadPool,
		// 	verbose: true
        // }),
        // new HappyPack({
		// 	id: 'less',
		// 	loaders: [
        //         'vue-style-loader',
        //         {
        //             loader: 'css-loader',
        //             options: {
        //                 minimize: false
        //             }
        //         }, {
        //             loader: 'postcss-loader',
        //             options: {
        //                 sourceMap: true
        //             }
        //         }, {
        //             loader: 'less-loader',
        //             options: {
        //                 javascriptEnabled: true
        //             }
        //         }
        //     ],
		// 	threadPool: happyThreadPool,
		// 	verbose: true
		// }),
        // banner注释 
        new webpack.BannerPlugin('版权所有，翻版必究'),
        // new FriendlyErrorsPlugin(),
        new FriendlyErrorsPlugin({
            compilationSuccessInfo: {
                messages: ["Your application is running here"],
            },
			onErrors: (severity, errors) => {
		      	if (severity != 'error') {
		        	return;
		      	}
		      	const error = errors[0];
                Notifier.notify({
		            title: 'Webpack error',
		            message: severity + ': ' + error.name,
		            subtitle: error.file || ''
		        })
		    }
        }),
        // 用于固定模块id 防止调整顺序对于id进行重新打包
        new webpack.HashedModuleIdsPlugin(),
        // devServer 使用热更新 hot 时需要使用插件
        new webpack.HotModuleReplacementPlugin(),
        // 模块热更新
        new webpack.NamedModulesPlugin(),
    ],
    resolve: {
        extensions: ['.js', '.vue', '.jsx', '.less', '.scss', '.css'], //后缀名自动补全
        alias: {
            'vue': 'vue/dist/vue.js',
            '@src': path.resolve(__dirname, '../', 'src/'),
            '@js': path.resolve(__dirname, '../', 'src/js'),
            '@imgs': path.resolve(__dirname, '../', 'src/imgs/'), // 图片资源
            '@style': path.resolve(__dirname, '../', 'src/style'), // 视图
            '@views': path.resolve(__dirname, '../', 'src/views'), // 视图
            '@components': path.resolve(__dirname, '../', 'src/views/components/') // 视图内的组件
        }
    },
    devServer: {
        clientLogLevel: 'info', //阻止打印那种搞乱七八糟的控制台信息
        inline: true, // 打包后加入一个websocket客户端,自动刷新
        contentBase: path.resolve(__dirname, '../', 'dist'), // 静态服务器的根目录，可以访问到不通过webpack处理的文件。
        compress: true, // 服务器返回浏览器的时候是否启动gzip压缩
        host: ip,
        port: "8080", // 端口
        open: false, // 开启浏览器
        disableHostCheck: true,
        historyApiFallback: true,
        // openPage: 'index.html', //默认打开的页面
        overlay: {
            warnings: true,
            errors: true
        }, // 在浏览器上全屏显示编译的errors或warnings。
        publicPath: '/',
        quiet: false, // necessary for FriendlyErrorsPlugin // 终端输出的只有初始启动信息。 webpack 的警告和错误是不输出到终端的
        watchOptions: {
            poll: true
        }
    },
    watch: true, // 开启监听文件更改，自动刷新
    watchOptions: {
        ignored: /node_modules/, //忽略不用监听变更的目录
        aggregateTimeout: 2000, //防止重复保存频繁重新编译,500毫秒内重复保存不打包
        poll: 2000 //每秒询问的文件变更的次数
    }
}