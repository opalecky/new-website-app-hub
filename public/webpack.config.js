const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtract = require('mini-css-extract-plugin');
const CssMinimizer = require('css-minimizer-webpack-plugin');
const webpack = require("webpack");
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    mode: 'development',
    entry: {
        index: './src/app.ts',
    },
    devServer: {
        contentBase: './dist',
        host: 'localhost',
        port: '8080',
        inline: false,
        compress: true,
        hot: true
    },
    plugins: [
        new webpack.ProvidePlugin({
            _: 'lodash',
            $: 'jquery',
            jQuery: 'jquery'
        }),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            favicon: "./src/img/logo-color.svg"
        }),
        new MiniCssExtract({
            filename: 'style.css'
        }),
        new LodashModuleReplacementPlugin({
            'collections': true,
            'paths': true
        }),
        new CopyPlugin({
            patterns: [
                { from: "src/app/translations/", to: "lang/" },
                { from: "src/translation.js", to: "translation.js" }
            ],
        }),
    ],
    module: {
        rules: [
            {
                test: require.resolve('jquery/dist/jquery.slim'),
                use: [{
                    loader: 'expose-loader',
                    options: 'jquery'
                },
                    {
                        loader: 'expose-loader',
                        options: '$'
                    }]
            },
            {
                test: /\.less$/,
                exclude: /node_module/,
                use: [
                    {
                        loader: MiniCssExtract.loader,//'style-loader', // creates style nodes from JS strings
                    },
                    {
                        loader: 'css-loader', // translates CSS into CommonJS
                    },
                    {
                        loader: 'less-loader', // compiles Less to CSS
                    },
                ],
            },
            {
                test: /\.css$/,
                use: [MiniCssExtract.loader, 'style-loader', 'css-loader']
            },
            {
                test: /(\.[jt]sx?$)/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            babelrc: false,
                            presets: ["@babel/preset-env"],
                            plugins: ['@babel/proposal-class-properties']
                        }
                    },
                    {
                        loader: 'ts-loader'
                    },
                ]
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            }
        ],
    },
    resolve: {
        extensions: [".webpack.js", ".web.js", ".ts", ".js"]
    },
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    compress: {
                        warnings: true
                    },
                    output: {
                        comments: false
                    },
                    sourceMap: true
                }
            }),
            new CssMinimizer({
                minimizerOptions: {
                    preset: [
                        'default',
                        {
                            discardComments: {
                                removeAll: true
                            },
                        },
                    ],
                },
                parallel: true
            })
        ],
    }
};
