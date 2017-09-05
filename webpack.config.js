const path = require('path'),
    webpack = require('webpack'),
    NODE_ENV = process.env.NODE_ENV || "DEV", //环境类型
    NODE_RUN = process.env.NODE_RUN || "0", //是否是运行
    ROOT_PATH = path.resolve(__dirname) + "/",
    OUT_PATH = path.resolve(ROOT_PATH, 'build') + "/",
    SERVER_PATH = process.env.SERVER || "./build/", // 服务路径
    ExtractTextPlugin = require("extract-text-webpack-plugin"),
    HtmlWebpackPlugin = require("html-webpack-plugin"),
    port = "8085";
const config = {
    entry: {
        index: "./src/js/entrance.js", //[ROOT_PATH + "\\js\\entrance.js"],
        // 打包第三方库作为公共包
        commons: ['vue', 'vue-router']
    },
    output: {
        path: NODE_RUN === "0" ? path.resolve(__dirname, './build') : "/", //"./build",//"./build",//path.resolve(__dirname, './build'), //path.resolve(__dirname, './build'), //
        //publicPath路径就是你发布之后的路径，比如你想发布到你站点的/util/vue/build 目录下, 那么设置publicPath: "/util/vue/build/",此字段配置如果不正确，发布后资源定位不对，比如：css里面的精灵图路径错误
        publicPath: NODE_RUN === "0" ? "./build/" : "/", //"build/",//SERVER_PATH, //process.env.CUSTOM ? "/git/WebApp/n-build/" : "/n-build/",
        filename: NODE_RUN === "0" ? "build.[hash].js" : "build.js"
    },
    externals: [],
    module: {
        rules: [{
            test: /\.html$/,
            use: [{
                loader: 'html-loader',
                options: {
                    attrs: ['img:src', 'link:href']
                }
            }]
        }, {
            test: /\.js(x)*$/,
            exclude: /^node_modules$/,
            use: ['babel-loader']
        }, {
            test: /\.vue$/,
            use: {
        		loader: "vue-loader",
        		options: {
        			extractCSS: true,
	            	loaders: {
		                css: ExtractTextPlugin.extract({
		                    fallback: 'vue-style-loader',
			          		use: [
			            		{ loader: 'css-loader', options: { minimize: true } },
			          		]
		                }),
		                less: ExtractTextPlugin.extract({
		                    fallback: 'vue-style-loader',
				          	use: [
				            	{ loader: 'css-loader', options: { minimize: true } },
				            	"less-loader"
				          	]
		                }),
		                scss: ExtractTextPlugin.extract({
		                    fallback: 'vue-style-loader',
			          		use: [
			            		{ loader: 'css-loader', options: { minimize: true } },
			            		'sass-loader'
			          		]
		                }),
	            	}
        		}
    		}
        }, {
            test: /\.css$/,
            exclude: /^node_modules$/,
            use: ExtractTextPlugin.extract({
          		fallback: "style-loader",
          		use: [
            		{ loader: 'css-loader', options: { minimize: true } },
          		]
        	})
        }, {
            test: /\.less/,
            exclude: /^node_modules$/,
            use: ExtractTextPlugin.extract({
	          	fallback: "style-loader",
	          	use: [
	            	{ loader: 'css-loader', options: { minimize: true } },
	            	"less-loader"
	          	]
	        })
        }, {
            test: /\.scss/,
            exclude: /^node_modules$/,
            use: ExtractTextPlugin.extract({
          		fallback: "style-loader",
          		use: [
            		{ loader: 'css-loader', options: { minimize: true } },
            		'sass-loader'
          		]
        	})
        }, {
            test: /\.(png|jpe?g|gif|svg|ico)(\?.*)?$/,
            use: [{
                loader: "url-loader",
                options: {
                    limit: 10000,
                    name: 'imgs/[name].[hash:7].[ext]'
                }
            }]
        }, {
            test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
            use: [{
                loader: "url-loader",
                options: {
                    limit: 5000,
                    name: 'fonts/[name].[hStyleExtHtmlWebpackPluginash:7].[ext]'
                }
            }]
        }]
    },
    plugins: [
        new ExtractTextPlugin({
			filename: NODE_RUN === "0" ? "style.[hash].[name].css" : "style.[name].css",
			allChunks: true
		}), //必须要allChunks设置为true,不然webpack编译会报错
        new HtmlWebpackPlugin({
            filename: "../index.html", //生成的html存放路径，相对于 path
            template: './src/index.html', //html模板路径
            favicon: "./src/imgs/favicon/favicon.ico",
            chunks: ['commons', 'index'],
            inject: true, //允许插件修改哪些内容，包括head与body
            minify: { //压缩HTML文件
                removeComments: true, //移除HTML中的注释
                collapseWhitespace: false, //删除空白符与换行符
                collapseInlineTagWhitespace: true,
                removeRedundantAttributes: true
            }
        }),
        /*
              使用CommonsChunkPlugin插件来处理重复代码
              因为vendor.js和index.js都引用了spa-history, 如果不处理的话, 两个文件里都会有spa-history包的代码,
            我们用CommonsChunkPlugin插件来使共同引用的文件只打包进vendor.js
        */
        new webpack.optimize.CommonsChunkPlugin({
            name: "commons",
            filename: NODE_RUN === "0" ? "common.[hash].js" : "common.js",
            chunks: ['index'], //提取哪些模块共有的部分
            minChunks: 1
//          minChunks (module) {
//              return module.context && module.context.indexOf('node_modules') >= 0;
//          }
        }),
        //自动分析重用的模块并且打包成单独的文件
        new webpack.ProvidePlugin({
            //根据环境加载JS
            config: ROOT_PATH + "/src/js/config/" + NODE_ENV
        }),
        //显示构建进度
        new webpack.ProgressPlugin(),
        new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: (NODE_RUN === "0" ? '"production"' : '""'), // 设置生产版本环境，目前只要是打包环境都算是生成环境
				TYPE: '"' + NODE_ENV + '"', //设置当前环境类型
				NODE_RUN: NODE_RUN //是否是运行状态
			}
		}),
    ],
    resolve: {
        extensions: ['.js', '.vue', '.jsx', '.less', '.scss', '.css'], //后缀名自动补全
        alias: {
        	zepto: ROOT_PATH + "/src/js/lib/zepto"
        }
    }
}
var fileSystem = require('fs');
//打包状态
if (NODE_RUN === "0") {
    config.devtool = false;
	config.performance = {
		hints: false
	};
	config.plugins = (config.plugins || []).concat([
//		new webpack.DefinePlugin({
//			'process.env': {
//				NODE_ENV: '"production"'
//			}
//		}),
		new webpack.optimize.UglifyJsPlugin({
			compress: {
		        warnings: false,
		        screw_ie8: true,
                conditionals: true,
                unused: true,
                comparisons: true,
                sequences: true,
                dead_code: true,
                evaluate: true,
                if_return: true,
                join_vars: true
		    },
		    output: {
		        comments: false
		    },
			sourceMap: false
		})
	]);
	//非开发环境下要清空 output 文件夹下的文件
	var dirArray = [];
	//递归删文件
	var clearOutPutDir = function(path) {
		if(fileSystem.existsSync(path)) {
			var dirList = fileSystem.readdirSync(path);
			dirList.forEach(function(fileName) {
				if(fileSystem.statSync(path + fileName).isDirectory()) {
					console.info("目录:" + path + fileName);
					// 目录
					dirArray.push(path + fileName);
					clearOutPutDir(path + fileName + "/");
				} else {
					console.info("文件:" + path + fileName);
					fileSystem.unlinkSync(path + fileName);
				}
			});
		};
	}
	clearOutPutDir(OUT_PATH);
	for(var i = dirArray.length - 1, j = 0; i >= j; i--) {
		fileSystem.rmdirSync(dirArray[i]);
	}
} else {
	config.devtool = '#cheap-module-eval-source-map';
	config.performance = {
		hints: "warning"
	};
	config.plugins = (config.plugins || []).concat([
		new (require('friendly-errors-webpack-plugin')),
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NoEmitOnErrorsPlugin()
	]);
	// 热替换
	Object.keys(config.entry).forEach(function(name) {
	    config.entry[name] = [
	        `webpack-dev-server/client?http://localhost:${port}/`,
	        "webpack/hot/dev-server"
	    ].concat(config.entry[name])
	});
	var opn = require('opn');
	var url = `http://localhost:${port}/`;
	var webpackDevServer = require('webpack-dev-server');
	var compiler = webpack(config);
	var server = new webpackDevServer(compiler, {
		//hot: true,
    	quiet: true,
    	historyApiFallback: true, //配置为true, 当访问的文件不存在时, 返回根目录下的index.html文件
        noInfo: true,
        disableHostCheck: true, // 禁用服务检查
    	publicPath: "/" //TODO:必须是output中的publicPath保持一致
	});
	server.listen(port, "0.0.0.0");
	// 打包完毕后启动浏览器
	server.middleware.waitUntilValid(function() {
	    console.log(`> Listening at ${url}`);
	    opn(`${url}`);
	});
}
module.exports = config;