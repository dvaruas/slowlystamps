const path = require("path");

module.exports = {
  mode: "production",
  entry: "./src/html/script.ts",
  output: {
    filename: "script.js",
    path: path.resolve(__dirname, "static"),
  },
  devtool: false,
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
};
