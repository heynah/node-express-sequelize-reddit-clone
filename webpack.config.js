module.exports = {
    entry: './files/js/app.js',
    output: {
        filename: './files/js/app-compiled.js'
    },
    module: {
        loaders: [
            {
                loader: 'babel',
                exclude: /node_modules/
            }
        ] //please pass my file through this before you load, thanks!
    },
    devtool: 'sourcemap'
};

//watching our files, automating output of jsx+require into browser readable, but ugmo file