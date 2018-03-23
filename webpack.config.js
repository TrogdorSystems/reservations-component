const path = require('path');

const common = {
  context: path.join(__dirname, '/client/src/components'),
  resolve: {
    extensions: ['.js', '.jsx'],
  },
};

const client = {
  entry: '../production.js',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env', 'react'],
          },
        },
      },
      {
        test: /dayPicker\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.css$/,
        exclude: /dayPicker\.css$/,
        loader: 'style-loader!css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]'
      },
    ],
  },
  output: {
    path: path.join(__dirname, 'client/dist'),
    filename: 'productionBundle.js',
  },
};

const server = {
  entry: '../server.js',
  target: 'node',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env', 'react'],
          },
        },
      },
      {
        test: /dayPicker\.css$/,
        use: ['css-loader'],
      },
      {
        test: /\.css$/,
        exclude: /dayPicker\.css$/,
        loader: 'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
      },
    ],
  },
  output: {
    path: path.join(__dirname, '/client/dist'),
    filename: 'productionBundle-server.js',
    libraryTarget: 'commonjs-module',
  },
};

module.exports = [
  Object.assign({}, common, client),
  Object.assign({}, common, server),
];
