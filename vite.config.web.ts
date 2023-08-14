import { defineConfig } from 'vite'
import path from 'path'
import dts from 'vite-plugin-dts'

const config = defineConfig({
    build: {
        minify: false,
        lib: {
            entry: ["./src/demo/index"],
            name: "react-pro-sidebar",
            formats: ['es', 'cjs', 'umd'],
            fileName: (format: string, entryName: string) => `${entryName}.${format}.js`
        },
        sourcemap: true,
        rollupOptions: {
            external: ['react', 'react-dom', 'voby', 'oby', "react/jsx-runtime", "react-dom/client"],
            output: {
                globals: {
                    'react': 'React',
                    'react-dom': 'ReactDOM',
                    'voby': 'voby',
                    'oby': 'oby',
                    "react/jsx-runtime": "jsxRuntime",
                    "react-dom/client": "client"
                }
            }
        },
    },
    esbuild: {
        jsx: 'automatic',
    },
    assetsInclude: ['**/*.md'],
    plugins: [
        dts({ entryRoot: './src', outputDir: './dist/types', exclude: './nodes_modules' })
    ],
    resolve: {
        alias: {
            '~': path.resolve(__dirname, 'src'),
        },
    },
    css: {
        modules: {
            scopeBehaviour: 'global',
            localsConvention: 'camelCase',
        },
        preprocessorOptions: {
            sass: {
                "load-path": "./node_modules"
            }
        }
    },
})



export default config
