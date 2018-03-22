const path = require('path');
const webpack = require('webpack');

const common = {
  context: path.join(__dirname, '/client/src'),
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
  resolve: {
    extensions: ['.js', '.jsx'],
  },
};

const client = {
  entry: './production.js',
  output: {
    path: path.join(__dirname, 'client/dist'),
    filename: 'productionBundle.js',
  },
};

const server = {
  entry: './server.js',
  output: {
    path: path.join(__dirname, '/client/dist'),
    filename: 'prudctionBundle-server.js',
    libraryTarget: 'commonjs-module',
  },
};


// module.exports = {
//   entry: './client/src/index.jsx',

//   module: {
//     rules: [
//       {
//         test: /\.jsx?$/,
//         exclude: /node_modules/,
//         use: {
//           loader: 'babel-loader',
//           options: {
//             presets: ['env', 'react'],
//           },
//         },
//       },
//       {
//         test: /dayPicker\.css$/,
//         use: ['style-loader', 'css-loader'],
//       },
//       {
//         test: /\.css$/,
//         exclude: /dayPicker\.css$/,
//         loader: 'style-loader!css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]'
//       },
//     ],
//   },

//   resolve: {
//     extensions: ['.js', '.jsx'],
//   },

//   output: {
//     filename: 'bundle.js',
//     path: path.resolve(__dirname, 'client/dist'),
//     publicPath: '/',
//   },
// };

module.exports = [
  Object.assign({}, common, client),
  Object.assign({}, common, server),
];
