/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly PUBLIC_SUPABASE_URL: string;
    readonly PUBLIC_SUPABASE_ANON_KEY: string;
    readonly ANTHROPIC_API_KEY: string;
    readonly VERTEX_PROJECT_ID: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
} 