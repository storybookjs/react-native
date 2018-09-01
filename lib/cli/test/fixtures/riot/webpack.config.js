module.exports = {
    target: 'web',
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.tag$/,
                use: {
                    loader: 'riot-tag-loader'
                }
            },
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                },
                exclude: /node_modules/,
            },
            { test: /\.css$/, use: [{ loader: 'style-loader' }, { loader: 'css-loader', options: { sourceMap: true } }] },
        ],
    },
}
