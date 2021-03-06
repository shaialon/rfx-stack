import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import StartServerPlugin from 'start-server-webpack-plugin';
import nodeExternalModules from 'webpack-node-externals';
import path from 'path';

const Dir = global.DIR;

export function loader() {
  return {
    jsx: {
      query: {
        cacheDirectory: true,
        presets: [['es2015', { modules: false }], 'stage-0', 'react'],
        plugins: [
          'transform-decorators-legacy',
          'transform-class-properties',
          'babel-root-import',
          'jsx-control-statements',
        ],
      },
    },
    cssModules: {
      loader: ExtractTextPlugin.extract({
        fallbackLoader: 'isomorphic-style-loader',
        loader: ['css-loader?modules',
        'importLoaders=1',
        'localIdentName=[name]__[local]___[hash:base64:5]!postcss-loader']
         .join('&'),
      }),
    },
    cssGlobal: {
      loader: ExtractTextPlugin.extract({
        fallbackLoader: 'isomorphic-style-loader',
        loader: 'css-loader!postcss-loader',
      }),
    },
  };
}

export function config(entry) {
  return {
    devtool: 'cheap-module-eval-source-map',
    entry: [
      'babel-polyfill',
      'whatwg-fetch',
      // 'webpack/hot/poll?1000',
      path.join(Dir.run, entry),
    ],
    output: {
      path: Dir.nodeBuild,
      filename: [entry, 'dev.bundle.js'].join('.'),
      chunkFilename: '[id].[hash:5]-[chunkhash:7].js',
      devtoolModuleFilenameTemplate: '[absolute-resource-path]',
      libraryTarget: 'commonjs2',
    },
    externals: [nodeExternalModules()],
    // externals: [nodeExternalModules({
    //   whitelist: ['webpack/hot/poll?1000'],
    // })],
    plugins: [
      new ExtractTextPlugin({
        filename: 'style.css',
        disable: true,
      }),
      new StartServerPlugin(),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NamedModulesPlugin(),
      new webpack.NoErrorsPlugin(),
    ],
  };
}
