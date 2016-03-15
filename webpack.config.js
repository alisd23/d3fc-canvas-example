const path = require('path');

module.exports = {
	cache: true,
  devtool: 'inline-source-map',
  progress: true,

	entry: './src/main.js',

	output: {
		path: path.join(__dirname, 'build'),
    filename: 'bundle.js',
	},

	module: {
		loaders: [
      {
				test: /\.js$/,
				loaders: ['babel?presets[]=es2015'],
				include: path.join(__dirname, 'src')
			},
      {
        test: /\.scss$/,
        loaders: ['style', 'css?sourceMap&importLoaders=1', 'sass'],
				include: path.join(__dirname, 'sass')
      },
		]
	}
};
