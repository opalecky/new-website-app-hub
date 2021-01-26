const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtract = require('mini-css-extract-plugin');
const CssMinimizer = require('css-minimizer-webpack-plugin');
const webpack = require("webpack");
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');

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
        compress: false
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            favicon: "./src/img/logo-color.svg"
        }),
        new MiniCssExtract({
            filename: 'style.css'
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        }),
        new LodashModuleReplacementPlugin({
            'collections': true,
            'paths': true
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
                            'plugins': ['lodash'],
                            'presets': [[
                                'env',
                                {
                                    'modules': false,
                                    'targets': {
                                        'node': 4
                                    }
                                }
                            ]]
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
                    sourceMap: false
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