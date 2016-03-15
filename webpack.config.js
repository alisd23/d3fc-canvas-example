const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
	cache: true,
  devtool: 'inline-source-map',
  progress: true,

	entry: './src/main.js',

	output: {
		path: path.join(__dirname, 'build'),
    filename: 'bundle.js',
	},

	plugins: [
    new ExtractTextPlugin("app.css")
  ],

	module: {
		loaders: [
      {
				test: /\.js$/,
				loaders: ['babel?presets[]=es2015'],
				include: path.join(__dirname, 'src')
			},
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style', ['css?sourceMap&importLoaders=1', 'sass']),
				include: path.join(__dirname, 'sass')
      },
		]
	}
};
