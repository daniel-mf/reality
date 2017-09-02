export default {
    entry: 'src/Reality.js',
    indent: '\t',
    plugins: [],
    targets: [
        {
            format: 'umd',
            moduleName: 'Reality',
            dest: 'build/reality.js'
        },
        {
            format: 'es',
            dest: 'build/reality.module.js'
        }
    ]
};