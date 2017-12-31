const path = require('path');
const env = process.env.NODE_ENV;

const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
	// Point d'entrée du projet
	entry: './frontend/index.js',
	// Résultat de la compilation
	output: {
		filename: 'bundle.js',
		path: path.join(__dirname, './public')
	},
	// Dossiers à partir desquels seront résolus les imports globaux
	resolve: {
		modules: [ path.resolve('./node_modules'), path.resolve('./frontend') ]
	},
	// Modules de compilation pour les différents types de contenu
	module: {
		rules: [
			{
				// Fichiers de style
				test: /\.css$/,
				// Extraction dans un fichier bundle uniquement en production :
				use:
					env === 'production'
						? ExtractTextPlugin.extract({
								fallback: 'style-loader',
								use: [ 'css-loader' ]
							})
						: [ 'style-loader', 'css-loader' ]
			},
			{
				// Fichier statiques (images, polices, ...)
				test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
				loader: 'url-loader',
				options: {
					limit: 10000
				}
			},
			{
				// Transpilation des fichiers JS avec Babel, à l'exclusion du
				// dossier node_modules
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
	// Configuration du plugin permettant l'extraction du CSS
	plugins:
		env === 'production'
			? [
					new ExtractTextPlugin({
						filename: 'bundle.css'
					})
				]
			: [],
	// Configuration du serveur de développement Webpack
	devServer: {
		// Le contenu est servi à partir du dossier public
		contentBase: path.join(__dirname, 'public'),
		historyApiFallback: true,
		// Toutes les requêtes ne correspondant pas à des fichiers statiques
		// sont redirigées vers le server PHP
		proxy: {
			'/api': {
				target: 'http://localhost:7000',
				secure: false
			}
		}
	}
};
