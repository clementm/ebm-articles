const path = require('path');

module.exports = {
	entry: './frontend/index.js',
	output: {
		filename: 'bundle.js'
	},
	resolve: {
		modules: [ path.resolve('./node_modules'), path.resolve('./frontend') ]
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: [ 'style-loader', 'css-loader' ]
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
	devServer: {
		historyApiFallback: true,
		proxy: {
			'/api': {
				target: 'http://localhost:7000',
				secure: false
			}
		}
	}
};
