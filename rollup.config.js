import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';

export default {
    input: 'src/index.ts',
    output: [
        {
            file: 'dist/index.js',
            format: 'esm',
            sourcemap: true
        },
        {
            file: 'dist/index.esm.js',
            format: 'esm',
            sourcemap: true
        }
    ],
    plugins: [
        peerDepsExternal(),
        resolve(),
        commonjs(),
        typescript({
            tsconfig: './tsconfig.json',
            declaration: true,
            declarationDir: 'dist',
            sourceMap: true,
            noEmitOnError: false // Allow build to continue with errors
        })
    ],
    external: [
        'react',
        'react-dom',
        '@mui/material',
        'material-react-table',
        '@chris-c-brine/autogrid',
        '@mui/x-date-pickers',
        /^@mui\/.*/,   // Mark all MUI packages as external
        /^@emotion\/.*/  // Mark all Emotion packages as external
    ]
};