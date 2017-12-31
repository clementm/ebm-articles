const path = require('path');
const env = process.env.NODE_ENV;

const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
	entry: './frontend/index.js',
	output: {
		filename: 'bundle.js',
		path: path.join(__dirname, './public')
	},
	resolve: {
		modules: [ path.resolve('./node_modules'), path.resolve('./frontend') ]
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use:
					env === 'production'
						? ExtractTextPlugin.extract({
								fallback: 'style-loader',
								use: [ 'css-loader' ]
							})
						: [ 'style-loader', 'css-loader' ]
			},
			{
				test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
				loader: 'url-loader',
				options: {
					limit: 10000
				}
			},
			{
				test: /\.js$/,
				exclude: /(node_modules)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: [ 'babel-preset-env' ]
					}
				}
			}
		]
	},
	plugins:
		env === 'production'
			? [
					new ExtractTextPlugin({
						filename: 'bundle.css'
					})
				]
			: [],
	devServer: {
		contentBase: path.join(__dirname, 'public'),
		historyApiFallback: true,
		proxy: {
			'/api': {
				target: 'http://localhost:7000',
				secure: false
			}
		}
	}
};
