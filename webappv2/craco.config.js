// const path = require('path');
const CracoLessPlugin = require('craco-less');
const theme = require('./theme.js');

// process.env.BROWSER = 'none';

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions : {
            modifyVars: theme,
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
  babel: {
    plugins: [
      [
        'import',
        { libraryName: 'antd', libraryDirectory: 'es', style: true },
        'import-antd',
      ],
    ],
  },
};
