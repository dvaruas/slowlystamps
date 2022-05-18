const path = require("path");

module.exports = {
  mode: "development",
  entry: "./src/html/script.ts",
  output: {
    filename: "script.js",
    path: path.resolve(__dirname, "static"),
  },
  devtool: "inline-source-map",
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
