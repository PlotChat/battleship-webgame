// webpack.config.js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
	mode: "development",
	entry: "./src/index.js",
	devtool: "eval-source-map",
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "bundle.js",
		publicPath: isProduction ? "./" : "/",
		clean: true,
	},
	devServer: {
		static: "./dist",
		watchFiles: ["./src/template.html"],
		hot: true,
		open: true,
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: "./src/template.html",
		}),
	],
	module: {
		rules: [
			{
				test: /\.css$/i,
				use: ["style-loader", "css-loader"],
			},
			{
				test: /\.html$/i,
				loader: "html-loader",
			},
			{
				test: /\.(png|svg|jpg|jpeg|gif)$/i,
				type: "asset/resource",
			},
		],
	},
	resolve: {
		fallback: {
			fs: false,
			os: false,
			path: false,
		},
	},
};
