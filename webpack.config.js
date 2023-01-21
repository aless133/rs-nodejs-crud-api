import path from 'path';

const cfg = {
  target: ['node'],
  entry: {
    index: './src/index.ts',
    dataserver: './src/app/dataserver.ts'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
    parser: {
      javascript: {
        importMeta: false,
      },
    },    
  },
  resolve: {
    extensions: ['.ts','.js'],
  },
  output: {
    chunkFormat: 'module',
    filename: '[name].bundle.js',
    path: path.resolve('build/'),
  },
  experiments: {
      outputModule: true,
  },  
};

export default cfg;