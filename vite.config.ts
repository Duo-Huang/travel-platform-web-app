/// <reference types="vitest" />
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import checker from 'vite-plugin-checker'
import path from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import IconsResolver from 'unplugin-icons/resolver'
import Icons from 'unplugin-icons/vite'

const pathSrc = path.resolve(__dirname, 'src')

// https://vitejs.dev/config/
export default defineConfig(() => {
    return {
        server: {
            proxy: {
                '/api': {
                    target: 'http://localhost:3000',
                    rewrite(path) {
                        return path.replace(/^\/api/, '')
                    },
                },
            },
        },
        plugins: [
            vue(),
            // localResolve(),
            AutoImport({
                resolvers: [
                    ElementPlusResolver(),
                    IconsResolver(),
                ],
                dts: path.resolve(pathSrc, 'auto-imports.d.ts'),
            }),
            Components({
                resolvers: [
                    ElementPlusResolver(),
                    // Auto register icon components
                    IconsResolver({
                        enabledCollections: ['ep'],
                    }),
                ],
                dts: path.resolve(pathSrc, 'components.d.ts'),
            }),
            Icons({
                autoInstall: true,
            }),
            // checker({ typescript: true })
        ],
        base: './',
        envDir: './env',
        envPrefix: 'APP',
        resolve: {
            alias: [
                { find: '@', replacement: pathSrc }, // don't use 'src' directly, it can cause bugs
            ],
        },
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: `@import "@/styles/variable.scss";@import "@/styles/common.scss";@import "@/styles/mixins.scss";`,
                },
            },
        },
        test: {
            globals: true,
            // mockReset: true,
            // clearMocks: true,
            restoreMocks: true,
            deps: {
                inline: [/element-plus/], // test中不能识别css
            },
            environment: 'happy-dom',
        },
    }
})
