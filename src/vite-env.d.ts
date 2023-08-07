/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_BASE_HOSTNAME: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}