const path = require('path'); //Path - библиотека использующая системный модуль путей, для адресации к файлам
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');

module.exports = {
    mode: 'production',
    devServer: {
        static: {
            directory: path.resolve(__dirname, 'docs/')
        },
        compress: true,
        port: 1234,
        hot: true
    },
    entry: {
        app: './src/app/index.ts',
    }, // Входная точка для сборки всего проекта (Файл, в котором собираются все модули проекта)
    output: {
        filename: '[name]/[name].js', // Выходной/итоговый файл проекта в зависимости от целей production/development
        path: path.resolve(__dirname, 'docs'), // Путь к выходному/итоговому файлу
        clean: true, // Для очистки директории после пересборки
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name]/[name].css'
        }),
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
            title: "App",
            filename: "index.html",
            favicon: path.resolve(__dirname, 'src/images/dev-favicon.png')
        })
    ],
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                options: {
                    appendTsSuffixTo: [/\.vue$/],
                },
                exclude: /node_modules/
            },
            {
                test: /\.vue$/,
                use: 'vue-loader'
            },
            {
                test: /\.s[ac]ss$/i,
                /* Регулярное выражение, показывающее тип файла к которому применяется loader/...
                (Между /.../ - искомое значение $ - символ конца строки, i - флаг игнорирующий регистр) */
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader'
                ],
                /* Используемые модули порядок выполнения слева -> направо или снизу -> вверх,
                следующий модуль получает результаты предыдущего */
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
    }
};
