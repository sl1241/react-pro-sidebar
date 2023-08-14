import { defineConfig } from 'vite'
import path from 'path'
import dts from 'vite-plugin-dts'

const config = defineConfig({
    build: {
        minify: false,
        lib: {
            entry: ["./src/index.ts"],
            name: "voby-sidebar",
            formats: ['es', 'cjs', 'umd'],
            fileName: (format: string, entryName: string) => `${entryName}.${format}.js`
        },
        sourcemap: true,
        rollupOptions: {
            external: [
                'voby',
                "voby/jsx-runtime",
                "use-voby",
                "./src/components/LegacySidebarContext.tsx",
                "./src/components/ProSidebarProvider.tsx",
                "./src/hooks/useLegacySidebar.tsx",
                "./src/hooks/useProSidebar.tsx"],
            output: {
                globals: {
                    'voby': 'voby',
                    'oby': 'oby',
                }
            }
        },
    },
    esbuild: {
        jsx: 'automatic',
    },
    plugins: [
        dts({ entryRoot: './src', outputDir: './dist/types', exclude: './nodes_modules' })
    ],
    resolve: {
        alias: {
            '~': path.resolve(__dirname, 'src'),
        },
    },
})



export default config
