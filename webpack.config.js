const path = require("path");

module.exports = {
  mode: "development",

  entry: {
    main: path.resolve(__dirname, "./src/index.js"),
  },

  output: {
    path: path.resolve(__dirname, "./public"),
    filename: "[name].bundle.js",
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
    ],
  },

  resolve: {
    fallback: {
      path: require.resolve("path-browserify"),
    },
  },

  devServer: {
    open: true,
  },
};
