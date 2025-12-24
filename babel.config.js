module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current', // Tells Babel to compile for the current Node version
        },
      },
    ],
  ],
};