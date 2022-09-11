/// <reference types="vite/client" />

declare module '*.vue' {
    import type { DefineComponent } from 'vue'
    const component: DefineComponent<{}, {}, any>
    export default component
}
interface ImportMetaEnv {
    readonly APP_API_BASE_URL: string
    readonly APP_ENV: string
    // 更多环境变量...
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
