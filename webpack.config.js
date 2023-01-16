import path from 'path';

const cfg = {
  target: ['node'],
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts','.js'],
  },
  output: {
    chunkFormat: 'module',
    filename: 'bundle.js',
    path: path.resolve('build/'),
  },
  experiments: {
      outputModule: true,
  },  
};

export default cfg;